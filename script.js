const container = document.querySelector("#grid-container");
const colorPicker = document.querySelector("#color-picker");

let eraser = false;

function createGrid(size) {
    container.innerHTML = '';

    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            cell.addEventListener('mouseover',() => {
                if(eraser) {
                    cell.style.backgroundColor = '';
                } else {
                    cell.style.backgroundColor = colorPicker.value;
                }
            })

            container.appendChild(cell);
            cell.style.height = `${960/size}px`;
            cell.style.width = `${960/size}px`;  
        }
    }
}

createGrid(16);

const resizeBtn = document.querySelector("#resize-btn");

resizeBtn.addEventListener('click', () => {

    const newSize = prompt("Enter new grid size (max 100):");
    if(newSize > 0 && newSize <= 100) {
        createGrid(newSize);
    } else {
        alert("Invalid size. Please enter a number between 1 and 100.");
    }
});

const clearBtn = document.querySelector("#clear-btn");
clearBtn.addEventListener('click', () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.backgroundColor = '';
    })
});

const eraseBtn = document.querySelector("#erase-btn");
eraseBtn.addEventListener('click', () => {
    eraser = !eraser;
});