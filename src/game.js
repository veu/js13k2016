import Audio from './audio';
import Battle from './battle';
import Input from './input';
import Screen from './screen';
import Title from './title';

export default class Game {
    constructor() {
        this.screen = new Screen();
        this.input = new Input();
        Audio.play();

        this.tutorial = true;
        this.currentState = new Title();
    }

    start() {
        setInterval(this.update.bind(this), 1000 / 30);
    }

    update() {
        this.currentState.update(this);
        this.draw();
        if (this.input.hasKey(84)) {
            this.input.handleKey(84);
            Audio.isPlaying ? Audio.stop() : Audio.play();
        }
    }

    draw() {
        this.screen.reset();
        this.currentState.draw(this.screen);
    }

    startBattle() {
        this.currentState = new Battle(this, this.tutorial);
    }
}
