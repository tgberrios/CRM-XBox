/**
 * Formats a date string into a localized date format.
 * Handles various date formats including ISO and common US/European formats.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date or "Invalid Date" if parsing fails.
 */
function formatDate(dateString) {
  let date;

  // Try parsing as a timestamp
  if (!isNaN(parseInt(dateString, 10))) {
    date = new Date(parseInt(dateString, 10));
  } else {
    // Try parsing as an ISO date
    date = new Date(dateString);

    // If not ISO, try common formats (MM/DD/YYYY or DD/MM/YYYY)
    if (isNaN(date.getTime())) {
      const parts = dateString.split(/[-/]/); // Split by '-' or '/'
      if (parts.length === 3) {
        const [month, day, year] = parts;
        // Format date string to YYYY-MM-DD
        date = new Date(
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
        );
      }
    }
  }

  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString(); // Return formatted date or error message
}

// Event listener for clearing local storage
document
  .getElementById("clearLocalStorageButton")
  .addEventListener("click", function () {
    if (confirm("Are you sure you want to clear all local storage data?")) {
      localStorage.clear();
      alert("Local storage data cleared.");
      location.reload(); // Reload to reflect changes
    }
  });

// Initialize page elements on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event triggered.");
  loadTrackers();
  loadHistory();
  setupSearch();
});

/**
 * Loads and displays trackers from the database.
 */
function loadTrackers() {
  const trackersTable = document.getElementById("trackersTable");
  trackersTable.innerHTML = ""; // Clear existing rows

  window.cert
    .loadTrackers()
    .then((trackers) => {
      console.log("Trackers loaded:", trackers);
      trackers.forEach(
        ({ id, titleName, supportedPlatforms, leadName, testCases }) => {
          console.log("Processing tracker:", titleName);

          let parsedTestCases = [];
          try {
            console.log("Raw test cases:", testCases);
            console.log("Type of testCases:", typeof testCases);

            // Ensure testCases is handled properly
            if (typeof testCases === "string" && testCases.trim() !== "") {
              parsedTestCases = JSON.parse(testCases);
            } else if (Array.isArray(testCases)) {
              parsedTestCases = testCases;
            } else {
              console.error("Unexpected format for testCases:", testCases);
              throw new Error("Invalid format for test cases");
            }

            const totalCases = parsedTestCases.length;
            const completedCases = parsedTestCases.filter((tc) =>
              ["N/A", "Pass", "Fail", "CNT"].includes(tc.status)
            ).length;

            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${titleName || "N/A"}</td>
              <td>${supportedPlatforms || "N/A"}</td>
              <td>${leadName || "N/A"}</td>
              <td>
                <div class="progress-container">
                  <div class="progress-text">${completedCases} / ${totalCases}</div>
                </div>
              </td>
              <td>
                <a href="trackerDetails.html?trackerId=${
                  id || ""
                }" class="btn btn-primary">View Details</a>
                <button class="btn btn-danger" onclick="deleteTracker('${
                  id || ""
                }')">Delete</button>
              </td>
            `;
            trackersTable.appendChild(row);
          } catch (error) {
            console.error("Error processing tracker:", titleName, error);
          }
        }
      );
    })
    .catch((error) => {
      console.error("Error loading trackers:", error);
      alert("Failed to load trackers. Please try again.");
    });
}

/**
 * Loads and displays history from the database.
 */
function loadHistory() {
  const historyTable = document.getElementById("historyTable");
  historyTable.innerHTML = ""; // Clear existing rows

  window.cert
    .loadHistory()
    .then((histories) => {
      console.log("History loaded:", histories);
      histories.forEach((tracker) => {
        console.log("Processing history tracker:", tracker);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${tracker.titleName || "N/A"}</td>
          <td>${formatDate(tracker.date)}</td>
          <td>
            <button class="btn btn-primary" onclick="viewTestCases('${
              tracker.id || ""
            }')">View Test Cases</button>
          </td>
        `;
        historyTable.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error loading history:", error);
      alert("Failed to load history. Please try again.");
    });
}

/**
 * Sets up the search functionality for the history table.
 */
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", filterHistory);
}

/**
 * Filters the history table based on the search input.
 */
function filterHistory() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#historyTable tr");

  rows.forEach((row) => {
    const titleName = row.children[0].textContent.toLowerCase();
    const date = row.children[1].textContent.toLowerCase();
    row.style.display =
      titleName.includes(searchTerm) || date.includes(searchTerm) ? "" : "none";
  });
}

/**
 * Deletes a tracker based on its ID.
 * @param {string} id - The ID of the tracker to delete.
 */
function deleteTracker(id) {
  console.log("Deleting tracker with ID:", id);
  if (confirm("Are you sure you want to delete this tracker?")) {
    window.cert
      .deleteTracker(id)
      .then(() => {
        console.log("Tracker deleted:", id);
        loadTrackers();
        loadHistory(); // Refresh history after deletion
      })
      .catch((error) => {
        console.error("Error deleting tracker:", error);
        alert("Failed to delete tracker. Please try again.");
      });
  }
}

