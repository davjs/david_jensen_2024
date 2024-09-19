import {Application, Assets, Container, ContainerChild, PointData, Sprite} from "pixi.js";
import softImage from '/images/blob.png';
import {ColorSource} from "pixi.js";

type Particle = {
    sprite: Sprite,
    velocity: PointData,
    attractor: PointData,
    life: number,
    startLife: number,
    friction: number,
    gravity: number
}

let clientWidth: number;
let clientHeight: number
const particles: Particle[] = [];
let emitterPosition: PointData;

export async function start(app: Application, SceneContainer: Container<ContainerChild>) {
    clientWidth = app.canvas.clientWidth;
    clientHeight = app.canvas.clientHeight;
    emitterPosition = {
        x: clientWidth * 0.5,
        y: clientHeight * 0.5
    };
    // Create 10 sprites that are reused indefinitely
    for (let i = 0; i < 10; i++) {
        const softTexture = await Assets.load(softImage);
        const softSprite = Sprite.from(softTexture);
        softSprite.x = emitterPosition.x + Math.random() * 100;
        softSprite.y = emitterPosition.y + Math.random() * 100;
        // Additive blend mode gives it that center glow when particles overlap
        // I generally prefer to use a mix of normal and additive particles to better preserve colors
        // But this will do
        softSprite.blendMode = "add";
        const particle = {
            sprite: softSprite,
            velocity: {x: 0, y: 0},
            attractor: {x: 0, y: 0},
            life: 0,
            startLife: 0,
            friction: 0.2,
            gravity: -0.8
        };
        initParticle(particle);
        particles.push(particle)
        SceneContainer.addChild(softSprite);
        // Sleep to make the particles stream out and offset their lifecycles
        await sleep(90);
    }
}

// Initializes and resets the particle
function initParticle(particle: Particle) {
    const direction = randomDirection();
    direction.y = Math.min(direction.y, 0);
    const speed = 8;
    particle.velocity = {
        x: direction.x * speed,
        y: direction.y * speed
    };
    particle.attractor = {
        x: emitterPosition.x,
        y: emitterPosition.y + 10
    };
    particle.startLife = 50;
    particle.life = particle.startLife;
    particle.sprite.position = emitterPosition;
    particle.sprite.anchor.set(0.5);
    particle.sprite.rotation = Math.random() * Math.PI;
}


// Returns alpha from life-progress (0-1), fading it in and out
// See: https://www.desmos.com/calculator/ire7uv2ssz
function alphaLifeCurve(progress: number) {
    return 1 - 16 * Math.pow(progress - 0.5, 4);
}

// A bit trickier, and less calculated, but essentially:
// - Red reacts strongest (ensuring it still has reds on low life)
// - A little green to get it yellow,
// - Even less blue, but with an exponential kick in the start to move towards white
// A lerp between 3 colors would have been preferred.
function getTemperatureColor(progressRaw: number): ColorSource {
    const progress = Math.pow(progressRaw, 0.5);
    const brighten = Math.pow(1.0 - progress, 2.0) * 2.0 * 255;
    const r = Math.min(progress * 1.66, 1.0) * 255 + brighten;
    const g = Math.min(Math.pow(progress * 0.4, 1.0), 1.0) * 255 + brighten;
    const b = Math.min(Math.pow(progress * 0.068, 0.68), 1.0) * 255 + brighten;
    return {
        r,
        g,
        b
    }
}

export function update() {
    particles.forEach(p => {
        p.life -= 1;
        if (p.life <= 0) {
            // Reuse particle on death
            initParticle(p);
        }
        // Apply friction
        p.velocity.x *= (1 - p.friction);
        p.velocity.y *= (1 - p.friction);
        // Apply gravity
        p.velocity.y += p.gravity;
        // Apply velocity
        p.sprite.x += p.velocity.x;
        p.sprite.y += p.velocity.y;
        // Progress is inverse of life
        const progress = 1.0 - p.life / p.startLife;
        // Slightly move particles towards center
        p.sprite.x += (p.attractor.x - p.sprite.x) * progress * 0.01;
        p.sprite.tint = getTemperatureColor(progress);
        p.sprite.alpha = alphaLifeCurve(progress);
        // I am reusing the first half of the alpha curve to scale it up but not down
        // A set of easing functions with lerps would probably do the trick better.
        const progressToFull = Math.min(progress, 0.5)
        p.sprite.scale = alphaLifeCurve(progressToFull) * 2.0;
    });
}


// Returns a normalized random direction vector
function randomDirection(): PointData {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const length = Math.sqrt(x * x + y * y);
    return {
        x: x / length,
        y: y / length,
    };
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}