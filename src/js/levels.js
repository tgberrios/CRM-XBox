// DATA
const levelsList = document.querySelector("#levelsList");
let levelsData = [];
const btnAddLevel = document.getElementById("btnAddLevel"); // Botón para agregar niveles
const inputModal = document.getElementById("inputModal"); // Modal para entrada de datos
const overlay = document.getElementById("overlay"); // Overlay para el modal
const levelForm = document.getElementById("levelForm");

// END DATA

// GET DATA
async function getLevels() {
  try {
    const levels = await window.cert.getLevels();
    levelsData = levels;
    console.log("Levels:", levels);
    renderLevels();
  } catch (err) {
    console.error("Error fetching levels:", err);
  }
}
// END GET DATA

// Render Levels
function renderLevels() {
  levelsList.innerHTML = ""; // Clear the List

  const printedLevels = {}; // Stores the levels that have been printed

  const row = document.createElement("div"); // Create a new row
  row.classList.add("row"); // Add the style row

  levelsData.forEach((level) => {
    // Loop through all levels
    if (!printedLevels[level.level]) {
      const column = document.createElement("div"); // Create a div for the column
      column.classList.add("col-md-2"); // Add the class col-md-2

      const title = document.createElement("h2"); // Create the title
      title.classList.add("levelsTitle"); // Add the class
      title.innerText = "Tier: " + level.level; // Set the text
      column.appendChild(title); // Append the title to the column

      printedLevels[level.level] = column; // Add the level to the dictionary
      row.appendChild(column); // Append the column to the row
    }

    // Create a list item for the level
    const levelItem = document.createElement("li"); // Create the item
    levelItem.classList.add("level-item"); // Add the class

    // Create the text content
    const textContent = document.createElement("span");
    textContent.innerHTML = `Tester: ${level.testerName}`; // Set the content

    // Create the delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Eliminar";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.addEventListener("click", () => deleteLevel(level.id)); // Call deleteLevel with level id

    // Append text content and delete button to the list item

    levelItem.appendChild(textContent);
    levelItem.appendChild(deleteButton);

    // Append the item to the column
    printedLevels[level.level].appendChild(levelItem);
  });

  levelsList.appendChild(row); // Append the row to the list
}
// END Render Levels

// Add Level Function
function setupAddLevelButton() {
  btnAddLevel.addEventListener("click", () => {
    // Show the modal
    inputModal.style.display = "block";
    overlay.style.display = "block";
  });
}

// Handle form submission
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  const testerName = document.getElementById("testerName").value;
  const level = parseInt(document.getElementById("level").value);

  if (!testerName || isNaN(level)) {
    alert("Please enter a tester name and a level.");
    return;
  }

  const levelObj = {
    testerName: testerName,
    level: level,
  };

  try {
    // Add the level
    await window.cert.addLevel(levelObj);
    console.log("Level added successfully:", levelObj);
    await getLevels(); // Refresh the levels
    closeModal(); // Close the modal
  } catch (err) {
    console.error("Error adding level:", err);
  }
}

// Close the modal
function closeModal() {
  inputModal.style.display = "none";
  overlay.style.display = "none";
}

// Delete Level Function
async function deleteLevel(id) {
  try {
    // Replace with the actual function that deletes the level
    await window.cert.deleteLevel(id);
    console.log("Level deleted successfully:", id);
    await getLevels(); // Refresh the levels
  } catch (err) {
    console.error("Error deleting level:", err);
  }
}

// Setup initial functions
async function initialize() {
  await getLevels(); // Initialize levels data
  setupAddLevelButton(); // Setup the add level button functionality
  levelForm.addEventListener("submit", handleFormSubmit); // Setup form submit handler
}

initialize();
