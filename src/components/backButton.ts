import {Container, Application} from "pixi.js";
import * as SceneState from "../Core/sceneState.ts";
import * as button from "./button.ts";

export async function createBackButton(app: Application): Promise<Container> {
    const buttonContainer = await button.createButton( "< Back", "#ff653d", () => SceneState.Change(SceneState.Scene.Menu));

    buttonContainer.scale = 0.7;
    buttonContainer.x = app.canvas.clientWidth * 0.5 - buttonContainer.width * 0.5;
    buttonContainer.y = app.canvas.clientHeight - buttonContainer.height - 30;

    return buttonContainer;
}