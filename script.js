// Your SheetBest API endpoint for the spreadsheet data
const API_URL =
  "https://api.sheetbest.com/sheets/32bbc4a0-25ba-44ae-835f-2b8e6d207b9a";

// Hold data arrays
let mantras = [];
let voiceMessages = [];
let moodPrompts = [];
let cyberTips = [];
let images = [];

let mantraIndex = 0;
let cyberTipIndex = 0;
let moodIndex = 0;

// DOM elements
const mantraTextEl = document.getElementById("mantraText");
const mantraAudioEl = document.getElementById("mantraAudio");
const nextMantraBtn = document.getElementById("nextMantraBtn");

const moodPromptEl = document.getElementById("moodPrompt");
const emojiContainer = document.getElementById("emojiContainer");

const cyberTipEl = document.getElementById("cyberTip");
const cyberImageEl = document.getElementById("cyberImage");
const nextCyberTipBtn = document.getElementById("nextCyberTipBtn");

// Fetch data from API
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data = await res.json();

    // data is an array of objects — map them to arrays for easier access
    mantras = data.map((row) => row.daily_mantra).filter(Boolean);
    voiceMessages = data.map((row) => row.voice_message).filter(Boolean);
    moodPrompts = data.map((row) => row.mood_prompt).filter(Boolean);
    cyberTips = data.map((row) => row.cyber_tip).filter(Boolean);
    images = data.map((row) => row.image_url).filter(Boolean);

    if (mantras.length === 0) mantras = ["No mantras available"];
    if (moodPrompts.length === 0) moodPrompts = ["No mood prompts available"];
    if (cyberTips.length === 0) cyberTips = ["No cyber tips available"];
    if (images.length === 0) images = [""];

    initUI();
  } catch (error) {
    console.error("Error loading data:", error);
    mantraTextEl.textContent = "Failed to load mantras.";
    moodPromptEl.textContent = "Failed to load mood prompts.";
    cyberTipEl.textContent = "Failed to load cyber tips.";
  }
}

// Initialize UI with fetched data
function initUI() {
  // Start with mantra and voice message
  showMantra();

  // Start mood prompt rotation
  showMoodPrompt();

  // Start cyber tip
  showCyberTip();
}

// Mantra & voice message rotate between text and audio
function showMantra() {
  const hasVoice = voiceMessages.length > 0;

  // Rotate daily mantra text and voice messages on button click
  const combinedLength = mantras.length + (hasVoice ? voiceMessages.length : 0);

  // Use mantraIndex to cycle through mantras and voiceMessages alternately:
  // Even indexes = mantra text, odd indexes = voice message

  if (combinedLength === 0) {
    mantraTextEl.textContent = "No mantras or voice messages available.";
    mantraAudioEl.style.display = "none";
    return;
  }

  if (mantraIndex % 2 === 0) {
    // Show mantra text, hide audio
    const mantraPos = Math.floor(mantraIndex / 2) % mantras.length;
    mantraTextEl.textContent = mantras[mantraPos];
    mantraAudioEl.style.display = "none";
    mantraAudioEl.pause();
    mantraAudioEl.src = "";
  } else {
    // Show voice message audio
    const voicePos = Math.floor(mantraIndex / 2) % voiceMessages.length;
    mantraTextEl.textContent = "";
    mantraAudioEl.style.display = "block";
    mantraAudioEl.src = voiceMessages[voicePos];
    mantraAudioEl.load();
    mantraAudioEl.play().catch(() => {});
  }
}

// On "Next" button click for mantras/voice
nextMantraBtn.addEventListener("click", () => {
  mantraIndex =
    (mantraIndex + 1) % (mantras.length + voiceMessages.length || 1);
  showMantra();
});

// Show current mood prompt
function showMoodPrompt() {
  if (moodPrompts.length === 0) {
    moodPromptEl.textContent = "No mood prompts available.";
    return;
  }
  moodPromptEl.textContent = moodPrompts[moodIndex];
}

// Emoji click handler
emojiContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("emoji")) return;

  // Reset all
  [...emojiContainer.children].forEach((emoji) => {
    emoji.setAttribute("aria-pressed", "false");
  });

  // Set clicked emoji as pressed
  e.target.setAttribute("aria-pressed", "true");
});

// Keyboard accessibility for emoji buttons
emojiContainer.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("emoji")) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.target.click();
  }
});

// Next cyber tip and image
function showCyberTip() {
  if (cyberTips.length === 0) {
    cyberTipEl.textContent = "No cyber tips available.";
    cyberImageEl.src = "";
    cyberImageEl.alt = "";
    return;
  }
  const idx = cyberTipIndex % cyberTips.length;
  cyberTipEl.textContent = cyberTips[idx];
  cyberImageEl.src = images[idx] || "";
  cyberImageEl.alt = cyberTips[idx];
}

nextCyberTipBtn.addEventListener("click", () => {
  cyberTipIndex = (cyberTipIndex + 1) % cyberTips.length;
  showCyberTip();
});

// Dark mode toggle
const modeToggle = document.getElementById("modeToggle");

// On load: set theme based on system preference or stored value
function setInitialTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("ww-theme");
  if (storedTheme) {
    document.body.classList.toggle("dark", storedTheme === "dark");
    modeToggle.checked = storedTheme === "dark";
  } else {
    document.body.classList.toggle("dark", prefersDark);
    modeToggle.checked = prefersDark;
  }
}

modeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", modeToggle.checked);
  localStorage.setItem("ww-theme", modeToggle.checked ? "dark" : "light");
});

// Init app
window.addEventListener("DOMContentLoaded", () => {
  setInitialTheme();
  fetchData();
});
