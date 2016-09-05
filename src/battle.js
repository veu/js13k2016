import Debris from './battle/debris';
import PirateShip from './battle/pirate-ship';
import Trader from './battle/trader';

export default class Battle {
    constructor(game) {
        this.cannonBalls = [];
        this.debris = [];
        this.traders = [];
        this.pirateShip = new PirateShip(this);
        this.updateOccupied();
        this.addRandomDebris();
        this.provisions = 10;
        this.score = 0;
    }

    update(game) {
        if (!this.pirateShip.alive) {
            return;
        }

        this.applyKeyInput(game.input);

        this.pirateShip.update();

        this.traders = this.traders.filter((trader) => {
            trader.update();
            return trader.alive;
        });

        this.debris = this.debris.filter((debris) => debris.alive);

        this.cannonBalls = this.cannonBalls.filter((cannonBall) => {
            cannonBall.update();
            return cannonBall.alive;
        });
        this.traders = this.traders.filter((trader) => {
            if (!trader.alive) {
                trader.turnIntoDebris();
            }
            return trader.alive;
        });

        this.updateOccupied();
        if (this.isOccupied(this.pirateShip.parts[0].position.x, this.pirateShip.parts[0].position.y)) {
            this.pirateShip.alive = false;
            return;
        }
        if (this.traders.length == 0 && this.debris.length == 0) {
            this.addTrader();
        }

        this.provisions = Math.max(this.provisions - .01, 0);
        if (this.provisions < 1) {
            this.pirateShip.alive = false;
        }
    }

    draw(screen) {
        screen.ctx.fillStyle = '#fff';
        screen.ctx.fillRect(0, 0, 800, 600);
        for (let x = 15; x--;) {
            for (let y = 15; y--;) {
                screen.ctx.save();
                screen.addPolygon(
                    x, y,
                    (x + y) + 1,
                    [
                        0, 0,
                        20, 10,
                        0, 20,
                        -20, 10
                    ],
                    this.pirateShip.alive ? '#4aa' : '#999'
                );
                screen.ctx.restore();
            }
        }

        this.debris.forEach(function (entity) {
            entity.draw(screen);
        });

        this.cannonBalls.forEach(function (entity) {
            entity.draw(screen);
        });

        this.traders.forEach(function (entity) {
            entity.draw(screen);
        });

        this.pirateShip.draw(screen);
        screen.drawPolygons();

        screen.ctx.fillStyle = '#630';
        screen.ctx.font = '20px serif';
        screen.ctx.save();
        screen.ctx.translate(165, 206);
        screen.ctx.rotate(-Math.PI/2.8);
        screen.ctx.transform(1, 0.8, 0, 1, 0, 0);
        screen.ctx.fillText('Provisions: ' + (this.provisions | 0), 0, 0);
        screen.ctx.restore();

        screen.ctx.save();
        screen.ctx.translate(520, 150);
        screen.ctx.rotate(Math.PI/2.8);
        screen.ctx.transform(1, -0.8, 0, 1, 0, 0);
        screen.ctx.fillText('Score: ' + this.score, 0, 0);
        screen.ctx.restore();

    }

    updateOccupied() {
        this.occupied = [];
        this.pirateShip.addOccupied(this.occupied);
        this.traders.forEach((trader) => {
            trader.addOccupied(this.occupied);
        });
    }

    isOccupied(x, y) {
        return this.occupied.some((o) => {
            return x == o.x && y == o.y;
        });
    }

    addRandomDebris() {
        let x, y;
        do {
            x = Math.random() * 14 + 1 | 0;
            y = Math.random() * 14 + 1 | 0;
        } while (this.isOccupied(x, y));

        this.debris.push(new Debris(x, y));
    }

    addTrader() {
        let x, y;
        do {
            x = Math.random() * 14 + 1 | 0;
            y = Math.random() < .5 ? 0 : 15;
            if (Math.random() < .5) {
                [x, y] = [y, x];
            }
        } while (this.isOccupied(x, y));

        const direction = {
            x: x == 0 ? 1 : x == 15 ? -1 : 0,
            y: y == 0 ? 1 : y == 15 ? -1 : 0
        };

        this.traders.push(new Trader(this, {x: x, y: y}, direction));
    }

    isOutOfBounds(position) {
        if (!position) {
            return true;
        }
        if (position.x < 0 || position.x > 15) {
            return true;
        }
        if (position.y < 0 || position.y > 15) {
            return true;
        }
        return false;
    };

    applyKeyInput(input) {
        this.pirateShip.shooting = input.hasKey(32);

        if (input.hasKey(37)) {
            input.handleKey(37);
            this.pirateShip.nextDirection = {x: -this.pirateShip.direction.y, y: this.pirateShip.direction.x};
        }
        if (input.hasKey(39)) {
            input.handleKey(39);
            this.pirateShip.nextDirection = {x: this.pirateShip.direction.y, y: -this.pirateShip.direction.x};
        }
    }
}
