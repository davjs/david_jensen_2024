import {Container, PointData} from "pixi.js";
/*
Animator that stores tweens and interpolates them during update.
Only handles position, and is used in the card scene.
Far from full-fledged. There are many libraries for this, but this will do for now.
* */

const tweens: TweenData[] = [];

type TweenData = {
    target: Container,
    timeStarted: number,
    durationMS: number,
    from: PointData,
    to: PointData
};

function lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * Math.min(Math.max(progress, 0), 1);
}
function easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// Interpolate between start and target
function tween({ target, timeStarted, durationMS, from, to }: TweenData) : boolean {
    const now = performance.now();
    const elapsed = now - timeStarted;
    const progress = Math.min(elapsed / durationMS, 1);
    target.x = lerp(from.x, to.x, easeInOutCubic(progress));
    target.y = lerp(from.y, to.y, easeInOutCubic(progress));
    return progress < 1;
}

export function addAnimation(target: Container, to: PointData){
    tweens.push({
        target: target,
        durationMS: 2000,
        timeStarted: performance.now(),
        from: {
            x: target.position.x,
            y: target.position.y
        },
        to: to
    });
}

// Update tweens
export function animatorUpdate(){
    // Loop reverse so that we can remove while iterating
    for(let i = tweens.length -1; i >= 0; i--) {
        const tweenData = tweens[i];
        if (performance.now() - tweenData.timeStarted > tweenData.durationMS) {
            tweenData.target.position = tweenData.to;
            // Remove finished tween
            tweens.splice(i, 1);
        } else {
            tween(tweenData);
        }
    }
}