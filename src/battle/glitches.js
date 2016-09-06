import Effect from '../effect';

export default class SpinGlitch extends Effect {
    constructor(subject) {
        super(subject, 30 * 10);
        this.max = 30 * 10;
        subject.glitchActive = true;
    }

    step() {
        this.subject.spin = this.ttl / this.max * Math.PI * 2;
    }

    finish() {
        this.subject.glitchActive = false;
    }
}