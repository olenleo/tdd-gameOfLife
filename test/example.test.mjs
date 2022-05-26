import { expect } from "chai";
import { Board } from "../src/GameOfLife.mjs";

describe("A board can be created:", () => {
  it("With an array as a parameter", () => {
    const array = [
      `000`,
      `010`,
      `000`
    ]
    let board = new Board(array);
    expect(board.toString()).to.equal(
`000
010
000
`
    )
  });
});
