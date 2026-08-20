const WHATSAPP_NUMBER = "601XXXXXXXX";

const siteHeader = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
}

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  siteNav?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
  const opening = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(opening));
  siteNav?.classList.toggle("open", opening);
  document.body.classList.toggle("menu-open", opening);
});

siteNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function updateHeader() {
  siteHeader?.classList.toggle("scrolled", window.scrollY > 35);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const portfolioFilters = document.querySelectorAll("[data-filter]");
const portfolioItems = document.querySelectorAll(".portfolio-item[data-category]");

portfolioFilters.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    portfolioFilters.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    portfolioItems.forEach((item) => {
      const categories = item.dataset.category.split(" ");
      item.classList.toggle("hidden", category !== "all" && !categories.includes(category));
    });
  });
});

document.querySelectorAll("[data-before-after]").forEach((comparison) => {
  const range = comparison.querySelector('input[type="range"]');
  if (!range) return;
  const update = () => comparison.style.setProperty("--position", `${range.value}%`);
  range.addEventListener("input", update);
  update();
});

const enquirySection = document.querySelector("#enquiry");
const styleSelect = document.querySelector("#wedding-style");
const packageSelect = document.querySelector("#package-interest");
const locationInput = document.querySelector("#location");
const messageInput = document.querySelector("#message");

function goToEnquiry(field) {
  enquirySection?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => field?.focus({ preventScroll: true }), 650);
}

document.querySelectorAll("[data-style-select]").forEach((button) => {
  button.addEventListener("click", () => {
    if (styleSelect) styleSelect.value = button.dataset.styleSelect;
    showToast(`${button.dataset.styleSelect} added to your enquiry.`);
    goToEnquiry(styleSelect);
  });
});

document.querySelectorAll("[data-package-select]").forEach((button) => {
  button.addEventListener("click", () => {
    if (packageSelect) packageSelect.value = button.dataset.packageSelect;
    showToast(`${button.dataset.packageSelect} package selected. Add your wedding details below.`);
    goToEnquiry(packageSelect);
  });
});

document.querySelectorAll("[data-venue-select]").forEach((button) => {
  button.addEventListener("click", () => {
    const venue = button.dataset.venueSelect;
    if (locationInput) locationInput.value = venue;
    if (messageInput && !messageInput.value) messageInput.value = `Please include availability and venue details for: ${venue}.`;
    showToast("Venue interest added to your enquiry.");
    goToEnquiry(locationInput);
  });
});

function whatsappIsConfigured() {
  return /^601\d{7,9}$/.test(WHATSAPP_NUMBER);
}

async function openWhatsApp(message) {
  if (whatsappIsConfigured()) {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    return true;
  }
  try {
    await navigator.clipboard.writeText(message);
    showToast("Enquiry copied. Add the real WhatsApp number in script.js to open WhatsApp automatically.");
  } catch {
    showToast("Add the real WhatsApp number in script.js to activate enquiries.");
  }
  return false;
}

document.querySelectorAll("[data-whatsapp-direct]").forEach((button) => {
  button.addEventListener("click", () => {
    openWhatsApp("Hi EverAfter! I’d like to check my wedding date and learn about your packages. Could you guide me on the details you need?");
  });
});

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(`${link.dataset.placeholderLink} is a placeholder. Add the real business or venue link before publishing.`);
  });
});

const dateField = document.querySelector("#wedding-date");
if (dateField) {
  const now = new Date();
  dateField.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
}

document.querySelector("#enquiry-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "Hi EverAfter! I’d like to check my wedding date and package options.",
    "",
    `Name: ${data.get("name")}`,
    `WhatsApp: ${data.get("whatsapp")}`,
    `Wedding date: ${data.get("date")}`,
    `Location: ${data.get("location")}`,
    `Estimated pax: ${data.get("pax")}`,
    `Event: ${data.get("eventType")}`,
    `Venue booked: ${data.get("venueBooked")}`,
    `Approximate budget: ${data.get("budget")}`,
    `Preferred style: ${data.get("style")}`,
    `Package interest: ${data.get("package") || "Not selected"}`,
    `Message: ${data.get("message") || "No additional message"}`,
    "",
    "Please let me know whether the date is available and share the relevant package details. Thank you!"
  ].join("\n");
  openWhatsApp(message);
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -35px" });
  revealItems.forEach((item) => observer.observe(item));
}

document.querySelector("#year").textContent = new Date().getFullYear();
