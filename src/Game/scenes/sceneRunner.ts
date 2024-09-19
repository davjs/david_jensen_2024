import {Application, Container, Ticker} from "pixi.js";
import * as SceneState from "../../core/sceneState.ts";
import * as MenuScene from "./menuScene.ts";
import * as CardsScene from "./cards/cardsScene.ts";
import * as WordsScene from "./words/wordsScene.ts";
import * as FlameScene from "./flame/flameScene.ts";

export async function start(app: Application) {
    const SceneContainer = new Container();
    app.stage.addChild(SceneContainer);
    await MenuScene.start(app, SceneContainer);
    SceneState.OnSceneChanged.on((scene: SceneState.Scene) => {
        // Clear up previous scene
        SceneContainer.removeChildren(0, SceneContainer.children.length);
        switch (scene) {
            case SceneState.Scene.Menu:
                MenuScene.start(app, SceneContainer);
                break;
            case SceneState.Scene.AceOfShadows:
                CardsScene.start(app, SceneContainer);
                break;
            case SceneState.Scene.MagicWords:
                WordsScene.start(app, SceneContainer);
                break;
            case SceneState.Scene.PhoenixFlame:
                FlameScene.start(app, SceneContainer);
                break;

        }
    })
}

export function update(ticker: Ticker){
    switch (SceneState.current) {
        case SceneState.Scene.Menu:
            MenuScene.update();
            break;
        case SceneState.Scene.AceOfShadows:
            CardsScene.update(ticker);
            break;
        case SceneState.Scene.MagicWords:
            WordsScene.update(ticker);
            break;
        case SceneState.Scene.PhoenixFlame:
            FlameScene.update();
            break;
    }
}