const API_URL = "http://localhost:8081";

let towers = [[], [], []];

let selectedTower = null;

let moves = 0;

let numberOfDisks = 3;



async function startGame() {

    numberOfDisks =
        parseInt(document.getElementById("diskSelect").value);

    towers = [[], [], []];

    
    for (let i = numberOfDisks; i >= 1; i--) {
        towers[0].push(i);
    }

    selectedTower = null;

    moves = 0;

    document.getElementById("diskCount").textContent =
        numberOfDisks;

    document.getElementById("moveCount").textContent =
        moves;

    await getMinimumMoves();

    renderTowers();

    setMessage("Click a tower to select a disk.");
}



async function getMinimumMoves() {

    try {

        const response = await fetch(
            `${API_URL}/minimum_moves`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    n: numberOfDisks
                })
            }
        );

        const data = await response.json();

        document.getElementById("minimumMoves").textContent =
            data.minimum_moves;

    } catch (error) {

        console.error(error);

        setMessage(
            "Cannot connect to the Prolog server."
        );
    }
}


function renderTowers() {

    for (let i = 0; i < 3; i++) {

        const towerElement =
            document.getElementById(`tower${i}`);

       
        towerElement
            .querySelectorAll(".disk")
            .forEach(disk => disk.remove());

        const disks = towers[i];

        disks.forEach((disk, index) => {

            const diskElement =
                document.createElement("div");

            diskElement.className = "disk";

            diskElement.textContent = disk;


        

            const width = 50 + disk * 25;

            diskElement.style.width =
                `${width}px`;

            diskElement.style.left =
                "50%";


    

            const rainbowColors = [
                "#ff0000", // Red
                "#ff7f00", // Orange
                "#ffff00", // Yellow
                "#00cc00", // Green
                "#00dddd", // Cyan
                "#004cff", // Blue
                "#8a00ff"  // Purple
            ];

            diskElement.style.backgroundColor =
                rainbowColors[(disk - 1) % rainbowColors.length];


            diskElement.style.border =
                "2px solid rgba(0, 0, 0, 0.25)";


            diskElement.style.bottom =
                `${35 + (index + 1) * 32}px`;


            towerElement.appendChild(diskElement);

        });
    }
}




function selectTower(towerIndex) {

    
    if (selectedTower === null) {

       
        if (towers[towerIndex].length === 0) {

            setMessage(
                "This tower is empty."
            );

            return;
        }

        selectedTower = towerIndex;

        setMessage(
            `Tower ${towerIndex + 1} selected. Choose a destination tower.`
        );

        return;
    }


    
    if (selectedTower === towerIndex) {

        selectedTower = null;

        setMessage(
            "Selection cancelled."
        );

        return;
    }


   
    moveDisk(
        selectedTower,
        towerIndex
    );
}



async function moveDisk(from, to) {

    const source =
        towers[from];

    const destination =
        towers[to];


    if (source.length === 0) {

        selectedTower = null;

        return;
    }


    const disk =
        source[source.length - 1];


    if (
        destination.length > 0 &&
        disk > destination[destination.length - 1]
    ) {

        setMessage(
            "Invalid move! A larger disk cannot be placed on a smaller disk."
        );

        selectedTower = null;

        return;
    }



    source.pop();

    destination.push(disk);

    moves++;


    document.getElementById("moveCount").textContent =
        moves;


    selectedTower = null;



    renderTowers();


    if (
        towers[2].length === numberOfDisks
    ) {

        setMessage(
            `🎉 Congratulations! You solved it in ${moves} moves!`
        );

        return;
    }


    // Normal move
    setMessage(
        "Good move! Select another tower."
    );
}




function setMessage(message) {

    document.getElementById("message").textContent =
        message;
}




startGame();