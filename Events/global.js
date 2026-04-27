import { ROOT_DIV } from "../Helper/constants.js";
import { renderHighlight, clearHighlight,selfHighlight } from "../Render/main.js";

import { giveBishopHighlightIds, checkSquareCaptureId } from "../Helper/commonHelper.js";
import { checkPieceOfOpponentOnElement, checkWhetherPieceExistsOrNot } from "../Helper/commonHelper.js";

import { globalStateRender} from "../Render/main.js";
import { globalState, keySquareMapper } from "../index.js";

import { RooksHlts, Knight_Hlts, Queen_Charge } from "../Helper/commonHelper.js";
import { King_Logic ,giveKnightCaptureIds} from "../Helper/commonHelper.js";

import { giveKingCaptureIds, giveQueenCapturesIds } from "../Helper/commonHelper.js";
import { giveRookCapturesIds, giveBishopCaptureIds } from "../Helper/commonHelper.js";
import { globalPiece } from "../Render/main.js";

import Pawn_Promotion from "../Helper/modelCr.js"

let highlight_state = false;
let selfHighlightState = null;

let whoInCheck=null;
let currTurn="white";
let moveState = null;

function clearHighlightLocal() {
  clearHighlight();
  highlight_state = false;
}

function movePieceFromXToY(from, to) {
  to.piece = from.piece;
  from.piece = null;
  globalStateRender();
}

function flipTurn(){
  currTurn = currTurn === "white" ? "black" : "white";
}

function King_Under_Attack() {
  if (currTurn === "black") {
    const whiteKingCurrentPosition = globalPiece.White_King.current_position;
    const knight_1 = globalPiece.Black_Knight_1.current_position;
    const knight_2 = globalPiece.Black_Knight_2.current_position;
    const king = globalPiece.Black_King.current_position;
    const bishop_1 = globalPiece.Black_Bishop_1.current_position;
    const bishop_2 = globalPiece.Black_Bishop_2.current_position;
    const rook_1 = globalPiece.Black_Rook_1.current_position;
    const rook_2 = globalPiece.Black_Rook_2.current_position;
    const queen = globalPiece.Black_Queen.current_position;

    let finalCheckList = [];
    finalCheckList.push(giveKnightCaptureIds(knight_1, currTurn));
    finalCheckList.push(giveKnightCaptureIds(knight_2, currTurn));
    finalCheckList.push(giveKingCaptureIds(king, currTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_1, currTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_2, currTurn));
    finalCheckList.push(giveRookCapturesIds(rook_1, currTurn));
    finalCheckList.push(giveRookCapturesIds(rook_2, currTurn));
    finalCheckList.push(giveQueenCapturesIds(queen, currTurn));

    finalCheckList = finalCheckList.flat();
    const checkOrNot = finalCheckList.find(
      (element) => element === whiteKingCurrentPosition
    );

    if (checkOrNot) {
      whoInCheck = "white";
    }
  } else {
    const blackKingCurrentPosition = globalPiece.Black_King.current_position;
    const knight_1 = globalPiece.White_Knight_1.current_position;
    const knight_2 = globalPiece.White_Knight_2.current_position;
    const king = globalPiece.White_King.current_position;
    const bishop_1 = globalPiece.White_Bishop_1.current_position;
    const bishop_2 = globalPiece.White_Bishop_2.current_position;
    const rook_1 = globalPiece.White_Rook_1.current_position;
    const rook_2 = globalPiece.White_Rook_2.current_position;
    const queen = globalPiece.White_Queen.current_position;

    let finalCheckList = [];
    finalCheckList.push(giveKnightCaptureIds(knight_1, currTurn));
    finalCheckList.push(giveKnightCaptureIds(knight_2, currTurn));
    finalCheckList.push(giveKingCaptureIds(king, currTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_1, currTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_2, currTurn));
    finalCheckList.push(giveRookCapturesIds(rook_1, currTurn));
    finalCheckList.push(giveRookCapturesIds(rook_2, currTurn));
    finalCheckList.push(giveQueenCapturesIds(queen, currTurn));

    finalCheckList = finalCheckList.flat();
    const checkOrNot = finalCheckList.find(
      (element) => element === blackKingCurrentPosition
    );

    if (checkOrNot) {
      whoInCheck = "black";
    }
  }
}


function inTurnCapture(square){
  const piece = square.piece;
   if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  return;
}

