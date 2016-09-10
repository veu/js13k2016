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

function createShipGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 30);
    gradient.addColorStop(0.5, '#852');
    gradient.addColorStop(1, '#630');
    return gradient;
}

function createWhaleGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 30);
    gradient.addColorStop(0.5, '#59b');
    gradient.addColorStop(1, '#156');
    return gradient;
}

const Sprites = {
    back: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(22, 10);
        ctx.lineTo(22, 30);
        ctx.quadraticCurveTo(0, 30, 0, 15);
        ctx.fillStyle = createShipGradient(ctx);
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
        ctx.fillStyle = createShipGradient(ctx);
        ctx.fillRect(0, 15, 22, 15);
    }),
    blackSail: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.quadraticCurveTo(25, 7, 11, 15);
        ctx.fillStyle = '#333';
        ctx.fill();

        ctx.fillStyle = '#963';
        ctx.fillRect(10, 0, 2, 15);
        ctx.fillStyle = createShipGradient(ctx);
        ctx.fillRect(0, 15, 22, 15);
    }),
    cannon: createSpriteBundle(function (canvas, ctx) {
        ctx.fillStyle = createShipGradient(ctx);
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
    cannonFiring: createSpriteBundle(function (canvas, ctx) {
        ctx.fillStyle = createShipGradient(ctx);
        ctx.fillRect(0, 15, 22, 15);

        ctx.beginPath();
        ctx.arc(11, 15, 4, 0, 7, 0);
        ctx.fillStyle = '#666';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(11, 15, 2, 0, 7, 0);
        ctx.fillStyle = '#d20';
        ctx.fill();
    }),
    front: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.fillStyle = createShipGradient(ctx);
        ctx.fillRect(0, 13, 22, 2);
        ctx.moveTo(0, 15);
        ctx.lineTo(22, 15);
        ctx.quadraticCurveTo(12, 30, 0, 30);
        ctx.fill();
    }),
    cannonball: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.arc(11, 15, 2, 0, 7, 0);
        ctx.fillStyle = '#000';
        ctx.fill();
    }),
    whaleBack: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.moveTo(22, 15);
        ctx.lineTo(22, 30);
        ctx.quadraticCurveTo(5, 30, 0, 20);
        ctx.lineTo(2, 30);
        ctx.quadraticCurveTo(5, 15, 22, 15);
        ctx.fillStyle = createWhaleGradient(ctx);
        ctx.fill();
    }),
    whaleBody: createSpriteBundle(function (canvas, ctx) {    
        ctx.fillStyle = '#963';
        ctx.fillStyle = createWhaleGradient(ctx);
        ctx.fillRect(0, 15, 22, 15);
    }),
    whaleFront: createSpriteBundle(function (canvas, ctx) {
        ctx.beginPath();
        ctx.fillStyle = createWhaleGradient(ctx);
        ctx.moveTo(0, 15);
        ctx.quadraticCurveTo(25, 15, 21, 19);
        ctx.quadraticCurveTo(25, 25, 0, 30);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(5, 18, 2, 2);
    }),
};

export default Sprites;
