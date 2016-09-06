export default class Effect {
    constructor(subject, ttl) {
        this.subject = subject;
        this.ttl = ttl;
        this.alive = true;
    }

    update() {
        this.ttl--;
        if (this.ttl > 0) {
            this.step();
            return;
        }

        this.alive = false;
        this.finish();
    }

    step() {
    }

    finish() {
    }
}