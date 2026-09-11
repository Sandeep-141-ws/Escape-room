/* ============================================================================
   Verify Me — question bank
   ----------------------------------------------------------------------------
   Add or edit questions here. Nothing else needs to change.

   category   "identity" | "mfa" | "phishing" | "cyber"
   difficulty 1 warm-up | 2 tricky | 3 expert   (games are ordered easiest first)
   context    optional scene-setting line shown above the question
   mock       optional HTML mock-up of a screen, chat or notice
   choices    3-4 options, exactly one with correct:true
   why        ONE sentence shown after answering
   lock       true keeps choice order fixed (use when options are sequential)

   Digital Identity answers follow the Woodside "Digital Identity - Leader
   Overview" deck: privacy & consent, photo capture, review (manager
   confirmation where needed), choose your Microsoft 365 photo.
   ========================================================================== */
window.VM_QUESTIONS = [

/* ========================================================================== */
/*  DIGITAL IDENTITY                                                          */
/* ========================================================================== */
{
  id:"di-what", category:"identity", difficulty:1, tag:"Digital Identity",
  question:"What is a Woodside Digital Identity actually for?",
  choices:[
    { t:"Trusted digital proof that it's really you, so identity can be confirmed securely", correct:true },
    { t:"A new staff photo directory so people can see who's who" },
    { t:"Tracking where employees are on site" },
    { t:"Replacing your building access card" }
  ],
  why:"Digital Identity moves us from verbal trust to digital proof, which protects against impersonation and social engineering."
},
{
  id:"di-steps", category:"identity", difficulty:1, tag:"Photo capture", lock:true,
  context:"You've been invited to create your Digital Identity.",
  question:"What's the first thing you'll be asked to do?",
  mock:`
    <div class="body dark">
      <h3>Create your Digital Identity</h3>
      <p class="muted">A few short steps. It takes about two minutes and you only do it once.</p>
      <p class="muted" style="margin-bottom:0">Step 1 of 4</p>
      <span class="cta green">Get started</span>
    </div>`,
  choices:[
    { t:"Review the privacy information and give your consent", correct:true },
    { t:"Take your photo straight away" },
    { t:"Ask your manager to approve you first" },
    { t:"Enter your password to confirm it's you" }
  ],
  why:"Privacy and consent come first — you see what the photo is used for before you take it."
},
{
  id:"di-voluntary", category:"identity", difficulty:2, tag:"Digital Identity",
  question:"A colleague asks whether they have to create a Digital Identity. What's true?",
  choices:[
    { t:"It's voluntary, but without one they'll need a slower fallback check for some support requests", correct:true },
    { t:"It's mandatory and their account will be locked if they don't" },
    { t:"It's only for leaders and digital teams" },
    { t:"It's optional and makes no difference to anything" }
  ],
  why:"Participation is voluntary and strongly encouraged; the fallback is a three-way verification call with you, your leader and the Service Desk."
},
{
  id:"di-autofail", category:"identity", difficulty:2, tag:"Photo review",
  context:"You've just submitted your identity photo.",
  question:"Your photo couldn't be automatically verified against your existing profile photo. What happens now?",
  mock:`
    <div class="body">
      <div class="idcard">
        <div class="idphoto"></div>
        <div class="idmeta">
          <b>Identity photo submitted</b>
          Automatic verification could not be completed.
          <span class="pill pending">Awaiting review</span>
        </div>
      </div>
    </div>`,
  choices:[
    { t:"It goes to your manager to confirm it's really you", correct:true },
    { t:"Your photo is rejected and you can't try again" },
    { t:"It's approved anyway after 24 hours" },
    { t:"You have to visit the Service Desk in person" }
  ],
  why:"Where automatic verification can't be completed, manager confirmation is used instead — the check still happens, just by a human."
},
{
  id:"di-review", category:"identity", difficulty:2, tag:"Photo review",
  context:"You're a leader reviewing a team member's identity photo.",
  question:"The photo is blurry and you can't confidently tell it's them. What do you do?",
  mock:`
    <div class="body">
      <div class="idcard">
        <div class="idphoto blur"></div>
        <div class="idmeta">
          <b>Review identity photo</b>
          Submitted by a member of your team.
          <span class="pill pending">Your approval needed</span>
        </div>
      </div>
      <p class="muted" style="margin-top:14px;margin-bottom:0">Approve only if you are confident this is the person.</p>
    </div>`,
  choices:[
    { t:"Reject it and ask them to retake it", correct:true },
    { t:"Approve it — they're in your team, so it must be them" },
    { t:"Approve it and mention the quality to them later" },
    { t:"Ignore it and let it time out" }
  ],
  why:"Approving a photo you can't verify defeats the whole point — if you aren't confident, send it back."
},
{
  id:"di-benefit", category:"identity", difficulty:3, tag:"Digital Identity",
  question:"Once you have a Digital Identity, what does it change day to day?",
  choices:[
    { t:"Identity checks for support and account recovery become faster and more consistent", correct:true },
    { t:"You no longer need multi-factor authentication" },
    { t:"You can share your account with a colleague when you're on leave" },
    { t:"You stop receiving security awareness emails" }
  ],
  why:"It's trusted digital proof used when stronger verification is needed — it supports MFA and account recovery, it never replaces them."
},

/* ========================================================================== */
/*  IDENTITY & MFA                                                            */
/* ========================================================================== */
{
  id:"mfa-unexpected", category:"mfa", difficulty:1, tag:"MFA",
  context:"You're eating lunch. You haven't touched your laptop for an hour.",
  question:"Your phone buzzes with a sign-in approval request. What do you do?",
  mock:`
    <div class="body dark">
      <div class="authcard">
        <div style="font-size:13px;color:#98A2AE">Microsoft Authenticator</div>
        <h3 style="margin:8px 0 4px">Approve sign-in?</h3>
        <p class="muted" style="margin-bottom:10px">you@woodside.com &#183; Windows &#183; Lagos, Nigeria</p>
        <span class="cta green">Approve</span><span class="cta red">Deny</span>
      </div>
    </div>`,
  choices:[
    { t:"Deny it, then report it — someone has your password", correct:true },
    { t:"Approve it so the buzzing stops" },
    { t:"Ignore it and hope it goes away" },
    { t:"Approve it, then change your password afterwards" }
  ],
  why:"An approval request you didn't trigger means someone else already has your password — deny and report it straight away."
},
{
  id:"mfa-share", category:"mfa", difficulty:1, tag:"MFA",
  context:"A message from someone claiming to be IT support.",
  question:"They ask you to read out the 6-digit code from your Authenticator app. What's the right answer?",
  mock:`
    <div class="body dark">
      <div class="chatrow">
        <div class="av" style="background:#B45309">&#9742;</div>
        <div class="bubble">
          &#8220;I'm just finishing your account fix now &#8212; can you read me the six-digit code in your Authenticator app so I can complete the sync?&#8221;
          <div style="margin-top:10px;font-size:12.5px;color:#98A2AE">Incoming call &#183; number withheld</div>
        </div>
      </div>
    </div>`,
  choices:[
    { t:"Never share it — no genuine IT person will ever ask for it", correct:true },
    { t:"Share it, but only if they already know your employee number" },
    { t:"Share it if the caller ID shows an internal number" },
    { t:"Share it, then change your password afterwards" }
  ],
  why:"Your MFA code is the one thing an attacker can't get from your password alone, which is exactly why they ask for it."
},
{
  id:"mfa-lostphone", category:"mfa", difficulty:2, tag:"Account recovery",
  context:"You've lost your phone. You can't approve MFA and you're locked out.",
  question:"What's the right way to get back in?",
  choices:[
    { t:"Contact the Service Desk through an official channel and verify your identity", correct:true },
    { t:"Borrow a colleague's phone and register it on your account" },
    { t:"Ask a teammate to approve the prompt for you" },
    { t:"Click a 'restore access' link from a search engine result" }
  ],
  why:"Account recovery always runs through a verified identity check — and a Digital Identity makes that check faster."
},
{
  id:"mfa-impersonate", category:"mfa", difficulty:2, tag:"Impersonation",
  context:"A Teams message from someone using your manager's name and photo.",
  question:"They urgently need you to approve an access request. What do you do?",
  mock:`
    <div class="body dark">
      <div class="chatrow">
        <div class="av" style="background:#0F9D7A">RM</div>
        <div class="bubble">
          Hi &#8212; I'm in back-to-back meetings and locked out. Can you approve the access request that's about to come through? Need it in the next 10 minutes for the board pack. Don't wait for me, just approve it &#128591;
          <div style="margin-top:10px;font-size:12.5px;color:#98A2AE">External &#183; new contact</div>
        </div>
      </div>
    </div>`,
  choices:[
    { t:"Call them on a number you already have and confirm before doing anything", correct:true },
    { t:"Approve it — the photo and name match your manager" },
    { t:"Reply in the chat asking them to prove who they are" },
    { t:"Approve it, then tell them afterwards you've done it" }
  ],
  why:"A name and photo are trivially copied; verify on a channel the sender doesn't control."
},
{
  id:"mfa-tap", category:"mfa", difficulty:3, tag:"Verified ID",
  question:"How does a verified Digital Identity help when you need temporary access to get back into your account?",
  choices:[
    { t:"It proves who you are, so a temporary access pass can be issued with less back-and-forth", correct:true },
    { t:"It gives you a permanent password you never have to change" },
    { t:"It lets you skip identity checks completely" },
    { t:"It automatically unlocks your account whenever you're locked out" }
  ],
  why:"Verified identity is what makes safe self-service recovery possible — the check is stronger and quicker, not skipped."
},
{
  id:"mfa-fatigue", category:"mfa", difficulty:3, tag:"MFA fatigue",
  context:"Prompts keep arriving every few minutes. You didn't start any of them.",
  question:"What's happening, and what should you do?",
  mock:`
    <div class="body dark">
      <div class="authcard">
        <div style="font-size:13px;color:#98A2AE">Microsoft Authenticator</div>
        <h3 style="margin:8px 0 4px">Approve sign-in?</h3>
        <p class="muted" style="margin-bottom:0">Request 7 of 7 &#183; last 12 minutes</p>
      </div>
    </div>`,
  choices:[
    { t:"Someone is hoping you'll approve one by mistake — deny them all and report it", correct:true },
    { t:"The app is glitching — approve one to reset it" },
    { t:"It's a routine security test — approve it" },
    { t:"Turn your phone off and deal with it tomorrow" }
  ],
  why:"Flooding you with prompts until one gets approved is a known attack; denying isn't enough on its own, so report it."
},

/* ========================================================================== */
/*  PHISHING & SOCIAL ENGINEERING                                             */
/* ========================================================================== */
{
  id:"ph-quishing", category:"phishing", difficulty:1, tag:"Quishing",
  context:"A notice taped to the printer on your floor.",
  question:"It says your account expires today unless you scan the code. What do you do?",
  mock:`
    <div class="body">
      <div class="sticker">
        <div class="qr"></div>
        <div>
          <div style="font-weight:800;font-size:15px;margin-bottom:4px">ACTION REQUIRED</div>
          <div style="font-size:13px;line-height:1.5">Your network account expires today.<br>Scan to re-validate and avoid losing access.</div>
        </div>
      </div>
    </div>`,
  choices:[
    { t:"Don't scan it — anyone can print a sticker; report it instead", correct:true },
    { t:"Scan it to check whether it looks genuine" },
    { t:"Scan it, but only enter your password if the page looks right" },
    { t:"Ask the person at the next desk to scan it first" }
  ],
  why:"A QR code hides where it goes until you're already there, and on your phone you've left the company's protections behind."
},
{
  id:"ph-deepfake", category:"phishing", difficulty:3, tag:"Deepfake",
  context:"A video call from an executive you recognise. The picture stutters occasionally.",
  question:"They ask you to push through an urgent payment, today, without the usual approval. What do you do?",
  mock:`
    <div class="body dark">
      <div class="chatrow">
        <div class="av" style="background:#4B5563">&#127909;</div>
        <div class="bubble">
          &#8220;Sorry about the connection. This is confidential &#8212; I need this processed before close of business and I can't go through the usual channel. You have my authority.&#8221;
          <div style="margin-top:10px;font-size:12.5px;color:#98A2AE">Video call &#183; 2 min &#183; connection unstable</div>
        </div>
      </div>
    </div>`,
  choices:[
    { t:"Stop, and confirm through the normal approval process on a separate channel", correct:true },
    { t:"Do it — you can see and hear them, so it's clearly them" },
    { t:"Do it, and log the exception afterwards" },
    { t:"Ask them a personal question on the call to check it's really them" }
  ],
  why:"Faces and voices can be convincingly faked now, so the control that still works is the process, not your recognition."
},
{
  id:"ph-servicedesk", category:"phishing", difficulty:2, tag:"Vishing",
  context:"A caller knows your name, your manager's name and your laptop's asset tag.",
  question:"They say your account fails a compliance check and needs fixing now. What do you do?",
  choices:[
    { t:"Hang up and call the Service Desk on the number from the intranet", correct:true },
    { t:"Continue — only a real colleague would know those details" },
    { t:"Ask for their employee number and carry on if they give one" },
    { t:"Let them proceed but don't type anything yourself" }
  ],
  why:"Knowing things about you is not proof of identity; those details leak constantly."
},
{
  id:"ph-link", category:"phishing", difficulty:1, tag:"Phishing",
  context:"An email about a shared document you weren't expecting.",
  question:"What's the safest way to check whether it's genuine?",
  mock:`
    <div class="body">
      <h3>A document has been shared with you</h3>
      <p class="muted">R. Mitchell shared &#8220;Q3 Rates &#8212; FINAL.xlsx&#8221; with you. This link expires in 24 hours.</p>
      <span class="cta">Open document</span>
    </div>`,
  choices:[
    { t:"Don't click — contact the sender another way, and report it if unsure", correct:true },
    { t:"Click the link and see whether the site looks legitimate" },
    { t:"Reply to the email and ask if they sent it" },
    { t:"Forward it to a colleague to see what they think" }
  ],
  why:"Replying reaches the attacker if the account is fake, so verify on a channel they don't control."
},
{
  id:"ph-oversharing", category:"phishing", difficulty:2, tag:"Oversharing",
  context:"You're about to post a photo from your first day on site.",
  question:"What should you leave out of the picture?",
  choices:[
    { t:"Your ID badge, screens, and anything showing systems or site layout", correct:true },
    { t:"Nothing — it's a public area, so it's all fine" },
    { t:"Only your face, to protect your privacy" },
    { t:"Only the company logo" }
  ],
  why:"Badges, screens and layouts are exactly the details that make a later impersonation attempt convincing."
},
{
  id:"ph-urgency", category:"phishing", difficulty:2, tag:"Social engineering",
  question:"Which of these is the strongest sign you're being socially engineered?",
  choices:[
    { t:"Urgency, secrecy, and a request to skip the normal process", correct:true },
    { t:"A message arriving outside business hours" },
    { t:"An attachment larger than 5 MB" },
    { t:"A sender you've never emailed before" }
  ],
  why:"Pressure plus secrecy plus a bypassed process is the pattern behind nearly every one of these attacks."
},

/* ========================================================================== */
/*  EVERYDAY CYBER                                                            */
/* ========================================================================== */
{
  id:"cy-wifi", category:"cyber", difficulty:1, tag:"Public Wi-Fi",
  context:"You're at an airport and need to finish something for work.",
  question:"What's the safest way to connect?",
  choices:[
    { t:"Use your phone's hotspot, or the company VPN if you must use the Wi-Fi", correct:true },
    { t:"Join the open network named after the airport" },
    { t:"Join whichever network has the strongest signal" },
    { t:"Join the free network but only visit sites showing a padlock" }
  ],
  why:"Anyone can stand up a network with a convincing name; your own hotspot removes the guesswork."
},
{
  id:"cy-usb", category:"cyber", difficulty:1, tag:"USB",
  context:"You find a USB drive in the car park with your site's logo on it.",
  question:"What do you do with it?",
  choices:[
    { t:"Hand it in — don't plug it into anything", correct:true },
    { t:"Plug it into your laptop to find the owner" },
    { t:"Plug it into a spare machine that doesn't matter" },
    { t:"Scan it with antivirus first, then open it" }
  ],
  why:"Plugging in an unknown device can run code before anything appears on screen — including before a scan finishes."
},
{
  id:"cy-password", category:"cyber", difficulty:2, tag:"Passwords",
  question:"Which password habit actually protects you?",
  choices:[
    { t:"A long unique passphrase for each account, kept in an approved password manager", correct:true },
    { t:"One strong password reused everywhere so you never forget it" },
    { t:"A strong password with a number on the end that you change each month" },
    { t:"Writing passwords in a notebook you keep in your desk drawer" }
  ],
  why:"Reuse is what turns one breached website into a compromise of your work account."
},
{
  id:"cy-suspicious-login", category:"cyber", difficulty:2, tag:"Account security",
  context:"An email says there was a sign-in to your account from another country.",
  question:"How do you check whether it's true?",
  mock:`
    <div class="body">
      <h3>Unusual sign-in activity</h3>
      <p class="muted">We detected a sign-in from a new location. If this wasn't you, secure your account now.</p>
      <span class="cta">Secure my account</span>
    </div>`,
  choices:[
    { t:"Ignore the email's buttons and check your account through the app or portal yourself", correct:true },
    { t:"Click 'Secure my account' and sign in to review it" },
    { t:"Reply asking for more detail about the sign-in" },
    { t:"Delete it — these are always fake" }
  ],
  why:"The alert may well be real, but you should always navigate there yourself rather than through the message."
},
{
  id:"cy-shoulder", category:"cyber", difficulty:2, tag:"Identity theft",
  context:"You're working on a report on a busy flight.",
  question:"What's the biggest risk, and what do you do about it?",
  choices:[
    { t:"People nearby reading your screen — use a privacy filter or don't open it", correct:true },
    { t:"The aircraft Wi-Fi corrupting your file — save often" },
    { t:"Your battery running out — dim the screen" },
    { t:"Nothing, as long as you lock your laptop when you leave your seat" }
  ],
  why:"Information gathered over your shoulder is what makes a later impersonation attempt sound credible."
},
{
  id:"cy-reporting", category:"cyber", difficulty:1, tag:"Reporting",
  context:"You clicked a suspicious link before realising. Nothing obvious happened.",
  question:"What's the right thing to do?",
  choices:[
    { t:"Report it straight away — you're not in trouble, and minutes matter", correct:true },
    { t:"Wait and see whether anything goes wrong" },
    { t:"Run a virus scan and only report it if something is found" },
    { t:"Change your password and say nothing" }
  ],
  why:"Fast reporting is what limits the damage; people who report early are the reason incidents stay small."
}

];
