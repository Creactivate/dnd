// constants and global variables
const parent = document.querySelector('.drag-wrapper');
let card;
let inputEl = document.querySelector('.aniInput');
let currentDrag;




/*         SETUP         */


// setup draggable element attributes, labelled with class card with img children
function addElementListeners() {
    card = document.querySelectorAll('.card')
    card.forEach((img,i) => {
        img.style.cursor = 'move';
        img.draggable = true;
        img.children[0].draggable = false;
        img.children[0].children[0].draggable = false;
        img.onmouseenter = onHoverShowDelete;
        img.onmouseleave = onLeaveHideDelete;
        img.addEventListener('dragstart', (event) => {onDragStart(event)});
        img.addEventListener('dragend', (event) => {onDragEnd(event)});
        img.ondragover = onDragOver;
    }) 
}


// need use add event listener for file upload as javascript to use false capture boolean
inputEl.addEventListener('change', handleFiles, false);





/*         EVENT LISTENERS         */



/*         DRAG EVENT LISTENERS    */
// Event Listeners For Dragged Elements:

function onDragStart(e){
    currentDrag = e.target;
    e.target.style.opacity = 0.5;
    e.target.children[1].style.display = 'none';
}

function onDragEnd(e){
    e.target.style.opacity = 1;
    currentDrag = '';
}

// Event Listeners For Hovered Over Elements:

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
            parent.insertBefore(currentDrag, e.target.parentElement.parentElement);
        } else if(distanceFromMiddleX >= 0) {
            e.target.parentElement.parentElement.after(currentDrag)
        }
    }
}


/*        ADD NEW PAGE LISTENERS         */
// add-new-card handler onClick
function add_new_card(e) {
    document.querySelector('.add-new-overlay').style.display = 'block';
}

// card on hover show delete cross button
function onHoverShowDelete(e) {
    if (!currentDrag && this.children){
        this.children[1].style.display = 'block';
    }
    
}

// card on hover show delete cross button
function onLeaveHideDelete(e) {
    this.children[1].style.display = 'none';
}


// Handle delete
function cardDeleteHandler(e) {
    console.log('delete',this);
    e.target.parentElement.remove();
}

// Exit upoad new
function addNewExitBtn() {
    document.querySelector('.add-new-overlay').style.display = 'none';
}

function handleFiles() {
    if (this.files.length) {
        console.log('upload time')
        // Script to add a new element to the DOM
        // Selectors
        let newPage = document.createElement('div');
        let newImg = document.createElement('img');
        let newImgCont = document.createElement('div');
        let newDeleteBtn = document.createElement('button');

        // Set Attributes
        newPage.addEventListener('mouseover', (event) => {onHoverShowDelete(event)})
        newImgCont.className = 'card-img-cont';
        newDeleteBtn.type = 'button';
        newDeleteBtn.className = 'card-delete-btn'
        newDeleteBtn.addEventListener('click', (event) => {cardDeleteHandler(event)})
        newDeleteBtn.innerHTML = 'X';
        newImg.className = 'card-img';
        newImg.src = URL.createObjectURL(this.files[0]);
        newImg.onload = function() {URL.revokeObjectURL(this.src);};
        newPage.className = 'card';
        newImgCont.appendChild(newImg);
        newPage.appendChild(newImgCont);
        newPage.appendChild(newDeleteBtn);
        parent.appendChild(newPage);
        addElementListeners();
        this.value = '';
        document.querySelector('.add-new-overlay').style.display = 'none';
    } else {
        console.log('no file selected')
    }
}




/*         ON LOAD         */
addElementListeners()