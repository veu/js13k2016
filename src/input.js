class Input {
    constructor() {
        this.keys = new Set();
        this.handledKeys = new Set();
        this.lastKeyCode = null;

        document.onkeydown = (function (event) {
            this.lastKeyCode = event.keyCode;
            if (!this.handledKeys.has(event.keyCode)) {
                this.keys.add(event.keyCode);
            }
        }).bind(this);

        document.onkeyup = (function (event) {
            this.keys.delete(event.keyCode);
            this.handledKeys.delete(event.keyCode);
        }).bind(this);
    }

    hasKey(keyCode) {
        if (!keyCode) {
            keyCode = this.lastKeyCode;
        }
        return this.keys.has(keyCode);
    }

    handleKey(keyCode = null) {
        if (!keyCode) {
            keyCode = this.lastKeyCode;
        }
        this.keys.delete(keyCode);
        this.handledKeys.add(keyCode);
    }
}
