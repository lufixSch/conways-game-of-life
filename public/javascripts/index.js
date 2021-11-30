import { Matrix, History } from './game.js';

let game_state = new Matrix(
  100,
  55,
  Array(100 * 55)
    .fill(false)
    .map(() => !!Math.round(Math.random()))
);
const history = new History(100);

const game_of_life = () => {
  for (let y = 0; y < game_state.y; y++) {
    for (let x = 0; x < game_state.x; x++) {
      const cell = game_state.get(x, y);

      const sum =
        game_state.get(x - 1, y) +
        game_state.get(x + 1, y) +
        game_state.get(x, y + 1) +
        game_state.get(x, y - 1) +
        game_state.get(x - 1, y - 1) +
        game_state.get(x + 1, y - 1) +
        game_state.get(x - 1, y + 1) +
        game_state.get(x + 1, y + 1);

      if (cell && (sum < 2 || sum > 3)) {
        game_state.hold(x, y, false);
      } else if (!cell && sum == 3) {
        game_state.hold(x, y, true);
      }
    }
  }

  game_state.release();
  history.add(game_state.copy());
};

let running = false;
let loop = null;
let period = 1000;
const max_period = 3000;
const min_period = 100;

const setIntervalTime = (time) => {
  if (running) {
    clearInterval(loop);
    loop = setInterval(game_of_life, time);
  }
};

document.getElementById('play').addEventListener('click', () => {
  game_of_life();
  loop = setInterval(game_of_life, period);

  document.getElementById('play').setAttribute('disabled', '');
  document.getElementById('pause').removeAttribute('disabled');
  running = true;
});

document.getElementById('pause').addEventListener('click', () => {
  clearInterval(loop);

  document.getElementById('pause').setAttribute('disabled', '');
  document.getElementById('play').removeAttribute('disabled');
  running = false;
});

document.getElementById('rewind').value = 0;
document.getElementById('rewind').oninput = () => {
  const new_matrix = history.get(-1 * document.getElementById('rewind').value);

  if (new_matrix) {
    game_state.matrix = new_matrix;
    game_state.fill_field();
  }
};

document.getElementById('fastForward').onclick = () => {
  const time = period - 0.2 * period;

  if (time > min_period) {
    period = time;
    setIntervalTime(time);
    document.getElementById('fastRewind').removeAttribute('disabled');
  } else {
    document.getElementById('fastForward').setAttribute('disabled', '');
  }
};

document.getElementById('fastRewind').onclick = () => {
  const time = period + 0.2 * period;

  if (time < max_period) {
    period = time;
    setIntervalTime(time);
    document.getElementById('fastForward').removeAttribute('disabled');
  } else {
    document.getElementById('fastRewind').setAttribute('disabled', '');
  }
};
