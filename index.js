import {InitGame} from "./Data/data.js";
import { initGameRender } from "./Render/main.js";

const globalData=InitGame();

initGameRender(globalData);

// console.log(globalData);

