import { globalState } from "../index.js";
import { keySquareMapper } from "../index.js";

// function to check if piece exists of opponent
function checkPieceOfOpponentOnElement(id, color) {
  const opponentColor = color === "white" ? "Black" : "White";

  const element = keySquareMapper[id];

  if (!element) return false;

  if (element.piece && element.piece.piece_name.includes(opponentColor)) {
    const el = document.getElementById(id);
    el.classList.add("captureColor");
    element.captureHighlight = true;
    return true;
  }

  return false;
}

// function to check whether piece exists or not by square-id
function checkWhetherPieceExistsOrNot(squareId) {
  const square = keySquareMapper[squareId];

  if (square.piece) {
    return square;
  } else {
    return false;
  }
}

// function to check capture id square
function checkSquareCaptureId(array) {
  let returnArray = [];

  for (let index = 0; index < array.length; index++) {
    const squareId = array[index];
    const square = keySquareMapper[squareId];

    if (square.piece) {
      break;
    }
    returnArray.push(squareId);
  }

  return returnArray;
}

// function Knight_Hlts(id){
//   let finalArray = [];
//   if(!id)return;

//   function left(){
//     let alpha = id[0];
//     let num = Number(id[1]);

//     let temp=0;
//     let resultArray = [];

//     while(alpha!='a'){
//       if(temp>=2)break;
//       alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);

//       resultArray.push(`${alpha}${num}`);
//       temp++;
//     }
//     if(resultArray.length==2){
//       let finalArray1=[];

//       const lastEle=resultArray[resultArray.length-1];
//       let numba=Number(lastEle[1]);

//       if(numba<8){
//         finalArray1.push(`${alpha}${numba-1}`);
//       }
//       if(numba>1){
//         finalArray1.push(`${alpha}${numba+ 1}`)
//       }
//       return finalArray1;
     
//     }
//     else{
//       return [];
//     }
//   }
  
//   function right(){
//     let alpha = id[0];
//     let num = Number(id[1]);

//     let temp=0;
//     let resultArray = [];

//     while(alpha!='h'){
//       if(temp>=2)break;
//       alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);

//       resultArray.push(`${alpha}${num}`);
//       temp++;
//     }
//     if(resultArray.length==2){
//       let finalArray1=[];

//       const lastEle=resultArray[resultArray.length-1];
//       let numba=Number(lastEle[1]);

//       if(numba<8){
//         finalArray1.push(`${alpha}${numba-1}`);
//       }
//       if(numba>1){
//         finalArray1.push(`${alpha}${numba+ 1}`)
//       }
//       return finalArray1;
     
//     }
//     else{
//       return [];
//     }
//   }
 
//  function bottom(){
//     let alpha = id[0];
//     let num = Number(id[1]);

//     let temp=0;
//     let resultArray = [];

//     while(num!=1){
//       if(temp>=2)break;

//       num--;

//       resultArray.push(`${alpha}${num}`);
//       temp++;
//     }
//     if(resultArray.length==2){
//       let finalArray1=[];
//       const lastEle=resultArray[resultArray.length-1];

//       let alpha1=lastEle[0];
//       let numba=Number(lastEle[1]);

//       if(alpha1 != "h"){
//         finalArray1.push(`${String.fromCharCode(alpha1.charCodeAt(0) + 1)}${numba}`);
//       }
//       if(alpha1 != "a"){
//         finalArray1.push(`${String.fromCharCode(alpha1.charCodeAt(0) - 1)}${numba}`);
//       }
//       return finalArray1;
     
//     }
//     else{
//       return [];
//     }
//  }
 
//   function top(){
//     let alpha = id[0];
//     let num = Number(id[1]);

//     let temp=0;
//     let resultArray = [];

//     while(num!=8){
//       if(temp>=2)break;

//       num++;

//       resultArray.push(`${alpha}${num}`);
//       temp++;
//     }
//     if(resultArray.length==2){
//       let finalArray1=[];
//       const lastEle=resultArray[resultArray.length-1];

