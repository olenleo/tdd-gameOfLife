import fs from "fs";

// I'm not sure if this is 100% reliable.
// But since I'm only testing the internal functionality of this function I should be able to copy it into the main program later.
// Of course I will need to test it in the GameOfLife class context.
// This is a bit clumsy but it should work!
export class TestArrayToRLE {
  #board
  #reps = 1;
  constructor(board) {
    console.log('Test class: constructor')
    this.#board = board;
    
  }
   /*
    Rules:
      s   |   rle
      1   |   'o'
      0   |   'b'
      line|   '$'
      end |   '!'
    We know the pattern width (10) and length (10).
    If the sum of repetitions and 'b' and 'o' symbols equals 10, append '$'
    The end can be added @ the return.
    */
    /*
    This should be done in one for-loop.
    Tracking the sum of 1 and 0 *entries* lets us insert the '$'.
    Tracking the difference between the current char and the previous char lets us parse the repetition.
  */
  /*
    Maybe I'll just pause again and keep at it.

  */

   parseArrayToRLE() {
    console.log('Test class: parseArr')
    let s = this.arrayToString()
    let rle = "";
    
    let curr = s[0];
    let next = s[1];
    
    for (let i = 1; i < s.length; i++) {
      if (i % 10 === 0 && i !== 0) {
        rle += this.handleInsert(curr, next,  this.#reps, i);
        this.#reps = 1;
      }
      if (next != curr) {
        rle += this.handleInsert(curr, next,  this.#reps, i);
        this.#reps = 1;
      } else {
        this.#reps++;
      }
      curr = s[i];
      next = s[i+1];
      
    }
    rle += this.handleInsert(curr, next,  this.#reps, s.length);
    return rle + "!\n"
  }
  
  handleInsert(curr, next, reps, i) {
    let val = "";
    let ret = ""
    function handleChar(c) {    
      if (parseInt(c) === 0) { return "b"; } else {return "o"; }
    }

    let char = handleChar(curr);
    let nextChar = handleChar(next)
    console.log(i, char, nextChar)
    if (reps > 0) {
      val += reps;
    }
    if (reps > 10) { // I placed a ceiling on the 'reps'. Hope it works out.
      val = 10;  
    }
    if (i % 10 === 0 && i !== 0) {
      if (i == 100) {
      return val + char;
      } else {
        return val + char + "$"
      }
    } 
    
    ret = char;
    return val + ret
    
  }

  arrayToString() {
  let s = ""
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      s += this.getStateOfCell(this.#board, row,col)
    }
  }
  
  return s
  }

  getStateOfCell(board, row, col) {
    return board[row][col]
  }
}
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
    try {fs.writeFileSync(path, header)} catch (e) {console.log(e)}
    
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

  reverseString(s) {
    return s.split("").reverse().join("")
  }
  arrayToString() {
    let s = ""
    for (let row = 9; row >= 0; row--) {
      for (let col = 9; col >= 0; col--) {
        s += this.#board.getStateOfCell(row,col)
      }
    }
    return this.reverseString(s);
  }
  
  parseArrayToRLE( string ) {
    let s;
    if (!string) {
    s = this.arrayToString()
    } else {
      s = string;
    }
    let rle = "";
    for (let i = 0; i < s.length; i++) {

    }
    return rle + "!\n"
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
