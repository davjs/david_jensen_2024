import {EventEmitter} from "../utils/EventEmitter.ts";

export enum Scene {
    Menu,
    AceOfShadows,
    MagicWords,
    PhoenixFlame
}

export const OnSceneChanged = new EventEmitter<Scene>();
export let current: Scene = Scene.Menu;

export function Change(sceneName: Scene) {
    current = sceneName;
    OnSceneChanged.emit(sceneName);
}
