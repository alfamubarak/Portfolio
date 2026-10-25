/**
 * Contact form
 * ---------------------------------------------------------------------------
 * Front-end validation only — no message is sent anywhere.
 */

const form = document.getElementById("contact-form");
const successMessage = document.getElementById("form-success");
const inputs = [...form.querySelectorAll(".field__input")];

function validate(input) {
    const value = input.value.trim();

    if (!value) return "This field is required.";

    if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Please enter a valid email address.";
    }

    if (input.type === "tel" && !/^\d+$/.test(value)) {
        return "Phone number must contain digits only.";
    }

    return "";
}

function showError(input, message) {
    const error = document.getElementById(`${input.id}-error`);

    input.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
    error.hidden = !message;
}

inputs.forEach((input) => {
    input.addEventListener("input", () => {
        showError(input, "");
        successMessage.hidden = true;
    });
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    let firstInvalid = null;

    inputs.forEach((input) => {
        const message = validate(input);
        showError(input, message);

        if (message && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }

    form.reset();
    successMessage.hidden = false;
});
