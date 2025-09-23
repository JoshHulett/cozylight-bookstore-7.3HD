//script for implementing a fade-in animation when element in scrolled to
//listen for when the the HTML document has been completely parsed, then run function
document.addEventListener("DOMContentLoaded", () => {
    //select all elements with scroll-fade
    const faders = document.querySelectorAll(".scroll-fade");

    //use IntersectionObserver to watch each eleemnt with respect to the viewport
    const observer = new IntersectionObserver((onscreen, observer) => {
        onscreen.forEach(element => {
            //for each element, if it is onscreen, make it visible and stop watching it
            if (element.isIntersecting) {
                element.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, 
    
    //how much of the element needs to be intersected with viewport
    {
        threshold: 0.2
    });

    //for each eleemnt with scrollfade, observe with IntersectionObserver
    faders.forEach(scrollFade => observer.observe(scrollFade));
});