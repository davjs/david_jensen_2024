import {Container, Sprite, TextStyle, Texture, Text, Assets} from "pixi.js";
import buttonImage from '/images/button.png';
import menuFont from '/fonts/lonely_cake.woff2';

const buttonTextStyle = new TextStyle({
    fontFamily: 'Lonely Cake',
    fontSize: 34,
    fill: '#fcca03',
    align: 'center',
    dropShadow: {
        alpha: 0.2,
        blur: 2,
        distance: 3,
        angle: 90
    },
    stroke: {
        color: '#5a0308',
        width: 5
    },
});

export async function createButton(text: string, backgroundTint: string, callBack: () => void): Promise<Container> {
    // Loads the assets on first call,
    // If we want to make this function synchronous we could create a generic asset storage that we load upfront
    await Assets.load(menuFont)
    const texture: Texture = await Assets.load(buttonImage);

    const container = new Container();
    const button = Sprite.from(texture);
    button.cursor = "pointer";
    button.interactive = true;
    button.on('pointerdown', callBack);
    button.tint = backgroundTint;

    const buttonText = new Text({
        text: text,
        style: buttonTextStyle
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(button.width / 2, button.height / 2 - 6);
    button.addChild(buttonText);

    container.addChild(button);
    container.addChild(buttonText);

    return container;
}
