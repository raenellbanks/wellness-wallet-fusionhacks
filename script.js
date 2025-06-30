const API_URL =
  "https://api.sheetbest.com/sheets/32bbc4a0-25ba-44ae-835f-2b8e6d207b9a";

// App data
let mantras = [];
let voiceMessages = [];
let moodPrompts = [];
let cyberTips = [];
let images = [];

let mantraIndex = 0;
let cyberTipIndex = 0;
let moodIndex = 0;

// DOM Elements
const mantraTextEl = document.getElementById("mantraText");
const mantraAudioEl = document.getElementById("mantraAudio");
const nextMantraBtn = document.getElementById("nextMantraBtn");

const moodPromptEl = document.getElementById("moodPrompt");
const emojiContainer = document.getElementById("emojiContainer");
const emojiStatsEl = document.getElementById("emojiStats");

const cyberTipEl = document.getElementById("cyberTip");
const cyberImageEl = document.getElementById("cyberImage");
const nextCyberTipBtn = document.getElementById("nextCyberTipBtn");

// Track emoji reactions
let emojiCounts = {
  happy: 0,
  sad: 0,
  angry: 0,
  sleepy: 0,
  sick: 0,
};

// Load Data
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    mantras = data.map((row) => row.daily_mantra).filter(Boolean);
    voiceMessages = data.map((row) => row.voice_message).filter(Boolean);
    moodPrompts = data.map((row) => row.mood_prompt).filter(Boolean);
    cyberTips = data.map((row) => row.cyber_tip).filter(Boolean);
    images = data.map((row) => row.image_url).filter(Boolean);

    initUI();
  } catch (err) {
    console.error("Failed to fetch data:", err);
    mantraTextEl.textContent = "Couldn’t load mantras 💔";
    moodPromptEl.textContent = "Couldn’t load prompts 😔";
    cyberTipEl.textContent = "No cyber tips yet 🔐";
  }
}

// UI Init
function initUI() {
  showMantra();
  showMoodPrompt();
  showCyberTip();
}

// MANTRA SECTION
function showMantra() {
  if (mantras.length === 0 && voiceMessages.length === 0) {
    mantraTextEl.textContent = "No mantras or audio today 😅";
    mantraAudioEl.style.display = "none";
    return;
  }

  if (mantraIndex % 2 === 0 && mantras.length > 0) {
    const pos = Math.floor(mantraIndex / 2) % mantras.length;
    mantraTextEl.textContent = mantras[pos];
    mantraAudioEl.style.display = "none";
    mantraAudioEl.pause();
    mantraAudioEl.src = "";
  } else if (voiceMessages.length > 0) {
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

// MOOD SECTION
function showMoodPrompt() {
  if (moodPrompts.length === 0) {
    moodPromptEl.textContent = "No prompts available 😴";
    return;
  }
  const pos = moodIndex % moodPrompts.length;
  moodPromptEl.textContent = moodPrompts[pos];
}
