// ✅ Wellness Wallet JavaScript
// API Endpoint
const API_URL =
  "https://api.sheetbest.com/sheets/32bbc4a0-25ba-44ae-835f-2b8e6d207b9a";

// Data arrays
let mantras = [];
let voiceMessages = [];
let moodPrompts = [];
let cyberTips = [];
let images = [];
let emojiVotes = { happy: 0, sad: 0, angry: 0, sleepy: 0, sick: 0 };

let mantraIndex = 0;
let cyberTipIndex = 0;
let moodIndex = 0;

// DOM elements
const mantraTextEl = document.getElementById("mantraText");
const mantraAudioEl = document.getElementById("mantraAudio");
const nextMantraBtn = document.getElementById("nextMantraBtn");

const moodPromptEl = document.getElementById("moodPrompt");
const emojiContainer = document.getElementById("emojiContainer");
const emojiResults = document.getElementById("emojiResults");

const cyberTipEl = document.getElementById("cyberTip");
const cyberImageEl = document.getElementById("cyberImage");
const nextCyberTipBtn = document.getElementById("nextCyberTipBtn");

// Fetch and initialize
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    mantras = data.map((r) => r.daily_mantra).filter(Boolean);
    voiceMessages = data.map((r) => r.voice_message).filter(Boolean);
    moodPrompts = data.map((r) => r.mood_prompt).filter(Boolean);
    cyberTips = data.map((r) => r.cyber_tip).filter(Boolean);
    images = data.map((r) => r.image_url).filter(Boolean);

    initUI();
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

function initUI() {
  showMantra();
  showMoodPrompt();
  showCyberTip();
}

function showMantra() {
  // Even indexes: mantra text; Odd indexes: voice message
  if (mantraIndex % 2 === 0) {
    const pos = Math.floor(mantraIndex / 2) % mantras.length;
    mantraTextEl.textContent = mantras[pos];
    mantraAudioEl.style.display = "none";
    mantraAudioEl.src = "";
    mantraAudioEl.pause();
  } else {
    const pos = Math.floor(mantraIndex / 2) % voiceMessages.length;
    mantraTextEl.textContent = "";
    mantraAudioEl.style.display = "block";
    mantraAudioEl.src = voiceMessages[pos];
    mantraAudioEl.load();
    mantraAudioEl.play().catch(() => {});
  }
}

nextMantraBtn.addEventListener("click", () => {
  mantraIndex = (mantraIndex + 1) % (mantras.length + voiceMessages.length);
  showMantra();
});

function showMoodPrompt() {
  if (moodPrompts.length > 0) {
    moodPromptEl.textContent = moodPrompts[moodIndex % moodPrompts.length];
  }
}

emojiContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("emoji")) return;

  const feeling = e.target.dataset.feeling;
  emojiVotes[feeling]++;
  e.target.classList.add("emoji-bounce");

  setTimeout(() => {
    e.target.classList.remove("emoji-bounce");
  }, 600);

  updateEmojiResults();
});

function updateEmojiResults() {
  const total = Object.values(emojiVotes).reduce((a, b) => a + b, 0);
  if (total === 0) {
    emojiResults.textContent = "No votes yet.";
    return;
  }
  const output = Object.entries(emojiVotes)
    .map(([emoji, count]) => `${emoji}: ${((count / total) * 100).toFixed(1)}%`)
    .join(" | ");
  emojiResults.textContent = output;
}

function showCyberTip() {
  const idx = cyberTipIndex % cyberTips.length;
  cyberTipEl.textContent = cyberTips[idx];
  cyberImageEl.src = images[idx] || "";
  cyberImageEl.alt = "Tip visual";
}

nextCyberTipBtn.addEventListener("click", () => {
  cyberTipIndex++;
  showCyberTip();
});

// Dark mode setup
const modeToggle = document.getElementById("modeToggle");
function setInitialTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("ww-theme");
  const useDark = storedTheme ? storedTheme === "dark" : prefersDark;
  document.body.classList.toggle("dark", useDark);
  modeToggle.checked = useDark;
}

modeToggle.addEventListener("change", () => {
  const useDark = modeToggle.checked;
  document.body.classList.toggle("dark", useDark);
  localStorage.setItem("ww-theme", useDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  setInitialTheme();
  fetchData();
});
