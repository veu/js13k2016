export default class Effect {
    constructor(subject, ttl) {
        this.subject = subject;
        this.ttl = ttl;
        this.max = ttl;
        this.alive = true;
    }

    update() {
        this.ttl--;
        if (this.ttl > 0) {
            this.step(1 - this.ttl / this.max);
            return;
        }

        this.alive = false;
        this.finish();
    }

    step(progress) {
    }

    finish() {
    }
}