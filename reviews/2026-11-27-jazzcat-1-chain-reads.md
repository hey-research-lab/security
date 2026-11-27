# JazzCat #1 · chain reads: security review

HEY Research Lab reviewed the six paid chain reads that JazzCat #1 sells on x402fi, as part of x402fi's security review
program. We sent four findings to the team (NJC Council) privately. They fixed all four, and the further points we raised,
within about a day. We retested the fixes twice. This page records what we reviewed, what we found and how each finding was
fixed.

This is a record of what we reviewed and found, not an audit and not a statement that the code is free of bugs.

## At a glance

| | |
|---|---|
| Project | JazzCat #1 · chain reads (New Jazz City), listed on x402fi as `jazzcat-1-chain-reads` |
| Code | [github.com/nebulamji/rh-tx-explain](https://github.com/nebulamji/rh-tx-explain) |
| Reviewed at | [`9ce92a8`](https://github.com/nebulamji/rh-tx-explain/commit/9ce92a89785f1fd49fca26a913b7879016aa9501) (25 Nov 2026) |
| First retest | [`04a94df`](https://github.com/nebulamji/rh-tx-explain/commit/04a94df853094aead437c782584f88f8d568ac97) (27 Nov 2026) |
| Final retest | [`007d04b`](https://github.com/nebulamji/rh-tx-explain/commit/007d04bb4d40f5da37191381e4a287a2fd7e1207) (27 Nov 2026) |
| Findings | 1 Medium, 4 Low (one of them found in the first retest), all fixed at `007d04b` |
| Review state on x402fi | Findings fixed and re-tested, signed by HEY Research Lab for all six endpoints at `007d04b` |

## Scope

The six paid endpoints of the listing, and the code they share:

| Endpoint | What it sells |
|---|---|
| `/x402/money-trail` | Who launched a Robinhood Chain coin, where its supply went, early buyers, top holders |
| `/x402/line-read` | Credit-line read for an ERC-8004 agent before a lender opens a line |
| `/x402/income-read` | Who actually paid an agent, with its own wallets, loans and withdrawals split out |
| `/x402/poison-check` | Address-poisoning signs in a wallet's history |
| `/x402/ledger` | Every USDG in and out of an address, reconciled with its balance |
| `/x402/transfer-read` | Who can still act during a two-step ownership transfer |

Shared code in scope: the x402 payment path (requirements, facilitator calls, settlement), the `/buy` checkout page every
read can be bought through, the Base and Solana payment rails, the Raeto Pay rail next to it, and the chain-reading helpers.
The rest of the repository (New Jazz City's other tools, Orbio, Cat Calls, launch tools and so on) was not in scope.
Commits on the main branch after `007d04b` are not covered by this review.

## How we worked

- We read the source at each commit. For the retests we read every change on the payment and read paths between the
  commits.
- Every finding was proved on our own machine. The worker ran locally with every chain node, payment facilitator and outside
  service replaced by a local stand-in, and anything trying to reach the internet was refused. The checkout page was tested
  in a local browser with a stand-in wallet. We never called or paid the live endpoints, never contacted the facilitators,
  and sent no transaction. On-chain state (the payment wallet and the JazzCats contract) was read with read-only calls.
- We ran the project's own test suite at each retest. The final run passed 531 of 532 tests. The remaining test needs a
  live chain node, which our setup blocks on purpose.

## Findings

| ID | Severity | Title | Status |
|---|---|---|---|
| F-1 | Medium (CVSS 3.1 6.1, CWE-79) | Script injection on the `/buy` checkout page | Fixed in `b9d2102`, `f1a68f7` |
| F-3 | Low (3.7, CWE-754) | Paid reads settled on incomplete data when a chain node returned an error | Fixed in `a6937b1`, `04a94df`, `007d04b` |
| F-4 | Low (3.7, CWE-672) | The Base payment address could stay with a previous Cat holder | Fixed (`f4a4c24` and later) |
| N-1 | Low (3.7), conditional | The Raeto Pay rail served a read before its payment capture was confirmed | Fixed (`84ce44a` and later) |
| R-1 | Low (3.7, CWE-754) | Income read: two lookups still treated a node error as an empty answer (found in the first retest) | Fixed in `007d04b` |

### F-1 Medium: script injection on the /buy checkout page

**What it was.** The checkout page took the name of the read to buy from its link and wrote it into the page's own script
without escaping it, and the page had no Content Security Policy. A crafted link to the real checkout page could therefore
run the sender's script there. Because that page's purpose is to ask a wallet for a USDG payment signature, the script could
ask the wallet to sign a payment with a different amount and recipient while the page still showed the normal price. The
victim still had to approve that signature in their wallet, and a careful wallet shows the recipient and amount, which is
why it was rated Medium.

**Fix.** The page now uses the read name only when it is one of the paid reads, keeps only the reads' own input names (up
to 200 characters each), escapes every value it places in its script, and is served with a Content Security Policy that
allows only its own script, by a fresh nonce on every load, plus `nosniff` and `no-referrer`.

**Retest.** Our original link and several variants (in the read name, in the prefilled inputs, in attributes, with
JavaScript line terminators) run nothing. Each load gets a new nonce, markup added to the page later is blocked by the
policy, and buying a read from the page still works.

### F-3 Low: paid reads settled on incomplete data

**What it was.** When a chain node answered one call in a batch with an error, the shared helper turned that error into an
empty answer. Four reads then finished normally and the payment settled. In our tests, income-read reported 1 USDG of income
instead of 6, poison-check said "no poisoning seen" after reading nothing, transfer-read said no ownership transfer was open,
and ledger reported a balance of 0. The project promises that a failed read is never charged.

**Fix.** Only an execution revert now counts as a call's answer. Any other per-call error is retried on the next node and in
the end fails the read, so nothing is charged. A read that comes back incomplete is released, never settled, on the x402,
token-payment and Raeto rails alike, and it names the part that is missing.

**Retest.** Node errors on every one of the six reads now return 400 or 503 with nothing settled. A genuine revert is still
reported correctly.

### F-4 Low: the Base payment address could lag a Cat sale

**What it was.** Base USDC payments go to whoever holds the Cat. That holder was cached in memory with no expiry, so after a
sale the previous holder could keep receiving Base payments, and one failed lookup switched the Base option off until a
restart.

**Fix.** The holder is read fresh for every request, checked against a recent block, and never cached. If the read fails,
the request stops with a 503 before any payment. After the paid read runs, the receiver is read again, and if it changed the
payment is not settled.

**Retest.** The Base payment address follows a sale at once. A failed holder read stops before any payment and leaves
nothing behind, and a sale during a paid read stops settlement.

### N-1 Low, conditional: Raeto Pay served before capture was confirmed

**What it was.** On the Raeto Pay rail, which sits next to the six x402 routes, the worker served the read whatever the
payment capture returned. In our test, three concurrent calls with one receipt all received the read, while only one
capture succeeded. This mattered only if Raeto's held verification did not lock the receipt.

**Fix.** The read is returned only when the capture is confirmed. Otherwise the result is withheld.

**Retest.** With three concurrent calls on one receipt, one call is served and two are withheld.

### R-1 Low: income read lookups (found in the first retest)

**What it was.** At the first retest, the income read still used its own node helper with the old behaviour. If the
agent-wallet lookup failed, the read silently used the agent's owner address and reported that wallet's income. If a
transaction-sender lookup failed, the agent's own withdrawals were counted as outside income. Both answers were charged.

**Fix.** The income read's helper follows the same rule as the others. A sender, market detail or loan timestamp that cannot
be read is named as a missing part, and the read is not charged.

**Retest.** Node errors on the agent-wallet, sender, binder, lending-market and timestamp lookups now fail the read or mark it
incomplete, and nothing is settled.

## Smaller points, all fixed

These carried no severity. The team fixed each of them:

- A malformed payment header that decoded to `null` caused a server error instead of a normal payment-required answer.
- A payment on a network the read never offered was passed to a facilitator instead of being refused locally.
- One payment could start several reads at once. The facilitator settled only one of them, so only one answer came back,
  but each read still cost the server work. The worker now records each payment itself before any work starts, so one
  payment buys exactly one answer, and a read that fails releases the payment for a retry.
- A fractional `days` value in income-read caused an error, and any made-up path under `/x402/` created a new usage-counter
  key.
- From the first retest: the payment record now refuses an authorization that is not in the standard form, holds an
  unsettled payment until its authorization expires, fails a split log query that comes back empty instead of reading it as
  "no events", and reads the Cat holder once per payment offer.

Two observations were left as designed, by the author's choice. The free `/contract-changes` route returns the same
ownership data as the paid transfer read. `?cat=N` sells a read on behalf of another Cat and pays that Cat's holder.

## What we found sound

- No way to receive a paid read without paying. Price, asset and recipient are set by the server for each route, and a
  payment for a cheaper route or another recipient is refused.
- The worker never serves a paid answer before settlement succeeds. A failed settlement, an unreachable facilitator or a
  failed read returns nothing and does not settle.
- Paid answers are never cached or shared between buyers.
- The facilitator's API key is sent only to the facilitator it belongs to, and never appears in a response.
- Every caller-supplied address or identifier is validated before it reaches a chain node, and all node and service hosts
  are fixed. There is no server-side request forgery path.
- The payment address for Robinhood Chain sales is JazzCat #1's ERC-6551 account. We recomputed it from the Tokenbound
  registry and it matches the Cat's token.

## Timeline

| Date (2026) | |
|---|---|
| 25 Nov | Review of `9ce92a8` |
| 26 Nov | Findings sent to the team privately |
| 27 Nov | Fixes pushed. First retest at `04a94df`: F-1, F-3 (five reads), F-4 and N-1 fixed, R-1 found |
| 27 Nov | R-1 and the remaining points fixed. Final retest at `007d04b`: everything fixed, no new findings |

Thanks to NJC Council for fixing everything quickly and for asking for a second retest.

HEY Research Lab · [heyresearch.xyz](https://heyresearch.xyz) · [x.com/HeyResearch](https://x.com/HeyResearch)
