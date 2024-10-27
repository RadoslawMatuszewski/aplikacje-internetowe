let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        let rasterMap = document.getElementById("rasterMap");

        createPuzzle(canvas);
    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});

function createPuzzle(canvas) {
    let puzzleContainer = document.getElementById("puzzle-container");
    let puzzleSlotContainer = document.getElementById("puzzle-slot-container");
    puzzleContainer.innerHTML = "";
    puzzleSlotContainer.innerHTML = "";
    let message = document.getElementById("message");
    message.innerHTML = "";

    let pieceWidth = 150;
    let pieceHeight = 75;

    let pieces = [];
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            let pieceCanvas = document.createElement("canvas");
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;

            let pieceContext = pieceCanvas.getContext("2d");
            pieceContext.drawImage(canvas, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

            pieces.push({
                canvas: pieceCanvas,
                correctIndex: y * 4 + x,
                currentIndex: null
            });
        }
    }

    pieces = shuffleArray(pieces);

    for (let i = 0; i < 16; i++) {
        let slotDiv = document.createElement("div");
        slotDiv.classList.add("puzzle-slot");


        slotDiv.addEventListener("dragover", dragOver);
        slotDiv.addEventListener("drop", drop);
        slotDiv.dataset.index = i;

        puzzleSlotContainer.appendChild(slotDiv);
    }

    pieces.forEach((piece, i) => {
        let pieceDiv = document.createElement("div");
        pieceDiv.classList.add("puzzle-piece");
        pieceDiv.appendChild(piece.canvas);

        pieceDiv.setAttribute("draggable", "true");

        piece.currentIndex = i;

        pieceDiv.addEventListener("dragstart", dragStart);

        pieceDiv.dataset.correctIndex = piece.correctIndex;
        pieceDiv.dataset.currentIndex = piece.currentIndex;


        puzzleContainer.appendChild(pieceDiv);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


let draggedElement = null;

function dragStart(event) {
    draggedElement = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();

    let targetElement = event.target;

    if (targetElement.classList.contains('puzzle-piece') && draggedElement) {

        let parent1 = draggedElement.parentNode;
        let parent2 = targetElement.parentNode;

        parent1.appendChild(targetElement);
        parent2.appendChild(draggedElement);

        let tempIndex = draggedElement.dataset.currentIndex;
        draggedElement.dataset.currentIndex = targetElement.dataset.currentIndex;
        targetElement.dataset.currentIndex = tempIndex;

        checkPuzzleCompletion();
    }

    else if (targetElement.classList.contains('puzzle-slot') && draggedElement) {
        let oldSlot = draggedElement.parentNode;


        targetElement.appendChild(draggedElement);


        let currentIndex = draggedElement.dataset.currentIndex;
        let targetIndex = targetElement.dataset.index;

        draggedElement.dataset.currentIndex = targetIndex;

        checkPuzzleCompletion();
    }
}

function checkPuzzleCompletion() {
    let allCorrect = true;
    let puzzlePieces = document.querySelectorAll('.puzzle-piece');

    puzzlePieces.forEach(piece => {
        if (piece.dataset.currentIndex !== piece.dataset.correctIndex) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        document.getElementById("message").innerHTML = "Gratulacje";
        if(Notification.permission==='granted'){
            new Notification("");
        }
        if (Notification.permission === 'granted') {
            new Notification("Gratulacje udało ci się ułożyć puzzle");
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification("Gratulacje udało ci się ułożyć puzzle.");
                }
            });
        }
    }

}
