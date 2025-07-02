// SheetBest API endpoint
const API_URL =
  "https://api.sheetbest.com/sheets/32bbc4a0-25ba-44ae-835f-2b8e6d207b9a";

// Data arrays
let mantras = [];
let voiceMessages = [];
let moodPrompts = [];
let cyberTips = [];
// Your local image filenames for The Drop section
const localImages = [
  "coffeedate.jpg",
  "cybergirl.jpg",
  "electrica.jpg",
  "generations.jpg",
  "hackergirl.jpg",
  "letthegoodtimesroll.jpg",
  "love.jpg",
  "namaste.jpg",
  "prettysmile.jpg",
  "rideordie.jpg",
  "selfcare.jpg",
  "sweethtooth.jpg",
];

let mantraIndex = 0;
let audioIndex = 0;
let moodIndex = 0;
let cyberTipIndex = 0;

// Emoji vote counts
const emojiVotes = {
  happy: 0,
  sad: 0,
  angry: 0,
  sleepy: 0,
  sick: 0,
};

// DOM elements
const mantraTextEl = document.getElementById("mantraText");
const mantraAudioEl = document.getElementById("mantraAudio");
const nextMantraBtn = document.getElementById("nextMantraBtn");

const playPauseBtn = document.getElementById("playPauseBtn");
const nextAudioBtn = document.getElementById("nextAudioBtn");

const moodPromptEl = document.getElementById("moodPrompt");
const nextPromptBtn = document.getElementById("nextPromptBtn");

const emojiContainer = document.getElementById("emojiContainer");
const emojiResultsEl = document.getElementById("emojiResults");

const cyberTipEl = document.getElementById("cyberTip");
const cyberImageEl = document.getElementById("cyberImage");
const nextCyberTipBtn = document.getElementById("nextCyberTipBtn");

// Fetch data from API
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data = await res.json();

    mantras = data.map((row) => row.daily_mantra).filter(Boolean);
    voiceMessages = data.map((row) => row.voice_message).filter(Boolean);
    moodPrompts = data.map((row) => row.mood_prompt).filter(Boolean);
    cyberTips = data.map((row) => row.cyber_tip).filter(Boolean);

    // Fallbacks
    if (mantras.length === 0) mantras = ["No mantras available"];
    if (moodPrompts.length === 0) moodPrompts = ["No mood prompts available"];
    if (cyberTips.length === 0) cyberTips = ["No cyber tips available"];

    initUI();
  } catch (err) {
    console.error("Error loading data:", err);
    mantraTextEl.textContent = "Failed to load mantras.";
    moodPromptEl.textContent = "Failed to load mood prompts.";
    cyberTipEl.textContent = "Failed to load cyber tips.";
  }
}

// Initialize UI with first items
function initUI() {
  showMantra();
  showAudio();
  showMoodPrompt();
  showCyberTip();
  updateEmojiResults();
}

// Food for the Soul - Mantras
function showMantra() {
  mantraTextEl.textContent = mantras[mantraIndex];
}

// Food for the Soul - Audio
function showAudio() {
  if (voiceMessages.length === 0) {
    mantraAudioEl.style.display = "none";
    playPauseBtn.style.display = "none";
    nextAudioBtn.style.display = "none";
    return;
  }

  mantraAudioEl.style.display = "block";
  playPauseBtn.style.display = "inline-block";
  nextAudioBtn.style.display = "inline-block";

  mantraAudioEl.src = voiceMessages[audioIndex];
  mantraAudioEl.load();
}

// Food for the Soul - Next Mantra
nextMantraBtn.addEventListener("click", () => {
  mantraIndex = (mantraIndex + 1) % mantras.length;
  showMantra();
});

// Play/Pause Audio
playPauseBtn.addEventListener("click", () => {
  if (mantraAudioEl.paused) {
    mantraAudioEl.play();
  } else {
    mantraAudioEl.pause();
  }
});

// Next Song
nextAudioBtn.addEventListener("click", () => {
  audioIndex = (audioIndex + 1) % voiceMessages.length;
  showAudio();
  mantraAudioEl.play();
});

// Stop and Reflect - Mood Prompts
function showMoodPrompt() {
  moodPromptEl.textContent = moodPrompts[moodIndex];
}

nextPromptBtn.addEventListener("click", () => {
  moodIndex = (moodIndex + 1) % moodPrompts.length;
  showMoodPrompt();
});

// Emoji click & voting logic
emojiContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("emoji")) return;

  // Update vote counts
  const feeling = e.target.getAttribute("data-feeling");
  if (!feeling) return;

  emojiVotes[feeling] = (emojiVotes[feeling] || 0) + 1;

  // Update pressed state for accessibility
  [...emojiContainer.children].forEach((btn) =>
    btn.setAttribute("aria-pressed", "false")
  );
  e.target.setAttribute("aria-pressed", "true");

  updateEmojiResults();
});

// Update emoji percentage display
function updateEmojiResults() {
  const totalVotes = Object.values(emojiVotes).reduce((a, b) => a + b, 0);
  if (totalVotes === 0) {
    emojiResultsEl.textContent = "No data yet";
    return;
  }

  // Build results string
  const parts = [];
  for (const [feeling, count] of Object.entries(emojiVotes)) {
    const percent = ((count / totalVotes) * 100).toFixed(1);
    parts.push(`${feeling}: ${percent}%`);
  }
  emojiResultsEl.textContent = parts.join(" | ");
}

// The Drop - Cyber Tips + Images
function showCyberTip() {
  cyberTipEl.textContent = cyberTips[cyberTipIndex];
  // Use local images for display
  const imgName = localImages[cyberTipIndex % localImages.length];
  const imgPath = `assets/images/${imgName}`;
  cyberImageEl.src = imgPath;
  cyberImageEl.alt = `Image related to cyber tip: ${cyberTips[cyberTipIndex]}`;

  // Fallback if image doesn't load
  cyberImageEl.onerror = () => {
    cyberImageEl.src = "assets/placeholder.jpg";
  };
}

nextCyberTipBtn.addEventListener("click", () => {
  cyberTipIndex = (cyberTipIndex + 1) % cyberTips.length;
  showCyberTip();
});

// Dark mode toggle logic (from before)
const modeToggle = document.getElementById("modeToggle");
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

// Initialize app
window.addEventListener("DOMContentLoaded", () => {
  setInitialTheme();
  fetchData();
});
//
// End of
