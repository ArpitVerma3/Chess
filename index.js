import {InitGame} from "./Data/data.js";
import { initGameRender } from "./Render/main.js";
import { GlobalEvent } from "./Events/global.js";

const globalData=InitGame();

let keyMapper = {};

globalData.flat.forEach(square => {
    keyMapper[square.id]=square;
});

initGameRender(globalData);
GlobalEvent();

export {globalData, keyMapper};


