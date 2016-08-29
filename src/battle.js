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
        this.addTrader();

        game.input.on('click', (x, y) => {
            if (x > 400) {
                if (y > 275) {
                    this.pirateShip.nextDirection = {x: 0, y: 1};
                } else {
                    this.pirateShip.nextDirection = {x: -1, y: 0};
                }
            } else {
                if (y > 275) {
                    this.pirateShip.nextDirection = {x: 1, y: 0};
                } else {
                    this.pirateShip.nextDirection = {x: 0, y: -1};
                }
            }
        });
    }

    update(game) {
        if (!this.pirateShip.alive) {
            return;
        }

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

        this.updateOccupied();
        if (this.isOccupied(this.pirateShip.parts[0].position.x, this.pirateShip.parts[0].position.y)) {
            this.pirateShip.alive = false;
        }
    }

    draw(screen) {
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
        if (position.x < 0 || position.x >= 16) {
            return true;
        }
        if (position.y < 0 || position.y >= 16) {
            return true;
        }
        return false;
    };
}
