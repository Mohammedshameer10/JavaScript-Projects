const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");
let notes = document.querySelectorAll(".input-box");

// Create popup elements
const popup = document.createElement("div");
popup.className = "popup-container";
popup.innerHTML = `
    <div class="popup-content">
        <h3 id="popup-title">Create New Note</h3>
        <input type="text" class="popup-input-title" placeholder="Enter note title...">
        <textarea class="popup-input-content" placeholder="Enter your note..."></textarea>
        <div class="popup-buttons">
            <button class="done-btn">Done</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    </div>
`;
document.body.appendChild(popup);

function showNotes() {
    notesContainer.innerHTML = localStorage.getItem("notes") || '';
}

function updateStorage() {
    localStorage.setItem("notes", notesContainer.innerHTML);
}

function getFormattedDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'short' });
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${hours}:${minutes}`;
}

function createNote(title, content) {
    let inputBox = document.createElement("p");
    let deleteImg = document.createElement("img");
    let editImg = document.createElement("img");
    let timestamp = document.createElement("span");
    let titleSpan = document.createElement("span");
    let contentSpan = document.createElement("span");
    
    inputBox.className = "input-box";
    titleSpan.className = "title";
    titleSpan.setAttribute("contenteditable", "true");
    titleSpan.textContent = title;
    contentSpan.className = "content";
    contentSpan.setAttribute("contenteditable", "true");
    contentSpan.textContent = content;
    deleteImg.src = "images/delete.png";
    deleteImg.className = "delete-btn";
    editImg.src = "images/edit.png";
    editImg.className = "edit-btn";
    timestamp.className = "timestamp";
    timestamp.textContent = getFormattedDateTime();
    
    inputBox.appendChild(titleSpan);
    inputBox.appendChild(contentSpan);
    inputBox.appendChild(deleteImg);
    inputBox.appendChild(editImg);
    inputBox.appendChild(timestamp);
    
    notesContainer.appendChild(inputBox);
    updateStorage();
}

function setupPopupForEdit(note) {
    popup.style.display = "flex";
    const titleInput = popup.querySelector(".popup-input-title");
    const contentInput = popup.querySelector(".popup-input-content");
    const popupTitle = popup.querySelector("#popup-title");
    
    popupTitle.textContent = "Edit Note";
    titleInput.value = note.querySelector(".title").textContent;
    contentInput.value = note.querySelector(".content").textContent;
    titleInput.focus();

    // Temporarily override Done button for editing
    const doneBtn = popup.querySelector(".done-btn");
    const newDoneHandler = () => {
        if (contentInput.value.trim()) {
            note.querySelector(".title").textContent = titleInput.value.trim() || "Untitled";
            note.querySelector(".content").textContent = contentInput.value.trim();
            note.querySelector(".timestamp").textContent = getFormattedDateTime();
            updateStorage();
        }
        popup.style.display = "none";
        // Restore original Done handler after edit
        doneBtn.onclick = originalDoneHandler;
        popupTitle.textContent = "Create New Note";
    };
    
    doneBtn.onclick = newDoneHandler;
}

createBtn.addEventListener("click", () => {
    popup.style.display = "flex";
    const titleInput = popup.querySelector(".popup-input-title");
    const contentInput = popup.querySelector(".popup-input-content");
    const popupTitle = popup.querySelector("#popup-title");
    
    popupTitle.textContent = "Create New Note";
    titleInput.value = "";
    contentInput.value = "";
    titleInput.focus();
});

// Store original Done handler
const originalDoneHandler = () => {
    const titleInput = popup.querySelector(".popup-input-title");
    const contentInput = popup.querySelector(".popup-input-content");
    if (contentInput.value.trim()) {
        createNote(titleInput.value.trim() || "Untitled", contentInput.value.trim());
    }
    popup.style.display = "none";
};

popup.querySelector(".done-btn").addEventListener("click", originalDoneHandler);

popup.querySelector(".cancel-btn").addEventListener("click", () => {
    popup.style.display = "none";
    const popupTitle = popup.querySelector("#popup-title");
    popupTitle.textContent = "Create New Note";
});

notesContainer.addEventListener("click", function(e) {
    if (e.target.className === "delete-btn") {
        e.target.parentElement.remove();
        updateStorage();
    }
    else if (e.target.className === "edit-btn") {
        setupPopupForEdit(e.target.parentElement);
    }
});

notesContainer.addEventListener("keyup", function(e) {
    if (e.target.className === "title" || e.target.className === "content") {
        const note = e.target.parentElement;
        note.querySelector(".timestamp").textContent = getFormattedDateTime();
        updateStorage();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Enter" && popup.style.display !== "flex") {
        document.execCommand("insertLineBreak");
        event.preventDefault();
    }
});

showNotes();