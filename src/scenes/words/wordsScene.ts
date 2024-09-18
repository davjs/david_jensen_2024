import {Application, Assets, Container, ContainerChild, TextStyle, Texture, Ticker} from "pixi.js";
import {createBackButton} from "../../components/backButton.ts";
import nojiImage from '/images/not_emoji.png';
import {flowLayout} from "./flowLayout.ts";

let timeSinceScrambleMS = 0;
const frequencyMS = 2000;
let clientWidth: number;
let clientHeight: number
let randomImage: Texture;
let container: Container;
let flowLayoutContainer: Container;
const randomText = "Textus longus sine imaginibus etiam potest significare altam significationem, affectus et claritatem, solum innixus in opulentia linguae.";

export async function start(app: Application, sceneContainer: Container<ContainerChild>) {
    clientWidth = app.canvas.clientWidth;
    clientHeight = app.canvas.clientHeight;
    const button = await createBackButton(app);
    randomImage = await Assets.load(nojiImage);
    container = sceneContainer;
    container.addChild(button);
    scramble();
}

export function update(ticker: Ticker) {
    // Update swap timer
    timeSinceScrambleMS += ticker.deltaMS;
    if (timeSinceScrambleMS > frequencyMS) {
        scramble();
        timeSinceScrambleMS -= frequencyMS;
    }
}

function scramble() {
    if (flowLayoutContainer != null) {
        container.removeChild(flowLayoutContainer);
        flowLayoutContainer.destroy();
    }

    // Randomly cut up the text based on a chosen character
    const randomCharacterIndex = Math.round(Math.random() * randomText.length - 1);
    const randomCharacter = randomText[randomCharacterIndex];
    const textSnippets = randomText.split(randomCharacter);
    // Interweave the text parts with images
    const interWovenWithImages = textSnippets.flatMap((text) => {
        return [text, randomImage];
    });

    // Call our "flow" layout function
    flowLayoutContainer = flowLayout(
        interWovenWithImages,
        clientWidth * 0.5,
        12 + Math.random() * 22
    );
    flowLayoutContainer.x = clientWidth * 0.1;
    flowLayoutContainer.y = clientHeight * 0.1;
    container.addChild(flowLayoutContainer);
}
