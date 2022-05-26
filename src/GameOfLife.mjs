import fs from 'fs';

export class GameOfLife {
  #tickLimit;
  #file;
  #board;
  #fileData;
  #RLEHeader = "";
  #patternWidth;
  #patternHeight;

  constructor( file, tickLimit) {
    this.#file = file;
    this.#tickLimit = tickLimit;  
    this.readRLE();
    
    // this.#board = new Board(file); <--- file needs to be converted into array first.
  }
  getRLEHeader() {
    return this.#RLEHeader;
  }
  getX() {
    return this.#patternWidth;
  }
  getY() {
    return this.#patternHeight; 
  }

  // file data needs to be parsed.
  readRLE() {
    try {
      const data = fs.readFileSync(this.#file, "utf8");
      console.log("File content:", data);
      this.#fileData = data;
      this.parseRLE();

    } catch (err) {
      console.error(err);
    }
  }

  parseRLE() {
    const headerRegex = /#.+[$|\n]/g 
    const xRegex = /x\s=\s\d+/
    const yRegex = /y\s=\s\d+/
    const arr = this.#fileData.match(headerRegex);
    this.#patternHeight = parseInt(this.#fileData.match(yRegex)[0].match(/\d/)[0])
    this.#patternWidth = parseInt(this.#fileData.match(xRegex)[0].match(/\d/)[0])
    for (let i in arr) {
      this.#RLEHeader += arr[i];
    }
    
    
  }
  
}

/*
Apparently there is a \n missing in the test. Feels bad to go and edit, but this seems like a quite obvious case.
AssertionError: expected 
'undefined#N Block\n#C An extremely common 4-cell still life.\n#C www.conwaylife.com/wiki/index.php?title=Block\n' to equal 
         '#N Block\n#C An extremely common 4-cell still life.\n#C www.conwaylife.com/wiki/index.php?title=Block'
 
 * 
 */
 

export class Board {
  #rows;
  #cols;
  #board;
  #file;
  

  // First test fails; let's code the functionality
  // The constructor should expect an array for testing purposes;
  // In practise we will use .rle files.

  constructor(file) {
    this.#file = file;
    if (file instanceof Array) {
      this.#rows = file.length;
      this.#cols = file[0].length;
      this.#board = new Array(this.#rows);
      for (let row = 0; row < this.#rows; row++) {
        this.#board[row] = new Array(this.#cols).fill(0);
      }
      for (let i = 0; i < this.#rows; i++) {
        for (let j = 0; j < this.#cols; j++) {
          this.#board[i][j] = parseInt(file[i][j]);
        }
      }
    }
  }

  parseRLE() {
    const data = fs.readFile(this.#file, (err) => {
      console.log(err)
    })
    console.log('Data: ', data)
  }

  toString() {
    let s = "";
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        s += this.#board[i][j];
      }
      s += "\n";
    }
    return s;
  }

  getRows() {
    return this.#rows;
  }
  getCols() {
    return this.#cols;
  }
  getBoard() {
    return this.#board;
  }
 
}
