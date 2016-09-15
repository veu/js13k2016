class Glitch extends Effect {
    constructor(subject, ttl) {
        super(subject, ttl);
        subject.glitchActive = true;
    }

    finish() {
        this.subject.glitchActive = false;
    }
}

class SpinGlitch extends Glitch {
    constructor(subject) {
        super(subject, 30 * 10);
    }

    step(progress) {
        this.subject.spin = (1 - progress) * Math.PI * 2;
    }
}

class StormGlitch extends Glitch {
    constructor(subject) {
        super(subject, 30 * 10);
    }

    step(progress) {
        this.subject.stormFactor = 1 - Math.abs(progress * 2 - 1);
    }
}

class LowResGlitch extends Glitch {
    constructor(subject) {
        super(subject, 30 * 10);
        this.subject.pixelated = true;
    }

    finish() {
        this.subject.glitchActive = false;
        this.subject.pixelated = false;
    }
}

class MirrorGlitch extends Glitch {
    constructor(subject) {
        super(subject, 30 * 10);
        this.subject.mirrored = true;
    }

    finish() {
        this.subject.glitchActive = false;
        this.subject.mirrored = false;
    }
}