function checkForPawnPromotion(piece, id) {
  if (currTurn === "white") {
    if (
      piece?.piece_name?.toLowerCase()?.includes("pawn") &&
      id?.includes("8")
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      piece?.piece_name?.toLowerCase()?.includes("pawn") &&
      id?.includes("1")
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function callbackPawnPromotion(piece, id) {
  const realPiece = piece(id);
  const currentSquare = keySquareMapper[id];

  piece.current_position = id;
  currentSquare.piece = realPiece;

  const image = document.createElement("img");
  image.src = realPiece.img;
  image.classList.add("piece");

  const currentElement = document.getElementById(id);
  currentElement.innerHTML = "";
  currentElement.append(image);
}
// move element to square with id
function moveElement(piece, id, castle) {
  const pawnIsPromoted = checkForPawnPromotion(piece, id);

  if (piece.piece_name.includes("King") || piece.piece_name.includes("Rook")) {
    piece.move = true;

    if (
      piece.piece_name.includes("King") &&
      piece.piece_name.includes("Black")
    ) {
      if (id === "c8" || id === "g8") {
        let rook = keySquareMapper[id === "c8" ? "a8" : "h8"];
        moveElement(rook.piece, id === "c8" ? "d8" : "f8", true);
      }
    }

    if (
      piece.piece_name.includes("King") &&
      piece.piece_name.includes("White")
    ) {
      if (id === "c1" || id === "g1") {
        let rook = keySquareMapper[id === "c1" ? "a1" : "h1"];
        moveElement(rook.piece, id === "c1" ? "d1" : "f1", true);
      }
    }
  }

  const flatData = globalState.flat();
  flatData.forEach((el) => {
    if (el.id == piece.current_position) {
      delete el.piece;
    }
    if (el.id == id) {
      if (el.piece) {
        el.piece.current_position = null;
      }
      el.piece = piece;
    }
  });
  clearHighlight();
  const previousPiece = document.getElementById(piece.current_position);
  piece.current_position = null;

  previousPiece?.classList?.remove("highlightYellow");
  const currentPiece = document.getElementById(id);

  currentPiece.innerHTML = previousPiece?.innerHTML;
  if (previousPiece) previousPiece.innerHTML = "";
  piece.current_position = id;

  if (pawnIsPromoted) {
    Pawn_Promotion(currTurn, callbackPawnPromotion, id);
  }
  King_Under_Attack();

  if (!castle) {
    flipTurn();
  }
  
}


function whiteKnightClk(square){
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, square.id);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = Knight_Hlts(current_pos);

  // Filter out squares with own pieces
  highlightSquareIds = highlightSquareIds.filter((id) => {
    const element = keySquareMapper[id];
    if (!element || !element.piece) return true;
    return !element.piece.piece_name.toLowerCase().includes("white");
  });

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    if (element) {
      element.highlight = true;
    }
  });

  let captureIds = [];

  highlightSquareIds.forEach(element => {
    checkPieceOfOpponentOnElement(element, "white");
  });

  globalStateRender();
}

function blackKnightClk(square){
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = Knight_Hlts(current_pos);

  // Filter out squares with own pieces
  highlightSquareIds = highlightSquareIds.filter((id) => {
    const element = keySquareMapper[id];
    if (!element || !element.piece) return true;
    return !element.piece.piece_name.toLowerCase().includes("black");
  });

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    if (element) {
      element.highlight = true;
    }
  });

  let captureIds = [];

  highlightSquareIds.forEach(element => {
    checkPieceOfOpponentOnElement(element, "black");
  });

  globalStateRender();
}


function whiteKingClk(square) {

  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = King_Logic(current_pos);

  const {bottomLeft, topLeft, bottomRight, topRight,
    top, bottom, left, right
   } = highlightSquareIds;

  const directions = [bottomLeft, topLeft, bottomRight, topRight,
    bottom, top, right, left];
  const result = directions.map(checkSquareCaptureId);
  
  const temp = [bottom, top, right, left, bottomLeft, topLeft, bottomRight, topRight];
  highlightSquareIds = result.flat();

  // Add castling squares if king hasn't moved
  if (!piece.move) {
    const leftRook = keySquareMapper["a1"];
    const rightRook = keySquareMapper["h1"];
    
    // Check queenside castling
    if (leftRook && leftRook.piece && !leftRook.piece.move && 
        !keySquareMapper["b1"].piece && !keySquareMapper["c1"].piece && !keySquareMapper["d1"].piece) {
      highlightSquareIds.push("c1");
    }
    
    // Check kingside castling
    if (rightRook && rightRook.piece && !rightRook.piece.move && 
        !keySquareMapper["f1"].piece && !keySquareMapper["g1"].piece) {
      highlightSquareIds.push("g1");
    }
  }

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    if (element) {
      element.highlight = true;
    }
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWhetherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }
  globalStateRender();
}

