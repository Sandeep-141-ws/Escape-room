# Identity Lockdown

**Digital Identity Escape Room** — *Can you secure your identity before the attacker gets in?*

A four-minute cyber awareness escape room for a Cyber Awareness Month booth.
Players scan a QR code, work through five rooms on their phone, and try to
assemble the digital key before the clock or the attacker beats them.

Built for people who don't work in cyber: no jargon, no product trivia, five
different kinds of puzzle rather than five multiple-choice questions.

---

## The two games in this repository

| URL | Game | Format |
|---|---|---|
| `/` | **Identity Lockdown** | Escape room — 5 rooms, 3 lives, one 4-minute clock |
| `/verify-me.html` | **Verify Me** | Quiz — 10 randomised scenarios, per-question timer |
| `/fix-or-phish.html` | **Fix or Phish?** | The original ClickFix/FileFix challenge |

All three share the same storage, host dashboard and Excel export, so results
land in one place whichever you run at the booth.

---

## Contents

| Path | What it does |
|---|---|
| `index.html` | Escape room shell |
| `assets/styles.css` | Shared design system |
| `assets/escape.css` | Escape-room specific styling |
| `src/config.js` | **Edit before your event.** Branding, rules, storage, host access. |
| `src/rooms.js` | **Room content.** Every scenario lives here. |
| `src/escape.js` | Run state, lives, clock, scoring. No DOM. |
| `src/escape-ui.js` | The five room types, key assembly, results. |
| `src/questions.js` | Question bank for Verify Me |
| `src/engine.js` | Shared helpers + Verify Me scoring |
| `src/storage.js` | Storage adapter — local, webhook or Supabase |
| `src/host.js` | Host dashboard, search, sort, export |
| `src/xlsx.js` | Writes a real `.xlsx` with no external library |

No build step, no bundler, no dependencies. Plain scripts, so the page also
works opened straight from the file system.

---

## How the escape room works

**The setup.** Your phone is missing, your MFA is unavailable, and someone is
already trying to get into your account. Four minutes to shut them out.

**Five rooms, five interaction types** — deliberately not five quizzes:

| Room | Interaction | Teaches |
|---|---|---|
| 1 · Lost Phone | Tap the safest action | Approved recovery, why lending devices backfires, the three-way fallback check |
| 2 · Who Can You Trust? | Tap every suspicious message, then confirm | Nobody legitimate asks for codes, passwords or blind approvals |
| 3 · Prove Your Identity | Tap the steps into order | The real Digital Identity capture flow, and where manager confirmation fits |
| 4 · Phishing Trap | Tap every warning sign in a fake email | Sender domains, urgency, QR codes, disguised links |
| 5 · The Imposter | Tap the safest action | Deepfakes, vishing and Teams impersonation |

Each room you clear gives a **key fragment**. Five fragments assemble the
Digital Identity Key, which runs the final sequence: *LOCKED → VERIFYING
IDENTITY → IDENTITY VERIFIED → ACCOUNT SECURED → UNLOCKED*.

**Lives.** Three. A dangerous decision costs one, but you keep going — you
always see why it was wrong first. Lose all three and the run ends with
*IDENTITY COMPROMISED*.

**The clock.** One four-minute countdown for the whole run. It doesn't pause
between rooms. Run out and you get *OUT OF TIME*.

### Scoring

| | Points |
|---|---|
| Correct decision | 100 |
| Speed bonus | up to 25, scaled against a 35-second target |
| Clean sweep (right first time, nothing wrong selected) | 25 |
| No hint used | 10 |
| Wrong decision | 0 — never negative |

Accuracy matters more than speed: the maximum speed bonus is a quarter of what
a correct answer is worth.

### Winner ranking

1. Highest total score
2. Then highest accuracy
3. Then fastest completion time
4. Then whoever finished first

Applied identically in the dashboard, the podium and the export.

### Randomisation

Every room picks one of its scenarios at random, and answer order is shuffled.
Two people side by side in the queue get different runs — Room 5 alone has a
deepfake video call, a Service Desk phone scam and a Teams impersonation.

---

## Running it locally

**Open the file.** Double-click `index.html`. Fine for a booth laptop.

**Or serve it**, which matches production more closely — any static server
works. A throwaway PowerShell one:

```powershell
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

Your link becomes `https://<user>.github.io/<repo>/`. Put it behind a QR code on
the booth poster.

> If the repository must stay private, host the folder on an internal web server
> or SharePoint instead. Everything is static.

---

## Configuring the backend

Set `storage` in `src/config.js`.

### `"local"` — default

Results stay in the player's own browser. Nothing leaves the device.

Right for a **booth laptop or tablet everyone shares**, because the dashboard
then sees every run. Wrong for **QR-to-your-own-phone**: each result stays on
that phone and your dashboard stays empty.

### `"webhook"` — Power Automate or Logic Apps

Keeps data inside your own tenant, usually the easiest thing to get approved.

1. Create a flow with the **"When an HTTP request is received"** trigger.
2. Give it a JSON schema matching the payload (`name`, `wopid`, `score`,
   `correct`, `accuracy`, `lives`, `escaped`, `durationMs`, `startedAt`,
   `completedAt`, …).
3. Add **Add a row into a table** pointing at Excel or a SharePoint list.
4. Save and copy the generated POST URL into `webhook.url`.

Those triggers don't return CORS headers, so the page can't read the response
and the dashboard still shows this device's copy. Your central record is the
SharePoint list.

### `"supabase"` — central results from any phone

Best experience, but participant names leave your tenant. **Get that cleared
first.**

1. Create a free project at supabase.com.
2. Run this in the SQL editor:

