const mantras = [
  "You are strong, soft, and safe here.",
  "You don’t have to be perfect to be loved.",
  "Healing looks different every day.",
];

const audios = ["assets/voice1.mp3", "assets/voice2.mp3", "assets/voice3.mp3"];

const cyberTips = [
  "Use strong passwords and a password manager.",
  "Always update your software — it's protection!",
  "Don’t overshare personal info online.",
];

const images = ["assets/tip1.jpg", "assets/tip2.jpg", "assets/tip3.jpg"];

const moods = [
  "How do you feel today?",
  "What's your vibe right now?",
  "Need a moment to breathe?",
];

let mantraIndex = 0;
let tipIndex = 0;
let moodIndex = 0;

function nextMantra() {
  mantraIndex = (mantraIndex + 1) % mantras.length;
  document.getElementById("mantraText").innerText = mantras[mantraIndex];
  document.getElementById("mantraAudio").src = audios[mantraIndex];
}

function nextCyberTip() {
  tipIndex = (tipIndex + 1) % cyberTips.length;
  document.getElementById("cyberTip").innerText = cyberTips[tipIndex];
  document.getElementById("cyberImage").src = images[tipIndex];
}

function rotateMood() {
  moodIndex = (moodIndex + 1) % moods.length;
  document.getElementById("moodPrompt").innerText = moods[moodIndex];
}

// Rotate mood every 10 sec
setInterval(rotateMood, 10000);

// Toggle dark mode
document.getElementById("modeToggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark", e.target.checked);
});

// Init on load
window.onload = () => {
  nextMantra();
  nextCyberTip();
  document.getElementById("moodPrompt").innerText = moods[0];
};
