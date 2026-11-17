# Hall of fame

Teams that fixed what we reported and said so in public. Listed by how quickly they shipped a fix after our report,
then by name. Being listed here says the team handled a report well. It is not an audit and not a statement that the
code is safe.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hall-dark.svg">
  <img alt="Hall of fame: Agraris and NOUNY fixed within the hour; predict FWA the same day, before round 1; Agent402, Autonomo, LoomDesk, QHooks, Stoa and x402fi the same day; Priors published 0 to 3 days after the report; Gloam the last within hours; AgentCity within a week; 1Shot within days; Hookr in the next release" src="assets/hall-light.svg" width="100%">
</picture>

## The credits, with links

| Team | What we reported | Time to fix | Credit |
|---|---|---|---|
| **Agraris** | Public listings could set their own GitHub stars, activity and dates, and links accepted any URL scheme (Low) | Within the hour (2 Nov 2026) | [Commit 177e360](https://github.com/agrarisai/agraris/commit/177e360) · [post on X](https://x.com/agrarisai/status/2117276441310335355) |
| **NOUNY** | A review of the contracts NOUNY asked for. Three Low findings, each with a fork test: new AgentVaults could not be created while the stock price feeds paused each weekend, removed payroll recipients still counted toward the 100-recipient cap, and NounyHook's one-swap-per-block limit used the L1 block number on Robinhood Chain (Low) | Within the hour (16 Nov 2026), fixed and redeployed; advisories published by the team on 17 Nov | [GHSA-9j35](https://github.com/nounyagent/nouny-agent/security/advisories/GHSA-9j35-fvff-78xp) · [GHSA-2f3v](https://github.com/nounyagent/nouny-agent/security/advisories/GHSA-2f3v-w6ff-pm77) · [GHSA-ggxm](https://github.com/nounyagent/nouny-agent/security/advisories/GHSA-ggxm-63r4-39pp) · [fix commit e79bca2](https://github.com/nounyagent/nouny-agent/commit/e79bca2) |
| **predict FWA** (Sherwood arena) | Two game-logic issues found before launch (Low) | Same day, before round 1 (2 Nov 2026) | [Security review in the README](https://github.com/MirakoolDev/sherwood#security-review-nov-2026) · [post on X](https://x.com/pfwafun/status/2117205853539353009) |
| **Agent402** | Two payment issues: the x402 buyer signed the seller's `maxAmountRequired` while spend caps checked `amount`, and the Stellar settle fallback took any recent transfer from the payer as payment (High) | Same day (6 Nov 2026) | [GHSA-q7vw](https://github.com/MikeyPetrillo/Agent402/security/advisories/GHSA-q7vw-c7hm-m885) · [GHSA-gcw5](https://github.com/MikeyPetrillo/Agent402/security/advisories/GHSA-gcw5-6259-gh72) · [post on X](https://x.com/Agent402Tools/status/2118727213222617597) |
| **Autonomo** (autonomo-sdk) | When an agent's wallet was short, the SDK's Borro borrow path signed and sent every transaction in the answer it got back, outside the agent's spending caps (Medium) | Same day (14 Nov 2026), fixed in both SDKs (npm autonomo-sdk 0.1.3, PyPI autonomo 0.1.1) and re-tested by us | [post on X](https://x.com/useautonomo/status/2121624143187812566) |
| **LoomDesk** (loomdesk-sdk) | Four gaps in the SDK's send gate (Low) | Same day (2 Nov 2026) | [0.7.1, commit 2e97226](https://github.com/loomdesk-hq/sdk/commit/2e97226) |
| **QHooks** | A key-storage issue in how the quantum key was protected (Medium) | Same day (14 Nov 2026) | [Security changelog](https://qhooks.com/changelog#quantum-key-protection) |
| **Stoa** | A requested review of RugCover, SpotlightMarket, StoaLimit and StoaRouter at a pinned commit. Two Medium findings, each with a fork test: anyone could block new limit orders with dust (StoaLimit), and a finding about which Uniswap V4 pools the router uses | Same day (16 Nov 2026); the new V4 adapter goes live through Stoa's 48-hour timelock | [Stoa's security review page](https://stoadex.com/docs/security-review) |
| **x402fi** | Three payment issues in the gateway and the public facilitator: an encoded `../` priced as one endpoint and forwarded to another (High), `/settle` paying gas for transfers that pay nobody (Medium), and paid calls forwarded when the payment cannot settle (Medium) | Same day (15 Nov 2026), advisories published by the team | [GHSA-2695](https://github.com/RWA-ID/x402fi/security/advisories/GHSA-2695-fqv4-x6wm) · [GHSA-4mf4](https://github.com/RWA-ID/x402fi/security/advisories/GHSA-4mf4-56v3-jvm7) · [GHSA-9g6h](https://github.com/RWA-ID/x402fi/security/advisories/GHSA-9g6h-3x75-ghv9) |
| **Priors** | Eight reports: StockVault, borrowing, the score, the AgentKit and elizaOS integrations, and the Rialto stock route (Low to Medium) | Published 0 to 3 days after the report (20 Oct to 4 Nov 2026) | [GHSA-3vg6](https://github.com/priors-agents/priors/security/advisories/GHSA-3vg6-2f3m-j5qm) · [GHSA-qcrq](https://github.com/priors-agents/priors/security/advisories/GHSA-qcrq-x8xg-25vg) · [GHSA-xccq](https://github.com/priors-agents/priors/security/advisories/GHSA-xccq-5ghg-w7mq) · [GHSA-jjxq](https://github.com/priors-agents/priors/security/advisories/GHSA-jjxq-7r68-44m5) · [GHSA-4w7q](https://github.com/priors-agents/priors/security/advisories/GHSA-4w7q-8vph-j5mr) · [GHSA-p29w](https://github.com/priors-agents/priors/security/advisories/GHSA-p29w-c8p2-qfm5) · [GHSA-cqcw](https://github.com/priors-agents/priors/security/advisories/GHSA-cqcw-9qjc-5qc7) · [credits in SECURITY-v2](https://github.com/priors-agents/priors/blob/main/docs/SECURITY-v2.md) |
| **Gloam** | Eight items across the vault contracts, relay, SDK, MCP server and app; seven are now published as advisories (Low to Medium) | The last within hours (23 Oct to 1 Nov 2026), advisories published 16 Nov | [GHSA-wxv6](https://github.com/gloamtrade/gloam/security/advisories/GHSA-wxv6-6fjw-c2m9) · [GHSA-5gwv](https://github.com/gloamtrade/gloam/security/advisories/GHSA-5gwv-jpjr-x34r) · [GHSA-p2wm](https://github.com/gloamtrade/gloam/security/advisories/GHSA-p2wm-6x89-63c2) · [GHSA-x8fx](https://github.com/gloamtrade/gloam/security/advisories/GHSA-x8fx-frxx-7f66) · [GHSA-fqc9](https://github.com/gloamtrade/gloam/security/advisories/GHSA-fqc9-v45x-jfh8) · [GHSA-vqqr](https://github.com/gloamtrade/gloam/security/advisories/GHSA-vqqr-hg6r-779w) · [GHSA-rvhx](https://github.com/gloamtrade/gloam/security/advisories/GHSA-rvhx-3m36-4g8h) · [joint post on X](https://x.com/HeyResearch/status/2117263881815118077) |
| **AgentCity** | Five findings across the placement market contract, the terms page, key custody, contract ownership docs and the checkout, one with a Foundry test; a second round of five smaller notes | Within a week (10 to 16 Nov 2026), each answered in public | [AgentCity's write-up](https://github.com/agentcitylabs/research/blob/main/%5BRnDAC%5D-SecurityReview_HEYResearchLab.md) |
| **1Shot** (embedded wallet) | Hardening across the open-source embedded wallet: risk warnings an embedding site could replace, one site's extension session usable by another, and requester origins that could be wrong or chosen by an attacker (Low to Medium) | Within days (2 to 12 Nov 2026), across several releases | [post on X](https://x.com/1shotapi/status/2121327154864738646) |
| **Hookr** (hookr-contracts) | Two published: in first-release time shares a lock made after a drop could share in that drop, and the per-wallet launch cap counted per contract for router swaps (Low). Nobody was exposed | Fixed in the next release (29 Oct 2026), advisories published 6 Nov | [GHSA-43mv](https://github.com/Hookr-fun/hookr-contracts/security/advisories/GHSA-43mv-935h-rpm7) · [GHSA-m3fx](https://github.com/Hookr-fun/hookr-contracts/security/advisories/GHSA-m3fx-pjvg-cmf7) |

## The numbers so far

<!-- NUMBERS:START -->
- 100 private security advisories filed on GitHub, across 47 projects. 31 accepted or published by their teams.
- 272 pull requests to 214 other teams' repositories, 52 merged.
- 14 teams in the hall of fame.

Advisories counted by hand, last on 17 November 2026. Pull requests read from GitHub search every day.
<!-- NUMBERS:END -->

Your team can be next: see the [disclosure policy](README.md).
