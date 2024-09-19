import {Application, Container, ContainerChild} from "pixi.js";
import * as SceneState from "../../core/sceneState.ts";
import {Scene} from "../../core/sceneState.ts";
import {createButton} from "../../UI/components/button.ts";

// Construct menu
export async function start(app: Application, SceneContainer: Container<ContainerChild>) {
    const button1 = await createButton( "Ace of shadows", "#ff653d", () => SceneState.Change(SceneState.Scene.AceOfShadows));
    const button2 = await createButton( "Magic Words", "#54cdff", () => SceneState.Change(SceneState.Scene.MagicWords));
    const button3 = await createButton( "Phoenix flame", "#8af14a", () => SceneState.Change(SceneState.Scene.PhoenixFlame));

    layout(app, [button1, button2, button3]);

    SceneContainer.addChild(button1, button2, button3);

    window.onresize = onResize;

    function onResize() {
        // On iPhone we need to skip a frame to get proper size information
        const delay = 1;
        setTimeout(() => {
            if (SceneState.current != Scene.Menu) return;
            layout(app, [button1, button2, button3]);
        }, delay);
    }
}

function layout(app: Application, spriteList: Container[]) {
    let top = 55;
    // Auto scale buttons to fit vertically, respectively horizontally
    if (screen.orientation.type == "landscape-primary" || screen.orientation.type == "landscape-secondary") {
        top = 0;
        const totalHeight = app.canvas.clientHeight;
        const spacePerItem = totalHeight / spriteList.length;
        spriteList.forEach(item => {
            item.height = Math.min(spacePerItem, item.height);
            item.scale.x = item.scale.y;
        });
    } else {
        const totalWidth = app.canvas.clientWidth;
        spriteList.forEach(item => {
            item.width = totalWidth;
            item.scale.y = item.scale.x;
        });
    }

    spriteList.forEach((item, index) => {
        item.y = top + item.height * index;
        item.x = app.canvas.clientWidth * 0.5 - item.width * 0.5;
    });
}

export function update() {

}