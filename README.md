# Verify Me — Digital Identity Challenge

A three-to-five minute cyber awareness game for a Cyber Awareness Month booth.
Players scan a QR code, answer ten randomised real-world scenarios, and get a
score. The booth team gets a private leaderboard and an Excel export.

Built for people who don't work in cyber: no jargon, no CVE trivia, no
compliance quiz. Just "what would you actually do?"

---

## Contents

| Path | What it does |
|---|---|
| `index.html` | Page shell. Loads the scripts in order. |
| `assets/styles.css` | All styling. Mobile-first. |
| `src/config.js` | **Edit this before your event.** Branding, rules, storage, host access. |
| `src/questions.js` | The question bank. Add or edit questions here. |
| `src/engine.js` | Round selection, timing, scoring, ranking. No DOM. |
| `src/storage.js` | Storage adapter — local, webhook or Supabase. |
| `src/host.js` | Host dashboard, search, sort, export. |
| `src/ui.js` | Everything a player sees. Boots the game. |
| `src/xlsx.js` | Writes a real `.xlsx` with no external library. |
| `fix-or-phish.html` | The earlier ClickFix/FileFix game, kept and still playable. |

No build step, no bundler, no dependencies. Plain scripts, so the page also
works when opened straight from the file system.

---

## How the game works

1. **Start** — player enters their name, and their WOPID if you've asked for it.
2. **Ten questions**, drawn at random from a bank of 24 across four categories:
   Digital Identity, Identity & MFA, Phishing & social engineering, and everyday
   cyber. Answer order is shuffled too, so no two games look the same.
3. **25 seconds per question.** Correct answers score 100, plus up to 50 for
   speed, plus a streak bonus that caps at 75. Wrong answers score zero — you
   never lose points, so nobody is pushed out of the game early.
4. **Result** — score, rank, accuracy, time taken, average response time, and
   three things worth remembering.

Players only ever see their own result. They are told they're "in the running",
never where they sit against anyone else.

### Winner ranking

1. Highest total score
2. Then highest accuracy
3. Then fastest completion time
4. Then whoever finished first

Applied consistently in the dashboard, the podium and the export.

---

## Running it locally

Because there's no build step, either of these works:

**Open the file.** Double-click `index.html`. Good enough for a booth laptop.

**Or serve it**, which is closer to production:

```powershell
# any static server will do; this uses the one built into PowerShell
cd path\to\Cyber-Awareness-Game
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8822/')
$listener.Start()
```

Then open <http://localhost:8822/>.

---

## Deploying to GitHub Pages

1. Push to `main`.
2. **Settings → Pages → Source:** *Deploy from a branch* → `main` / `(root)` → **Save**.
3. The repository must be **public** for Pages on a free account.

Your link will be `https://<user>.github.io/Cyber-Awareness-Game/`. Put that
behind a QR code on the booth poster.

> If the repository must stay private, host the folder on an internal web server
> or SharePoint instead. Everything is static.

---

## Configuring the backend

Set `storage` in `src/config.js`. Three options:

### `"local"` — default

Scores are kept in the player's own browser. Nothing leaves the device.

Right for a **booth laptop or tablet** that everyone plays on, because the host
dashboard then sees every game. Wrong for **QR-to-your-own-phone**, because each
player's score stays on their own phone and your dashboard stays empty.

No configuration, no external service, no privacy review.

### `"webhook"` — Power Automate or Logic Apps

Keeps data inside your own tenant, which is usually the easiest option to get
approved.

1. Create a flow with the **"When an HTTP request is received"** trigger.
2. Give it a JSON schema matching the payload (`name`, `wopid`, `score`,
   `correct`, `accuracy`, `durationMs`, `startedAt`, `completedAt`, …).
3. Add an **Add a row into a table** action pointing at an Excel file or a
   SharePoint list.
4. Save, copy the generated POST URL into `webhook.url`.

Note the trade-off: those triggers don't return CORS headers, so the page can't
read the response and the host dashboard still reads this device's local copy.
Your central record is the SharePoint list, not the dashboard.

### `"supabase"` — central scores from any phone

Best experience, but it puts participant names outside your tenant. **Get that
cleared before you use it.**

1. Create a free project at supabase.com.
2. Run this in the SQL editor:

```sql
create table results (
  id                bigint generated always as identity primary key,
  game_id           uuid not null unique,
  name              text not null,
  wopid             text,
  score             integer not null,
  correct           integer not null,
  incorrect         integer not null,
  total             integer not null,
  accuracy          integer not null,
  duration_ms       integer not null,
  avg_response_ms   integer not null,
  started_at        timestamptz not null,
  completed_at      timestamptz not null,
  responses         jsonb,
  created_at        timestamptz default now()
);

alter table results enable row level security;

-- Players may add their own result and nothing else. No select, no update,
-- no delete. The unique game_id blocks duplicate submissions.
create policy "players can submit"
  on results for insert to anon with check (true);

-- Only a signed-in host account can read the leaderboard.
create policy "hosts can read"
  on results for select to authenticated using (true);
```

