/* ============================================================================
   Verify Me — player experience
   Renders every player-facing screen into #stage. Players never see anyone
   else's result: the only leaderboard lives behind the host dashboard.
   ========================================================================== */
(function (global) {
  "use strict";

  var CFG = global.VM_CONFIG;
  var ENGINE = global.VM_ENGINE;
  var STORE = global.VM_STORAGE;

  var stage = document.getElementById("stage");
  var hostBtn = document.getElementById("nav-host");

  var game = null, timerId = null, tickId = null, questionStart = 0, answered = false;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function tokens(s) {
    return String(s)
      .replace(/\{\{serviceDesk\}\}/g, esc(CFG.serviceDesk))
      .replace(/\{\{reportHow\}\}/g, esc(CFG.reportHow))
      .replace(/\{\{orgName\}\}/g, esc(CFG.orgName));
  }

  function clearTimers() {
    if (timerId) { clearTimeout(timerId); timerId = null; }
    if (tickId) { clearTimeout(tickId); tickId = null; }
  }

  /* ------------------------------------------------------------------ start */
  function renderStart(keepPlayer) {
    clearTimers();
    var prev = keepPlayer && game ? game.player : null;

    stage.innerHTML =
      '<p class="eyebrow">' + esc(CFG.orgName) + " &#183; " + esc(CFG.eventName) + "</p>" +
      "<h1>Verify <em>Me</em></h1>" +
      '<p class="lede">Ten quick calls. Real situations. Can you tell who to trust?</p>' +
      '<p class="lede"><b>' + CFG.questionsPerGame + " questions &#183; " +
        CFG.secondsPerQuestion + " seconds each &#183; fastest correct answers score highest.</b></p>" +

      '<div class="field">' +
        '<label for="p-name">Your name</label>' +
        '<input type="text" id="p-name" autocomplete="name" autocapitalize="words" ' +
          'placeholder="e.g. Alex Taylor" maxlength="40" value="' + esc(prev ? prev.name : "") + '">' +
      "</div>" +

      (CFG.collectWopid ?
        '<div class="field">' +
          '<label for="p-wopid">WOPID <span class="opt">' +
            (CFG.wopidRequired ? "" : "(optional)") + "</span></label>" +
          '<input type="text" id="p-wopid" inputmode="text" autocapitalize="characters" ' +
            'placeholder="For prize verification" maxlength="20" value="' + esc(prev ? prev.wopid : "") + '">' +
        "</div>" : "") +

      '<p class="err" id="start-err" hidden role="alert"></p>' +

      '<div class="foot"><button class="big" id="go">Start</button></div>' +

      '<h3 class="sub">How it works</h3>' +
      '<ul class="howto">' +
        '<li><span class="num">1</span><div>Read the situation, then pick the <b>safest</b> thing to do.</div></li>' +
        '<li><span class="num">2</span><div>Answer quickly for bonus points, and keep a streak going for more.</div></li>' +
        '<li><span class="num">3</span><div>Wrong answers score nothing &#8212; but you never lose points.</div></li>' +
      "</ul>" +

      '<div class="privacy">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
          '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
        "<p>" + esc(CFG.privacyNotice) + "</p>" +
      "</div>";

    var nameInput = document.getElementById("p-name");
    var wopidInput = document.getElementById("p-wopid");
    var err = document.getElementById("start-err");

    function start() {
      var name = nameInput.value.trim();
      var wopid = wopidInput ? wopidInput.value.trim() : "";

      if (name.length < 2) {
        err.textContent = "Enter your name to start.";
        err.hidden = false; nameInput.focus(); return;
      }
      if (CFG.collectWopid && CFG.wopidRequired && !wopid) {
        err.textContent = "Enter your WOPID to start.";
        err.hidden = false; wopidInput.focus(); return;
      }

      game = new ENGINE.Game({ name: name, wopid: wopid });
      renderQuestion();
    }

    document.getElementById("go").onclick = start;
    [nameInput, wopidInput].forEach(function (input) {
      if (input) input.addEventListener("keydown", function (e) { if (e.key === "Enter") start(); });
    });
    nameInput.focus();
  }

  /* --------------------------------------------------------------- question */
  var CATEGORY_LABEL = {
    identity: "Digital Identity",
    mfa: "Identity &amp; MFA",
    phishing: "Phishing",
    cyber: "Everyday cyber"
  };

  function renderQuestion() {
    answered = false;
    var round = game.current();
    var q = round.q;
    var n = game.index;

    var pips = game.rounds.map(function (_, i) {
      return '<div class="pip ' + (i < n ? "done" : i === n ? "now" : "") + '"></div>';
    }).join("");

    var streak = game.streak();

    stage.innerHTML =
      '<div class="meta">' +
        '<div class="pips" role="progressbar" aria-valuenow="' + (n + 1) +
          '" aria-valuemin="1" aria-valuemax="' + game.rounds.length + '" ' +
          'aria-label="Question ' + (n + 1) + " of " + game.rounds.length + '">' + pips + "</div>" +
        '<div class="chip cat-' + q.category + '">' + CATEGORY_LABEL[q.category] + "</div>" +
        '<div class="chip">' + (n + 1) + " / " + game.rounds.length + "</div>" +
        '<div class="chip pts">' + game.score() + " pts</div>" +
        (streak > 1 ? '<div class="chip streak">' + streak + " streak</div>" : "") +
      "</div>" +

      '<div class="clock"><i id="clockbar"></i></div>' +

      (q.context ? '<p class="qcontext">' + tokens(esc(q.context)) + "</p>" : "") +
      '<p class="qtext">' + tokens(esc(q.question)) + "</p>" +
      (q.mock ? '<div class="screen">' + q.mock + "</div>" : "") +

      '<div class="answers" id="answers">' +
        round.choices.map(function (c, i) {
          return '<button class="ans" data-i="' + i + '">' +
                   "<kbd>" + (i + 1) + "</kbd>" +
                   "<span>" + tokens(esc(c.t)) + "</span>" +
                   '<span class="mark" aria-hidden="true"></span>' +
                 "</button>";
        }).join("") +
      "</div>" +
      '<div id="slot"></div>';

    Array.prototype.forEach.call(stage.querySelectorAll(".ans"), function (b) {
      b.onclick = function () { submitAnswer(parseInt(b.dataset.i, 10)); };
    });

    startClock();
  }

  function startClock() {
    var bar = document.getElementById("clockbar");
    var ms = CFG.secondsPerQuestion * 1000;
    questionStart = Date.now();

    bar.style.transition = "transform " + CFG.secondsPerQuestion + "s linear";
    requestAnimationFrame(function () { bar.style.transform = "scaleX(0)"; });

    tickId = setTimeout(function () { if (bar) bar.classList.add("low"); }, Math.max(0, ms - 5000));
    timerId = setTimeout(function () { submitAnswer(null); }, ms);
  }

  /* ---------------------------------------------------------------- verdict */
  function submitAnswer(choiceIndex) {
    if (answered) return;
    answered = true;
    clearTimers();

    var bar = document.getElementById("clockbar");
    if (bar) {
      bar.style.transition = "none";
      bar.style.transform = getComputedStyle(bar).transform;
    }

    var round = game.current();
    var response = game.record(choiceIndex, Date.now() - questionStart);

    Array.prototype.forEach.call(stage.querySelectorAll(".ans"), function (b) {
      var i = parseInt(b.dataset.i, 10);
      b.disabled = true;
      if (round.choices[i].correct) {
        b.classList.add("is-right");
        b.querySelector(".mark").textContent = "\u2713";
        b.insertAdjacentHTML("beforeend", '<span class="sr">Correct answer</span>');
      } else if (i === choiceIndex) {
        b.classList.add("is-wrong");
        b.querySelector(".mark").textContent = "\u2717";
        b.insertAdjacentHTML("beforeend", '<span class="sr">Your answer, incorrect</span>');
      }
    });

    var cls = response.correct ? "ok" : (choiceIndex === null ? "out" : "no");
    var head = response.correct ? "Correct"
             : choiceIndex === null ? "Out of time" : "Not quite";

    var detail = response.correct
      ? "+" + response.points + " pts" +
        (response.speedBonus ? " &#183; " + response.speedBonus + " speed" : "") +
        (response.streakBonus ? " &#183; " + response.streakBonus + " streak" : "")
      : "+0 pts";

    var last = game.isLast();

    document.getElementById("slot").innerHTML =
      '<div class="verdict" role="status">' +
        '<div class="vhead ' + cls + '"><span>' + head + "</span>" +
          '<span class="pts">' + detail + "</span></div>" +
        '<div class="vbody">' + tokens(esc(round.q.why)) + "</div>" +
      "</div>" +
      '<div class="next"><button class="big" id="next">' +
        (last ? "See my result" : "Next") + "</button></div>";

    var next = document.getElementById("next");
    next.onclick = function () {
      if (last) { renderResult(); } else { game.index++; renderQuestion(); }
    };
    next.focus();
  }

  /* ----------------------------------------------------------------- result */
  function renderResult() {
    clearTimers();
    var result = game.result();
    var rank = ENGINE.rankFor(result.accuracy);

    stage.innerHTML =
      '<p class="eyebrow">' + esc(CFG.orgName) + " &#183; " + esc(CFG.eventName) + "</p>" +
      '<p class="lede" style="margin-bottom:10px">' +
        esc(result.name.split(" ")[0]) + ", here&#8217;s how you did:</p>" +
      '<div class="scorewrap"><p class="score">' + result.score + "<small> pts</small></p></div>" +
      '<div class="rank">' + esc(rank.title) + "</div>" +
      '<p class="rankmsg">' + esc(rank.msg) + "</p>" +

      '<div class="statrow">' +
        '<div class="stat good"><b>' + result.correct + "/" + result.total + "</b><span>Correct</span></div>" +
        '<div class="stat"><b>' + result.accuracy + "%</b><span>Accuracy</span></div>" +
        '<div class="stat"><b>' + ENGINE.formatDuration(result.durationMs) + "</b><span>Time taken</span></div>" +
        '<div class="stat"><b>' + (result.avgResponseMs / 1000).toFixed(1) + "s</b><span>Avg answer</span></div>" +
      "</div>" +

      '<div class="savenote" id="savenote">Saving your score&#8230;</div>' +

      '<h3 class="sub">Three things worth remembering</h3>' +
      '<ul class="takeaways">' +
        '<li><span class="num">1</span><div><b>Never approve an MFA prompt you didn&#8217;t start.</b> ' +
          "Deny it and report it &#8212; it means someone already has your password.</div></li>" +
        '<li><span class="num">2</span><div><b>Verify on a channel they don&#8217;t control.</b> ' +
          "Call the person back on a number you already had. A name, a photo or a voice proves nothing.</div></li>" +
        '<li><span class="num">3</span><div><b>Your Digital Identity is trusted proof it&#8217;s really you.</b> ' +
          "It makes account recovery faster and impersonation much harder.</div></li>" +
      "</ul>" +

      '<div class="foot">' +
        '<button class="big" id="again">Play again</button>' +
        '<button class="big alt" id="newplayer">Next player</button>' +
      "</div>" +
      '<p class="tiny" style="margin-top:18px">Scores are reviewed by the booth team. ' +
        "Winners are announced at the end of " + esc(CFG.eventName) + ".</p>";

    var note = document.getElementById("savenote");
    STORE.submit(result).then(function (r) {
      if (r.duplicate) { note.textContent = "Score already recorded."; return; }
      if (r.ok) {
        note.textContent = "Score recorded \u2713 Great score \u2014 you\u2019re in the running!";
      } else {
        note.className = "savenote bad";
        note.textContent = "Couldn\u2019t save your score. Show this screen to the booth team.";
      }
    });

    document.getElementById("again").onclick = function () {
      game = new ENGINE.Game(game.player);
      renderQuestion();
    };
    document.getElementById("newplayer").onclick = function () { renderStart(false); };
    document.getElementById("again").focus();
  }

  /* ------------------------------------------------------------------- host */
  function openHost() {
    clearTimers();
    global.VM_HOST.open(stage, function () { renderStart(false); });
  }

  hostBtn.onclick = openHost;

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") {
      e.preventDefault(); openHost(); return;
    }
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) {
      var btn = stage.querySelector('.ans[data-i="' + (n - 1) + '"]');
      if (btn && !btn.disabled) btn.click();
    }
    if (e.key === "Enter") {
      var next = document.getElementById("next");
      if (next) next.click();
    }
  });

  /* ------------------------------------------------------------------- boot */
  document.getElementById("brand-name").textContent = CFG.gameName;
  document.getElementById("brand-sub").textContent = CFG.orgName + " \u00b7 " + CFG.eventName;
  document.title = CFG.gameName + " \u2014 " + CFG.tagline;

  if ((location.hash || "").toLowerCase() === "#host") { openHost(); }
  else { renderStart(false); }

  global.VM_UI = { esc: esc, renderStart: renderStart };
})(window);