function blackKingClk(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = King_Logic(current_pos);

  const {bottomLeft, topLeft, bottomRight, topRight,
    top, bottom, left, right
   } = highlightSquareIds;

  const directions = [bottomLeft, topLeft, bottomRight, topRight,
    bottom, top, right, left];
  const result = directions.map(checkSquareCaptureId);
  
  const temp = [bottom, top, right, left, bottomLeft, topLeft, bottomRight, topRight];
  highlightSquareIds = result.flat();

  // Add castling squares if king hasn't moved
  if (!piece.move) {
    const leftRook = keySquareMapper["a8"];
    const rightRook = keySquareMapper["h8"];
    
    // Check queenside castling
    if (leftRook && leftRook.piece && !leftRook.piece.move && 
        !keySquareMapper["b8"].piece && !keySquareMapper["c8"].piece && !keySquareMapper["d8"].piece) {
      highlightSquareIds.push("c8");
    }
    
    // Check kingside castling
    if (rightRook && rightRook.piece && !rightRook.piece.move && 
        !keySquareMapper["f8"].piece && !keySquareMapper["g8"].piece) {
      highlightSquareIds.push("g8");
    }
  }

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    if (element) {
      element.highlight = true;
    }
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWhetherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }
  globalStateRender();
}

function whitePawnClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = null;

  // on initial position movement
  if (current_pos[1] == "2") {
    highlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) + 1}`,
      `${current_pos[0]}${Number(current_pos[1]) + 2}`,
    ];
  } else {
    highlightSquareIds = [`${current_pos[0]}${Number(current_pos[1]) + 1}`];
  }

  highlightSquareIds = checkSquareCaptureId(highlightSquareIds);

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  // capture id logic
  const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
    Number(current_pos[1]) + 1
  }`;
  const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
    Number(current_pos[1]) + 1
  }`;

  let captureIds = [col1, col2];
  // captureIds = checkSquareCaptureId(captureIds);

  captureIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "white");
  });

  globalStateRender();
}

// white bishop event
function whiteBishopClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveBishopHighlightIds(current_pos);
  let temp = [];

  const {bottomLeft, topLeft, bottomRight, topRight } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));

  // insert into temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);

  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWhetherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }
  globalStateRender();
}

// black bishop event
function blackBishopClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveBishopHighlightIds(current_pos);
  let temp = [];

  const { bottomLeft, topLeft, bottomRight, topRight } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));

  // insert into temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);

  // highlightSquareIds = checkSquareCaptureId(highlightSquareIds);
  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });
  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWhetherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }
  globalStateRender();
}

function whiteQueenClk(square) {

  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = Queen_Charge(current_pos);

  const {bottomLeft, topLeft, bottomRight, topRight,
    top, bottom, left, right
   } = highlightSquareIds;

  const directions = [bottomLeft, topLeft, bottomRight, topRight,
    bottom, top, right, left];
  const result = directions.map(checkSquareCaptureId);
  
  const temp = [bottom, top, right, left, bottomLeft, topLeft, bottomRight, topRight];
  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    if (element) {
      element.highlight = true;
    }
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWhetherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }
  globalStateRender();
}

function blackQueenClk(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = Queen_Charge(current_pos);

  const {bottomLeft, topLeft, bottomRight, topRight,
    top, bottom, left, right
   } = highlightSquareIds;

  const directions = [bottomLeft, topLeft, bottomRight, topRight,
    bottom, top, right, left];
  const result = directions.map(checkSquareCaptureId);
  
  const temp = [bottom, top, right, left, bottomLeft, topLeft, bottomRight, topRight];
  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    if (element) {
      element.highlight = true;
    }
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWhetherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }
  globalStateRender();
}
// black pawn function
function blackPawnClick(square) {
  // clear board for any previous highlight

  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = null;

  // on initial position movement
  if (current_pos[1] == "7") {
    highlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) - 1}`,
      `${current_pos[0]}${Number(current_pos[1]) - 2}`,
    ];
  } else {
    highlightSquareIds = [`${current_pos[0]}${Number(current_pos[1]) - 1}`];
  }

  highlightSquareIds = checkSquareCaptureId(highlightSquareIds);

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  // capture logic id
  const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
    Number(current_pos[1]) - 1
  }`;
  const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
    Number(current_pos[1]) - 1
  }`;

  let captureIds = [col1, col2];
  // captureIds = checkSquareCaptureId(captureIds);

  captureIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "black");
  });

  globalStateRender();
}

