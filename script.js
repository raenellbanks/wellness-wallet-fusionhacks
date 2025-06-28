const API_URL =
  "https://api.sheetbest.com/sheets/32bbc4a0-25ba-44ae-835f-2b8e6d207b9a";

// Data storage
let data = [];
let soulIndex = 0;
let tipIndex = 0;
let moodIndex = 0;

// DOM elements
const mantraText = document.getElementById("mantraText");
const audioPlayer = document.getElementById("audioPlayer");
const moodPrompt = document.getElementById("moodPrompt");
const cyberTip = document.getElementById("cyberTip");
const tipImage = document.getElementById("tipImage");

// Fetch data
fetch(API_URL)
  .then((response) => response.json())
  .then((json) => {
    data = json;
    updateSoulSection();
    updateMoodPrompt();
    updateCyberTip();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// ==== FOOD FOR THE SOUL ====
function updateSoulSection() {
  if (data.length === 0) return;
  const entry = data[soulIndex];
  mantraText.textContent = entry.daily_mantra || "Stay strong, queen.";
  audioPlayer.src = entry.music_url || "";
}

// ==== STOP & REFLECT ====
function updateMoodPrompt() {
  if (data.length === 0) return;
  const entry = data[moodIndex];
  moodPrompt.textContent = entry.mood_prompt || "How you feelin', sis?";
}

// ==== THE DROP ====
function updateCyberTip() {
  if (data.length === 0) return;
  const entry = data[tipIndex];
  cyberTip.textContent =
    entry.cyber_tip || "Protect your peace—and your password.";
  tipImage.src = entry.image_url || "";
}

// ==== BUTTONS ====
document.getElementById("nextSoul").addEventListener("click", () => {
  soulIndex = (soulIndex + 1) % data.length;
  updateSoulSection();
});

document.getElementById("nextTip").addEventListener("click", () => {
  tipIndex = (tipIndex + 1) % data.length;
  updateCyberTip();
});

// ==== LIGHT/DARK MODE TOGGLE ====
const toggle = document.getElementById("modeToggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// ==== AUTO SET BY USER'S PREF ====
window.addEventListener("DOMContentLoaded", () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    document.body.classList.add("dark-mode");
  }
});
