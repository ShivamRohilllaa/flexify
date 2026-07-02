/* ============================================================
   Flexiphy Physiotherapy — interactivity
   ============================================================ */

// ---------- Services data ----------
const SERVICES = [
  ["Back Pain", "Targeted therapy for chronic and acute lower / upper back pain."],
  ["Knee Pain", "Rehabilitation for knee injuries, arthritis and post-surgery recovery."],
  ["Shoulder Pain", "Frozen shoulder, rotator cuff and mobility restoration."],
  ["Hip Pain", "Assessment and treatment for hip mobility and joint discomfort."],
  ["Foot & Ankle Pain", "Sprains, plantar fasciitis and post-fracture rehab."],
  ["Arthritis Treatment", "Manage pain, stiffness and improve joint function."],
  ["Spinal Injuries", "Structured recovery programs for spinal conditions."],
  ["Post-surgical Rehab", "Guided rehabilitation after orthopaedic surgery."],
  ["Neurological Physiotherapy", "Stroke, Parkinson's and neurological rehab."],
  ["Paediatric Physiotherapy", "Gentle therapy for children with developmental needs."],
  ["Geriatric Physiotherapy", "Balance, strength and independence for seniors."],
  ["Vestibular Rehabilitation", "Vertigo, dizziness and balance disorder therapy."],
  ["Balance Exercise Therapy", "Prevent falls and rebuild postural stability."],
  ["Therapeutic Exercise", "Customised exercise plans for lasting recovery."],
  ["Physical Therapy", "General physiotherapy for pain, posture and performance."],
];

const ARROW_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>';

const servicesGrid = document.getElementById("servicesGrid");
SERVICES.forEach(([name, desc], i) => {
  const card = document.createElement("a");
  card.className = "service";
  card.href = "#book";
  card.setAttribute("data-reveal", "");
  card.setAttribute("data-reveal-delay", String((i % 3) * 90));
  card.innerHTML = `
    <span class="service__num">${String(i + 1).padStart(2, "0")}</span>
    <span class="service__arrow" aria-hidden="true">${ARROW_SVG}</span>
    <h3>${name}</h3>
    <p>${desc}</p>
  `;
  servicesGrid.appendChild(card);
});

// Populate the booking form's service dropdown
const serviceSelect = document.getElementById("service");
SERVICES.forEach(([name]) => {
  const option = document.createElement("option");
  option.textContent = name;
  serviceSelect.appendChild(option);
});

// ---------- Sticky header shadow ----------
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}, { passive: true });

// ---------- Mobile navigation ----------
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------- Active nav link on scroll ----------
const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".nav__link")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) =>
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`)
      );
    });
  },
  { rootMargin: "-35% 0px -60% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = Number(el.dataset.revealDelay || 0);
      setTimeout(() => el.classList.add("is-visible"), delay);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

// Safety net: never leave content hidden (e.g. anchored deep-links, old browsers)
setTimeout(() => {
  document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => el.classList.add("is-visible"));
}, 2500);

// ---------- Booking form ----------
const form = document.getElementById("bookingForm");
const success = document.getElementById("formSuccess");

// Disallow past dates in the date picker
document.getElementById("date").min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Send the request via WhatsApp so the clinic actually receives it
  const data = new FormData(form);
  const message = [
    "New appointment request — Flexiphy",
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    data.get("email") ? `Email: ${data.get("email")}` : null,
    `Service: ${data.get("service")}`,
    `Preferred date: ${data.get("date")}`,
    `Preferred time: ${data.get("time")}`,
    data.get("notes") ? `Notes: ${data.get("notes")}` : null,
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/918368063702?text=${encodeURIComponent(message)}`, "_blank");

  success.hidden = false;
  form.reset();
  setTimeout(() => (success.hidden = true), 8000);
});
