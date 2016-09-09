import Audio from './audio';
import Battle from './battle';
import Input from './input';
import Screen from './screen';
import Title from './title';

export default function Game() {
    this.screen = new Screen();
    this.input = new Input();
    Audio.play();

    this.currentState = new Title();

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
