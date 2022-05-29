import fs from "fs";

export class GameOfLife {
  #tickLimit;
  #file;
  #board;
  #fileData;
  #RLEHeader = "";
  #RLEarray = [];
  #RLEpatternAsString;
  #patternWidth;
  #patternHeight;

  constructor(file, tickLimit) {
    // I should check the file existance here.
    // 
    try {
      fs.readFileSync(file, "utf8");
    } catch (e) {
      throw new Error("Error: File does not exist")
    }
    this.#file = file;
    this.#tickLimit = tickLimit;
    this.readRLE();
    this.#board = new Board(this.#RLEarray); 
    console.log('Board toString:\n', this.#board.toString())
  }

  getRLEarray() {
    return this.#RLEarray;
  }
  getRLEHeader() {
    return this.#RLEHeader;
  }
  getRLEpatternAsString() {
    return this.#RLEpatternAsString;
  }
  getX() {
    return this.#patternWidth;
  }
  getY() {
    return this.#patternHeight;
  }

  getBoard() {
    return this.#board;
  }

  readRLE() {
    try {
      const data = fs.readFileSync(this.#file, "utf8");
      this.#fileData = data;
      this.parseRLE();
    } catch (err) {
      console.error(err);
    }
  }

  parseRLE() {
    const headerRegex = /#.+[$|\n]/g;
    const xRegex = /x\s=\s\d+/;
    const yRegex = /y\s=\s\d+/;
    const patternRegex = /rule\s=\s.*\n([^\r\n]+)/;
    const arr = this.#fileData.match(headerRegex);
    this.#patternHeight = parseInt(
      this.#fileData.match(yRegex)[0].match(/\d/)[0]
    );
    this.#patternWidth = parseInt(
      this.#fileData.match(xRegex)[0].match(/\d/)[0]
    );
    this.#RLEpatternAsString = this.#fileData.match(patternRegex)[1];
    this.#RLEarray = this.parseRLEtoArray();
    for (let i in arr) {
      this.#RLEHeader += arr[i];
    }
  }

  /*
    Todo: 
      - Finish up the importing of .rle files
      - Implement game of life rules
      - Implement ticks
      - Implement export .rle
      - Refactor every once in a while.
      
  */
  parseRLEtoArray() {
    const string = this.#RLEpatternAsString;
    let rows = string.split("$");
    let toReturn = []
    for (let r = 0; r < rows.length; r++) {
      toReturn[r] = new Array(this.#patternWidth).fill(0);
    }
    
    let repetitions = 0;
    for (let r = 0; r < rows.length; r++) {
      let row = []
      for (let char = 0; char < this.#patternWidth; char++) {
        let current = rows[r][char];
        if (!isNaN(parseInt(current))) {
          repetitions = parseInt(current);
        }
        if (current === "o" || current === "b") {
          if (repetitions === 0) {
              row.push(current)
            }
          else {
            for (let i = 0; i < repetitions; i++) {
              row.push(current)
            }
            repetitions = 0;
          }
        }
      }
      
      toReturn[r] = this.formatRow(row);
    }
    return toReturn;
  }

  formatRow(row) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === "b") { row[i] = 0} else {row[i] = 1}
    }
    return row;
  }
}

export class Board {
  #rows;
  #cols;
  #board;
  #file;


  // Line 133 => is problematic. I think.
  constructor(file) {
    this.#file = file;
    if (file instanceof Array) {
      console.log('Recieve Array\n', file)
      console.log('')
      this.#rows = this.#file.length;
      this.#cols = this.#file[0].length;
      this.#board = new Array(this.#rows);
      for (let row = 0; row < this.#rows; row++) {
        this.#board[row] = new Array(this.#cols).fill(0);
      }
      for (let i = 0; i < this.#rows; i++) {
        for (let j = 0; j < this.#cols; j++) {
          this.#board[i][j] = parseInt(this.#file[i][j]);
        }
      }
    }
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
