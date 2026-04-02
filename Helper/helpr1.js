import { globalData } from "../index.js";

function checkOpponentPiece(id,color){
    const flatArray=globalData.flat();
    const oppColor=color=="white"?"BLACK" : "WHITE";

    for (let index = 0; index < flatArray.length; index++) {
        const element = flatArray[index];

        if(element.id==id){
            if(element.piece && element.piece.piece_name.includes
                (oppColor)
            ){
                const el=document.getElementById(id);
                el.classList.add("captureColor");
                element.captureHiglight=true;
            }
            break;
        }
        return false;
        
    }
}
export {checkOpponentPiece};