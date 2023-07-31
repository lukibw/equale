import { assert } from "chai";
import {
  Digit,
  Issue,
  IssueKind,
  IssueMissingEquality,
  IssueNotBinary,
  IssueNotEqual,
  IssueWrongSize,
  Operator,
  Token,
  verify,
} from "../../src/input";

const fromString = (s: string) => {
  const tokens: Token[] = [];
  for (const c of s) {
    if (c >= "0" && c <= "9") {
      tokens.push(parseInt(c) as Digit);
    } else if (c !== " ") {
      tokens.push(c as Operator);
    }
  }
  return tokens;
};

describe("verify", function () {
  it("accept addition", function () {
    assert.equal(verify(fromString("87 + 11 = 98")), null);
  });
  it("accept subtraction", function () {
    assert.equal(verify(fromString("45 - 28 = 17")), null);
  });
  it("accept multiplication", function () {
    assert.equal(verify(fromString("23 * 5 = 115")), null);
  });
  it("accept division", function () {
    assert.equal(verify(fromString("512 / 8 = 64")), null);
  });
  it("accept modulo", function () {
    assert.equal(verify(fromString("57 % 15 = 12")), null);
  });
  it("accept exponentation", function () {
    assert.equal(verify(fromString("25 ^ 2 = 625")), null);
  });
  it("accept equal precedence", function () {
    const inputs = [
      "4 + 5 + 6 = 15",
      "11 + 4 - 7 = 8",
      "13 - 1 - 5 = 7",
      "3 * 5 * 6 = 90",
      "63 / 3 / 7 = 3",
      "39 % 8 % 3 = 1",
      "2 ^ 2 ^ 2 = 16",
    ];
    for (const input of inputs) {
      assert.equal(verify(fromString(input)), null);
    }
  });
  it("accept unequal precedence", function () {
    const inputs = [
      "3 * 3 + 5 = 14",
      "30 / 6 - 1 = 4",
      "12 % 5 + 3 = 5",
      "11 - 8 % 3 = 9",
      "2 ^ 3 + 4 = 12",
    ];
    for (const input of inputs) {
      assert.equal(verify(fromString(input)), null);
    }
  });
  it("reject wrong size", function () {
    assert.equal(verify(fromString("72 / 8 = 9")), IssueWrongSize);
  });
  it("reject missing equality", function () {
    assert.equal(verify(fromString("3 * 4 - 1 + 27")), IssueMissingEquality);
  });
  it("reject left side being a number", function () {
    assert.equal(verify(fromString("19 = 4 * 3 + 7")), IssueNotBinary);
  });
  it("reject leading zero", function () {
    assert.deepEqual(
      verify(fromString("6 + 02 - 5 = 3")),
      new Issue(IssueKind.LeadingZero, 2)
    );
  });
  it("reject missing number", function () {
    assert.deepEqual(
      verify(fromString("+ 64 - 59 = 5")),
      new Issue(IssueKind.MissingNumber, 0)
    );
  });
  it("reject inequality", function () {
    assert.equal(verify(fromString("40 / 5 + 1 = 7")), IssueNotEqual);
  });
  it("reject right side not being a number", function () {
    assert.deepEqual(
      verify(fromString("6 * 7 = 2 * 21")),
      new Issue(IssueKind.NotEnd, 5)
    );
  });
  it("reject forbidden operations", function () {
    const inputs: [string, number][] = [
      ["27 / 9 + 0 = 3", 4],
      ["14 - 9 - 0 = 5", 4],
      ["49 / 7 / 0 = 7", 4],
      ["5 * 3 / 1 = 10", 3],
      ["9 + 1 * 1 = 10", 3],
      ["5 - 6 + 9 = 10", 1],
      ["72 / 8 - 0 = 9", 4],
      ["14 - 9 % 0 = 5", 4],
      ["42 % 1 + 2 = 2", 3],
      ["1 ^ 10 + 7 = 8", 1],
      ["9 + 5 ^ 1 = 14", 3],
      ["9 - 11 ^ 1 = 2", 4],
    ];
    for (const [input, index] of inputs) {
      assert.deepEqual(
        verify(fromString(input)),
        new Issue(IssueKind.NotAllowed, index)
      );
    }
  });
});
