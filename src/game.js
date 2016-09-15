class Game {
    constructor() {
        this.screen = new Screen();
        this.input = new Input();

        this.currentState = new Title();
    }

    start() {
        setInterval(this.update.bind(this), 1000 / 30);
    }

    update() {
        this.currentState.update(this);
        requestAnimationFrame(() => this.draw());
    }

    draw() {
        this.screen.reset();
        this.currentState.draw(this.screen);
        this.screen.finish();
    }

    startBattle() {
        this.currentState = new Battle(this);
    }
}
