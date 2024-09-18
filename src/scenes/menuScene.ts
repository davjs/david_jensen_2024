import {Application, Container, ContainerChild} from "pixi.js";
import * as SceneState  from "../core/SceneState.ts";
import  {createButton} from "../components/button.ts";

// Construct menu
export async function start(app: Application, SceneContainer: Container<ContainerChild>) {
    const button1 = await createButton( "Ace of shadows", "#ff653d", () => SceneState.Change(SceneState.Scene.AceOfShadows));
    const button2 = await createButton( "Magic Words", "#54cdff", () => SceneState.Change(SceneState.Scene.MagicWords));
    const button3 = await createButton( "Phoenix flame", "#8af14a", () => SceneState.Change(SceneState.Scene.PhoenixFlame));

    layout(app,[button1, button2, button3]);

    SceneContainer.addChild(button1, button2, button3);
}

function layout(app: Application,spriteList: Container[]){
    const top = 55;
    spriteList.forEach((item, index) => {
        item.y = top + item.height * index;
        item.x = app.canvas.clientWidth * 0.5 - item.width * 0.5;
    });
}