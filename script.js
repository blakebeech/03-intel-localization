// Language and direction (LTR/RTL) helper
// This runs when the page loads and updates the HTML language settings.

const languageSelect = document.getElementById("languageSelect");
const dirStatus = document.getElementById("dirStatus");
const rtlStylesheet = document.getElementById("bootstrap-rtl");
const subscribeForm = document.querySelector(
	'section[aria-labelledby="subscribe-title"] form'
);
const emailInput = document.getElementById("subscribe-email");
const formMessage = document.getElementById("formMessage");

// Return true if the language should be right-to-left.
function isRtlLanguage(lang) {
	const rtlPrefixes = ["ar", "he", "fa", "ur"];
	return rtlPrefixes.some((prefix) => lang.startsWith(prefix));
}

// Apply the language and direction to the page.
function applyLanguage(lang) {
	const isRtl = isRtlLanguage(lang);

	document.documentElement.lang = lang;
	document.documentElement.dir = isRtl ? "rtl" : "ltr";

	if (languageSelect) {
		languageSelect.value = lang;
	}

	if (dirStatus) {
		dirStatus.textContent = isRtl ? "RTL" : "LTR";
	}

	if (rtlStylesheet) {
		rtlStylesheet.disabled = !isRtl;
	}
}

// Decide the initial language.
function getInitialLanguage() {
	const saved = localStorage.getItem("preferredLanguage");
	if (saved) {
		return saved;
	}
	return navigator.language || "en";
}

// Initialize on page load.
const initialLanguage = getInitialLanguage();
applyLanguage(initialLanguage);

// Listen for changes in the language select.
if (languageSelect) {
	languageSelect.addEventListener("change", (event) => {
		const selectedLanguage = event.target.value;
		applyLanguage(selectedLanguage);
		localStorage.setItem("preferredLanguage", selectedLanguage);
	});
}

// Subscribe form validation
if (subscribeForm && emailInput && formMessage) {
	subscribeForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const emailValue = emailInput.value.trim();
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValidEmail = emailPattern.test(emailValue);

		if (!emailValue || !isValidEmail) {
			formMessage.textContent = "Please enter a valid email address.";
			formMessage.classList.remove("text-success");
			formMessage.classList.add("text-danger");
			emailInput.classList.add("is-invalid");
			emailInput.setAttribute("aria-invalid", "true");
			emailInput.focus();
			return;
		}

		emailInput.classList.remove("is-invalid");
		emailInput.removeAttribute("aria-invalid");
		formMessage.textContent = "Thanks for subscribing! Please check your email.";
		formMessage.classList.remove("text-danger");
		formMessage.classList.add("text-success");
		subscribeForm.reset();
	});
}