/**
 * Views the test cases for a given tracker.
 * @param {string} trackerId - The ID of the tracker to view test cases for.
 */
function viewTestCases(trackerId) {
  console.log("Fetching test cases for tracker ID:", trackerId);
  window.cert
    .getTestCases(trackerId)
    .then((testCasesString) => {
      console.log("Raw test cases string:", testCasesString);

      let testCases;
      try {
        if (typeof testCasesString === "string") {
          if (testCasesString.trim() === "") {
            throw new Error("Received empty string");
          }
          testCases = JSON.parse(testCasesString);
        } else if (Array.isArray(testCasesString)) {
          testCases = testCasesString;
        } else {
          throw new Error("Invalid format for test cases");
        }
      } catch (error) {
        console.error("Error parsing test cases:", error);
        alert("Failed to load test cases. Please try again.");
        return;
      }

      console.log("Test cases loaded:", testCases);

      // Aquí agregas los logs para verificar el array
      console.log("Is array:", Array.isArray(testCases));
      console.log("Length:", testCases.length);

      if (Array.isArray(testCases) && testCases.length > 0) {
        // Limpiar el contenedor antes de renderizar
        const container = document.getElementById("testCasesContainer");
        container.innerHTML = ""; // Limpiar antes de agregar nuevos casos

        renderTestCases(testCases);
        const testCasesModal = new bootstrap.Modal(
          document.getElementById("testCasesModal")
        );
        testCasesModal.show();
      } else {
        alert("No test cases found for this tracker.");
      }
    })
    .catch((error) => {
      console.error("Error loading test cases:", error);
      alert("Failed to load test cases. Please try again.");
    });
}

/**
 * Renders the test cases in the modal.
 * @param {Array} testCases - Array of test cases to render.
 */
function renderTestCases(testCases) {
  const container = document.getElementById("testCasesContainer");
  container.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos casos

  testCases.forEach((testCase) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h5>${testCase.title} (${testCase.status})</h5>
      <p>${testCase.comment}</p>
    `;
    container.appendChild(div);
  });
}

/**
 * Checks if all test cases are complete.
 * @param {Array} testCases - Array of test cases to check.
 * @returns {boolean} True if all test cases are complete, false otherwise.
 */
function areAllTestCasesComplete(testCases) {
  const allComplete = testCases.every((tc) =>
    ["N/A", "Pass", "Fail", "CNT"].includes(tc.status)
  );
  console.log("All test cases complete:", allComplete);
  return allComplete;
}

/**
 * Moves completed trackers to history.
 */
function moveCompletedTrackersToHistory() {
  window.cert
    .getAllTrackers()
    .then((trackers) => {
      const completedTrackers = trackers.filter((tracker) => {
        let testCases = [];
        try {
          console.log("Raw test cases:", tracker.testCases);

          // Verificar si testCases es una cadena y no está vacía
          if (
            typeof tracker.testCases === "string" &&
            tracker.testCases.trim() !== ""
          ) {
            testCases = JSON.parse(tracker.testCases);
          } else if (Array.isArray(tracker.testCases)) {
            testCases = tracker.testCases;
          } else {
            console.error("Invalid format for test cases:", tracker.testCases);
            return false; // Formato no válido
          }

          // Validaciones adicionales
          if (!Array.isArray(testCases)) {
            console.error("Parsed test cases are not an array:", testCases);
            return false; // No es un array
          }

          console.log("Parsed test cases:", testCases);
          console.log("Is array:", Array.isArray(testCases));
          console.log("Length:", testCases.length);
        } catch (e) {
          console.error("Error parsing test cases:", e);
          return false; // Saltar trackers con errores de análisis
        }
        return areAllTestCasesComplete(testCases);
      });

      if (completedTrackers.length > 0) {
        Promise.all(
          completedTrackers.map((tracker) => {
            const dateText = new Date().toISOString();

            return window.cert.moveTrackerToHistory({
              id: tracker.id || null,
              titleName: tracker.titleName || "",
              supportedPlatforms: tracker.supportedPlatforms || "",
              leadName: tracker.leadName || "",
              testCases: JSON.stringify(tracker.testCases || []),
              date: dateText,
            });
          })
        )
          .then(() => {
            alert("Completed trackers moved to history.");
            loadTrackers();
            loadHistory();
          })
          .catch((error) => {
            console.error("Error moving trackers to history:", error);
            alert("Failed to move trackers to history. Please try again.");
          });
      } else {
        alert("No completed trackers found to move to history.");
      }
    })
    .catch((error) => {
      console.error("Error getting trackers for moving to history:", error);
      alert(
        "Failed to retrieve trackers for moving to history. Please try again."
      );
    });
}