```sql
create table results (
  id                bigint generated always as identity primary key,
  game_id           uuid not null unique,
  game              text,
  name              text not null,
  wopid             text,
  score             integer not null,
  correct           integer not null,
  incorrect         integer not null,
  total             integer not null,
  accuracy          integer not null,
  lives             integer,
  max_lives         integer,
  escaped           boolean,
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

There are none, and there can't be. Pages serves static files, so everything in
`src/config.js` is readable by anyone who views source. Design around it:

- **The Supabase anon key is meant to be public.** It identifies the project; it
  doesn't grant access. Row Level Security is the control. Never put the
  `service_role` key in this repository.
- **`hostPasscode` is not a secret.** It stops a curious player wandering into
  the dashboard; it stops nobody who reads the source. Only use it in `local`
  mode, where the only thing behind the gate is that browser's own results. If
  results are central, use `hostAuth: "supabase"`.
- **A webhook URL is a capability.** Anyone who reads it can post junk results.
  Acceptable for a booth; validate inside the flow if it isn't.

---

## Host access

Reach the dashboard with `#host`, or press **Ctrl + Shift + H** on any screen.
Either route hits the gate set by `hostAuth`.

It shows total participants, completed games, average score, highest score,
average accuracy, average completion time, a 🥇🥈🥉 podium, and the full table:
rank, name, WOPID, score, correct decisions, accuracy, lives remaining, outcome,
completion time, started at, completed at. Search by name or WOPID; sort by any
of the underlined columns.

Escape-room runs show lives and outcome; quiz results show `—` in those columns.

The **Host** button in the top bar stays hidden until someone unlocks it, so
players never see a route to the leaderboard.

---

## Exporting results

**Export results** downloads
`Cyber-Awareness-Identity-Lockdown-Results-YYYY-MM-DD.xlsx` in ranking order:

Rank · Player Name · WOPID · Score · Correct Decisions · Incorrect Decisions ·
Accuracy % · Lives Remaining · Outcome · Completion Time · Average Response Time ·
Started At · Completed At

It's a genuine Excel workbook written by `src/xlsx.js` — no CDN, no library,
works offline. Players have no route to this button.

---

## Adding or editing scenarios

Everything is in `src/rooms.js`. Add a scenario to any room's `scenarios` array
and it joins the random rotation immediately. No logic changes needed.

**Tap the safest action** (`choice`):

```js
{
  id: "r1-recovery",
  brief: "Your phone is gone and you're locked out.",
  mock: `<div class="body dark">…</div>`,        // optional screen mock-up
  options: [
    { t: "Contact the Service Desk and verify your identity", correct: true },
    { t: "Ask a colleague to approve the MFA prompt for you" }
  ],
  why: "One sentence explaining the safer action.",
  hint: "One nudge, costs 10 points."
}
```

**Tap the suspicious messages** (`multiselect`): a `messages` array, each with
`from`, `initials`, `colour`, `text`, `suspicious` and `why`.

**Order the steps** (`order`): a `steps` array in the **correct** order — the
game shuffles them for display.

**Find the clues** (`hunt`): a `mock` HTML block containing
`<button class="clue" data-clue="id">…</button>` elements, plus a `clues` array
of `{ id, why }`. Wrap a non-text target (like the QR code) in
`<div class="clue-wrap" data-clue-wrap="id">`.

House rules that keep it usable for non-cyber staff:

- Describe a situation, not a definition.
- One clearly safest answer.
- `why` is **one sentence**. If it needs two, the scenario is too complex.
- Wrong answers should be plausible, not silly — that's where the learning is.

Digital Identity content follows the Woodside *Digital Identity — Leader
Overview* deck: privacy and consent first, then photo capture, then review with
manager confirmation where automatic verification can't complete, then choosing
your Microsoft 365 photo. People without a Digital Identity fall back to a
three-way verification call with their leader and the Digital Service Desk.

---

## Fairness

Prizes are involved, so there are basic controls — proportionate to a booth, not
to a bank:

- Every run gets a UUID; the same result can't be submitted twice, and Supabase
  enforces that server-side with a unique constraint.
- The final score is **recalculated from the recorded room outcomes**, not read
  from a running total on the page.
- Room and scenario IDs, per-room timings and start/finish timestamps are all
  stored, so an implausible run is visible in the export.
- Key fragments are only awarded for rooms actually cleared, so a partial run
  can't assemble the key.

What this does not do is stop someone who opens the developer console. The
answers are in the page, because all client-side code is. For a timed booth with
people watching, that's fine. If the prize is significant, have the top scores
play a decider in front of the booth team.

---

## Privacy

- Name required. WOPID optional by default — set `wopidRequired: true` only if
  prize verification genuinely needs it.
- No email address, no employee number, no device identifiers.
- Players see `privacyNotice` before they start.
- WOPIDs appear in the dashboard and export, never on a player screen.
- Players only ever see their own result and a generic "you're in the running"
  message. No leaderboard, no other participants.
- Delete results once prizes are awarded: **Clear results** in `local` mode, or
  `truncate results;` in Supabase.

---

## Accessibility

- Tap targets at least 52px; inputs at 16px so iOS doesn't zoom on focus.
- Correct and incorrect carry a tick or cross **and** screen-reader text, never
  colour alone. Lives and key fragments have ARIA labels with counts.
- Verdicts announce as a status; the clock exposes seconds remaining to screen
  readers.
- Keys `1`–`4` answer, `Enter` advances. Clue hotspots are real buttons and
  respond to Enter and Space.
- Animations respect `prefers-reduced-motion`.
- No room needs precise pointing or drag-and-drop — everything is a tap.
