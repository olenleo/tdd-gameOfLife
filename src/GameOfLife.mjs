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
    this.#file = file;
    this.#tickLimit = tickLimit;
    this.readRLE();
    // this.#board = new Board(file); <--- file needs to be converted into array first.
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

  readRLE() {
    try {
      const data = fs.readFileSync(this.#file, "utf8");
      //console.log("File content:", data);
      this.#fileData = data;
      this.parseRLE();
    } catch (err) {
      console.error(err);
    }
  }
  // Let's figure this regex out. Looking good!
  // Different faulty RLE files should of course be tested, but for the scope of this test I'll trust the user.
  // Now to parse the RLE string into an array.

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

  // bob$2bo$3o!
  // TODO: Break this down to multiple methods.
  parseRLEtoArray() {
    const string = this.#RLEpatternAsString;
    let rows = string.split("$");
    console.log(rows);
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
            repetitions =0;
          }
        }
      }
      
      toReturn[r] = this.formatRow(row);
    }
    console.log(toReturn)
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

  constructor(file) {
    this.#file = file;
    if (file instanceof Array) {
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
