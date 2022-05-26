import { expect } from "chai";
import { Board } from "../src/GameOfLife.mjs";

describe("A board can be created:", () => {
  describe("With an array as a parameter", () => {
    let board;
    beforeEach(() => {
      const array = [`000`, `010`, `000`];
      board = new Board(array);
    });
    it("Board.toString() returns a formatted string", () => {
      expect(board.toString()).to.equal(
        `000
010
000
`
      );
    });
    it("Each cell is an integer", () => {});
  });
});
