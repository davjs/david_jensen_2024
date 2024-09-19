import {Application, Assets, Container, ContainerChild, PointData, Sprite, Texture, Ticker} from "pixi.js";
import cardImage from '/images/card.png';
import {addAnimation} from "../../../core/animator.ts";

const frequencyMS = 1000;
const cards = 144;
let timeSinceLastSwapMS = 0;
let mainContainer: Container;
let secondaryContainer: Container;
let cardTexture: Texture;
let secondaryStackPosition: PointData;

export async function start(app: Application, SceneContainer: Container<ContainerChild>) {
    const clientWidth = app.canvas.clientWidth;
    const clientHeight = app.canvas.clientHeight;
    mainContainer = new Container();
    secondaryContainer = new Container();
    const mainStackPosition = {
        x: clientWidth * 0.5,
        y: clientHeight * 0.5
    };
    secondaryStackPosition = {
        x: clientWidth * 0.5,
        y: clientHeight * 0.85
    };
    cardTexture = await Assets.load(cardImage);

    for (let i = 0; i < cards; i++) {
        // Build stack from bottom up
        const cardSprite = Sprite.from(cardTexture);
        cardSprite.anchor.set(0.5, 0.5);
        cardSprite.scale.set(0.6, 0.6);
        const strictPositionX = mainStackPosition.x;
        const strictPositionY = mainStackPosition.y - i;
        cardSprite.x = strictPositionX;
        cardSprite.y = strictPositionY;

        // Add noise towards bottom of deck
        const progressTowardsBottom = ((cards - i) / cards);
        const chaosFactor = progressTowardsBottom * 2 + 1;
        noiseOffset(cardSprite, chaosFactor);
        mainContainer.addChild(cardSprite);
    }
    // Skewing to fake isometric perspective
    mainContainer.scale.y = 0.74;
    secondaryContainer.scale.y = 0.74;
    SceneContainer.addChild(mainContainer, secondaryContainer);
}

function noiseOffset(sprite: Sprite, chaosFactor: number) {
    sprite.x += signedRandom() * chaosFactor * 2;
    sprite.y += signedRandom() * chaosFactor * 2;
    sprite.rotation += signedRandom() * 0.01 * chaosFactor + 0.5;
}

function startSwap() {
    if (mainContainer.children.length == 0) return;

    // Swap stack
    const child = mainContainer.children.pop()!;
    secondaryContainer.addChild(child);
    const newStackIndex = secondaryContainer.children.length - 1;
    const targetPosition = {
        x: secondaryStackPosition.x,
        y: secondaryStackPosition.y - newStackIndex
    };

    // set up a tween that is updated asynchronously
    addAnimation(child, targetPosition);
}

export function update(ticker: Ticker) {
    // Update swap timer
    timeSinceLastSwapMS += ticker.deltaMS;
    if (timeSinceLastSwapMS > frequencyMS) {
        startSwap();
        timeSinceLastSwapMS -= frequencyMS;
    }
}


// Random in range -1:+1
function signedRandom() {
    return Math.random() - Math.random();
}