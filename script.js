// === Wellness Wallet - script.js ===
// Accessibility, UX, Performance & Test-Ready Refactor 💅

// ✅ CONFIGURATION
const API_URL =
  "https://api.sheetbest.com/sheets/32bbc4a0-25ba-44ae-835f-2b8e6d207b9a";
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
const emojiClickSound = new Audio("assets/sounds/click.mp3");

// ✅ STATE
let data = {
  mantras: [],
  voiceMessages: [],
  moodPrompts: [],
  cyberTips: [],
  emojiVotes: { happy: 0, sad: 0, angry: 0, sleepy: 0, sick: 0 },
  indexes: { mantra: 0, audio: 0, mood: 0, tip: 0 },
};

// ✅ DOM
const DOM = {
  mantraText: document.getElementById("mantraText"),
  mantraAudio: document.getElementById("mantraAudio"),
  nextMantraBtn: document.getElementById("nextMantraBtn"),
  playPauseBtn: document.getElementById("playPauseBtn"),
  nextAudioBtn: document.getElementById("nextAudioBtn"),
  moodPrompt: document.getElementById("moodPrompt"),
  nextPromptBtn: document.getElementById("nextPromptBtn"),
  emojiContainer: document.getElementById("emojiContainer"),
  emojiResults: document.getElementById("emojiResults"),
  cyberTip: document.getElementById("cyberTip"),
  cyberImage: document.getElementById("cyberImage"),
  nextCyberTipBtn: document.getElementById("nextCyberTipBtn"),
  modeToggle: document.getElementById("modeToggle"),
};

// ✅ INIT
document.addEventListener("DOMContentLoaded", () => {
  setInitialTheme();
  restoreLastMood();
  fetchData();

  DOM.nextMantraBtn.addEventListener("click", nextMantra);
  DOM.playPauseBtn.addEventListener("click", toggleAudio);
  DOM.nextAudioBtn.addEventListener("click", nextAudio);
  DOM.nextPromptBtn.addEventListener("click", nextMoodPrompt);
  DOM.nextCyberTipBtn.addEventListener("click", nextCyberTip);
  DOM.emojiContainer.addEventListener("click", handleEmojiClick);
  DOM.modeToggle.addEventListener("change", toggleTheme);

  showMantra(); // fallback
  updateEmojiResults();
});

// ✅ FETCH DATA
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const sheet = await res.json();
    data.mantras = sheet.map((r) => r.daily_mantra).filter(Boolean);
    data.voiceMessages = sheet.map((r) => r.voice_message).filter(Boolean);
    data.moodPrompts = sheet.map((r) => r.mood_prompt).filter(Boolean);
    data.cyberTips = sheet.map((r) => r.cyber_tip).filter(Boolean);
    renderAll();
  } catch (err) {
    console.error("Error loading data:", err);
    DOM.mantraText.textContent = "Failed to load mantras.";
    DOM.moodPrompt.textContent = "Failed to load mood prompts.";
    DOM.cyberTip.textContent = "Failed to load cyber tips.";
  }
}

// ✅ RENDER UI
function renderAll() {
  showMantra();
  showAudio();
  showMoodPrompt();
  showCyberTip();
  updateEmojiResults();
}

// === MANTRAS ===
function showMantra() {
  const arr = data.mantras.length ? data.mantras : ["You are enough."];
  DOM.mantraText.textContent = arr[data.indexes.mantra];
}
function nextMantra() {
  data.indexes.mantra = (data.indexes.mantra + 1) % data.mantras.length;
  showMantra();
}

// === AUDIO ===
function showAudio() {
  const src = data.voiceMessages[data.indexes.audio];
  if (!src) return hideAudio();
  DOM.mantraAudio.src = src;
  DOM.mantraAudio.load();
  DOM.mantraAudio.style.display = "block";
  DOM.playPauseBtn.style.display = "inline-block";
  DOM.nextAudioBtn.style.display = "inline-block";
}
function hideAudio() {
  DOM.mantraAudio.style.display = "none";
  DOM.playPauseBtn.style.display = "none";
  DOM.nextAudioBtn.style.display = "none";
}
function toggleAudio() {
  DOM.mantraAudio.paused ? DOM.mantraAudio.play() : DOM.mantraAudio.pause();
}
function nextAudio() {
  data.indexes.audio = (data.indexes.audio + 1) % data.voiceMessages.length;
  showAudio();
  DOM.mantraAudio.play();
}

// === MOOD PROMPTS ===
function showMoodPrompt() {
  const arr = data.moodPrompts.length
    ? data.moodPrompts
    : ["How do you feel today?"];
  DOM.moodPrompt.textContent = arr[data.indexes.mood];
}
function nextMoodPrompt() {
  data.indexes.mood = (data.indexes.mood + 1) % data.moodPrompts.length;
  showMoodPrompt();
}

// === EMOJI VOTING ===
function handleEmojiClick(e) {
  const button = e.target.closest(".emoji");
  if (!button) return;

  const feeling = button.dataset.feeling;
  if (!feeling) return;

  data.emojiVotes[feeling]++;
  emojiClickSound.currentTime = 0;
  emojiClickSound.play();

  // Accessibility state
  [...DOM.emojiContainer.children].forEach((btn) =>
    btn.setAttribute("aria-pressed", "false")
  );
  button.setAttribute("aria-pressed", "true");

  // Visual feedback
  document
    .querySelectorAll(".emoji")
    .forEach((el) => el.classList.remove("selected"));
  button.classList.add("selected");

  // Save to localStorage
  localStorage.setItem("lastMood", feeling);

  updateEmojiResults();
}

function restoreLastMood() {
  const feeling = localStorage.getItem("lastMood");
  if (!feeling) return;
  const btn = document.querySelector(`.emoji[data-feeling="${feeling}"]`);
  if (btn) btn.classList.add("selected");
}

function updateEmojiResults() {
  const total = Object.values(data.emojiVotes).reduce(
    (sum, val) => sum + val,
    0
  );
  if (total === 0) {
    DOM.emojiResults.textContent = "No data yet";
    return;
  }
  const results = Object.entries(data.emojiVotes)
    .filter(([_, count]) => count > 0)
    .map(
      ([mood, count]) =>
        `${capitalize(mood)}: ${((count / total) * 100).toFixed(1)}%`
    )
    .join(" | ");
  DOM.emojiResults.textContent = results;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// === CYBER TIPS ===
function showCyberTip() {
  const arr = data.cyberTips.length
    ? data.cyberTips
    : ["Protect your passwords sis!"];
  const index = data.indexes.tip;
  DOM.cyberTip.textContent = arr[index];

  const imgName = localImages[index % localImages.length];
  const imgPath = `assets/images/${imgName}`;
  DOM.cyberImage.src = imgPath;
  DOM.cyberImage.alt = `Cyber tip visual`;
  DOM.cyberImage.onerror = () => {
    DOM.cyberImage.src = "assets/placeholder.jpg";
  };
}
function nextCyberTip() {
  data.indexes.tip = (data.indexes.tip + 1) % data.cyberTips.length;
  showCyberTip();
}

// === DARK MODE THEME TOGGLE ===
function toggleTheme() {
  const isDark = DOM.modeToggle.checked;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("ww-theme", isDark ? "dark" : "light");
}

function setInitialTheme() {
  const savedTheme = localStorage.getItem("ww-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedTheme ? savedTheme === "dark" : prefersDark;

  document.body.classList.toggle("dark", isDark);
  DOM.modeToggle.checked = isDark;
}
