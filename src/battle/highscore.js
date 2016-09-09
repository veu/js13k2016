export default class Highscore {
    constructor() {
        this.key = 'poftgs_highscore';
        this.highscore = localStorage.getItem(this.key) || 0;
    }

    get() {
        return this.highscore;
    }

    update(score) {
        if (score > this.highscore) {
            this.highscore = score;
            localStorage.setItem(this.key, score);
        }
    }
}