# Fix or Phish?

An interactive security awareness challenge about **ClickFix**, **FileFix** and other
"paste this to fix it" attacks — built for everyone in an organisation, not just security people.

Players are shown realistic screens and have a few seconds each to decide:
**Go ahead**, **Verify it**, or **Report it**. After every screen they're told exactly
what gave it away.

It is a single HTML file. No build step, no dependencies, no tracking, no backend.

## Run it

Open `index.html` in a browser. That's it.

To host it for free, push this repo to GitHub and turn on **Settings → Pages → Deploy from
branch → `main` / root**. Your game will be live at
`https://<your-username>.github.io/<repo-name>/`, ready for a QR code on a poster.

## Configure it for your organisation

Everything you need to change is in one block near the top of the `<script>` in `index.html`:

```js
const CONFIG = {
  orgName:        "Your Organisation",
  eventName:      "Cyber Awareness Month",
  reportTo:       "the Security team",
  reportHow:      "the Report Phishing button in Outlook",
  serviceDesk:    "the IT Service Desk",
  secondsPerRound: 20,
  roundsPerGame:   10,
  askForName:      true,
  showLeaderboard: true,
  resultsEndpoint: ""
};
```

`reportTo`, `reportHow` and `serviceDesk` are substituted into the scenario explanations,
so the advice players read matches your actual process.

Set `resultsEndpoint` to a Power Automate / Logic App *"When an HTTP request is received"*
URL if you want scores logged centrally. Leave it blank and nothing leaves the browser.

## How scoring works

Three answers, with partial credit — because real life is not binary.

| The screen was | Go ahead | Verify it | Report it |
| --- | --- | --- | --- |
| An attack | 0 | 60% | **100%** |
| Genuine | **100%** | 50% | 25% |
| Ambiguous | 0 | **100%** | 60% |

Full-credit answers also earn a speed bonus and a streak bonus, so answering
confidently and quickly is rewarded. Caution never scores zero; complacency does.

The results screen counts how many screens the player **would actually have run** —
usually the number that lands hardest.

## Difficulty

19 scenarios, graded warm-up / tricky / expert. Each player gets a randomised, balanced
set (5 attacks, 3 genuine, 2 ambiguous) ordered easiest-first, so no two people see the
same game and full marks are genuinely hard to get.

Covered techniques include ClickFix fake CAPTCHAs, FileFix via the File Explorer address
bar, macOS Terminal lures, fake browser updates, QR stickers on office equipment,
poisoned search/AI answers, compromised-colleague chat messages, help desk vishing, and
several genuine IT screens that people wrongly report.

## Adding your own scenarios

Append to the `SCENARIOS` array:

```js
{
  id:"my-scenario",
  answer:"attack",          // "attack" | "safe" | "verify"
  difficulty:2,             // 1 warm-up | 2 tricky | 3 expert
  tag:"ClickFix",
  prompt:"The situation the player is in.",
  chrome:{ url:"https://example[.]com/page", secure:false },  // or null for no browser bar
  screen:`<div class="body">…mock screen HTML…</div>`,
  title:"The headline lesson",
  why:"The explanation shown after answering.",
  flags:["Clue one","Clue two"],
  clip:"Optional reveal of what was really on the clipboard.",
  good:true                 // only on genuine screens: shows green ticks
}
```

Then update `MIX` if you change how many of each type a player should get.

## Running it at a booth

- Keys **1**, **2**, **3** answer; **Enter** advances. A host can run it without a mouse.
- **Next player** clears the name and returns to the start screen.
- The leaderboard lives in that browser's local storage only. Use one kiosk machine for a
  shared board, and **Clear leaderboard** at the end of the day.

## Safety note

Every command shown in the game is deliberately defanged (`hxxps`, `[.]`, truncated
payloads). Nothing in this repository can be copied and executed.

## Licence

MIT — see [LICENSE](LICENSE). Use it, rebrand it, and change the scenarios to fit your
organisation.
