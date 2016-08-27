import PirateShip from './battle/pirate-ship';
import Debris from './battle/debris';

export default class Battle {
    constructor(game) {
        this.sea = [];
        for (let x = 16; x--;) {
            this.sea[x] = [];
            for (let y = 16; y--;) {
                this.sea[x][y] = 0;
            }
        }

        this.cannonBalls = [];
        this.debris = [new Debris(4, 4)];
        this.pirateShip = new PirateShip(this);

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

        this.debris = this.debris.filter(function (debris) {
            return debris.alive;
        });

        this.cannonBalls = this.cannonBalls.filter(function (cannonBall) {
            cannonBall.update();
            return cannonBall.alive;
        });
    }

    draw(screen) {
        for (let x = this.sea.length - 1; x--;) {
            for (let y = this.sea[x].length - 1; y--;) {
                screen.ctx.save();
                screen.addPolygon(
                    x, y,
                    (x + y) + 1,
                    [
                        0, 5,
                        20, 15,
                        0, 25,
                        -20, 15
                    ],
                    this.pirateShip.alive ? '#4aa' : '#a66'
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

        this.pirateShip.draw(screen);
        screen.drawPolygons();
    }
}
