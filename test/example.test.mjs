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
    // I misunderstood the mocha syntax here.
    // Time to fix the test
    // Even though it should go the other way around usually.
    it("Each cell is an integer", () => {
      for (let i = 0; i < board.getRows(); i++) {
        for (let j = 0; j < board.getCols(); j++) {
          expect(typeof board.getBoard()[i][j]).to.equal(typeof 0)
        }
      }
    });
  });
});
