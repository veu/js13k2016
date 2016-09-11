import BlackSail from './battle/ship/black-sail-part';
import Cannon from './battle/ship/cannon-part';
import Debris from './battle/debris';
import Highscore from './battle/highscore';
import Message from './battle/message';
import PirateShip from './battle/pirate-ship';
import Trader from './battle/trader';
import {SpinGlitch, StormGlitch, LowResGlitch, MirrorGlitch} from './battle/glitches';
import Whale from './battle/whale';

export default class Battle {
    constructor(game, withTutorial = false) {
        this.withTutorial = withTutorial;
        this.cannonBalls = [];
        this.debris = [];
        this.traders = [];
        this.effects = [];
        this.pirateShip = new PirateShip(this);
        this.updateOccupied();
        this.addRandomDebris();
        this.provisions = 10;
        this.score = 0;
        this.animationStep = 0;
        this.glitchActive = false;
        this.spin = 0;
        this.stormFactor = 0;
        this.highscore = new Highscore();

        if (withTutorial) {
            this.message = new Message(this, [
                'Hunt traders crossing the Glitchy Sea and keep your provisions in check.',
                'Use left and right arrow keys to steer, T to toggle music.'
            ]);
        }

        this.rewards = [
            [8, () => { this.provisions += 2 }],
            [4, () => BlackSail],
            [2, () => Cannon],
            [1, () => {
                if (!this.glitchActive) {
                    const createGlitch = [
                        () => new SpinGlitch(this),
                        () => new StormGlitch(this),
                        () => new LowResGlitch(game.screen),
                        () => new MirrorGlitch(game.screen)
                    ][Math.random() * 2 | 0];
                    this.effects.push(createGlitch());
                }
            }],
        ];
        this.rewardSum = this.rewards.reduce((sum, [part]) => part + sum, 0);
    }

    update(game) {
        this.effects.forEach(effect => { effect.update() });
        this.effects = this.effects.filter(effect => effect.alive);

        if (!this.pirateShip.alive) {
            if (game.input.hasKey(32)) {
                game.input.handleKey(32);
                game.startBattle();
            }
            return;
        }

        if (this.message) {
            if (game.input.hasKey(32)) {
                this.message.continue();
                game.input.handleKey(32);
            }
            if (!this.message.alive) {
                this.message = null
            }
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
        this.traders = this.traders.filter((trader) => trader.alive);

        this.updateOccupied();
        if (this.isOccupied(this.pirateShip.parts[0].position.x, this.pirateShip.parts[0].position.y)) {
            this.pirateShip.die(true, ['You’re shark food now. Let that sink in… or']);
            return;
        }
        if (this.traders.length == 0) {
            this.addTrader();
        }

        this.provisions = Math.max(this.provisions - .01, 0);
        if (this.provisions < 1) {
            this.pirateShip.die(false, ['Without any food left you’re too weak to fight the rats taking over now.']);
        }

        this.animationStep++;
    }

    draw(screen) {
        for (let x = 15; x--;) {
            for (let y = 15; y--;) {
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
                    this.pirateShip.alive ? 'hsl(160,60%,'+(47-colorModifier)+'%)' : 'hsl(160,0%,'+(70-colorModifier)+'%)'
                );
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

        screen.ctx.save();
        screen.ctx.translate(400, 310);
        screen.ctx.rotate(this.spin);
        screen.ctx.translate(-400, -310);

        screen.ctx.font = '20px Times New Roman, serif';
        screen.ctx.textAlign = 'left';
        screen.ctx.save();
        screen.ctx.translate(165, 256);
        screen.ctx.rotate(-Math.PI/2.8);
        screen.ctx.transform(1, 0.8, 0, 1, 0, 0);
        screen.ctx.fillText('Provisions: ' + (this.provisions | 0), 0, 0);
        screen.ctx.restore();

        screen.ctx.save();
        screen.ctx.translate(520, 200);
        screen.ctx.rotate(Math.PI/2.8);
        screen.ctx.transform(1, -0.8, 0, 1, 0, 0);
        screen.ctx.fillText('Gold: ' + this.score, 0, 0);
        screen.ctx.restore();


        screen.ctx.save();
        screen.ctx.translate(659, 360);
        screen.ctx.rotate(Math.PI - Math.PI/2.8);
        screen.ctx.transform(1, 0.8, 0, 1, 0, 0);
        screen.ctx.fillText('Highest Gold: ' + this.highscore.get(), 0, 0);
        screen.ctx.restore();

        screen.drawPolygons();

        screen.ctx.restore();

        if (this.message) {
            this.message.draw(screen);
        }
    }

    getOffset(x, y) {
        return (1 - this.stormFactor) * 2 * Math.sin(x + y - this.animationStep / 8) + this.stormFactor * (4 - 12 * Math.random());
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

        this.debris.push(new Debris(this, x, y));
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

        this.traders.push(new (Math.random() < .2 ? Whale : Trader)(this, {x: x, y: y}, direction));
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

    rollReward() {
        let r = Math.random() * this.rewardSum;

        for (const [part, callback] of this.rewards) {
            if (r < part) {
                return callback();
            }
            r -= part;
        }
    }

    increaseScore(delta) {
        this.score += delta;
        this.highscore.update(this.score);
    }
}
