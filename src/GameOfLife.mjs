export class Board {
  #rows;
  #cols;
  #board;

  // First test fails; let's code the functionality
  // The constructor should expect an array for testing purposes;
  // In practise we will use .rle files.

  constructor(file) {
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
  getRows() {
    return this.#rows;
  }
  getCols() {
    return this.#cols;
  }
  getBoard() {
    return this.#board;
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
}
