// SheetBest API endpoint for spreadsheet data
const API_URL =
  "https://api.sheetbest.com/sheets/32bbc4a0-25ba-44ae-835f-2b8e6d207b9a";

// Data arrays
let mantras = [];
let moodPrompts = [];
let cyberTips = [];
let voiceMessages = [];

// List your image filenames from the assets/images folder
const images = [
  "assets/images/waterfall.jpg",
  "assets/images/coffeedate.jpg",
  "assets/images/cybergirl.jpg",
  "assets/images/electrica.jpg",
  "assets/images/generations.jpg",
  "assets/images/hackergirl.jpg",
  "assets/images/letthegoodtimesroll.jpg",
  "assets/images/love.jpg",
  "assets/images/namaste.jpg",
  "assets/images/prettysmile.jpg",
  "assets/images/rideordie.jpg",
  "assets/images/selfcare.jpg",
  "assets/images/sweettooth.jpg",
];

let mantraIndex = 0;
let moodPromptIndex = 0;
let cyberTipIndex = 0;
let dropImageIndex = 0;
let musicIndex = 0;

// Shuffle helper
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Fetch data from API and initialize UI
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Make sure these keys match your SheetBest column headers exactly!
    mantras = data.map((row) => row.daily_mantra).filter(Boolean);
    moodPrompts = data.map((row) => row.mood_prompt).filter(Boolean);
    cyberTips = data.map((row) => row.cyber_tip).filter(Boolean);
    voiceMessages = data.map((row) => row.voice_message).filter(Boolean);

    shuffle(mantras);
    shuffle(moodPrompts);
    shuffle(cyberTips);
    shuffle(images);
    shuffle(voiceMessages);

    showMantra();
    showMoodPrompt();
    showCyberTip();
    showDropImage();
    showMusic();
  } catch (error) {
    document.getElementById("mantraText").textContent =
      "Failed to load mantras.";
    document.getElementById("moodPrompt").textContent =
      "Failed to load mood prompts.";
    document.getElementById("cyberTip").textContent =
      "Failed to load cyber tips.";
    document.getElementById("dropImage").alt = "Failed to load images.";
    document.getElementById("mantraAudio").style.display = "none";
  }
}

// Show functions
function showMantra() {
  document.getElementById("mantraText").textContent =
    mantras[mantraIndex] || "No mantras available.";
}
function showMoodPrompt() {
  document.getElementById("moodPrompt").textContent =
    moodPrompts[moodPromptIndex] || "No mood prompts available.";
}
function showCyberTip() {
  document.getElementById("cyberTip").textContent =
    cyberTips[cyberTipIndex] || "No cyber tips available.";
}
function showDropImage() {
  const img = document.getElementById("dropImage");
  if (images.length > 0) {
    img.src = images[dropImageIndex];
    img.alt = "Wellness visual";
  }
}
function showMusic() {
  const audio = document.getElementById("mantraAudio");
  if (voiceMessages.length > 0) {
    audio.src = voiceMessages[musicIndex];
    audio.style.display = "block";
  } else {
    audio.style.display = "none";
  }
}

// Button event listeners
document.getElementById("nextMantraBtn").addEventListener("click", () => {
  mantraIndex = (mantraIndex + 1) % mantras.length;
  showMantra();
});
document.getElementById("nextMoodPromptBtn").addEventListener("click", () => {
  moodPromptIndex = (moodPromptIndex + 1) % moodPrompts.length;
  showMoodPrompt();
});
document.getElementById("nextCyberTipBtn").addEventListener("click", () => {
  cyberTipIndex = (cyberTipIndex + 1) % cyberTips.length;
  showCyberTip();
});
document.getElementById("nextDropImageBtn").addEventListener("click", () => {
  dropImageIndex = (dropImageIndex + 1) % images.length;
  showDropImage();
});
document.getElementById("nextSongBtn").addEventListener("click", () => {
  musicIndex = (musicIndex + 1) % voiceMessages.length;
  showMusic();
});
document.getElementById("playMusicBtn").addEventListener("click", () => {
  const audio = document.getElementById("mantraAudio");
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

// Load data on page load
window.addEventListener("DOMContentLoaded", fetchData);
