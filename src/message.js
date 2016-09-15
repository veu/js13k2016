const Message = (function () {
    const messages = {
        cannon: {
            text: [
                'You got your first cannon. Press space to fire.',
                'Other crates might contain provisions, more ship parts, or glitches.'
            ]
        },
        falling: {
            text: [
                'You discovered the end of the world but it’s too late to tell anyone.'
            ],
            recurring: true
        },
        intro: {
            text: [
                'Hunt traders crossing the Glitchy Sea and keep your provisions in check.',
                'Use left and right arrow keys to steer, T to toggle music.'
            ]
        },
        sinking: {
            text: [
                'You’re shark food now. Let that sink in… or'
            ],
            recurring: true
        },
        starving: {
            text: [
                'Without any food left you’re too weak to fight the rats taking over now.'
            ],
            recurring: true
        }
    };

    const seen = new Set();

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

    return class Message {
        constructor(state, key, sub = null) {
            this.state = state;
            this.messages = messages[key].text;
            this.sub = sub || 'Press space to continue.';
            this.alive = !seen.has(key);
            this.currentMessage = 0;
            this.opacity = 1;

            if (this.alive) {
                state.effects.push(new FadeIn(this));
                if (!messages[key].recurring) {
                    seen.add(key);
                }
            }
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
})();