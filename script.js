const API_URL =
  "https://api.sheetbest.com/sheets/32bbc4a0-25ba-44ae-835f-2b8e6d207b9a";

let mantras = [];
let voiceMessages = [];
let moodPrompts = [];
let cyberTips = [];
let images = [];

let mantraIndex = 0;
let cyberTipIndex = 0;
let moodIndex = 0;
const emojiCounts = {
  happy: 0,
  sad: 0,
  angry: 0,
  sleepy: 0,
  sick: 0,
};

const mantraTextEl = document.getElementById("mantraText");
const mantraAudioEl = document.getElementById("mantraAudio");
const nextMantraBtn = document.getElementById("nextMantraBtn");
const playMantraBtn = document.getElementById("playMantraBtn");

const moodPromptEl = document.getElementById("moodPrompt");
const emojiContainer = document.getElementById("emojiContainer");
const emojiStatsEl = document.getElementById("emojiStats");

const cyberTipEl = document.getElementById("cyberTip");
const cyberImageEl = document.getElementById("cyberImage");
const nextCyberTipBtn = document.getElementById("nextCyberTipBtn");
const modeToggle = document.getElementById("modeToggle");

async function fetchData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  mantras = data.map((row) => row.daily_mantra).filter(Boolean);
  voiceMessages = data.map((row) => row.voice_message).filter(Boolean);
  moodPrompts = data.map((row) => row.mood_prompt).filter(Boolean);
  cyberTips = data.map((row) => row.cyber_tip).filter(Boolean);
  images = data.map((row) => row.image_url).filter(Boolean);

  initUI();
}

function initUI() {
  showMantra();
  showMoodPrompt();
  showCyberTip();
}

function showMantra() {
  if (mantras.length === 0) return;
  const idx = mantraIndex % mantras.length;
  mantraTextEl.textContent = mantras[idx];
  mantraAudioEl.src = voiceMessages[idx % voiceMessages.length] || "";
}

nextMantraBtn.addEventListener("click", () => {
  mantraIndex++;
  showMantra();
});

playMantraBtn.addEventListener("click", () => {
  if (mantraAudioEl.src) {
    mantraAudioEl.play();
  }
});

function showMoodPrompt() {
  moodPromptEl.textContent =
    moodPrompts[moodIndex % moodPrompts.length] || "No prompt available.";
}

emojiContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("emoji")) return;
  const feeling = e.target.dataset.feeling;
  if (emojiCounts[feeling] !== undefined) {
    emojiCounts[feeling]++;
    updateEmojiStats();
  }
});

function updateEmojiStats() {
  const total = Object.values(emojiCounts).reduce((a, b) => a + b, 0);
  emojiStatsEl.textContent = Object.entries(emojiCounts)
    .map(
      ([feeling, count]) => `${feeling}: ${((count / total) * 100).toFixed(1)}%`
    )
    .join("\n");
}

function showCyberTip() {
  const idx = cyberTipIndex % cyberTips.length;
  cyberTipEl.textContent = cyberTips[idx] || "No tips available";
  cyberImageEl.src = images[idx] || "assets/placeholder.jpg";
}

nextCyberTipBtn.addEventListener("click", () => {
  cyberTipIndex++;
  showCyberTip();
});

function setInitialTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("ww-theme");
  const isDark = storedTheme ? storedTheme === "dark" : prefersDark;
  document.body.classList.toggle("dark", isDark);
  modeToggle.checked = isDark;
}

modeToggle.addEventListener("change", () => {
  const isDark = modeToggle.checked;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("ww-theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  setInitialTheme();
  fetchData();
});
