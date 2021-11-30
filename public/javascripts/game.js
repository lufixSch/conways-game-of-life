export class Matrix {
  hold_list = [];

  constructor(x, y, base_arr) {
    this.x = x;
    this.y = y;
    this.matrix = base_arr;

    this.init_field();
    this.fill_field();
  }

  normalizeIndex(i) {
    if (i < 0) {
      i += this.x * this.y;
    } else if (i >= this.x * this.y) {
      i -= this.x * this.y;
    }
    return i;
  }

  coordinatesToIndex(x, y) {
    if (x < 0) {
      x += this.x;
    } else if (x >= this.x) {
      x -= this.x;
    }

    if (y < 0) {
      y += this.y;
    } else if (y >= this.y) {
      y -= this.y;
    }

    return x + y * this.x;
  }

  get(x, y) {
    return this.matrix[this.coordinatesToIndex(x, y)];
  }

  getWithIndex(i) {
    return this.matrix[this.normalizeIndex(i)];
  }

  set(x, y, val) {
    this.matrix[this.coordinatesToIndex(x, y)] = val;
    this.change_state(this.coordinatesToIndex(x, y), val);
  }

  setWithIndex(i, val) {
    this.matrix[this.normalizeIndex(i)] = val;
    this.change_state(this.normalizeIndex(i), val);
  }

  hold(x, y, val) {
    this.hold_list.push({ x, y, val });
  }

  release() {
    this.hold_list.forEach((el) => {
      this.set(el.x, el.y, el.val);
    });
    this.hold_list = [];
  }

  change_state(index, state) {
    const field = document.getElementById('fieldWrapper');
    const square = field.children[index];

    square.classList.remove(state ? 'off' : 'on');
    square.classList.add(state ? 'on' : 'off');
  }

  copy() {
    const matrix_cp = [...this.matrix];

    return matrix_cp;
  }

  // init_field() {
  //   const field = document.getElementById('fieldCanv');
  //   const ctx = field.getContext('2d');
  //   const square_size = 8;
  //   const spacing = 1;

  //   for (let y = 0; y < this.y; y++) {
  //     for (let x = 0; x < this.x; y++) {
  //       ctx.strokeRect(
  //         x * (square_size + spacing),
  //         y * (square_size + spacing),
  //         square_size,
  //         square_size
  //       );
  //     }
  //   }
  // }

  init_field() {
    const field = document.getElementById('fieldWrapper');

    let columns = '';
    for (let index = 0; index < this.x; index++) {
      columns += 'var(--block-size) ';
    }
    field.style.gridTemplateColumns = columns;

    for (let index = 0; index < this.x * this.y; index++) {
      const html_el = document.createElement('div');
      html_el.classList.add(index);
      field.appendChild(html_el);
    }
  }

  fill_field() {
    const field = document.getElementById('fieldWrapper');
    const squares = field.children;
    for (var i = 0; i < squares.length; i++) {
      const square = squares[i];
      const state = this.getWithIndex(i);

      square.classList.remove(state ? 'off' : 'on');
      square.classList.add(state ? 'on' : 'off');
    }
  }
}

export class History {
  constructor(length) {
    this.history = Array(length).fill(null);
  }

  get(n) {
    if (n + 1 < this.history.length) {
      return this.history[this.history.length - n - 1];
    }
  }

  add(el) {
    this.history.shift();
    this.history.push(el);
  }
}
