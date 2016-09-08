import Battle from './battle.js';
import Input from './input.js';
import Screen from './screen.js';
import Audio from './audio';

export default function Game() {
    this.screen = new Screen();
    this.input = new Input();
    Audio.play();

    this.currentState = new Battle(this, true);

    this.start = function () {
        setInterval(this.update.bind(this), 1000 / 30);
    }

    this.update = function () {
        this.currentState.update(this);
        this.draw();
        if (this.input.hasKey(84)) {
            this.input.handleKey(84);
            Audio.isPlaying ? Audio.stop() : Audio.play();
        }
    }

    this.draw = function () {
        this.screen.reset();
        this.currentState.draw(this.screen);
    }
}
