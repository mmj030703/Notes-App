const notesArray = JSON.parse(localStorage.getItem('notes')) || [];

const addBtn = document.querySelector('.addNotes');
const saveBtn = document.querySelector('.save');
const notesPopupCloseBtn = document.querySelector('.close');
const notesPopup = document.querySelector('.notes_popup');
const notesContainer = document.querySelector('.notes_container');
const accountImage = document.querySelector('.account_image');
const accountMenu = document.querySelector('.account_menu');

let menuOpened = false;


const addNotesHandler = (eventObj) => {
    notesPopup.style.display = "flex";
    document.body.style.overflow = "hidden";
};

const changeNoteValue = (oldNoteValue, newNoteValue) => {
    notesArray.forEach(note => {
        if (note.noteValue.includes(oldNoteValue)) {
            note.noteValue = newNoteValue;
            localStorage.setItem('notes', JSON.stringify(notesArray));
        }
    });
};

const viewNote = (e, noteText) => {
    document.body.style.overflow = "hidden";

    const viewNoteContainer = document.createElement('div');
    const viewNote = document.createElement('div');
    const viewNoteText = document.createElement('textarea');
    const closeBtn = document.createElement('button');
    const editNoteBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    viewNoteContainer.classList.add('view_note_popup');
    viewNote.classList.add('view_note');
    viewNoteText.classList.add('view_note_text');
    closeBtn.classList.add('close');
    editNoteBtn.classList.add('edit');
    deleteBtn.classList.add('delete');

    viewNoteContainer.style.display = "flex";
    viewNoteText.style.marginTop = "1.8rem";
    viewNoteText.innerHTML = noteText;
    viewNoteText.setAttribute('readonly', 'true');
    closeBtn.innerHTML = `<i class="fa-regular fa-circle-xmark"></i>`;
    editNoteBtn.textContent = "Edit note";
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    viewNote.append(closeBtn, viewNoteText, editNoteBtn, deleteBtn);
    viewNoteContainer.append(viewNote);

    document.body.append(viewNoteContainer);

    closeBtn.addEventListener('click', () => {
        viewNoteContainer.style.display = "none";
        document.body.style.overflow = "visible";
    });

    editNoteBtn.addEventListener('click', () => {
        viewNoteText.removeAttribute('readonly');
        viewNoteText.style.border = "2px solid #8f8989";
        viewNoteText.focus();
        viewNoteText.setSelectionRange(viewNoteText.value.length, viewNoteText.value.length);
        editNoteBtn.textContent = 'Save';
        deleteBtn.remove();
        editNoteBtn.addEventListener('click', () => {
            const note = e.target.closest('.note');
            const textarea = note.firstElementChild;

            changeNoteValue(textarea.value, viewNoteText.value);

            textarea.value = viewNoteText.value;
            viewNoteContainer.style.display = "none";
            document.body.style.overflow = "visible";
        })
    });

    deleteBtn.addEventListener('click', () => {
        const textarea = e.target;
        textarea.closest('.note').remove();
        viewNoteContainer.style.display = "none";

        let index;
        notesArray.forEach(note => {
            if (note.noteValue === textarea.value) {
                index = notesArray.indexOf(note);
            }
        });
        notesArray.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notesArray));
        document.body.style.overflow = "visible";
    });
};

const appendNote = (noteText) => {
    const noteElement = document.createElement('div');
    const noteValue = document.createElement('textarea');

    noteElement.classList.add('note');

    noteValue.textContent = noteText;
    noteValue.setAttribute('readonly', 'true');
    noteElement.append(noteValue);
    notesContainer.append(noteElement);

    noteElement.addEventListener('click', (e) => {
        viewNote(e, e.target.value);
    });
}

const saveNoteHandler = (eventObj) => {
    notesPopup.style.display = "none";
    const textarea = document.querySelector('.note_text');
    const noteText = textarea.value;
    appendNote(noteText);

    const noteObj = {
        noteValue: noteText
    }
    notesArray.push(noteObj);
    localStorage.setItem('notes', JSON.stringify(notesArray));

    textarea.value = "";

    document.body.style.overflow = "visible";
};

const notesPopupCloseBtnHandler = (eventObj) => {
    notesPopup.style.display = "none";
    document.querySelector('.note_text').value = "";

    document.body.style.overflow = "visible";
}

const toggleMenu = (e) => {
    if (!menuOpened) {
        accountMenu.style.display = "block"
        menuOpened = true;
    }
    else {
        accountMenu.style.display = "none"
        menuOpened = false;
    }
}

const closeMenu = (e) => {
    if (!e.target.matches('.account_image') && !e.target.matches('.item1') && !e.target.matches('.item2')) {
        if (menuOpened) {
            accountMenu.style.display = "none"
            menuOpened = false;
        }
    }
}

notesArray.forEach(note => {
    const noteValue = note.noteValue;
    appendNote(noteValue);
});

addBtn.addEventListener('click', addNotesHandler);
saveBtn.addEventListener('click', saveNoteHandler);
notesPopupCloseBtn.addEventListener('click', notesPopupCloseBtnHandler);
accountImage.addEventListener('click', toggleMenu);

window.addEventListener('click', closeMenu)

