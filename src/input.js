export default class Input {
    constructor() {
        this.keys = new Set();
        this.handledKeys = new Set();

        document.onkeydown = (function (event) {
            if (!this.handledKeys.has(event.keyCode)) {
                this.keys.add(event.keyCode);
            }
            if (!this.handledKeys.has('any')) {
                this.keys.add('any');
            }
        }).bind(this);

        document.onkeyup = (function (event) {
            this.keys.delete(event.keyCode);
            this.handledKeys.delete(event.keyCode);
            this.keys.delete('any');
            this.handledKeys.delete('any');
        }).bind(this);
    }

    hasKey(keyCode = 'any') {
        return this.keys.has(keyCode);
    }

    handleKey(keyCode = 'any') {
        if (keyCode == 'any') {
            this.keys = new Set();
            this.handledKeys = new Set();
        } else {
            this.keys.delete(keyCode);
            this.handledKeys.add(keyCode);
        }
    }
}
