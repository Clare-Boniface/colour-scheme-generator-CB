const colorBtnEl = document.getElementById("color-btn");
const randomColorBtn = document.getElementById("random-color-btn");
const colorSchemeContainerEl = document.getElementById(
  "color-scheme-container"
);
const mode = document.getElementById("mode");
const seedColorEl = document.getElementById("seed-color");
const snackbar = document.getElementById("snackbar");
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

// console.log(hexCharacters);

randomColorBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let hexNumberArray = [];

  for (let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * hexCharacters.length);
    let randomCharacter = hexCharacters[randomIndex];
    hexNumberArray.push(randomCharacter);
  }
  let hexColor = `#${hexNumberArray.join("")}`;

  seedColorEl.value = hexColor;
  generateColor();
});

generateColor();
colorBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  generateColor();
});

seedColorEl.addEventListener("input", function () {
  // Assign the value here
  console.log(currentSeedColor);
});

async function generateColor() {
  try {
    currentSeedColor = seedColorEl.value.substring(1);
    const response = await fetch(
      `https://www.thecolorapi.com/scheme?hex=${currentSeedColor}&mode=${mode.value}&count=5`
    );
    const data = await response.json();
    console.log(data);

    const colorDivs = data.colors
      .map((color) => {
        const hexColor = color.hex.value;
        return `<div class="color-column" style="background-color: ${hexColor}">
     <p class="color-name">${color.name.value}</p>
     <p class="hex-code" id="hex-code">${hexColor}</p>
     </div>`;
      })
      .join("");
    colorSchemeContainerEl.innerHTML = colorDivs;
  } catch (error) {
    console.error("Error fetching color data", error);
  }
}

mode.addEventListener("input", function () {
  console.log(mode.value);
});

colorSchemeContainerEl.addEventListener("click", copyHexCode);

function copyHexCode(event) {
  const clickedElement = event.target;

  // Check if the clicked element has the class "hex-code" or "color-column"
  if (
    clickedElement.classList.contains("hex-code") ||
    clickedElement.classList.contains("color-column")
  ) {
    const hexCodeElement = clickedElement.classList.contains("hex-code")
      ? clickedElement
      : clickedElement.querySelector(".hex-code");

    const hexCode = hexCodeElement.textContent.trim();

    navigator.clipboard
      .writeText(hexCode)
      .then(() => {
        hexCodeElement.textContent = "Copied!";
        hexCodeElement.classList.add("click-hex-code");

        setTimeout(() => {
          hexCodeElement.textContent = hexCode;
          hexCodeElement.classList.remove("click-hex-code");
        }, 2000);

        console.log("Hex code copied");
        showSnackbar();
      })
      .catch((error) => {
        console.error("Copying to clipboard failed:", error);
      });
  }
}
const toggleBtnEl = document.getElementById("darkmode-toggle");
toggleBtnEl.addEventListener("click", toggle);
function toggle() {
  document.body.classList.toggle("dark-mode");
  //   toggleBtnEl.textContent === "☀️"
  //     ? (toggleBtnEl.textContent = "🌑")
  //     : (toggleBtnEl.textContent = "☀️");
}

function showSnackbar() {
  snackbar.classList.add("show"); // Add the "show" class to show the snackbar
  setTimeout(function () {
    snackbar.classList.remove("show"); // Remove the "show" class after a delay
  }, 2000);
}
