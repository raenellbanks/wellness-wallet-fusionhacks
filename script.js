/* === Wellness Wallet - script.js === */
/* Accessibility, UX, Performance & Test-Ready Refactor by ChatGPT 🛠️ */

// ✅ CONFIG
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

// ✅ RENDER ALL
function renderAll() {
  showMantra();
  showAudio();
  showMoodPrompt();
  showCyberTip();
  updateEmojiResults();
}

// === MANTRAS ===
function showMantra() {
  DOM.mantraText.textContent =
    data.mantras[data.indexes.mantra] || "No mantras available";
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
  DOM.moodPrompt.textContent =
    data.moodPrompts[data.indexes.mood] || "No mood prompt available";
}
function nextMoodPrompt() {
  data.indexes.mood = (data.indexes.mood + 1) % data.moodPrompts.length;
  showMoodPrompt();
}

// === EMOJI HANDLING ===
function handleEmojiClick(e) {
  if (!e.target.classList.contains("emoji")) return;

  const feeling = e.target.dataset.feeling;
  if (!feeling) return;

  data.emojiVotes[feeling]++;
  emojiClickSound.currentTime = 0;
  emojiClickSound.play();

  localStorage.setItem("lastMood", feeling);
  [...DOM.emojiContainer.children].forEach((btn) =>
    btn.setAttribute("aria-pressed", "false")
  );
  e.target.setAttribute("aria-pressed", "true");

  updateEmojiResults();
}
function updateEmojiResults() {
  const total = Object.values(data.emojiVotes).reduce((a, b) => a + b, 0);
  if (total === 0) return (DOM.emojiResults.textContent = "No data yet");

  const parts = Object.entries(data.emojiVotes)
    .filter(([_, count]) => count > 0)
    .map(
      ([feeling, count]) =>
        `${capitalize(feeling)}: ${((count / total) * 100).toFixed(1)}%`
    );

  DOM.emojiResults.textContent = parts.join(" | ");
}
function restoreLastMood() {
  const last = localStorage.getItem("lastMood");
  if (last) {
    const btn = DOM.emojiContainer.querySelector(`[data-feeling="${last}"]`);
    if (btn) btn.classList.add("selected");
  }
}

// === CYBER TIPS ===
function showCyberTip() {
  const index = data.indexes.tip;
  DOM.cyberTip.textContent = data.cyberTips[index] || "No tip available";
  const imgName = localImages[index % localImages.length];
  const imgPath = `assets/images/${imgName}`;
  DOM.cyberImage.src = imgPath;
  DOM.cyberImage.alt = `Related image: ${DOM.cyberTip.textContent}`;
  DOM.cyberImage.onerror = () => {
    DOM.cyberImage.src = "assets/placeholder.jpg";
  };
}
function nextCyberTip() {
  data.indexes.tip = (data.indexes.tip + 1) % data.cyberTips.length;
  showCyberTip();
}

// === THEME TOGGLE ===
function toggleTheme() {
  document.body.classList.toggle("dark", DOM.modeToggle.checked);
  localStorage.setItem("ww-theme", DOM.modeToggle.checked ? "dark" : "light");
}
function setInitialTheme() {
  const stored = localStorage.getItem("ww-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = stored ? stored === "dark" : prefersDark;
  document.body.classList.toggle("dark", dark);
  DOM.modeToggle.checked = dark;
}

// === UTILS ===
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
