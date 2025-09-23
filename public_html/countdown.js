//function for updating a real-time countdown
function updateCountdown() {
    const countdownElements = document.querySelectorAll('[data-release]');

    //for each element with data-release field
    countdownElements.forEach(cd => {
        const releaseDate = new Date(cd.getAttribute('data-release'));
        const now = new Date();
        //substract current date from release date
        const diff = releaseDate - now;

        if (diff <= 0) {
            cd.textContent = 'Now Available!';
        } else {

        //math for days, hours, minutes, seconds
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        //replace element text content with countdown
        cd.textContent = `${days}d-${hours}h-${minutes}m-${seconds}s until release!`;
        }
    });
}

//update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();