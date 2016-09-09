import Battle from './battle';
import PirateShip from './battle/pirate-ship';

export default class Title {
    constructor() {
        this.pirateShip = new PirateShip(this);
        this.animationStep = 0;
    }

    update(game) {
        if (game.input.hasKey()) {
            game.input.handleKey();
            game.currentState = new Battle(this, true);
        }

        this.animationStep++;
    }

    draw(screen) {
        screen.ctx.fillStyle = '#630';
        screen.ctx.font = '36px Times New Roman, serif';
        screen.ctx.textAlign = 'center';
        screen.ctx.fillRect(250, 78, 300, 1);
        screen.ctx.fillText('Pirates', 400, 70);
        screen.ctx.font = '24px serif';
        screen.ctx.fillText('of the Glitchy Sea', 400, 105);

        for (let x = 11; x--;) {
            for (let y = 11; y--;) {
                const colorModifier = (this.getOffset(x, y) - this.getOffset(x + 1, y + 1)) * 2 - Math.random() * 2;
                screen.addPolygon(
                    x, y,
                    (x + y) + 1,
                    [
                        0, 0 + this.getOffset(x, y),
                        20, 10 + this.getOffset(x, y + 1),
                        0, 20 + this.getOffset(x + 1, y + 1),
                        -20, 10 + this.getOffset(x + 1, y)
                    ],
                    'hsl(160,60%,'+(47-colorModifier)+'%)'
                );
            }
        }

        this.pirateShip.draw(screen);

        screen.drawPolygons();
    }

    getOffset(x, y) {
        return 2 * Math.sin(x + y - this.animationStep / 8);
    }
}