//       let alpha1=lastEle[0];
//       let numba=Number(lastEle[1]);

//       if(alpha1 != "h"){
//         finalArray1.push(`${String.fromCharCode(alpha1.charCodeAt(0) + 1)}${numba}`);
//       }
//       if(alpha1 != "a"){
//         finalArray1.push(`${String.fromCharCode(alpha1.charCodeAt(0) - 1)}${numba}`);
//       }
//       return finalArray1;
     
//     }
//     else{
//       return [];
//     }
//   }

//   return [...top(), ...right(),
//     ...bottom(), ...left()
//   ];
// }
function Knight_Hlts(id) {
  if (!id) return [];

  let alpha = id[0];
  let num = Number(id[1]);

  const offsets = [
    [2, 1], [2, -1],
    [-2, 1], [-2, -1],
    [1, 2], [1, -2],
    [-1, 2], [-1, -2]
  ];

  let moves = [];

  for (let [dx, dy] of offsets) {
    let newAlpha = String.fromCharCode(alpha.charCodeAt(0) + dx);
    let newNum = num + dy;

    if (newAlpha >= 'a' && newAlpha <= 'h' && newNum >= 1 && newNum <= 8) {
      moves.push(`${newAlpha}${newNum}`);
    }
  }
  return moves;
}


function RooksHlts(id){
    let finalReturnArray = [];

  function top(id) {
    let alpha = id[0];
    let num = Number(id[1]);
    let resultArray = [];

    while (num != 8) {
      num = num + 1;
      resultArray.push(`${alpha}${num}`);
    }

    return resultArray;
  }

  function bottom(id) {
    let alpha = id[0];
    let num = Number(id[1]);
    let resultArray = [];

    while (num != 1) {
      num = num - 1;
      resultArray.push(`${alpha}${num}`);
    }

    return resultArray;
  }

  function right(id) {
    let alpha = id[0];
    let num = Number(id[1]);
    let resultArray = [];

    while (alpha != "h") {
      alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
      resultArray.push(`${alpha}${num}`);
    }

    return resultArray;
  }

  function left(id) {
    let alpha = id[0];
    let num = Number(id[1]);
    let resultArray = [];

    while (alpha != "a") {
      alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
      resultArray.push(`${alpha}${num}`);
    }

    return resultArray;
  }

  return {
    top: top(id),
    bottom: bottom(id),
    right: right(id),
    left: left(id),
  };
}

function giveBishopHighlightIds(id) {
  let finalReturnArray = [];

  // will give top left id
  function topLeft(id) {
    let alpha = id[0];
    let num = Number(id[1]);
    let resultArray = [];

    while (alpha != "a" && num != 8) {
      alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
      num = num + 1;
      resultArray.push(`${alpha}${num}`);
    }

    return resultArray;
  }

  function bottomLeft(id) {
    let alpha = id[0];
    let num = Number(id[1]);
    let resultArray = [];

    while (alpha != "a" && num != 1) {
      alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
      num = num - 1;
      resultArray.push(`${alpha}${num}`);
    }

    return resultArray;
  }

  function topRight(id) {
    let alpha = id[0];
    let num = Number(id[1]);
    let resultArray = [];

    while (alpha != "h" && num != 8) {
      alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
      num = num + 1;
      resultArray.push(`${alpha}${num}`);
    }

    return resultArray;
  }

  function bottomRight(id) {
    let alpha = id[0];
    let num = Number(id[1]);
    let resultArray = [];

    while (alpha != "h" && num != 1) {
      alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
      num = num - 1;
      resultArray.push(`${alpha}${num}`);
    }

    return resultArray;
  }

  return {
    topLeft: topLeft(id),
    bottomLeft: bottomLeft(id),
    topRight: topRight(id),
    bottomRight: bottomRight(id),
  };
}

export {
  checkPieceOfOpponentOnElement, checkSquareCaptureId,
  checkWhetherPieceExistsOrNot,giveBishopHighlightIds,
  RooksHlts,Knight_Hlts,
};
