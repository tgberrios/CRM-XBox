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
      trackers.forEach((tracker) => {
        console.log("Processing tracker:", tracker);

        // Parse testCases safely
        let testCases = [];
        try {
          testCases = JSON.parse(tracker.testCases) || [];
        } catch (error) {
          console.error("Error parsing test cases:", error);
        }

        const totalCases = testCases.length;
        const completedCases = testCases.filter((tc) =>
          ["N/A", "Pass", "Fail", "CNT"].includes(tc.status)
        ).length;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${tracker.titleName || "N/A"}</td>
          <td>${tracker.supportedPlatforms || "N/A"}</td>
          <td>${tracker.leadName || "N/A"}</td>
          <td>
            <div class="progress-container">
              <div class="progress-text">${completedCases} / ${totalCases}</div>
            </div>
          </td>
          <td>
            <a href="trackerDetails.html?trackerId=${
              tracker.id || ""
            }" class="btn btn-primary">View Details</a>
            <button class="btn btn-danger" onclick="deleteTracker('${
              tracker.id || ""
            }')">Delete</button>
          </td>
        `;
        trackersTable.appendChild(row);
      });
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
  window.cert
    .getTestCases(trackerId)
    .then((testCasesString) => {
      try {
        const testCases = JSON.parse(testCasesString);
        console.log("Test cases loaded:", testCases);
        if (testCases.length > 0) {
          renderTestCases(testCases);
          const testCasesModal = new bootstrap.Modal(
            document.getElementById("testCasesModal")
          );
          testCasesModal.show();
        } else {
          alert("No test cases found for this tracker.");
        }
      } catch (error) {
        console.error("Error parsing test cases:", error);
        alert("Failed to load test cases. Please try again.");
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
  container.innerHTML = ""; // Clear existing content

  testCases.forEach((testCase) => {
    const div = document.createElement("div");
    div.classList.add("test-case");
    div.innerHTML = `
      <h6>${testCase.title || "N/A"}</h6>
      <p class="tester-name">Tester: ${testCase.testerName || "N/A"}</p>
      <p>Status: ${testCase.status || "N/A"}</p>
      <p>Description: ${testCase.comment || "N/A"}</p>
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
      // Get only trackers where all test cases are complete
      const completedTrackers = trackers.filter((tracker) => {
        let testCases = [];
        try {
          testCases = JSON.parse(tracker.testCases);
        } catch (e) {
          console.error("Error parsing test cases:", e);
          return false; // Skip trackers with parsing errors
        }
        return areAllTestCasesComplete(testCases);
      });

      if (completedTrackers.length > 0) {
        // Move each completed tracker to history
        Promise.all(
          completedTrackers.map((tracker) =>
            window.cert.moveTrackerToHistory(tracker)
          )
        )
          .then(() => {
            alert("Completed trackers moved to history.");
            loadTrackers(); // Refresh trackers
            loadHistory(); // Refresh history
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
