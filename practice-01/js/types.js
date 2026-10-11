"use strict";

const expressions = [
  ["\"8\" + 2", "8" + 2],
  ["\"8\" - 2", "8" - 2],
  ['Number("8") + 2', Number("8") + 2],
  ['"12" > "3"', "12" > "3"],
  ['12 === "12"', 12 === "12"],
  ['Number("")', Number("")],
  ['Number("text")', Number("text")]
];

for (const [expression, result] of expressions) {
  console.log(`${expression} =>`, result, `(тип: ${typeof result})`);
}
