import Effect from '../effect';

class Glitch extends Effect {
    constructor(subject, ttl) {
        super(subject, ttl);
        this.max = ttl;
        subject.glitchActive = true;
    }

    finish() {
        this.subject.glitchActive = false;
    }
}

export class SpinGlitch extends Glitch {
    constructor(subject) {
        super(subject, 30 * 10);
    }

    step() {
        this.subject.spin = this.ttl / this.max * Math.PI * 2;
    }
}

export class StormGlitch extends Glitch {
    constructor(subject) {
        super(subject, 30 * 10);
    }

    step() {
        this.subject.stormFactor = 1 - Math.abs(1 - this.ttl / this.max * 2);
    }
}