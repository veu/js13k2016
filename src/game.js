import Battle from './battle.js';
import Input from './input.js';
import Screen from './screen.js';

export default function Game() {
    this.screen = new Screen();
    this.input = new Input();

    this.currentState = new Battle(this);

    this.start = function () {
        setInterval(this.update.bind(this), 1000 / 30);
    }

    this.update = function () {
        this.currentState.update(this);
        this.draw();
    }

    this.draw = function () {
        this.screen.reset();
        this.currentState.draw(this.screen);
    }
}