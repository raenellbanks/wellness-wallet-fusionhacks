// ---------------------------
// Food for the Soul Section
// ---------------------------

const mantras = [
  "You are worthy of rest and joy.",
  "Protecting your peace is a full-time job.",
  "You don’t have to shrink to be safe.",
  "Healing is not linear — just keep going.",
];

const audioFiles = [
  "assets/audio1.mp3",
  "assets/audio2.mp3",
  "assets/audio3.mp3",
  "assets/audio4.mp3",
];

let soulIndex = 0;
const mantraText = document.getElementById("mantraText");
const audioPlayer = document.getElementById("audioPlayer");

function rotateSoulFood() {
  mantraText.textContent = mantras[soulIndex];
  audioPlayer.src = audioFiles[soulIndex];
  soulIndex = (soulIndex + 1) % mantras.length;
}

setInterval(rotateSoulFood, 10000); // Rotate every 10 seconds
rotateSoulFood(); // Load the first one on page load

// ---------------------------
// STOP and Reflect Section
// ---------------------------

const moodPrompts = [
  "What made you smile today?",
  "Where is your energy going right now?",
  "What emotion is taking up the most space?",
  "How are you *really* feeling?",
];

let moodIndex = 0;
const moodPrompt = document.getElementById("moodPrompt");

function rotateMoodPrompt() {
  moodPrompt.textContent = moodPrompts[moodIndex];
  moodIndex = (moodIndex + 1) % moodPrompts.length;
}

setInterval(rotateMoodPrompt, 12000); // Rotate every 12 seconds
rotateMoodPrompt(); // Load the first one on page load

// ---------------------------
// The Drop Section
// ---------------------------

const cyberTips = [
  "Use two-factor authentication on *everything*. No excuses.",
  "Strong password = 🔐 peace of mind. Make it long + unique.",
  "Never click links in shady emails. Hover, check, delete.",
  "Update your apps and OS. Outdated = vulnerable.",
];

const cyberImages = [
  "assets/cyber1.jpg",
  "assets/cyber2.jpg",
  "assets/cyber3.jpg",
  "assets/cyber4.jpg",
];

let tipIndex = 0;
const cyberTip = document.getElementById("cyberTip");
const tipImage = document.getElementById("tipImage");

function nextTip() {
  cyberTip.textContent = cyberTips[tipIndex];
  tipImage.src = cyberImages[tipIndex];
  tipIndex = (tipIndex + 1) % cyberTips.length;
}

nextTip(); // Load first tip when page loads

// ---------------------------
// Light/Dark Mode Toggle
// ---------------------------

const modeToggle = document.getElementById("modeToggle");

function setThemeFromSystem() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.body.classList.toggle("dark-mode", prefersDark);
}

function toggleMode() {
  document.body.classList.toggle("dark-mode");
}

modeToggle.addEventListener("click", toggleMode);
setThemeFromSystem();
