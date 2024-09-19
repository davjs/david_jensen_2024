import {Application, Ticker} from "pixi.js";
import * as SceneRunner from "./scenes/sceneRunner.ts";

export async function start(app: Application){
    await SceneRunner.start(app);
}

export function update(ticker: Ticker){
    SceneRunner.update(ticker);
}