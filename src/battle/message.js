export default class Message {
    constructor(...messages) {
        this.messages = messages;
        this.alive = true;
        this.currentMessage = 0;
    }

    draw(screen) {
        screen.ctx.font = '16px Times New Roman, serif';

        const boxWidth = screen.ctx.measureText(this.messages[this.currentMessage]).width + 20;

        screen.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        screen.ctx.fillRect(400 - boxWidth / 2, 286, boxWidth, 54);

        screen.ctx.textAlign = 'center';
        screen.ctx.fillStyle = '#630';
        screen.ctx.fillText(this.messages[this.currentMessage], 400, 306);

        screen.ctx.fillRect(400 - 200 / 2 + 10, 314, 200 - 20, 1);

        screen.ctx.font = '14px Times New Roman, serif';
        screen.ctx.fillText('Press space to continue.', 400, 330);
    }

    continue() {
        this.currentMessage++;
        if (this.currentMessage == this.messages.length) {
            this.alive = false;
        }
    }
}