import { expect } from "chai";
import { Board } from "../src/GameOfLife.mjs";

describe("A board can be created:", () => {
  let board;
  describe("With an array as a parameter", () => {
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
   
    it("Each cell is an integer", () => {
      for (let i = 0; i < board.getRows(); i++) {
        for (let j = 0; j < board.getCols(); j++) {
          expect(typeof board.getBoard()[i][j]).to.equal(typeof 0)
        }
      }
    });
    // Actually we could perform a parsing of the RLE file to an array
    // And then use the board(array) method.
  });
  
  // The parsing of RLE files might be a good idea to implement early.
  // That way we can get test material without manually writing a lot of arrays.
  describe("The GameOfLife class can parse RLE files", () => {
    const blockFile = "./patterns/block.rle";
    const blockRLE = "#N Block\n#C An extremely common 4-cell still life.\n#C www.conwaylife.com/wiki/index.php?title=Block";
    const blinkerFile = "./patterns/blinker.rle";
    const gliderFile = "./patterns/glider.rle";

    it("GameOfLife() can read an RLE file header", () => {
      board = new Board(blockFile);
      expect(board.getRLEHeader()).to.equal(blockRLE)
    })
  })
  
});