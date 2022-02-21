const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let isDragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// getSavedColumns();
// updateSavedColumns();

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  for (let i = 0; i <= listArrays.length - 1; i++) {
    localStorage.setItem(
      `${arrayNames[i]}Items`,
      JSON.stringify(listArrays[i])
    );
  }
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// FilteredArray
function filterArray(arr) {
  let filteredArray = arr.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("ondrag", "onDrag(event)");
  listEl.setAttribute("onfocusout", `updateOnFocuOut(${index}, ${column})`);
  //Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, idx) => {
    createItemEl(backlogList, 0, backlogItem, idx);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, idx) => {
    createItemEl(progressList, 1, progressItem, idx);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, idx) => {
    createItemEl(completeList, 2, completeItem, idx);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, idx) => {
    createItemEl(onHoldList, 3, onHoldItem, idx);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update item or delete if it is empty
function updateOnFocuOut(idx, column) {
  let selectedArray = listArrays[column];
  let selectedColumnEl = listColumns[column].children;
  if (!isDragging) {
    if (!selectedColumnEl[idx].textContent) {
      delete selectedArray[idx];
    } else {
      selectedArray[idx] = selectedColumnEl[idx].textContent;
    }
    updateDOM();
  }
}

// Add to column list and reset textbox
function addToColumn(idx) {
  const item = addItems[idx].textContent;
  let selectedArray = listArrays[idx];
  selectedArray.push(item);
  addItems[idx].textContent = "";
  updateDOM();
}

// show Input box
function showInput(idx) {
  addBtns[idx].style.visibility = "hidden";
  saveItemBtns[idx].style.display = "flex";
  addItemContainers[idx].style.display = "flex";
}

// hide Input Box
function hideInput(idx) {
  addBtns[idx].style.visibility = "visible";
  saveItemBtns[idx].style.display = "none";
  addItemContainers[idx].style.display = "none";
  addToColumn(idx);
}

// Allow arrays to reflect drag and drop
function reBuildArrays() {
  backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);
  progressListArray = Array.from(progressList.children).map(
    (i) => i.textContent
  );
  onHoldListArray = Array.from(onHoldList.children).map((i) => i.textContent);
  completeListArray = Array.from(completeList.children).map(
    (i) => i.textContent
  );
  updateDOM();
}

// when items starts dragging
function onDrag(e) {
  draggedItem = e.target;
  isDragging = true;
}

// Column Allows for Items to drop
function allowDrop(e) {
  e.preventDefault();
}
// When item enters column area
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// Droping allows in column
function onDrop(e) {
  e.preventDefault();
  // Remvoe BG color and padding
  listColumns.forEach((item) => {
    item.classList.remove("over");
  });

  // Add item to the column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  isDragging = false;
  reBuildArrays();
}

updateDOM();
