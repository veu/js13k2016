import Back from './ship/back-part.js';
import Front from './ship/front-part.js';
import Sail from './ship/sail-part.js';

export default function Ship (state) {
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

Ship.prototype.update = function () {
}

Ship.prototype.draw = function (screen) {
    this.parts.map(function (part) {
        part.draw(screen, this.animationStep);
    }, this);
}

Ship.prototype.move = function (onlyFirst) {
    if (this.nextDirection) {
        this.changeDirection(this.nextDirection);
        this.nextDirection = null;
    }

    var next = {
        x: this.parts[0].next.x + this.direction.x,
        y: this.parts[0].next.y + this.direction.y
    };

    this.parts.some(function (part) {
        part.previous = part.position;
        part.position = part.next;
        part.next = next;
        part.paused = false;
        next = part.position;

        return onlyFirst;
    });

    if (onlyFirst) {
        var first = true;
        this.parts.forEach(function (part) {
            part.paused = !first;
            first = false;
        });
    }
}

Ship.prototype.isOutOfBounds = function (mapSize) {
    return this.parts.some(function (part) {
        if (part.position.x < 0 || part.position.x >= mapSize) {
            return true;
        }
        if (part.position.y < 0 || part.position.y >= mapSize) {
            return true;
        }
        return false;
    });
};

Ship.prototype.changeDirection = function (direction) {
    if (direction.x === this.direction.x || direction.y === this.direction.y) {
        return;
    }
    this.direction = this.nextDirection;
};
