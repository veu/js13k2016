export default class Ship {
    constructor(state) {
        this.state = state;
        this.animationStep = 0;
        this.alive = true;
        this.nextDirection = null;
    }

    draw(screen) {
        this.parts.map((part) => {
            part.draw(screen, this.animationStep);
        });
    }

    move(onlyFirst = false, notFirst = false) {
        if (this.nextDirection) {
            this.direction = this.nextDirection;
            this.nextDirection = null;
        }

        let next = !this.parts[0].next ? null : {
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

    addOccupied(occupied) {
        occupied.push(this.parts[0].position);
        for (const part of this.parts) {
            occupied.push(part.previous);
        }
    }
}
