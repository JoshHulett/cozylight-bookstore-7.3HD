// timeout for notifications
let notificationTimeout;

document.addEventListener("DOMContentLoaded", () => {
    // load wishlist from localStorage if one exists
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // populates section with stored book Ids
    displayWishList();
    // set correct heart icon state for each book product
    updateWishlistIcons();

    // listener event for heart icons on books
    document.addEventListener("click", (event) => {
        // get the closest heart button from click
        const button = event.target.closest(".wishlist-heart");
        if (!button) return;
        // retrieve the book id and current img element
        const bookID = button.getAttribute("data-id");
        const img = button.querySelector("img");

        // if in wishlist, set to a filled heart. If not, set to an empty heart
        img.src = wishlist.includes(bookID) ? "/images/heart_fill.png" : "/images/heart_empty.png";

        // add or remove book from wishlist
        toggleWishlist(bookID, img);
    });
});

// properly updatesWishlistIcons. Essential for ensuring icons are updated dynamically
function updateWishlistIcons() {
    // syncs heart icon with proper state based on wishlist
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    document.querySelectorAll(".wishlist-heart").forEach(button => {
        const bookID = button.getAttribute("data-id");
        const img = button.querySelector("img");
        img.src = wishlist.includes(bookID) ? "/images/heart_fill.png" : "/images/heart_empty.png";
    });
}

// adds or removes bookId from localStorage wishlist
function toggleWishlist(bookID, img) {
    // open wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.includes(bookID)) {
        // Remove book if it already exists
        wishlist = wishlist.filter(id => id !== bookID);
        img.src = "/images/heart_empty.png";
        showNotification("Removed book from wishlist");
    } else {
        // add book if it doesnt exist
        wishlist.push(bookID);
        img.src = "/images/heart_fill.png";
        showNotification("Added book to your wishlist");
    }

    // update wishlist
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    // rerender wishlist section to match updated wishlist
    displayWishList();
    // update icons
    updateWishlistIcons();
};

// removes a book from the wishlist while bypassing toggle logic, used for wishlist section
function removeFromWishlist(bookID) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // debug
    console.log("Before removal:", wishlist);
    console.log("here is bookID:", bookID);

    wishlist = wishlist.filter(id => id !== bookID);

    console.log("After removal:", wishlist);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    showNotification("Removed book from wishlist");

    displayWishList();
};

// displayed a temporary notification reflecting wishlist change when called
function showNotification(message) {
    const notification = document.getElementById("wishlist-notification");
    notification.textContent = message;
    notification.classList.remove("hidden");
    notification.classList.add("show");

    // notification lasts 2 seconds
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 2000);
};

// fetch and render all books currently in wishlist
function displayWishList() {
    // retrieve bookIds in wishlsit from local storage
    const storedIds = localStorage.getItem('wishlist');

    if (!storedIds) return;

    let wishlistIds;
    try {
        wishlistIds = JSON.parse(storedIds);
        if (!Array.isArray(wishlistIds) || wishlistIds.length === 0) return;
    } catch (e) {
        console.warn('Invalid wishlist data in localStorage');
        return;
    }

    // fetch book data for wishlist items from the server book database
    fetch('/wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: wishlistIds })
    })
        .then(response => response.json())
        .then(books => {
            // retrieve container for wishlist section
            const container = document.getElementById('wishlist-placeholder');

            container.innerHTML = "";

            // validates container exists, returns if no wishlist section on page
            if (!container || !Array.isArray(books) || books.length === 0) {
                container.innerHTML = "<p>Your wishlist is empty!</p>";
                return;
            }

            // Generates a product card for each book in the wishlsit
            books.forEach(book => {
                const bookEl = document.createElement('div');
                bookEl.className = 'col-md-4 col-6 py-3';
                bookEl.innerHTML = `
                <div class="card hover">
                        <div class="product-image-container">
                            <img src="images/${book.card_image}" alt="book placeholder"
                                class="card-img-top img-fluid">
                            <button class="wishlist-heart hover" data-id="${book.id}">
                                <img src="/images/heart_fill.png" alt="wishlist" class="wishlist-icon">
                            </button>
                        </div>
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

                // ensure wishlist-heart icon is correctly filled for products in wishlist section
                const img = bookEl.querySelector(".wishlist-heart img");
                if (wishlistIds.includes(book.id)) {
                    img.src = "/images/heart_fill.png";
                }

                // render updated container
                container.appendChild(bookEl);
            });
        })
        .catch(err => console.error('Error loading wishlist books:', err));
};