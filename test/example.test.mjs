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
  });
  
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

    // I think my expect() here was a workaround.
    // Maybe I can test the constructor somehow?
    // Constructors are functions. I had the wrong syntax here.
    it("but it throws an error if the file does not exist", () => {
      const gameOfLife = () => {new GameOfLife("Non-existent", 0);}
      expect(gameOfLife).to.throw("Error: File does not exist");
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

    it("and import the .rle pattern onto the board class", () => {
      const gameOfLife = new GameOfLife(gliderFile,0);
      // Not an array, a string. With proper formatting. 
      // TODO: Helper method to trim all these test case files.
      const gliderString =
`010
001
111
`
      expect(gameOfLife.getBoard().toString()).to.equal(gliderString);
    })
  });
});
describe("The Game Of Life rules:", () => {
  describe("A cell can count it's living neighbours:", () =>  {
      let board;
      beforeEach(() => {
        const array = [ `11000`, 
                        `11000`, 
                        `00000`];
        board = new Board(array);
      })
      it("but a living cell(x,y) is not included in the sum of neighbours", () => {
        expect(board.countNeigbours(0,0)).to.equal(3);
      })
      it("wrapping around over the borders", () => {
        expect(board.countNeigbours(2,0)).to.equal(4);
        expect(board.countNeigbours(1,4)).to.equal(2);
        expect(board.countNeigbours(2,2)).to.equal(2)
      })
      
      
      
    });
    // I think I will simply write new arrays for each test.
    // This takes some more time & adds lines of code
    // But it will save up some stream recording time as I'm bound to mess up some array if I get too tricky.

    // Due to the update algorithm this does not actually test anything yet.
    // I probably should plan out a good order of tests
    // Or just do several ones that support each other.
    it("A cell with 0 neighbours dies after a tick()", () => {
      const array = [`000`, `010`, `000`];
      let board = new Board(array);
      board.tick()
      expect(board.toString()).to.equal(
        `000
000
000
`
);
    })
    it("A cell with 1 neighbour dies after a tick()", () => {
      const array = [`000`, `011`, `000`];
      let board = new Board(array);
      board.tick()
      expect(board.toString()).to.equal(
        `000
000
000
`
);
    })

  it("A cell with more than 3 alive neighbours dies after a tick", () => {
    const array = [ 
    `00000`,
    `00100`, 
    `01110`, 
    `00000`,
    `00000`];
let board = new Board(array);
board.tick();
expect(board.toString()).to.equal(
`00000
01010
00000
00100
00000
`)
  });

    it("A dead cell with 3 alive neighbours comes alive after a tick", () => {
      const array = [ `00000`,
                      `00100`, 
                      `00010`, 
                      `00100`,
                      `00000`];
      let board = new Board(array);
      board.tick();
      expect(board.toString()).to.equal(
`00000
00000
00100
00000
00000
`
      )
    })
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