3. **Authentication → Users → Add user.** Create one host account.
4. Copy the project URL and the **anon** key into `supabase` in `src/config.js`.
5. Set `hostAuth: "supabase"`.

---

## Secrets on GitHub Pages

There are none, and there can't be. GitHub Pages serves static files, so
anything in `src/config.js` is readable by anyone who opens the page source.
Design around it rather than trying to hide things:

- **The Supabase anon key is meant to be public.** It identifies the project, it
  doesn't grant access. Row Level Security is the control. Never put the
  `service_role` key in this repository.
- **`hostPasscode` is not a secret.** It stops a curious player wandering into
  the dashboard; it does not stop anyone who reads the source. Only use it in
  `local` storage mode, where the only thing behind the gate is that browser's
  own scores. If results are stored centrally, use `hostAuth: "supabase"`.
- **A webhook URL is a capability.** Anyone who reads it can post junk results.
  For a booth that's an acceptable risk; validate in the flow if it isn't.

---

## Host access

Reach the dashboard with `#host` on the URL, or press **Ctrl + Shift + H** on
any screen. Either way you hit the gate configured by `hostAuth`.

The dashboard shows participants, completed games, average score, highest score,
average accuracy, average completion time, a top-three podium, and the full
table with search and column sorting.

The **Host** button in the top bar stays hidden until someone unlocks it, so
players never see a route to the leaderboard.

---

## Exporting results

**Export results** in the dashboard downloads
`Cyber-Awareness-Game-Results-YYYY-MM-DD.xlsx` in ranking order, with:

Rank · Player Name · WOPID · Score · Correct Answers · Incorrect Answers ·
Accuracy · Completion Time · Average Response Time · Started At · Completed At

It's a genuine Excel workbook written by `src/xlsx.js` — no CDN, no library, and
it works offline. Players have no route to this button.

---

## Editing the questions

Everything lives in `src/questions.js`. One object per question:

```js
{
  id:"di-review",                      // unique, stable
  category:"identity",                 // identity | mfa | phishing | cyber
  difficulty:2,                        // 1 warm-up, 2 tricky, 3 expert
  tag:"Photo review",
  context:"You're a leader reviewing a team member's identity photo.",
  question:"The photo is blurry and you can't confidently tell it's them. What do you do?",
  mock:`<div class="body">…</div>`,    // optional screen mock-up
  choices:[
    { t:"Reject it and ask them to retake it", correct:true },
    { t:"Approve it — they're in your team, so it must be them" },
    { t:"Approve it and mention the quality to them later" }
  ],
  why:"Approving a photo you can't verify defeats the whole point.",
  lock:true                            // optional: don't shuffle these choices
}
```

House rules that keep it usable for non-cyber staff:

- Describe a situation, not a definition.
- Three or four choices, exactly one clearly safest.
- `why` is **one sentence**. If it needs two, the question is too complex.
- No jargon, no product names beyond what people actually see on screen.
- Wrong answers should be plausible, not silly — that's where the learning is.

Change how many of each category appear in `config.mix`. The totals must add up
to `questionsPerGame`, and each category needs more questions in the bank than
it draws, or games stop varying.

Digital Identity answers follow the Woodside *Digital Identity — Leader
Overview* deck: privacy and consent first, then photo capture, then review with
manager confirmation where automatic verification can't complete, then choosing
your Microsoft 365 photo.

---

## Fairness

Prizes are involved, so there are some basic controls. They're proportionate to
a booth, not to a bank:

- Every game gets a UUID; the same result can't be submitted twice, and
  Supabase enforces that server-side with a unique constraint.
- The final score is **recalculated from the recorded answers** at the end, not
  read from a running total on the page.
- Start and finish timestamps are recorded, so an implausible completion time is
  visible in the export.

What this does not do is stop someone who opens the developer console. The
answers are in the page, because all client-side code is. For a timed booth with
people watching, that's fine. If you're giving away something significant, make
the top scores play a decider in front of the booth team.

---

## Privacy

- Name is required. WOPID is optional by default — set `wopidRequired: true`
  only if prize verification genuinely needs it.
- No email address, no employee number, no device identifiers.
- Players see the notice in `privacyNotice` before they start.
- WOPIDs appear in the host dashboard and the export, never on a player screen.
- Delete the results once prizes are awarded. In `local` mode that's the
  **Clear results** button; in Supabase it's `truncate results;`.

---

## Accessibility

- Tap targets are at least 52px; inputs are 16px so iOS doesn't zoom on focus.
- Correct and incorrect are shown with a tick or cross **and** screen-reader
  text, never colour alone.
- Progress is exposed as an ARIA progress bar; verdicts announce as a status.
- Keys `1`–`4` answer, `Enter` advances, and focus moves to the next control.
- Animations are disabled under `prefers-reduced-motion`.
