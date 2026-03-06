import {InitGame} from "./Data/data.js";
import { initGameRender } from "./Render/main.js";
import { GlobalEvent } from "./Events/global.js";

const globalData=InitGame();

initGameRender(globalData);
GlobalEvent();

export {globalData};


