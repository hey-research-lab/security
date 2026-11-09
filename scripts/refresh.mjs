// Redraws this repository's pictures and the numbers in HALL_OF_FAME.md.
// The advisory counts and the hall of fame are kept by hand in data/; the pull request counts are read from GitHub's
// search API (pull requests hey-research-lab opened in repositories it does not own) and written to
// data/pull-requests.json. No dependency; Node 22.
//   GITHUB_TOKEN=... node scripts/refresh.mjs     read GitHub, then draw
//   node scripts/refresh.mjs --offline            draw from the stored counts only
import { readFileSync, writeFileSync } from 'node:fs';

import { flow, hall, hero, numbers } from './visuals.mjs';

const ACCOUNT = 'hey-research-lab';
const offline = process.argv.includes('--offline');
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const n = (v) => v.toLocaleString('en-US');
const isCount = (v) => Number.isInteger(v) && v >= 0;

// ---------------------------------------------------------------- the hand-kept data, checked before it is drawn
const advisories = readJson('data/advisories.json');
const { teams } = readJson('data/hall-of-fame.json');
const hallOfFame = readFileSync('HALL_OF_FAME.md', 'utf8');
{
  const a = advisories;
  const named = a.acceptedOrPublished.named;
  const counts = [a.filed.advisories, a.filed.projects, a.acceptedOrPublished.total, a.acceptedOrPublished.unnamed, ...named.map((p) => p.count)];
  if (!counts.every(isCount)) throw new Error('data/advisories.json: every count must be a whole number');
  if (named.reduce((sum, p) => sum + p.count, 0) + a.acceptedOrPublished.unnamed !== a.acceptedOrPublished.total) throw new Error('data/advisories.json: the named counts and the unnamed count must add up to the total');
  if (a.acceptedOrPublished.total > a.filed.advisories) throw new Error('data/advisories.json: more accepted than filed');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.asOf)) throw new Error('data/advisories.json: asOf must be YYYY-MM-DD');
  // A project is named only when it is already public in the hall of fame.
  for (const p of named) if (!hallOfFame.includes(`**${p.project}**`)) throw new Error(`data/advisories.json names ${p.project}, which HALL_OF_FAME.md does not list: count it as unnamed`);
  for (const r of a.publishedReadFrom ?? []) if (!hallOfFame.includes(`**${r.project}**`) || !/^[\w.-]+\/[\w.-]+$/.test(r.repository)) throw new Error(`data/advisories.json reads ${r.repository} for ${r.project}: name a hall of fame team and owner/repo`);
  for (const team of teams) if (!hallOfFame.includes(`**${team.team}**`)) throw new Error(`data/hall-of-fame.json lists ${team.team}, which HALL_OF_FAME.md does not`);
}

// ---------------------------------------------------------------- the pull requests, from GitHub search
let pulls = readJson('data/pull-requests.json');
if (!offline) {
  const headers = { accept: 'application/vnd.github+json', 'user-agent': 'hey-research-lab-security' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const q = `is:pr author:${ACCOUNT} -user:${ACCOUNT}`;
  const items = [];
  let total = 0;
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100&page=${page}`, { headers });
    if (!res.ok) throw new Error(`GitHub search ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const body = await res.json();
    total = body.total_count;
    items.push(...body.items);
    if (items.length >= total || body.items.length < 100) break;
  }
  // A partial answer would draw a fall that did not happen: refuse it and keep yesterday's numbers.
  if (items.length !== total) throw new Error(`GitHub search returned ${items.length} of ${total}`);
  const repoOf = (item) => item.repository_url.replace('https://api.github.com/repos/', '');
  // A pull request that adds HEY to someone else's list or directory (public-apis#8410, awesome-web3#863 …) is a
  // listing, not work on that team's code: left out, as on the profile (hey-research-lab/hey-research-lab).
  const NOT_FIXES = new Set(['punkpeye/awesome-remote-mcp-servers', 'punkpeye/awesome-mcp-servers']);
  const isListing = (item) =>
    NOT_FIXES.has(repoOf(item)) || (/hey research lab|hey-research|heyresearch|hey-check/i.test(item.title) && /(^|:\s*)(add|point)\b/i.test(item.title));
  const fixes = items.filter((item) => !isListing(item));
  pulls = {
    about: pulls.about,
    sent: fixes.length,
    repositories: new Set(fixes.map(repoOf)).size,
    merged: fixes.filter((item) => item.pull_request?.merged_at).length,
  };
  writeFileSync('data/pull-requests.json', `${JSON.stringify(pulls, null, 2)}\n`);
}
if (![pulls.sent, pulls.repositories, pulls.merged].every(isCount)) throw new Error('data/pull-requests.json: counts missing');

// ---------------------------------------------------------------- the pictures
for (const theme of ['light', 'dark']) {
  writeFileSync(`assets/hero-${theme}.svg`, hero(theme));
  writeFileSync(`assets/numbers-${theme}.svg`, numbers({ advisories, pulls, hallCount: teams.length }, theme));
  writeFileSync(`assets/flow-${theme}.svg`, flow(theme));
  writeFileSync(`assets/hall-${theme}.svg`, hall(teams, theme));
}

// ---------------------------------------------------------------- the numbers in HALL_OF_FAME.md
const asOf = new Date(`${advisories.asOf}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const lines = [
  `- ${n(advisories.filed.advisories)} private security advisories filed on GitHub, across ${n(advisories.filed.projects)} projects. ${n(advisories.acceptedOrPublished.total)} accepted or published by their teams.`,
  `- ${n(pulls.sent)} pull requests to ${n(pulls.repositories)} other teams' repositories, ${n(pulls.merged)} merged.`,
  `- ${n(teams.length)} teams in the hall of fame.`,
  '',
  `Advisories counted by hand, last on ${asOf}. Pull requests read from GitHub search every day.`,
];
const re = /(<!-- NUMBERS:START -->)[\s\S]*?(<!-- NUMBERS:END -->)/;
if (!re.test(hallOfFame)) throw new Error('HALL_OF_FAME.md has no NUMBERS markers');
// A function replacer, so a `$` in the text stays text.
writeFileSync('HALL_OF_FAME.md', hallOfFame.replace(re, (_whole, start, end) => `${start}\n${lines.join('\n')}\n${end}`));
console.log(`advisories=${advisories.filed.advisories} accepted=${advisories.acceptedOrPublished.total} prs=${pulls.sent} repos=${pulls.repositories} merged=${pulls.merged} teams=${teams.length}${offline ? ' (offline)' : ''}`);
