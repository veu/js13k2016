import Effect from '../effect';

class FadeIn extends Effect {
    constructor(subject) {
        super(subject, 12);
        subject.opacity = 0;
    }

    step(progress) {
        this.subject.opacity = progress;
    }
}

class FadeOut extends Effect {
    constructor(subject, callback) {
        super(subject, 12);
        this.callback = callback;
    }

    step(progress) {
        this.subject.opacity = 1 - progress;
    }

    finish() {
        this.callback();
    }
}

export default class Message {
    constructor(state, messages, sub = null) {
        this.state = state;
        this.messages = messages;
        this.sub = sub || 'Press space to continue.';
        this.alive = true;
        this.currentMessage = 0;
        this.opacity = 1;

        state.effects.push(new FadeIn(this));
    }

    draw(screen) {
        screen.ctx.globalAlpha = this.opacity;

        screen.ctx.font = '16px Times New Roman, serif';

        const boxWidth = screen.ctx.measureText(this.messages[this.currentMessage]).width + 20;

        screen.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        screen.ctx.fillRect(400 - boxWidth / 2, 286, boxWidth, 54);

        screen.ctx.textAlign = 'center';
        screen.ctx.fillStyle = '#630';
        screen.ctx.fillText(this.messages[this.currentMessage], 400, 306);

        screen.ctx.fillRect(400 - 200 / 2 + 10, 314, 200 - 20, 1);

        screen.ctx.font = '14px Times New Roman, serif';
        screen.ctx.fillText(this.sub, 400, 330);

        screen.ctx.globalAlpha = 1;
    }

    continue() {
        if (this.currentMessage == this.messages.length - 1) {
            this.state.effects.push(new FadeOut(this, () => { this.alive = false }));
            return;
        }
        this.currentMessage++;
    }
}