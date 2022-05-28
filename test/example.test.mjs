import { expect } from "chai";
import { Board, GameOfLife } from "../src/GameOfLife.mjs";

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
          expect(typeof board.getBoard()[i][j]).to.equal(typeof 0);
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
    const blockRLE =
      "#N Block\n#C An extremely common 4-cell still life.\n#C www.conwaylife.com/wiki/index.php?title=Block\n";
    const blinkerFile = "./patterns/blinker.rle";
    const gliderFile = "./patterns/glider.rle";

    // I'll pause here and read up a bit.
    // Getting proper files and sanitizing inputs feels very important
    // On the other hand, I could perhaps trust the user a bit in this case.
    // I'll make some tests but not too many so I won't drag this out.

    // The mocha documentation is not that easy to navigate.
    // I found this in the tetris tests though:
    // expect(() => board.drop(new Block("Y"))).to.throw("already falling");
    // I think I need to make a separate method for reading the file.

    // I did this backwards. But I'll leave it in anyhow.
    // It's hard to remember the proper order of operations when a surprising bug / issue comes up.
    it("but it throws an error if the file does not exist", () => {
      const gameOfLife = new GameOfLife("Non-existent", 0);
      expect(gameOfLife.parseRLE).to.throw();
    });
    it("and read an RLE file header", () => {
      const gameOfLife = new GameOfLife(blockFile, 0);
      expect(gameOfLife.getRLEHeader()).to.equal(blockRLE);
    });
    it("and read RLE pattern dimensions", () => {
      const gameOfLife = new GameOfLife(blinkerFile, 0);
      expect(gameOfLife.getX()).to.equal(3);
      expect(gameOfLife.getY()).to.equal(1);
    });

    it("and extract the RLE pattern", () => {
      const gameOfLife = new GameOfLife(gliderFile, 0);
      expect(gameOfLife.getRLEpatternAsString()).to.equal("bob$2bo$3o!");
    });

    /**
     * This needs to be refactored. There's something strange going on with the 'equals'-method here.
     * Do I need to write my own?
     */
    it("and handle parsing the rle syntax", () => {
      const gameOfLife = new GameOfLife(blinkerFile, 0);
      expect(arrayEquals(gameOfLife.parseRLEtoArray(), [[1,1,1]])).to.equal(true)
    });
    it("and parse the RLE pattern into an array", () => {
      const gameOfLife = new GameOfLife(gliderFile, 0);
      const gliderArr = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];
      expect(arrayEquals(gameOfLife.getRLEarray(), gliderArr)).to.equal(true)
    });
  });

});

function arrayEquals(arr1, arr2) {
  if (arr1.length !== arr2.length || arr1[0].length !== arr2[0].length) {
    console.log('error in length')
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1.length; j++) {
      if (parseInt(arr1[i][j]) !== parseInt(arr2[i][j])) {
        return false;
      }
    }
  }
  return true;
}
