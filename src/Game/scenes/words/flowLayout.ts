import {Container, Sprite, Text, TextStyle, Texture} from "pixi.js";

const textStyle = new TextStyle({
    fontFamily: 'Lonely Cake',
    fontSize: 22,
    fill: '#fff6dc',
    align: 'center',
    dropShadow: {
        alpha: 0.2,
        blur: 1,
        distance: 2,
        angle: 90
    },
});

export function flowLayout(textAndImages: (string | Texture)[], maxWidth: number, fontSize: number): Container {
    const container = new Container();
    let x = 0, y = 0;
    let latestTextHeight = fontSize;
    textStyle.fontSize = fontSize;

    // Fill container
    // Both images and text are bottom left aligned
    for (const element of textAndImages) {
        if (typeof element == 'string') {
            const textObject = new Text({
                text: element,
                style: textStyle
            });
            textObject.anchor.set(0, 1);
            latestTextHeight = textObject.height;
            container.addChild(textObject);
        } else {
            const sprite = new Sprite(element);
            sprite.anchor.set(0, 1);
            // Adapt image scale to the previous texts height
            sprite.scale.set(latestTextHeight / sprite.height);
            container.addChild(sprite);
        }
    }

    // Layout children
    const padding = 5;
    container.children.forEach(child => {
        // New line
        if (x + child.width > maxWidth) {
            x = 0;
            y += child.height + padding;
        }
        child.x = x;
        child.y = y;
        x += child.width + padding;
    });

    return container;
}