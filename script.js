let body = document.querySelector('body');
let header = document.querySelector('header')
let mainContainer = document.querySelector('main');
let noteContainer = document.getElementById('container');
let addIcon = document.getElementById('add-icon');
let myNotes = localStorage.getItem('myNotes') ? JSON.parse(localStorage.getItem('myNotes')) : [];

displayMyNotes();

addIcon.addEventListener('click', toggleInputContainer);

// when inputContainer does not exist then the inputContainer will be added and if exists then no inputContainer will be added in the mainContainer
function toggleInputContainer() {
  let inputContainer = document.getElementById('input-container');

  if (!inputContainer) {
    addNote();
  }
}

function addNote() {
  let inputContainer = document.createElement('div');
  inputContainer.setAttribute('id', 'input-container');

  inputContainer.innerHTML = `
    <textarea id="description" placeholder="Enter your note description here"></textarea>
    <div>
      <button id="save">Save</button>
      <button id="cancel">Cancel</button>
    </div>
  `;

  mainContainer.appendChild(inputContainer);

  let cancelButton = document.getElementById('cancel');
  let saveButton = document.getElementById('save');

  saveButton.addEventListener('click', saveNote);
  cancelButton.addEventListener('click', cancelNote);

  // To make the input container zoom-in animation
  inputContainer.classList.add('zoom-in');
}

function cancelNote() {
  let inputContainer = document.getElementById('input-container');
  if (inputContainer) {
    inputContainer.classList.add('zoom-out');
    setTimeout(() => {
      inputContainer.remove();
    }, 300)
  } else {
    inputContainer = document.getElementById('title-input-container');
    inputContainer.classList.add('zoom-out');
    setTimeout(() => {
      inputContainer.remove();
    }, 300)
  }
}

function saveNote() {
  let inputContainer = document.getElementById('input-container');
  let inputDescription = document.getElementById('description');

  if (inputDescription.value.trim() == '') { // trim() function used to remove whitespaces (spaces, tabs and newlines)
    return;
  }
  inputContainer.remove();
  mainContainer.appendChild(inputContainer);

  inputContainer.removeAttribute('id');
  inputContainer.setAttribute('id', 'title-input-container');

  inputContainer.innerHTML = `
      <input type="text" id="title-input" placeholder="Enter your note name here">
      <div>
        <button id="ok">OK</button>
        <button id="cancel">Cancel</button>
      </div>
    `;

  let noteTitle = document.getElementById('title-input')

  let cancelButton = document.getElementById('cancel');

  let okButton = document.getElementById('ok');

  cancelButton.addEventListener('click', cancelNote);
  okButton.addEventListener('click', confirmTitle);

  function confirmTitle() {
    if (noteTitle.value.trim() == '') {
      return;
    }
    inputContainer.classList.add('zoom-out');

    myNotes.unshift({ title: noteTitle.value, description: inputDescription.value });
    localStorage.setItem('myNotes', JSON.stringify(myNotes));

    setTimeout(() => {
      inputContainer.remove();
      displayMyNotes();
    }, 300)
  }
}

function displayMyNotes() {
  let innerHTML = '';
  myNotes.forEach((note, index) => {
    innerHTML += `
      <div class="my-note" id="${index}">
        <div class="note-title">${note.title}</div>
        <div class="buttons">
          <button class="note-buttons View" onclick="view(${index})" title="View"><img src="Images/view-icon.png" height="20px"></button>
          <button class="note-buttons Edit" onclick="edit(${index})" title="Edit"><img src="Images/edit.png" height="20px"></button>
          <button class="note-buttons Delete" onclick="remove(${index})" title="Delete"><img src="Images/delete-icon.png" height="20px"></button>
        </div>
      </div>
    `;
    noteContainer.innerHTML = innerHTML;
  });
}

function view(index) {
  let innerHTML = `
    <div id="preview" class="zoom-in">
      <div id="information">
        <div id="read-title">
          <b>Title:- </b> ${myNotes[index].title}
        </div>
        <b>Description:-</b>
        <div id="read-description">
          <pre>${myNotes[index].description}</pre>
        </div>
      </div>
      <button id="close">Close</button>
      </div>
  `;
  body.setAttribute('id', 'body');
  body.innerHTML = innerHTML;

  let closeButton = document.getElementById('close');
  closeButton.addEventListener('click', close);
}

function close() {
  let previewContainer = document.getElementById('preview');
  previewContainer.classList.add('zoom-out');
  setTimeout(() => {
    body.removeAttribute('id');
    body.prepend(header);
    body.appendChild(mainContainer);
    previewContainer.remove();
  }, 300)
}

function edit(index) {

  let description = myNotes[index].description;
  let title = myNotes[index].title;

  addNote();

  let descriptionValue = document.getElementById('description');
  descriptionValue.value = description;

  let saveButton = document.getElementById('save');

  saveButton.onclick = () => {
    let titleInput = document.getElementById('title-input');
    titleInput.value = title;
    let okButton = document.getElementById('ok');
    okButton.onclick = () => {
      myNotes.splice(index + 1, 1);
      localStorage.setItem('myNotes', JSON.stringify(myNotes));
      displayMyNotes();
    };
  };
}

function remove(index) {
  let myNote = document.getElementById(index);
  myNotes.splice(index, 1);
  localStorage.setItem('myNotes', JSON.stringify(myNotes));
  myNote.classList.add('zoom-out');
  setTimeout(() => {
    displayMyNotes()
  }, 300)
}