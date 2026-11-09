(function () {
  "use strict";

  var input = document.getElementById("input");
  var output = document.getElementById("output");
  var stats = document.getElementById("stats");
  var copyBtn = document.getElementById("copy");
  var clearBtn = document.getElementById("clear");
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll("[data-mode]"));

  var mode = "title";
  try {
    var saved = localStorage.getItem("capmytxt-mode");
    if (saved && modeBtns.some(function (b) { return b.dataset.mode === saved; })) mode = saved;
  } catch (e) { /* storage unavailable: fine */ }

  function render() {
    output.value = CapMyTxt.convert(input.value, mode);
    var s = CapMyTxt.stats(input.value);
    stats.textContent = s.words + (s.words === 1 ? " word" : " words") + " · " +
      s.characters + (s.characters === 1 ? " character" : " characters");
    modeBtns.forEach(function (b) {
      var on = b.dataset.mode === mode;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
  }

  function setMode(m) {
    mode = m;
    try { localStorage.setItem("capmytxt-mode", m); } catch (e) { /* ignore */ }
    render();
  }

  modeBtns.forEach(function (b, i) {
    b.addEventListener("click", function () { setMode(b.dataset.mode); });
    b.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % modeBtns.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + modeBtns.length) % modeBtns.length;
      if (next !== null) { e.preventDefault(); modeBtns[next].focus(); setMode(modeBtns[next].dataset.mode); }
    });
  });

  input.addEventListener("input", render);

  clearBtn.addEventListener("click", function () {
    input.value = "";
    render();
    input.focus();
  });

  var copyTimer;
  copyBtn.addEventListener("click", function () {
    var text = output.value;
    if (!text) return;
    function done(ok) {
      copyBtn.textContent = ok ? "Copied!" : "Press Ctrl+C to copy";
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { copyBtn.textContent = "Copy result"; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else fallback();
    function fallback() {
      output.focus();
      output.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { /* ignore */ }
      done(ok);
    }
  });

  render();
})();
