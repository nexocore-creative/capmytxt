/*!
 * capmytxt - case conversion logic (MIT License)
 * Pure functions, no DOM access, so they can be unit tested in Node.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CapMyTxt = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Words kept lowercase in Title Case unless first, last, or after a colon / sentence end.
  // Articles, coordinating conjunctions, and short prepositions (AP/Chicago-style).
  var SMALL_WORDS = new Set([
    "a", "an", "the",
    "and", "but", "or", "nor", "for",
    "as", "at", "by", "in", "of", "off", "on", "per", "to", "up", "via", "vs"
  ]);

  var HAS_LETTER = /\p{L}/u;
  var HAS_LOWER = /\p{Ll}/u;

  function upperFirst(s) {
    // Capitalize the first letter, leaving leading punctuation (quotes, brackets) alone.
    return s.replace(/\p{L}/u, function (c) { return c.toUpperCase(); });
  }

  // True when a word has capitals after its first letter (iPhone, NASA, McDonald).
  function hasInnerCaps(word) {
    var letters = word.match(/\p{L}/gu);
    if (!letters || letters.length < 2) return false;
    return /\p{Lu}/u.test(letters.slice(1).join(""));
  }

  function toUpper(text) { return text.toUpperCase(); }
  function toLower(text) { return text.toLowerCase(); }

  function toSentence(text) {
    var keep = HAS_LOWER.test(text); // all-caps input: don't treat shouting as acronyms
    var out = text.split(/(\s+)/).map(function (tok) {
      if (!HAS_LETTER.test(tok)) return tok;
      return keep && hasInnerCaps(tok) ? tok : tok.toLowerCase();
    }).join("");
    // Capitalize the first letter of the text and after . ! ? or a line break.
    // A period right after "x.y" (i.e., e.g., a.m.) is an abbreviation, not a sentence end.
    out = out.replace(
      /(^|(?:[!?]|(?<!\.\p{L})\.)["')\]”’]*\s+|\n+\s*)(["'(\[“‘]*)(\p{L})/gu,
      function (_, lead, quote, ch) { return lead + quote + ch.toUpperCase(); }
    );
    // Standalone pronoun "I" (I, I'm, I'll) but not "i.e."
    out = out.replace(/(^|[\s(["“])i(?=['’\s,!?;:)\]"”]|$)/g, "$1I");
    return out;
  }

  function toTitle(text) {
    var keep = HAS_LOWER.test(text);
    var tokens = text.split(/(\s+)/);

    // Indexes of word tokens (anything containing a letter or digit).
    var wordIdx = [];
    tokens.forEach(function (t, i) { if (/[\p{L}\p{N}]/u.test(t)) wordIdx.push(i); });
    var first = wordIdx[0];
    var last = wordIdx[wordIdx.length - 1];

    var forceCap = new Set();
    wordIdx.forEach(function (i, n) {
      if (i === first || i === last) { forceCap.add(i); return; }
      var prev = tokens[wordIdx[n - 1]];
      // After a colon, sentence end, or dash, the next word is capitalized.
      if (/[:.!?—–]["')\]”’]*$/.test(prev) || /\n/.test(tokens.slice(wordIdx[n - 1] + 1, i).join(""))) {
        forceCap.add(i);
      }
    });

    wordIdx.forEach(function (i) {
      var tok = tokens[i];
      if (keep && hasInnerCaps(tok)) return; // leave iPhone, NASA, etc. alone

      var m = tok.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
      var lead = m[1], core = m[2], trail = m[3];
      var lower = core.toLowerCase();

      if (!forceCap.has(i) && SMALL_WORDS.has(lower)) {
        tokens[i] = lead + lower + trail;
        return;
      }
      // Capitalize each hyphen part: well-known -> Well-Known
      var cased = lower.split("-").map(upperFirst).join("-");
      tokens[i] = lead + cased + trail;
    });

    return tokens.join("");
  }

  var MODES = {
    title: toTitle,
    sentence: toSentence,
    upper: toUpper,
    lower: toLower
  };

  function convert(text, mode) {
    var fn = MODES[mode];
    if (!fn) throw new Error("Unknown mode: " + mode);
    return fn(String(text));
  }

  function stats(text) {
    var trimmed = text.trim();
    return {
      characters: text.length,
      words: trimmed ? trimmed.split(/\s+/).length : 0
    };
  }

  return { convert: convert, toTitle: toTitle, toSentence: toSentence, toUpper: toUpper, toLower: toLower, stats: stats };
});
