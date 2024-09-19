import {Application, BitmapText, Container, Ticker} from "pixi.js";
import {OnSceneChanged, Scene} from "../core/sceneState.ts";
import {createBackButton} from "./components/backButton.ts";

// Bitmap text better handles frequent changes.
let fpsText: BitmapText;
let inMenu = true;
let backButton: Container;

export function start(app: Application){
    fpsText = new BitmapText({
        text: '?',
        style: {
            fontFamily: 'Desyrel',
            fontSize: 55,
            align: 'left',
        },
    });
    app.stage.addChild(fpsText);
    fpsText.x = 5;
    fpsText.y = -fpsText.height * 0.5 + 5;

    OnSceneChanged.on(async (newScene) => {
        // Create back button, leaving menu
        if(inMenu && newScene != Scene.Menu) {
            backButton = await createBackButton(app);
            app.stage.addChild(backButton);
            inMenu = false;
        }

        // Remove back button when entering menu
        if(!inMenu && newScene == Scene.Menu) {
            app.stage.removeChild(backButton);
            backButton.destroy();
            inMenu = true;
        }
    });
}

export function update(ticker: Ticker){
    fpsText.text = ticker.FPS.toFixed(0);
}