function clearPreviousSelfHighlight(piece) {
  if (piece) {
    document
      .getElementById(piece.current_position)
      .classList.remove("highlightYellow");
    // console.log(piece);
    // selfHighlight = false;
    selfHighlightState = null;
  }
}

function whiteRookClk(square){

  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = RooksHlts(current_pos);
  let temp = [];

  const {bottom, top, right, left } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(left));

  // insert into temp
  temp.push(bottom);
  temp.push(top);
  temp.push(right);
  temp.push(left);

  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWhetherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }
  globalStateRender();
}

function blackRookClk(square){
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = RooksHlts(current_pos);
  let temp = [];

  const {bottom, top,right, left} = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(left));

  // insert into temp
  temp.push(bottom);
  temp.push(top);
  temp.push(right);
  temp.push(left);

  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWhetherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }
  globalStateRender();
}

function GlobalEvent() {
  ROOT_DIV.addEventListener("click", function (event) {
    if (event.target.localName === "img") {
      const clickId = event.target.parentNode.id;
      const square = keySquareMapper[clickId];

      if(selfHighlightState && square.captureHighlight && 
         ((square.piece.piece_name.includes("White") && currTurn==="black") || 
          (square.piece.piece_name.includes("Black") && currTurn==="white"))){
        inTurnCapture(square);
        return;
      }
      

      if (square.piece.piece_name == "White_Pawn") {
        if(currTurn == "white")whitePawnClick(square);
      } 
      else if (square.piece.piece_name == "Black_Pawn" && currTurn == "black") {
        if(currTurn == "black")blackPawnClick(square);
      } 
      else if (square.piece.piece_name == "White_Bishop" && currTurn == "white") {
        if(currTurn == "white")whiteBishopClick(square);
      } 
      else if (square.piece.piece_name == "Black_Bishop" && currTurn == "black") {
        if(currTurn == "black")blackBishopClick(square);
      }
      else if (square.piece.piece_name == "Black_Rook" && currTurn == "black") {
        if(currTurn == "black")blackRookClk(square);
      }
      else if (square.piece.piece_name == "White_Rook" && currTurn == "white") {
        if(currTurn == "white")whiteRookClk(square);
      }
      else if (square.piece.piece_name == "White_Knight" && currTurn == "white") {
        if(currTurn == "white")whiteKnightClk(square);
      }
      else if (square.piece.piece_name == "Black_Knight" && currTurn == "black") {
        if(currTurn == "black")blackKnightClk(square);
      }
      else if (square.piece.piece_name == "White_Queen" && currTurn == "white") {
       if(currTurn == "white") whiteQueenClk(square);
      }
      else if (square.piece.piece_name == "Black_Queen" && currTurn == "black") {
        if(currTurn == "black")blackQueenClk(square);
      }
       else if (square.piece.piece_name == "White_King" && currTurn == "white") {
        if(currTurn == "white")whiteKingClk(square);
      }
      else if (square.piece.piece_name == "Black_King" && currTurn == "black") {
        if(currTurn == "black")blackKingClk(square);
      }
    } else {
      const childElementsOfclickedEl = Array.from(event.target.childNodes);

      if (
        childElementsOfclickedEl.length == 1 ||
        event.target.localName == "span"
      ) {
        if (event.target.localName == "span") {
          clearPreviousSelfHighlight(selfHighlightState);
          const id = event.target.parentNode.id;
          moveElement(moveState, id);
          moveState = null;
        } else {
          clearPreviousSelfHighlight(selfHighlightState);
          const id = event.target.id;
          moveElement(moveState, id);
          moveState = null;
        }
      } else {
        // clear highlights
        clearHighlightLocal();
        clearPreviousSelfHighlight(selfHighlightState);
      }
    }
  });
}

export { GlobalEvent, movePieceFromXToY };
