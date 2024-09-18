import {Application, Assets, BitmapText, Ticker} from 'pixi.js';
import './style.css'
import {animatorUpdate} from "./core/Animator.ts";
import * as SceneRunner from "./scenes/sceneRunner.ts";

async function createApp(): Promise<Application> {
    const app = new Application();
    await app.init({backgroundAlpha:0, resizeTo: window});
    document.body.appendChild(app.canvas);
    return app;
}

// Bitmap text better handles frequent changes.
let fpsText: BitmapText;

async function main() {
    const app = await createApp();
    await Assets.load('https://pixijs.com/assets/bitmap-font/desyrel.xml');
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
    app.ticker.add(main_update);
    await SceneRunner.start(app);
}

/*
    --- Main-loop ---
    Generally O would like to see more decomposition into nested subsystems that update other components here.
    For example, the animator could be updated by a "core" layer, and the fps text could be rendered by a UI layer.
    But so far it's a little bit empty.
* */
function main_update(ticker: Ticker) {
    animatorUpdate();
    fpsText.text = ticker.FPS.toFixed(0);
    SceneRunner.update(ticker);
}

// Run main
(async () => await main())();


