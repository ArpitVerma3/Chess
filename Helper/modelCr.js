class newModel {
    constructor(body) {
        if (!body) {
            throw new Error("Please pass the body");
        }
        this.open = false;
        this.body = body;
    }
    show() {
        this.open = true;
        document.body.appendChild(this.body);
        document.getElementById("root").classList.add("blur");
    }
}

function Pawn_Promotion(color) {
    const rook = document.createElement("img");
    rook.src = `../Gallery/images/pieces/${color}/rook.png`;

    const knight = document.createElement("img");
    knight.src = `../Gallery/images/pieces/${color}/knight.png`;

    const queen = document.createElement("img");
    queen.src = `../Gallery/images/pieces/${color}/queen.png`;

    const bishop = document.createElement("img");
    bishop.src = `../Gallery/images/pieces/${color}/bishop.png`;

    const imgBox = document.createElement("div");
    imgBox.appendChild(rook);
    imgBox.appendChild(bishop);
    imgBox.appendChild(knight);
    imgBox.appendChild(queen);

    const msg = document.createElement("p");
    msg.textContent = "Your Pawn has been promoted";

    const finalCont = document.createElement("div");
    finalCont.appendChild(msg);
    finalCont.appendChild(imgBox);

    finalCont.classList.add("modal");
    const model = new newModel(finalCont);
    model.show();
}

export default Pawn_Promotion;
