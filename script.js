const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];

// Drag Functionality
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// getSavedColumns();
// updateSavedColumns();

// Set localStorage Arrays
function updateSavedColumns() {
  let listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']

  for(let i =0; i<=listArrays.length-1; i++) {
    localStorage.setItem(`${arrayNames[i]}Items`, JSON.stringify(listArrays[i]))
  }
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  // listEl.id = index;
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondrag", "onDrag(event)")
  //Append
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
    if(!updatedOnLoad) {
      getSavedColumns();
    }
  // Backlog Column
  backlogList.textContent = ''
  backlogListArray.forEach((backlogItem, idx) => {
    createItemEl(backlogList, 0,backlogItem, idx)
  })

  // Progress Column
  progressList.textContent = ''
  progressListArray.forEach((progressItem, idx) => {
    createItemEl(progressList, 0,progressItem, idx)
  })

  // Complete Column
  completeList.textContent = ''
  completeListArray.forEach((completeItem, idx) => {
    createItemEl(completeList, 0,completeItem, idx)
  })

  // On Hold Column
  onHoldList.textContent = ''
  onHoldListArray.forEach((onHoldItem, idx) => {
    createItemEl(onHoldList, 0,onHoldItem, idx)
  })

  // Run getSavedColumns only once, Update Local Storage
}

// when items starts dragging
function onDrag(e) {
  draggedItem = e.target
  // console.log('dragged', draggedItem)
}

// Column Allows for Items to drop
function allowDrop(e) {
  e.preventDefault()
  console.log(e);
}
// When item enters column area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// Droping allows in column
function onDrop(e) {
  e.preventDefault()
  console.log(e)
  // Remvoe BG color and padding
  listColumns.forEach((item) => {
    item.classList.remove('over');
  })

  // Add item to the column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);

}


updateDOM();

