# Hey Research Lab: security disclosure policy

We read the open-source code of projects building on Robinhood Chain, and when we find a security problem we report it
to the team. This page says how we do that, what we ask in return, and when we speak publicly. It applies to every
project the same way, whatever its size.

The teams that fixed what we reported, and how fast, are listed in [HALL_OF_FAME.md](HALL_OF_FAME.md).

## How we report

1. **Privately first, always.** We use the project's own channel: GitHub private vulnerability reporting, a
   security email, or a direct message to the team.
2. **No private channel?** We open a short "Security contact request" issue on the repository. It names no finding,
   no file and no severity. It only asks where to send the details.
3. **What a report contains.** The commit we read, where the problem is, a step-by-step sequence, the impact, what we
   measured on chain (read-only), and a suggested fix.

## Timeline

| Day | What happens |
|---|---|
| 0 | We send the report privately, or the contact request when there is no private channel. |
| 14 | If nobody has acknowledged it, we say publicly that we sent a report to the project and are waiting to hear back. No details, no severity, no file names. |
| 90 | The fix window. If the team is working on it, we extend it; just tell us. |
| After the fix, or at 90 days | We publish a short summary and credit the team that fixed it. If it is still unfixed at 90 days, we tell users how to protect themselves and still leave out anything that would help someone exploit it. |

If we see a problem being exploited in the wild, we may shorten these steps to warn users sooner.

## What we never do

- Send a transaction, touch user funds or test against live systems. We read source code and on-chain state, and we
  reproduce on local forks only.
- Publish exploit code or step-by-step details before a fix ships.
- Ask for money. Our reviews are free.
- Let a report change how HEY ranks or scores a project. Security reports are kept apart from HEY's research.

## What we ask

- An acknowledgement, so we know the report arrived.
- A fix, or a clear "we accept this risk" with a reason.
- Credit: on the GitHub advisory, in your changelog, or a short mention on X tagging
  [x.com/HeyResearch](https://x.com/HeyResearch). We are a small team, and credit is how other builders find us.

## Contact

- X: [x.com/HeyResearch](https://x.com/HeyResearch)
- Email: hi@heyresearch.xyz

Open source on Robinhood Chain? Send us the repo and we will read it too.
