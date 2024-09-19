import {Application, Assets, Ticker} from 'pixi.js';
import './style.css'
import * as Core from "./core/core.ts";
import * as UI from "./UI/UI.ts";
import * as Game from "./Game/game.ts";

async function createApp(): Promise<Application> {
    const app = new Application();
    await app.init({backgroundAlpha:0, resizeTo: window});
    document.body.appendChild(app.canvas);
    return app;
}

async function main() {
    const app = await createApp();
    await Assets.load('https://pixijs.com/assets/bitmap-font/desyrel.xml');

    await Game.start(app);
    UI.start(app);
    app.ticker.add(main_update);
}

/*
    --- Main-loop ---
* */
function main_update(ticker: Ticker) {
    Core.update();
    Game.update(ticker);
    UI.update(ticker);
}

// Run main
(async () => await main())();


