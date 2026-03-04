export function Greet(){
    alert("Hello World");
}
function square(color,id,piece){
    return{color,id,piece};
}
function sqrRow(rowId){
    const Rows=[];
    const abcd=["a","b","c","d","e","f","g","h"];

    if(rowId % 2==0){
    
        abcd.forEach((element,index)=>{
            if(index % 2==0){
                Rows.push(square("white",element+rowId,null));
            }else{
                Rows.push(square("black",element+rowId,null));
            }
        });
    }
    else{
         abcd.forEach((element,index)=>{
            if(index % 2==0){
                Rows.push(square("black",element+rowId,null));
            }else{
                Rows.push(square("white",element+rowId,null));
            }
        });
    }
    return Rows;
}
function InitGame(){
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
export{InitGame};