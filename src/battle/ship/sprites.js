function createSprite(cb) {
    const canvas = document.createElement('canvas');
    canvas.width = 22;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');

    cb(canvas, ctx);

    return canvas;
}

function reverse(sprite) {
    return createSprite(function (canvas, ctx) {
        ctx.translate(11, 0);
        ctx.scale(-1, 1);
        ctx.translate(-11, 0);
        ctx.drawImage(sprite, 0, 0);
    });
}

function darken(sprite) {
    return createSprite(function (canvas, ctx) {;
        ctx.drawImage(sprite, 0, 0);
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, 0, 22, 30);
    });
}

function createSpriteBundle(cb) {
    const sprite = createSprite(cb);
    const reversed = reverse(sprite)
    return {
        base: sprite,
        reversed: reversed,
        baseDark: darken(sprite),
        reversedDark: darken(reversed)
    }
}

const Sprites = {
    // SHIP
    back: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(22, 10);
        ctx.lineTo(22, 30);
        ctx.quadraticCurveTo(0, 30, 0, 15);
        ctx.fillStyle = '#852';
        ctx.fill();
    }),
    sail: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.quadraticCurveTo(25, 7, 11, 15);
        ctx.fillStyle = '#ccc';
        ctx.fill();

        ctx.fillStyle = '#963';
        ctx.fillRect(10, 0, 2, 15);
        ctx.fillStyle = '#852';
        ctx.fillRect(0, 15, 22, 15);
    }),
    cannon: createSpriteBundle(function (canvas, ctx) {
        ctx.fillStyle = '#852';
        ctx.fillRect(0, 15, 22, 15);

        ctx.beginPath();
        ctx.arc(11, 15, 4, 0, 7, 0);
        ctx.fillStyle = '#666';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(11, 15, 2, 0, 7, 0);
        ctx.fillStyle = '#000';
        ctx.fill();
    }),
    front: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(22, 15);
        ctx.quadraticCurveTo(12, 30, 0, 30);
        ctx.fillStyle = '#852';
        ctx.fill();
    }),
    cannonball: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.arc(11, 15, 2, 0, 7, 0);
        ctx.fillStyle = '#000';
        ctx.fill();
    })
};

export default Sprites;
