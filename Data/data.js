import { renderHighlight } from "../Render/main.js";

function square(color,id,piece){

    // const highlightSqr=function(){
    //     renderHighlight(this.id);
    //     this.highlightSqr=true;
    // };
    return{color,id,piece};
}
function sqrRow(rowId){
    const Rows=[];
    const Cols=["a","b","c","d","e","f","g","h"];

    if(rowId % 2==0){
    
        Cols.forEach((element,index)=>{
            if(index % 2==0){
                Rows.push(square("white",element+rowId,null));
            }else{
                Rows.push(square("black",element+rowId,null));
            }
        });
    }
    else{
         Cols.forEach((element,index)=>{
            if(index % 2==0){
                Rows.push(square("black",element+rowId,null));
            }else{
                Rows.push(square("white",element+rowId,null));
            }
        });
    }
    return Rows;
}
function initGame(){
    return [
        sqrRow(8),
        sqrRow(7),
        sqrRow(6),
        sqrRow(5),
        sqrRow(4),
        sqrRow(3),
        sqrRow(2),
        sqrRow(1),
    ];
}
export{initGame};