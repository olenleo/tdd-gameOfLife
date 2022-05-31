import { expect } from "chai";
import { Board, GameOfLife, TestArrayToRLE } from "../src/GameOfLife.mjs";
import fs from 'fs'
describe("A board can be created:", () => {
  let board;
  // I'm thinking the array top left square should be
  // [rows/2-patternWidth / 2][cols/2 - patternWidth/2]
  // Apparently I counted wrong again.

  describe("With an array as a parameter", () => {
    beforeEach(() => {
      const array = [`111`, `111`, `111`];
      board = new Board(array);
    });
    it("Board.toString() returns a formatted string", () => {
      expect(board.toString()).to.equal(
        `0000000000
0000000000
0000000000
0000000000
0000111000
0000111000
0000111000
0000000000
0000000000
0000000000
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
      const gameOfLife = () => {
        new GameOfLife("Non-existent", 0);
      };
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
      expect(arrayEquals(gameOfLife.parseRLEtoArray(), [[1, 1, 1]])).to.equal(
        true
      );
    });
    it("and parse the RLE pattern into an array", () => {
      const gameOfLife = new GameOfLife(gliderFile, 0);
      const gliderArr = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];
      expect(arrayEquals(gameOfLife.getRLEarray(), gliderArr)).to.equal(true);
    });
    it("and import the .rle pattern onto the board class", () => {
      const gameOfLife = new GameOfLife(gliderFile, 0);
      const gliderString = `0000000000
0000000000
0000000000
0000000000
0000010000
0000001000
0000111000
0000000000
0000000000
0000000000
`;
      expect(gameOfLife.getBoard().toString()).to.equal(gliderString);
    });
  });
});
describe("The Game Of Life rules:", () => {
  describe("A cell can count it's living neighbours:", () => {
    let board;
    beforeEach(() => {
      const array = [
        `1100100011`,
        `1100000000`,
        `1100000000`,
        `0000000000`,
        `0000000000`,
        `1100000011`,
        `0000000000`,
        `1100000011`,
        `0000000000`,
        `1100100011`,
      ];
      board = new Board(array);
    });

    it("but a living cell(x,y) is not included in the sum of neighbours", () => {
      expect(board.countNeigbours(1, 2)).to.equal(3);
      expect(board.countNeigbours(1, 1)).to.equal(5);
      expect(board.countNeigbours(1, 2)).to.equal(3);
    });
    it("wrapping around over the borders", () => {
      expect(board.countNeigbours(0, 3)).to.equal(2);
      expect(board.countNeigbours(6, 0)).to.equal(6);
    });
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
    board.tick();
    expect(board.toString()).to.equal(
      `0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
`
    );
  });
  it("A cell with 1 neighbour dies after a tick()", () => {
    const array = [`000`, `011`, `000`];
    let board = new Board(array);
    board.tick();
    expect(board.toString()).to.equal(
      `0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
`
    );
  });

  it("A cell with more than 3 alive neighbours dies after a tick", () => {
    const array = [
      `0000000000`,
      `0010000000`,
      `0111000000`,
      `0010000000`,
      `0000000000`,
      `0000000000`,
      `0000000000`,
      `0000000000`,
      `0000000000`,
      `0000000000`,
    ];
    let board = new Board(array);
    board.tick();
    expect(board.toString()).to.equal(
      `0000000000
0111000000
0101000000
0111000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
`
    );
  });
  // Well, all I can say is that tests are useful.
  // Forgot to make sure cells remain alive when conditions are met.
  it("A dead cell with 3 alive neighbours comes alive after a tick", () => {
    const array = [`00000`, `00100`, `00010`, `00100`, `00000`];
    let board = new Board(array);
    board.tick();
    expect(board.toString()).to.equal(
      `0000000000
0000000000
0000000000
0000000000
0000000000
0000011000
0000000000
0000000000
0000000000
0000000000
`
    );
  });
});

// Time to implement the tick functionality.
// The game of life is played for n ticks, then create ./result.rle.
// I will make the tests & functionality for the ticks first.
describe("The board state updates according to the game of life rules after ticks", () => {
  it("A block remains unchanged", () => {
    let game = new GameOfLife("./patterns/block.rle", 1);
    expect(game.getBoard().toString()).to.equal(
      `0000000000
0000000000
0000000000
0000000000
0000110000
0000110000
0000000000
0000000000
0000000000
0000000000
`
    );
  });
  // I'm rushing through this to meet all my deadlines.
  // This means that I should spend a lot more time making useful, valid tests!
  // I'll leave a comment in the 'palautussovellus' regarding this.

  it("A blinker changes state", () => {
    let game = new GameOfLife("./patterns/blinker.rle", 1);

    expect(game.play()).to.equal(
      `0000000000
0000000000
0000000000
0000001000
0000001000
0000001000
0000000000
0000000000
0000000000
0000000000
`
    );
  });
});

describe("When the tick limit has been reached:", () => {
  let pattern = "./patterns/blinker.rle"
  let game;
  const read = () => {
    try { 
      let data = fs.readFileSync("./result.rle", "utf-8")
      return data;
    } catch (e) { throw new Error("Result.rle not created")}
  }
  beforeEach(() => {
    game = new GameOfLife(pattern,3)
    try {fs.unlink("./result.rle")} catch(e) {console.log('Before: File already deleted.')}
  });
  afterEach(() => {
    try {fs.unlink("./result.rle")} catch(e) {console.log('After: File already deleted.')}
  });

  it("the file './result.rle' is created", () => {
    game.play();
    expect(read).to.not.throw()
  });

  it("the file './result.rle' contains a header", () => {
    const header = game.getRLEHeader();
    game.play();
    const resultData = read();
    expect(resultData).to.contain(header);
  })
  // Without the dimensions and string the game could not be played.
  // The .rle strings should be identical when the functionality is implemented
  it("the file './result.rle' can be imported into the program", () => {
    game.play();
    const data1 = read();
    try {fs.unlink("./result.rle")} catch(e) {console.log('After: File already deleted.')}
    const newGame = new GameOfLife('./result.rle', 0);
    newGame.play()
    const data2 = read();
    console.log(data1)
    console.log(data2)

  })

})

describe("When writing .rle files", () => {
  // I need to implement testing to make sure the rle parsing works as intended.
  let game;
  const blinkerFile = "./patterns/blinker.rle";
  const modifiedBlinkerRLE = "10b$10b$10b$5b3o2b$10b$10b$10b$10b$10b$10b!\n";
  const blinkerArrToRLE = "3o7b$10b$10b$10b$10b$10b$10b$10b$10b$10b!\n"
  const blinkerArr = [
    [1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ]
  const emptyArr = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ]
  const fullArr = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1]
  ]
  const checkers = [
    [1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1]
  ]  
  it("An empty board returns the correct string", () => {
    const test = new TestArrayToRLE(emptyArr)
    expect(test.parseArrayToRLE()).to.equal("10b$10b$10b$10b$10b$10b$10b$10b$10b$10b!\n")
  })
  it("A full board returns the correct string", () => {
    const test = new TestArrayToRLE(fullArr)
    expect(test.parseArrayToRLE()).to.equal("10o$10o$10o$10o$10o$10o$10o$10o$10o$10o!\n")
  });
  
  it("A board with no repeats returns a correct string", () => {
    const test = new TestArrayToRLE(checkers)
    expect(test.parseArrayToRLE()).to.equal("obobobobob$bobobobobo$obobobobob$bobobobobo$obobobobob$bobobobobo$obobobobob$bobobobobo$obobobobob$bobobobobo!\n")
  })
  it("A rle string is properly parsed", () => {
    const test = new TestArrayToRLE(blinkerArr)
    expect(test.parseArrayToRLE()).to.equal(blinkerArrToRLE)
  })
})
function arrayEquals(arr1, arr2) {
  if (arr1.length !== arr2.length || arr1[0].length !== arr2[0].length) {
    console.log("error in length");
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
