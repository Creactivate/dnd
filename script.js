// constants and global variables
const parent = document.querySelector('.drag-wrapper');
const card = document.querySelectorAll('.card');
let currentDrag;




/*         SETUP         */


// setup draggable element attributes, labelled with class card with img children
card.forEach((img) => {
    img.style.cursor = 'move';
    img.draggable = true;
    img.firstChild.nextSibling.draggable = false;
    img.addEventListener('dragstart', (event) => {onDragStart(event)});
    img.addEventListener('dragend', (event) => {onDragEnd(event)});
    img.addEventListener('dragover', (event) => {onDragOver(event)});
    img.addEventListener('dragenter', (event) => {onDragEnter(event)});
})





/*         EVENT LISTENERS         */


// Event Listeners For Dragged Element
function onDragStart(e){
    currentDrag = e.target;
    e.target.style.opacity = 0.5;
}

function onDragEnd(e){
    e.target.style.opacity = 1;
}

// Event Listeners For Hovered Over Element
function onDragEnter(e) {
    currentDrag.style.opacity = 0.2;
}

function onDragOver(e){
    e.preventDefault();
    if (currentDrag !== e.target.parentElement){
        
        // work out if mouse is in left or right portion of element.
        let middleX, distanceFromMiddleX;
        if (e.target.width) {
            middleX = e.target.x + (e.target.width/2);
            distanceFromMiddleX = e.clientX - middleX
        } else {
            middleX = e.clientX;
        }

        // if right of middle, place before, else if left, place after
        if (distanceFromMiddleX <= 0) {
            parent.insertBefore(currentDrag, e.target.parentElement);
        } else if(distanceFromMiddleX >= 0) {
            e.target.parentElement.after(currentDrag)
        }
    } 
}

