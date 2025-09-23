// Script to handle everything related to the recently viewed feature, including the storage of book Ids in localStorage, the retrieval of ids, the API fetching from the server database, and rending of fetched data

// Function to save the current product page book ID in localStorage
window.saveViewedBook = function(bookID) {
    // Retrieve recently viewed array from local storage
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewedBooks")) || [];

    // Prepared retrieved data
    recentlyViewed = recentlyViewed.filter(id => id !== window.bookID);
    recentlyViewed.unshift(bookID);
    recentlyViewed = recentlyViewed.slice(0, 4);

    // Update local storage
    localStorage.setItem("recentlyViewedBooks", JSON.stringify(recentlyViewed));
    console.log("Saved ID!");
};

// Method for retrieving bookIds, API fetching information from server DB, rendering of recently viewed sections
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the list of bookIds
    const storedIds = localStorage.getItem('recentlyViewedBooks');

    // Return if no bookIds exist
    if (!storedIds) return;

    // Validate data for fetch, create a usable array
    let recentlyViewedIds;
    try {
        recentlyViewedIds = JSON.parse(storedIds);
        if (!Array.isArray(recentlyViewedIds) || recentlyViewedIds.length === 0) return;
    } catch (e) {
        console.warn('invalid recentlyViewedBooks data in localStorage');
        return;
    }

    // Remove current book from the list
    if (window.bookID) {
        recentlyViewedIds = recentlyViewedIds.filter(id => id !== window.bookID);
    }

    // Send validated IDs to the server, fetch matching book data from server DB
    fetch('/recentlyviewed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: recentlyViewedIds })
    })
        .then(response => response.json()) // Convert server response to usable json
        .then(books => {
            const container = document.getElementById('recently-viewed-placeholder');

            // Return if no container for recently view items exist on page
            if (!container || !Array.isArray(books) || books.length === 0) return;

            // For the first 3 books in the array
            books.slice(0, 3).forEach(book => {
                const bookEl = document.createElement('div');
                bookEl.className = 'col-md-4 col-6 py-3';

                // Create dynamic HTML cards to populate recently viewed section
                bookEl.innerHTML = `
                    <div class="card hover">
                        <img src="/images/${book.card_image}" alt="book placeholder" class="card-img-top img-fluid">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <p class="small text-muted">
                                    ${book.author}
                                </p>
                                <p class="small text-muted">
                                    ${book.genre}
                                </p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <h5 class="card-title">
                                    ${book.title}
                                </h5>
                                <h5>${book.price}
                                </h5>
                            </div>
                            <a href="/product/${book.id}" class="stretched-link"></a>
                        </div>
                    </div>
                `;

                // Render recently viewed section
                container.appendChild(bookEl);
            });
        })
        .catch(err => console.error('Error loading recently viewed books:', err));
});