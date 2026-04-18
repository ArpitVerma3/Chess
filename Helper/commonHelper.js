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
};
