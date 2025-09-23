// Initialises the IndexedDB database, gets it ready for use
function initiateDB() {
    // open new or existing db called "ReviewsDB"
    let request = indexedDB.open("ReviewsDB", 1);

    // Create new db if it does not already exist
    request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("reviews")) {
            db.createObjectStore("reviews", { keyPath: "bookId" });
        }
    };

    // notifies if successful
    request.onsuccess = function (event) {
        console.log("IndexedDB initialised successfully!");
    };

    // notifies if theres an error
    request.onerror = function (event) {
        console.error("Error opening database", event.target.error);
    };
}

// Saves draft information into the database when called
function saveDraft(bookId, title, content) {
    let request = indexedDB.open("ReviewsDB", 1);

    // print db to console, used for debugging
    printIndexedDBContents();

    request.onsuccess = function (event) {
        let db = event.target.result;

        // Create a transaction with read.write access
        let tx = db.transaction("reviews", "readwrite");
        let store = tx.objectStore("reviews");

        // Create a draft object in acceptable format
        const now = new Date().toISOString();
        let draft = { id: bookId, bookId: bookId, reviewTitle: title, content: content, timestamp: now };

        // Save the draft
        store.put(draft);

        // Log outcome
        tx.oncomplete = () => console.log("Draft saved successfully!");
        tx.onerror = (event) => console.error("Error saving draft", event.target.error);
    };
}

// Loads a draft from database when called using a bookId
function loadDraft(bookId, callback) {
    let request = indexedDB.open("ReviewsDB", 1);

    request.onsuccess = function (event) {
        let db = event.target.result;
        let tx = db.transaction("reviews", "readonly");
        let store = tx.objectStore("reviews");

        // Retrieve the draft matching the bookId with callback
        let getRequest = store.get(bookId);
        getRequest.onsuccess = function () {
            if (getRequest.result) {
                callback(getRequest.result);
            } else {
                console.log("No draft found");
                callback({ content: "", bookId: "" });
            }
        };
    };
}

// Deletes a draft from the database when called using a bookId
function deleteDraft(id) {
    let request = indexedDB.open("ReviewsDB", 1);

    request.onsuccess = function (event) {
        let db = event.target.result;
        let tx = db.transaction("reviews", "readwrite");
        let store = tx.objectStore("reviews");

        // Delete the draft object containing the corresponding bookId
        store.delete(id);

        tx.oncomplete = () => console.log("Draft deleted successfullt!");
    };
}

// Event listener for save, load, and delete buttons
document.addEventListener("DOMContentLoaded", () => {
    initiateDB();

    // Save draft button logic
    document.getElementById("saveDraftButton").addEventListener("click", () => {
        // get input field values
        const bookId = document.getElementById("book").value;
        const reviewTitle = document.getElementById("title").value;
        const reviewContent = document.getElementById("review").value;

        // validates that all input fields have values
        if (!bookId || !reviewTitle || !reviewContent) {
            alert("Please fill in all fields before saving the draft.");
            return;
        }

        // calls saveDraft, provides inputs
        saveDraft(bookId, reviewTitle, reviewContent);
        alert("Draft saved!");
    });

    // Load draft button logic
    document.getElementById("loadDraftButton").addEventListener("click", () => {
        // get bookId from select input field
        const bookId = document.getElementById("book").value;

        // validates bookId exists
        if (!bookId) {
            alert("Select a book to load its draft.");
            return;
        }

        // calls loadDraft with bookId, gets values of other input fields
        loadDraft(bookId, (draft) => {
            if (!draft) {
                alert("No draft found for this book.");
                return;
            }
            console.log(draft);
            document.getElementById("title").value = draft.reviewTitle;
            document.getElementById("review").value = draft.content;
        });
    });

    // Delete button logic
    document.getElementById("deleteDraftButton").addEventListener("click", () => {
        // get bookid from select input field
        const bookId = document.getElementById("book").value;

        // validates bookId exists
        if (!bookId) {
            alert("Select a book to delete its draft.");
            return;
        }

        // calls deleteDraft on object with bookId
        deleteDraft(bookId);
        alert("Draft deleted");
    });
});

// function for debugging, prints indexedDB contents
function printIndexedDBContents() {
    let request = indexedDB.open("ReviewsDB", 1);

    request.onsuccess = function (event) {
        let db = event.target.result;
        let tx = db.transaction("reviews", "readonly");
        let store = tx.objectStore("reviews");

        let cursorRequest = store.openCursor();

        // Use a cursor to iterate through all saved drafts and print them
        cursorRequest.onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                console.log("Review ID:", cursor.value.id);
                console.log("Book ID:", cursor.value.bookId);
                console.log("Review Title:", cursor.value.reviewTitle);
                console.log("Review Content:", cursor.value.content);
                console.log("Timestamp:", cursor.value.timestamp);
                console.log("----------------------");

                cursor.continue();
            } else {
                console.log("Finished printing IndexedDB contents.");
            }
        };

        cursorRequest.onerror = function (event) {
            console.error("Error reading IndexedDB:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error opening database:", event.target.error);
    };
}