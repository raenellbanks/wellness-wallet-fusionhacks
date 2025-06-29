// SheetBest API for your Google Sheet
const API_URL =
  "https://api.sheetbest.com/sheets/32bbc4a0-25ba-44ae-835f-2b8e6d207b9a";

// Data arrays
let mantras = [],
  voiceMessages = [],
  moodPrompts = [],
  cyberTips = [],
  images = [];
let mantraIndex = 0,
  cyberTipIndex = 0,
  moodIndex = 0;

// Elements
const mantraTextEl = document.getElementById("mantraText");
const mantraAudioEl = document.getElementById("mantraAudio");
const nextMantraBtn = document.getElementById("nextMantraBtn");

const moodPromptEl = document.getElementById("moodPrompt");
const emojiContainer = document.getElementById("emojiContainer");

const cyberTipEl = document.getElementById("cyberTip");
const cyberImageEl = document.getElementById("cyberImage");
const nextCyberTipBtn = document.getElementById("nextCyberTipBtn");

const modeToggle = document.getElementById("modeToggle");

// Fetch data from SheetBest
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    mantras = data.map((row) => row.daily_mantra).filter(Boolean);
    voiceMessages = data.map((row) => row.voice_message).filter(Boolean);
    moodPrompts = data.map((row) => row.mood_prompt).filter(Boolean);
    cyberTips = data.map((row) => row.cyber_tip).filter(Boolean);
    images = data.map((row) => row.image_url).filter(Boolean);

    if (!mantras.length) mantras = ["You're enough just as you are 💛"];
    if (!moodPrompts.length) moodPrompts = ["How are you feeling today, sis?"];
    if (!cyberTips.length) cyberTips = ["Stay safe online. 💻"];
    if (!images.length) images = [""];

    initUI();
  } catch (err) {
    console.error("Fetch failed:", err);
    mantraTextEl.textContent = "Failed to load mantras.";
    moodPromptEl.textContent = "Failed to load mood prompts.";
    cyberTipEl.textContent = "Failed to load cyber tips.";
  }
}

// Init interface
function initUI() {
  showMantra();
  showMoodPrompt();
  showCyberTip();
}

// Show next mantra or voice message
function showMantra() {
  const combinedLength = mantras.length + voiceMessages.length;
  if (combinedLength === 0) {
    mantraTextEl.textContent = "No mantras or audio today.";
    mantraAudioEl.style.display = "none";
    return;
  }

  if (mantraIndex % 2 === 0) {
    const index = Math.floor(mantraIndex / 2) % mantras.length;
    mantraTextEl.textContent = mantras[index];
    mantraAudioEl.style.display = "none";
    mantraAudioEl.pause();
    mantraAudioEl.src = "";
  } else {
    const index = Math.floor(mantraIndex / 2) % voiceMessages.length;
    mantraTextEl.textContent = "";
    mantraAudioEl.style.display = "block";
    mantraAudioEl.src = voiceMessages[index];
    mantraAudioEl.load();
    mantraAudioEl.play().catch(() => {});
  }
}

nextMantraBtn.addEventListener("click", () => {
  mantraIndex = (mantraIndex + 1) % (mantras.length + voiceMessages.length);
  showMantra();
});

// Show mood prompt
function showMoodPrompt() {
  moodPromptEl.textContent = moodPrompts[moodIndex % moodPrompts.length];
}

// Emoji button clicks
emojiContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("emoji")) return;
  [...emojiContainer.children].forEach((el) =>
    el.setAttribute("aria-pressed", "false")
  );
  e.target.setAttribute("aria-pressed", "true");
});

// Keyboard emoji selection
emojiContainer.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("emoji")) return;
  if (["Enter", " "].includes(e.key)) {
    e.preventDefault();
    e.target.click();
  }
});

// Show tip and image
function showCyberTip() {
  const i = cyberTipIndex % cyberTips.length;
  cyberTipEl.textContent = cyberTips[i];
  cyberImageEl.src = images[i] || "";
  cyberImageEl.alt = "Cyber Tip";
}

nextCyberTipBtn.addEventListener("click", () => {
  cyberTipIndex = (cyberTipIndex + 1) % cyberTips.length;
  showCyberTip();
});

// Dark mode setup
function setInitialTheme() {
  const stored = localStorage.getItem("ww-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = stored === "dark" || (!stored && prefersDark);
  document.body.classList.toggle("dark", useDark);
  modeToggle.checked = useDark;
}

modeToggle.addEventListener("change", () => {
  const isDark = modeToggle.checked;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("ww-theme", isDark ? "dark" : "light");
});

// Start app
window.addEventListener("DOMContentLoaded", () => {
  setInitialTheme();
  fetchData();
});
