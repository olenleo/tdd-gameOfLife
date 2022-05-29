import fs from "fs";

export class GameOfLife {
  #tickLimit;
  #tick;
  #file;
  #board;
  #fileData;
  #RLEHeader = "";
  #RLEarray = [];
  #RLEpatternAsString;
  #fullRLEHeader;
  #patternWidth;
  #patternHeight;
  #finalState = [];

  constructor(file, tickLimit) {
    try {
      fs.readFileSync(file, "utf8");
    } catch (e) {
      throw new Error("Error: File does not exist");
    }
    this.#file = file;
    this.#tickLimit = tickLimit;
    this.#tick = 0;
    this.readRLE();
    this.#board = new Board(this.#RLEarray);
  }

  play() {
    while (this.#tick < this.#tickLimit) {
      this.#board.tick();
      this.#tick++;
    }
    this.#finalState = this.#board;
    this.writeResultFile()
    return this.#board.toString();
  }

  writeResultFile() {
    const path = "./result.rle";
    const header = this.#fullRLEHeader +  this.parseArrayToRLE();
    try {fs.writeFileSync(path, header)
    console.log('File write complete')} catch (e) {console.log(e)}
    
  }

  getFinalState() {
    return this.#finalState.toString();
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
    const ruleRegex = /rule\s=\s.+[\n|$]/
    const arr = this.#fileData.match(headerRegex);
    this.#patternHeight = parseInt(
      this.#fileData.match(yRegex)[0].match(/\d/)[0]);
    this.#patternWidth = parseInt(
      this.#fileData.match(xRegex)[0].match(/\d/)[0]);
    this.#RLEpatternAsString = this.#fileData.match(patternRegex)[1];
    this.#RLEarray = this.parseRLEtoArray();
    for (let i in arr) {
      this.#RLEHeader += arr[i];
    }
    this.#fullRLEHeader = this.#RLEHeader + this.#fileData.match(xRegex)[0] + " " + this.#fileData.match(yRegex)[0] + " "
    + this.#fileData.match(ruleRegex);
  }

  parseArrayToRLE() {
    // start from end
    // save current symbol, then repetitions
    // should be relatively simple with the help of width and height.
    // Of course non-square patterns cause problems.
    // Since we are enlarging the board, we need to take into account the entire playing field.
    
    let s = ""
    console.log(this.getBoard().toString())
    for (let row = 9; row >= 0; row--) {
      for (let col = 9; col >= 0; col--) {
        s += this.#board.getStateOfCell(row,col)
      }
    }
    return s
  }
  
  parseRLEtoArray() {
    const string = this.#RLEpatternAsString;
    let rows = string.split("$");
    let toReturn = [];
    for (let r = 0; r < rows.length; r++) {
      toReturn[r] = new Array(this.#patternWidth).fill(0);
    }

    let repetitions = 0;
    for (let r = 0; r < rows.length; r++) {
      let row = [];
      for (let char = 0; char < this.#patternWidth; char++) {
        let current = rows[r][char];
        if (!isNaN(parseInt(current))) {
          repetitions = parseInt(current);
        }
        if (current === "o" || current === "b") {
          if (repetitions === 0) {
            row.push(current);
          } else {
            for (let i = 0; i < repetitions; i++) {
              row.push(current);
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
      if (row[i] === "b") {
        row[i] = 0;
      } else {
        row[i] = 1;
      }
    }
    return row;
  }
}

export class Board {
  #rows;
  #cols;
  #board;
  #file;

  constructor(file) {
    this.#file = file;
    if (file instanceof Array) {
      this.#rows = 10;
      this.#cols = 10;
      const patternHeight = file.length;
      const patternWidth = file[0].length;
      this.#board = new Array(this.#rows);
      this.initializeEmptyBoard(this.#board);
      for (let i = 0; i < patternHeight; i++) {
        for (let j = 0; j < patternWidth; j++) {
          this.#board[5 - Math.floor(patternWidth / 2) + i][
            5 - Math.floor(patternHeight / 2) + j
          ] = parseInt(this.#file[i][j]);
        }
      }
    }
  }
  initializeEmptyBoard(board) {
    for (let row = 0; row < this.#rows; row++) {
      board[row] = new Array(this.#cols).fill(0);
    }
    return board;
  }

  tick() {
    let next = [];
    next = this.initializeEmptyBoard(next); // Make changes on empty board
    for (let row = 0; row < this.#rows; row++) {
      for (let col = 0; col < this.#cols; col++) {
        const neighbours = this.countNeigbours(row, col);
        const cellIsAlive = this.#board[row][col] === 1;
        if (neighbours < 2 || neighbours > 3) {
          next[row][col] = 0;
        } else if (!cellIsAlive && neighbours === 3) {
          next[row][col] = 1;
        } else {
          next[row][col] = this.#board[row][col];
        }
      }
    }
    this.#board = next; // save changes onto #board.
  }
  getStateOfCell(row, col) {
    return this.#board[row][col]
  }

  countNeigbours(row, col) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let r = (row + i + this.#rows) % this.#rows;
        let c = (col + j + this.#cols) % this.#cols;
        sum += parseInt(this.#board[r][c]);
      }
    }
    return sum - parseInt(this.#board[row][col]);
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
