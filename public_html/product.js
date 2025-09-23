//once HTML is parsed, checks format option, sets price. Whenever a new selection is checked, rechecks and sets new price
document.addEventListener("DOMContentLoaded", () => {
    const formatOption = document.querySelectorAll("input[name='format']");
    const priceDisplay = document.getElementById('priceDisplay');

    const updatePrice = () => {
        const selectedOption = document.querySelector("input[name='format']:checked");
        if (selectedOption) {
            const selectedPrice = selectedOption.getAttribute('data-price');
            priceDisplay.innerHTML = `<strong>$${selectedPrice}</strong>`;
        }
    };

    updatePrice();

    formatOption.forEach(option => {
        option.addEventListener('change', updatePrice);
    });
});