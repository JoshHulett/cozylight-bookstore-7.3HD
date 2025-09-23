window.onload = submitValidation;

//function for disabling submit button until privacy policy is agreed to
function submitValidation() {
    const submitButton = document.getElementById('submitButton');
    const policyCheck = document.getElementById('privacyPolicy');

    submitButton.disabled = true;

    policyCheck.addEventListener('change', function () {
        submitButton.disabled = !policyCheck.checked;
    })
}

//function for validating input fields. Custom error messages. Includes custom validation checks for mobile, email, post code, etc.
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#queryForm");
    const reason = document.getElementById("reason");
    const firstname = document.getElementById("firstname");
    const surname = document.getElementById("surname");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");
    const address = document.getElementById("address");
    const state = document.getElementById("state");
    const postcode = document.getElementById("postcode");
    const custMessage = document.getElementById("customerMessage");

    form.addEventListener("submit", function (event) {
        removeError();

        let valid = true;

        if (reason.value === "") {
            showError(reason, "Please select a reason.");
            valid = false;
        }

        if (firstname.value.trim() === "") {
            showError(firstname, "First name cannot be left blank.");
            valid = false;
        }

        if (surname.value.trim() === "") {
            showError(surname, "Surname cannot be left blank.");
            valid = false;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email.value)) {
            showError(email, "Please enter a valid email address.");
            valid = false;
        }

        const mobilePattern = /^\d+$/;
        if (!mobilePattern.test(mobile.value)) {
            showError(mobile, "Please enter a valid mobile number.");
            valid = false;
        } else if (mobile.value.length > 10) {
            showError(mobile, "Mobile number can be no longer than 10 digits.");
            valid = false;
        }

        if (address.value.trim() === "") {
            showError(address, "Address cannot be left blank.");
            valid = false;
        }

        if (state.value === "") {
            showError(state, "Please select a State.");
            valid = false;
        }

        const postcodePattern = /^\d+$/;
        if (!postcodePattern.test(postcode.value)) {
            showError(postcode, "Please enter a valid Postcode.");
            valid = false;
        } else if (postcode.value.length !== 4) {
            showError(postcode, "Postcode must be 4 numbers long");
            valid = false;
        }

        if (custMessage.value.trim() === "") {
            showError(custMessage, "Please enter a message.");
            valid = false;
        }

        if (!valid) {
            event.preventDefault();
        }
    });

    function showError(input, message) {
        const feedback = input.nextElementSibling;
        input.classList.add("is-invalid");
        if (feedback && feedback.classList.contains("invalid-feedback")) {
            feedback.textContent = message;
        }
    }

    form.addEventListener("reset", function (event) {
        removeError();
        submitValidation();
    })
});

//function to remove error messages on resubmit/reset
function removeError() {
    const inputs = document.querySelectorAll('#queryForm .form-control, #queryForm .form-select');
    inputs.forEach(input => {
        input.classList.remove("is-invalid")
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains("invalid-feedback")) {
            feedback.textContent = "";
        }
    });
}



