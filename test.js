// Run with: node test.js  (no dependencies)
const assert = require("assert");
const { convert } = require("./caps.js");

const cases = [
  // [mode, input, expected]
  ["upper", "hello World", "HELLO WORLD"],
  ["lower", "Hello WORLD", "hello world"],

  ["title", "the quick brown fox jumps over the lazy dog", "The Quick Brown Fox Jumps Over the Lazy Dog"],
  ["title", "a tale of two cities", "A Tale of Two Cities"],
  ["title", "what are you waiting for", "What Are You Waiting For"],
  ["title", "how to win friends and influence people", "How to Win Friends and Influence People"],
  ["title", "the well-known author", "The Well-Known Author"],
  ["title", "star wars: the empire strikes back", "Star Wars: The Empire Strikes Back"],
  ["title", "what is this? a question", "What Is This? A Question"],
  ["title", "don't stop believing", "Don't Stop Believing"],
  ["title", "\"quoted words\" in a title", "\"Quoted Words\" in a Title"],
  ["title", "use my iPhone with NASA data", "Use My iPhone With NASA Data"],
  ["title", "I'M SHOUTING IN A LOUD TITLE", "I'm Shouting in a Loud Title"],
  ["title", "line one of text\nthe second line", "Line One of Text\nThe Second Line"],
  ["title", "   spaced   out   ", "   Spaced   Out   "],
  ["title", "", ""],
  ["title", "42 ways to cook an egg", "42 Ways to Cook an Egg"],

  ["sentence", "HELLO THERE. HOW ARE YOU? FINE!", "Hello there. How are you? Fine!"],
  ["sentence", "i think i'm right. i.e. maybe", "I think I'm right. I.e. maybe"],
  ["sentence", "first line\nsecond line", "First line\nSecond line"],
  ["sentence", "he said. \"wow, that works.\"", "He said. \"Wow, that works.\""],
  ["sentence", "my iPhone is here. nasa called", "My iPhone is here. Nasa called"],
];

let failed = 0;
for (const [mode, input, expected] of cases) {
  const actual = convert(input, mode);
  try {
    assert.strictEqual(actual, expected);
  } catch (e) {
    failed++;
    console.error(`FAIL [${mode}] ${JSON.stringify(input)}\n  expected ${JSON.stringify(expected)}\n  actual   ${JSON.stringify(actual)}`);
  }
}
console.log(`${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);
