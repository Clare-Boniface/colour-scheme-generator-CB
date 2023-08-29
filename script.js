const colorBtnEl = document.getElementById("color-btn");
const randomColorBtn = document.getElementById("random-color-btn");
const colorSchemeContainerEl = document.getElementById(
  "color-scheme-container"
);
const mode = document.getElementById("mode");
const seedColorEl = document.getElementById("seed-color");
const snackbar = document.getElementById("snackbar");
const toggleBtnEl = document.getElementById("darkmode-toggle");
let currentSeedColor = "";
let html = "";

const hexCharacters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
];

generateColor();

//Event Listeners

randomColorBtn.addEventListener("click", getRandomColor);
colorSchemeContainerEl.addEventListener("click", copyHexCode);
toggleBtnEl.addEventListener("click", toggle);

//Functions

colorBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  generateColor();
});

// Generate a random color and update the color scheme
function getRandomColor(e) {
  e.preventDefault();
  let hexNumberArray = [];
  for (let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * hexCharacters.length);
    hexNumberArray.push(hexCharacters[randomIndex]);
  }
  let hexColor = `#${hexNumberArray.join("")}`;
  seedColorEl.value = hexColor;
  generateColor();
}

// Fetch color scheme data from an API and update the display
async function generateColor() {
  currentSeedColor = seedColorEl.value.substring(1);
  const response = await fetch(
    `https://www.thecolorapi.com/scheme?hex=${currentSeedColor}&mode=${mode.value}&count=5`
  );
  const data = await response.json();
  const colorDivs = data.colors
    .map((color) => {
      const hexColor = color.hex.value;
      return `<div class="color-column flex" style="background-color: ${hexColor}">
     <p class="color-name flex">${color.name.value}</p>
     <p class="hex-code flex" id="hex-code">${hexColor}</p>
     </div>`;
    })
    .join("");
  colorSchemeContainerEl.innerHTML = colorDivs;
}

// Copy the clicked hex code to clipboard and show snackbar notification
function copyHexCode(e) {
  const clickedElement = e.target;
  if (
    clickedElement.classList.contains("hex-code") ||
    clickedElement.classList.contains("color-column")
  ) {
    const hexCodeElement = clickedElement.classList.contains("hex-code")
      ? clickedElement
      : clickedElement.querySelector(".hex-code");
    const hexCode = hexCodeElement.textContent.trim();
    copyToClipboard(hexCode).then(() => {
      displayCopied(hexCodeElement, hexCode);
      showSnackbar();
    });
  }
}

// Copy text to the clipboard
function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

// Display "Copied!" status and reset after a delay
function displayCopied(element, hexCode) {
  element.textContent = "Copied!";
  element.classList.add("click-hex-code");
  setTimeout(() => {
    element.textContent = hexCode;
    element.classList.remove("click-hex-code");
  }, 2000);
}

// Show snackbar notification and remove after a delay
function showSnackbar() {
  snackbar.classList.add("show");
  setTimeout(function () {
    snackbar.classList.remove("show");
  }, 2000);
}

// Toggle between dark and light modes
function toggle() {
  document.body.classList.toggle("dark-mode");
}
