import Back from './ship/back-part.js';
import Front from './ship/front-part.js';
import Sail from './ship/sail-part.js';

export default class Ship {
    constructor(state) {
        this.state = state;

        this.parts = [
            new Front(state, {x: 4, y: 4}, {x: 3, y: 4}, {x: 5, y: 4}),
            new Sail(state, {x: 5, y: 4}, {x: 4, y: 4}, {x: 6, y: 4}),
            new Back(state, {x: 6, y: 4}, {x: 5, y: 4}, {x: 7, y: 4})
        ];

        this.direction = {x: -1, y: 0};
        this.animationStep = 0;
        this.alive = true;
        this.nextDirection = null;
    }

    update() {
    }

    draw(screen) {
        this.parts.map((part) => {
            part.draw(screen, this.animationStep);
        });
    }

    move(onlyFirst) {
        if (this.nextDirection) {
            this.changeDirection(this.nextDirection);
            this.nextDirection = null;
        }

        let next = {
            x: this.parts[0].next.x + this.direction.x,
            y: this.parts[0].next.y + this.direction.y
        };

        this.parts.some((part) => {
            part.previous = part.position;
            part.position = part.next;
            part.next = next;
            part.paused = false;
            next = part.position;

            return onlyFirst;
        });

        if (onlyFirst) {
            let first = true;
            this.parts.forEach((part) => {
                part.paused = !first;
                first = false;
            });
        }
    }

    isOutOfBounds(mapSize) {
        return this.parts.some((part) => {
            if (part.position.x < 0 || part.position.x >= mapSize) {
                return true;
            }
            if (part.position.y < 0 || part.position.y >= mapSize) {
                return true;
            }
            return false;
        });
    };

    changeDirection(direction) {
        if (direction.x === this.direction.x || direction.y === this.direction.y) {
            return;
        }
        this.direction = this.nextDirection;
    }
}
