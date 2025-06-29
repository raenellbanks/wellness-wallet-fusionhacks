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

const mantraTextEl = document.getElementById("mantraText");
const mantraAudioEl = document.getElementById("mantraAudio");
const nextMantraBtn = document.getElementById("nextMantraBtn");

const moodPromptEl = document.getElementById("moodPrompt");
const emojiContainer = document.getElementById("emojiContainer");
const emojiStatsEl = document.getElementById("emojiStats");

const cyberTipEl = document.getElementById("cyberTip");
const cyberImageEl = document.getElementById("cyberImage");
const nextCyberTipBtn = document.getElementById("nextCyberTipBtn");

const modeToggle = document.getElementById("modeToggle");

// Data structure to count emoji selections
const emojiCounts = {
  happy: 0,
  sad: 0,
  angry: 0,
  sleepy: 0,
  sick: 0,
};

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data = await res.json();

    mantras = data.map((row) => row.daily_mantra).filter(Boolean);
    voiceMessages = data.map((row) => row.voice_message).filter(Boolean);
    moodPrompts = data.map((row) => row.mood_prompt).filter(Boolean);
    cyberTips = data.map((row) => row.cyber_tip).filter(Boolean);
    images = data.map((row) => row.image_url).filter(Boolean);

    if (mantras.length === 0) mantras = ["No mantras available"];
    if (moodPrompts.length === 0) moodPrompts = ["No mood prompts available"];
    if (cyberTips.length === 0) cyberTips = ["No cyber tips available"];
    if (images.length === 0) images = [""];

    initUI();
  } catch (error) {
    console.error("Error loading data:", error);
    mantraTextEl.textContent = "Failed to load mantras.";
    moodPromptEl.textContent = "Failed to load mood prompts.";
    cyberTipEl.textContent = "Failed to load cyber tips.";
  }
}

function initUI() {
  showMantra();
  showMoodPrompt();
  showCyberTip();
}

function showMantra() {
  const hasVoice = voiceMessages.length > 0;
  const combinedLength = mantras.length + (hasVoice ? voiceMessages.length : 0);

  if (combinedLength === 0) {
    mantraTextEl.textContent = "No mantras or voice messages available.";
    mantraAudioEl.style.display = "none";
    return;
  }

  if (mantraIndex % 2 === 0) {
    const mantraPos = Math.floor(mantraIndex / 2) % mantras.length;
    mantraTextEl.textContent = mantras[mantraPos];
    mantraAudioEl.style.display = "none";
    mantraAudioEl.pause();
    mantraAudioEl.src = "";
  } else {
    const voicePos = Math.floor(mantraIndex / 2) % voiceMessages.length;
    mantraTextEl.textContent = "";
    mantraAudioEl.style.display = "block";
    mantraAudioEl.src = voiceMessages[voicePos];
    mantraAudioEl.load();
    mantraAudioEl.play().catch(() => {});
  }
}

nextMantraBtn.addEventListener("click", () => {
  mantraIndex =
    (mantraIndex + 1) % (mantras.length + voiceMessages.length || 1);
  showMantra();
});

function showMoodPrompt() {
  if (moodPrompts.length === 0) {
    moodPromptEl.textContent = "No mood prompts available.";
    return;
  }
  moodPromptEl.textContent = moodPrompts[moodIndex];
}

emojiContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("emoji")) return;

  // Reset all
  [...emojiContainer.children].forEach((emoji) => {
    emoji.setAttribute("aria-pressed", "false");
  });

  // Mark clicked emoji pressed
  e.target.setAttribute("aria-pressed", "true");

  // Count emoji
  const feeling = e.target.getAttribute("data-feeling");
  if (feeling && emojiCounts.hasOwnProperty(feeling)) {
    emojiCounts[feeling]++;
    updateEmojiStats();
  }
});

emojiContainer.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("emoji")) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.target.click();
  }
});

function updateEmojiStats() {
  const totalVotes = Object.values(emojiCounts).reduce((a, b) => a + b, 0);
  if (totalVotes === 0) {
    emojiStatsEl.textContent = "No moods selected yet.";
    return;
  }

  const percentages = Object.entries(emojiCounts).map(([feeling, count]) => {
    const percent = ((count / totalVotes) * 100).toFixed(1);
    return `${feeling}: ${percent}%`;
  });

  emojiStatsEl.textContent = `Mood stats: ${percentages.join(", ")}`;
}

function showCyberTip() {
  if (cyberTips.length === 0) {
    cyberTipEl.textContent = "No cyber tips available.";
    cyberImageEl.src = "";
    cyberImageEl.alt = "";
    return;
  }
  const idx = cyberTipIndex % cyberTips.length;
  cyberTipEl.textContent = cyberTips[idx];

  // Fix empty or invalid image urls to fallback placeholder
  if (images[idx] && images[idx].trim() !== "") {
    cyberImageEl.src = images[idx];
  } else {
    cyberImageEl.src = "placeholder.jpg"; // make sure you have this file or replace with a valid fallback
  }
  cyberImageEl.alt = cyberTips[idx];
}

nextCyberTipBtn.addEventListener("click", () => {
  cyberTipIndex = (cyberTipIndex + 1) % cyberTips.length;
  showCyberTip();
});

// Dark mode toggle handlers

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

window.addEventListener("DOMContentLoaded", () => {
  setInitialTheme();
  fetchData();
});
