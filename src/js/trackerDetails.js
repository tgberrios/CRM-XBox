// Datos JSON incluidos directamente en el HTML
const testData = {
  testCases: {
    "001-01": "Title Stability",
    "003-02": "Title Integrity",
    "003-03": "Options",
    "003-04": "Language Support",
    "003-05": "Navigation",
    "014-01": "Personal Information",
    "022-01": "Official Naming Standards",
    "001-03": "Title Stability after Connected Standby",
    "003-14": "Local Multiple Players",
    "057-01": "No Additional Purchases Required for Base Achievements",
    "112-03": "No Signed-In User",
    "112-04": "Active User Indication",
    "112-05": "Access to Account Picker",
    "115-01": "Addition of Users",
    "130-01": "Controller Input",
    "130-04": "Featured Game Modes",
    "131-01": "Game DVR and Screenshots - Console 1",
    "115-02": "Removal of Controllers",
    "055-01": "Achievements",
    "115-03": "Removal of Users",
    "003-17": "Headset State Change",
    "003-18": "Headset State Change after Suspend",
    "003-19": "Headset State Change after Connected Standby",
    "018-01":
      "Reporting Inappropriate Content and UGC Text-String Verification",
    "050-02": "Cloud Storage: Roaming [USE GOLD PROFILE]",
    "123-01":
      "Installation/Unlock of Game Add-Ons or Consumables During Gameplay",
    "130-02": "Save Game Roaming [USE GOLD PROFILE]",
    "003-10": "Cross Region",
    "064-01": "Joining a Game Session from Outside the Game",
    "064-02": "Joining a Game Session from the Same Game",
    "064-05": "Non-Joinable Game",
    "067-01": "Maintaining Session State",
    "015-02": "Muting Support  - (matrix on Voice tab)",
    "015-03": "Blocked Users - (matrix on Voice tab)",
    "124-01": "Game Invitations - (matrix on Invites&Joins tab)",
    "130-03": "Online Segmentation",
    "015-01": "User Communication",
    "045-01": "Respect User Privileges",
    "064-07": "Xbox Play Anywhere - Cross Platform",
    "003-07": "Leaderboards",
    "003-08": "Low or High Friend Count",
    "047-01": "User-Profile Access - (matrix on Gtag tab)",
    "001-02": "Title Stability After Suspending",
    "013-01": "Linking Microsoft Accounts with Publisher Accounts",
    "046-01": "Display Name and Gamerpic - (matrix on Gtag tab)",
    "048-01": "Profile Settings Usage - (matrix on Gtag tab)",
    "050-01": "Correct User Association",
    "052-01": "User Sign-In and Sign-Out",
    "052-02": "User Change During Suspended or Terminated State",
    "112-02": "Initial User and Controller",
    "112-08": "User Change During Suspension",
    "001-04": "Title Stability After Quick Resume",
    "130-05": "Compatibility Mode",
    "812-01": "Scarlett Performance",
    "074-01": "WAN Disconnection to Xbox Services",
    "074-02": "Direct Disconnection",
    "074-07": "Dynamic Connectivity Loss",
    "074-08": "Pre-Launch Downtime",
    "112-06": "Handling Profile Change",
    "129-01": "Intelligent Delivery of Language Packs",
    "129-02": "Intelligent Delivery of Device specific Content",
    "129-03": "Migration of Device Specific Content",
    "129-04": "Intelligent Delivery of On-Demand Content",
    "074-03": "Suspend Disconnection to Xbox Services",
    "074-04": "Xbox Service Reconnection During Suspend",
    "074-05": "Constant Low Bandwidth",
    "074-06": "Variable Low Bandwidth",
    "112-07": "User Change During Constrained Mode",
    "129-05": "Features and Recipes",
    "037-04": "Multiplayer DLC",
    "034-01": "Streaming Installation",
    "037-01": "No Content Package Save-Game Dependencies for Base Title",
    "037-02": "No Dependencies on Other Content Packages",
    "123-02":
      "Installation/Unlock of Game Add-Ons or Consumables as Part of Main Game Package During Streaming Install",
    "117-01": "Beta/Game Preview Notification to Users",
    "003-16": "Save-Game Compatibility",
    "037-03": "DLC Dependency",
    "036-01": "Content Price Verification",
    "070-01": "Xbox Friends List",
    "132-01": "Service Access Limitations",
    "132-02": "Game Event Limitations",
    "133-01": "Local Storage Write Limitations",
    "001-01.2": "Hardware Requirements",
    "003-00": "App is testable",
    "002-10": "General Security",
    "003-10": "Cross Region",
    "003-14": "Local Multiple Players",
    "003-17": "Headset State Change",
    "003-18": "Headset State Change after Suspend",
    "003-18": "Headset State Change after Connected Standby",
    "003-24": "Test Account",
    "004-02": "App Crash or Freeze",
    "004-03": "App Responsiveness",
    "037-03": "DLC Dependendy",
    "037-04": "Multiplayer DLC",
    "064-01": "Joining a Game Session from Outside the Game",
    "064-02": "Joining a Game Session from the Same Game",
    "064-05": "Non-Joinable Game",
    "064-07": "Xbox Play Anywhere - Cross Platform",
    "067-01": "Maintaning Session State",
    "124-01": "Game Invitations",
    "130-01": "Controller Input",
    "130-02": "Save Game Roaming",
    "130-03": "Online Segmentation",
    "130-04": "Featured Game Modes",
    "130-05": "Compatibility Mode",
    "131-01": "Game DVR and Screenshots",
    "132-01": "Service Access Limitations",
    "132-02": "Game Even Limitations",
    "133-01": "Local Storage Write Limitations",
    "812-01": "Scarlett Performance",
    "999-03": "Online - Only Metadata Verification",
    "999-90": "Optional Test Pass",
    "034-01": "Streaming Installation",
    "047-01": "User-Profile Access",
    "052-01": "User Sign-In and Sign-Out",
    "052-02": "User Change During Suspended or Terminated State",
    "057-01": "No Additional Purchases Required for Base Achievements",
    "112-02": "Initial User And Controller",
    "112-03": "No Signed-In User",
    "112-04": "Active User Indication",
    "112-05": "Access to Account Picker",
    "112-06": "Handling Profile Change",
    "112-07": "User Change During Constrained Mode",
    "112-08": "User Change During Suspension",
    "129-01": "Intelligent Delivery of Langueage Packs",
    "129-02": "Intelligent Delivery of Device specific Content",
    "129-03": "Migration of Device Specific Content",
    "129-04": "Intelligent Delivery of On-Demand Content",
    "129-05": "Features and Recipes",
    "003-07": "Leaderboards",
    "037-01": "No Content Package Save-Game Dependencies for Base Title",
    "037-02": "No Dependencies on Other Content Packages",
    "046-01": "Display Name and Gamerpic",
    "074-01": "WAN Disconnection to Xbox Services",
    "074-02": "Direct Disconnection",
    "074-03": "Suspend Disconnection to Xbox Services",
    "074-04": "Xbox Service Reconnection During Suspend",
    "074-07": "Dynamic Connectivity Loss",
    "074-08": "Pre-Lunch Downtime",
    "115-01": "Addition of Users",
    "115-02": "Removal of Controllers",
    "115-03": "Removal of Users",
    "123-01":
      "Installation/Unlock of Game Add-Ons or Consumables During Gameplay",
    "123-02":
      "Installation/Unlock of Game Add-Ons or Consumables as Part of Main Game Package During Streaming Install",
    "003-04": "Language Support",
    "003-08": "Low or High Friend Count",
    "036-01": "Content Price Verification",
    "048-01": "Profile Settings Usage",
    "070-01": "Xbox Friends List",
    "074-05": "Constant Low Bandwith",
    "074-06": "Variable Low Bandwith",
  },
  testModels: {
    TC5: [
      "001-01",
      "003-02",
      "003-16",
      "013-01",
      "014-01",
      "015-01",
      "015-02",
      "015-03",
      "018-01",
      "022-01",
      "045-01",
      "046-01",
      "048-01",
      "050-01",
      "050-02",
      "052-01",
      "052-02",
      "112-02",
      "112-08",
      "001-04",
      "130-05",
      "812-01",
    ],
    TC4: [
      "001-01",
      "003-02",
      "003-16",
      "013-01",
      "014-01",
      "015-01",
      "015-02",
      "015-03",
      "018-01",
      "022-01",
      "045-01",
      "046-01",
      "048-01",
      "050-01",
      "050-02",
      "052-01",
      "052-02",
      "112-02",
      "112-08",
      "001-04",
      "130-05",
      "812-01",
      "001-01.2",
      "001-02",
      "001-03",
      "001-04",
      "003-00",
      "002-10",
      "003-03",
      "003-10",
      "003-14",
      "003-17",
      "003-18",
      "003-19",
      "003-24",
      "004-02",
      "004-03",
      "037-03",
      "037-04",
      "064-01",
      "064-02",
      "064-05",
      "064-07",
      "067-01",
      "124-01",
      "130-01",
      "130-02",
      "130-03",
      "130-04",
      "130-05",
      "131-01",
      "132-01",
      "132-02",
      "133-01",
      "812-01",
      "999-03",
      "999-90",
    ],
    TC3: [
      "001-01",
      "003-02",
      "003-16",
      "013-01",
      "014-01",
      "015-01",
      "015-02",
      "015-03",
      "018-01",
      "022-01",
      "045-01",
      "046-01",
      "048-01",
      "050-01",
      "050-02",
      "052-01",
      "052-02",
      "112-02",
      "112-08",
      "001-04",
      "130-05",
      "812-01",
      "001-01.2",
      "001-02",
      "001-03",
      "001-04",
      "003-00",
      "002-10",
      "003-03",
      "003-10",
      "003-14",
      "003-17",
      "003-18",
      "003-19",
      "003-24",
      "004-02",
      "004-03",
      "037-03",
      "037-04",
      "064-01",
      "064-02",
      "064-05",
      "064-07",
      "067-01",
      "124-01",
      "130-01",
      "130-02",
      "130-03",
      "130-04",
      "130-05",
      "131-01",
      "132-01",
      "132-02",
      "133-01",
      "812-01",
      "999-03",
      "999-90",
      "034-01",
      "047-01",
      "052-01",
      "052-02",
      "057-01",
      "112-02",
      "112-03",
      "112-04",
      "112-05",
      "112-06",
      "112-07",
      "112-08",
      "129-01",
      "129-02",
      "129-03",
      "129-04",
      "129-05",
    ],
    TC2: [
      "001-01",
      "003-02",
      "003-16",
      "013-01",
      "014-01",
      "015-01",
      "015-02",
      "015-03",
      "018-01",
      "022-01",
      "045-01",
      "046-01",
      "048-01",
      "050-01",
      "050-02",
      "052-01",
      "052-02",
      "112-02",
      "112-08",
      "001-04",
      "130-05",
      "812-01",
      "001-01.2",
      "001-02",
      "001-03",
      "001-04",
      "003-00",
      "002-10",
      "003-03",
      "003-10",
      "003-14",
      "003-17",
      "003-18",
      "003-19",
      "003-24",
      "004-02",
      "004-03",
      "037-03",
      "037-04",
      "064-01",
      "064-02",
      "064-05",
      "064-07",
      "067-01",
      "124-01",
      "130-01",
      "130-02",
      "130-03",
      "130-04",
      "130-05",
      "131-01",
      "132-01",
      "132-02",
      "133-01",
      "812-01",
      "999-03",
      "999-90",
      "034-01",
      "047-01",
      "052-01",
      "052-02",
      "057-01",
      "112-02",
      "112-03",
      "112-04",
      "112-05",
      "112-06",
      "112-07",
      "112-08",
      "129-01",
      "129-02",
      "129-03",
      "129-04",
      "129-05",
      "003-07",
      "037-01",
      "037-02",
      "046-01",
      "074-01",
      "074-02",
      "074-03",
      "074-04",
      "074-07",
      "074-08",
      "115-01",
      "115-02",
      "115-03",
      "123-01",
      "123-02",
    ],
    TC1: [
      "001-01",
      "003-02",
      "003-16",
      "013-01",
      "014-01",
      "015-01",
      "015-02",
      "015-03",
      "018-01",
      "022-01",
      "045-01",
      "046-01",
      "048-01",
      "050-01",
      "050-02",
      "052-01",
      "052-02",
      "112-02",
      "112-08",
      "001-04",
      "130-05",
      "812-01",
      "001-01.2",
      "001-02",
      "001-03",
      "001-04",
      "003-00",
      "002-10",
      "003-03",
      "003-10",
      "003-14",
      "003-17",
      "003-18",
      "003-19",
      "003-24",
      "004-02",
      "004-03",
      "037-03",
      "037-04",
      "064-01",
      "064-02",
      "064-05",
      "064-07",
      "067-01",
      "124-01",
      "130-01",
      "130-02",
      "130-03",
      "130-04",
      "130-05",
      "131-01",
      "132-01",
      "132-02",
      "133-01",
      "812-01",
      "999-03",
      "999-90",
      "034-01",
      "047-01",
      "052-01",
      "052-02",
      "057-01",
      "112-02",
      "112-03",
      "112-04",
      "112-05",
      "112-06",
      "112-07",
      "112-08",
      "129-01",
      "129-02",
      "129-03",
      "129-04",
      "129-05",
      "003-07",
      "037-01",
      "037-02",
      "046-01",
      "074-01",
      "074-02",
      "074-03",
      "074-04",
      "074-07",
      "074-08",
      "115-01",
      "115-02",
      "115-03",
      "123-01",
      "123-02",
      "003-04",
      "003-08",
      "036-01",
      "048-01",
      "070-01",
      "074-05",
      "074-06",
    ],
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const trackerId = urlParams.get("trackerId");

  if (trackerId) {
    loadTrackerDetails(trackerId);
  }

  document.getElementById("saveButton").addEventListener("click", saveDetails);
  document
    .getElementById("statusFilter")
    .addEventListener("change", applyFilter);
});

/**
 * Fetches and displays the tracker details.
 * @param {string} trackerId - The ID of the tracker to load.
 */
async function loadTrackerDetails(trackerId) {
  try {
    const tracker = await window.cert.loadTrackerDetails(trackerId);

    if (tracker?.testCases) {
      const testCasesContainer = document.getElementById("testCasesContainer");
      testCasesContainer.innerHTML = "";

      const testCases = JSON.parse(tracker.testCases);
      testCases.forEach((testCase) => {
        const div = document.createElement("div");
        div.className = "testcase";

        const description = testData.testCases[testCase.id] || "No Description";

        div.innerHTML = `
          <div class="testcase-row">
            <label for="testCase-${testCase.id}">${description}</label>
            <input type="text" id="testCase-${testCase.id}" value="${
          testCase.comment || ""
        }" placeholder="Comment" />
            <input type="text" class="tester-name" id="testerName-${
              testCase.id
            }" value="${testCase.testerName || ""}" placeholder="Tester Name" />
            <select id="status-${testCase.id}">
              <option value="n/a" ${
                testCase.status === "n/a" ? "selected" : ""
              }>N/A</option>
              <option value="Pass" ${
                testCase.status === "Pass" ? "selected" : ""
              }>Pass</option>
              <option value="Fail" ${
                testCase.status === "Fail" ? "selected" : ""
              }>Fail</option>
              <option value="CNT" ${
                testCase.status === "CNT" ? "selected" : ""
              }>CNT</option>
            </select>
          </div>
        `;

        testCasesContainer.appendChild(div);
      });

      const noTestCasesMessage = document.querySelector(
        "#testCasesContainer .no-test-cases"
      );
      if (noTestCasesMessage) {
        noTestCasesMessage.style.display =
          testCasesContainer.querySelectorAll(".testcase").length > 0
            ? "none"
            : "block";
      }
    }
  } catch (error) {
    console.error("Error loading tracker details:", error);
    // Consider adding user feedback for better UX
    alert("Failed to load tracker details.");
  }
}

/**
 * Saves the updated details of test cases.
 */
async function saveDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const trackerId = urlParams.get("trackerId");

  try {
    const tracker = await window.cert.loadTrackerDetails(trackerId);

    if (tracker?.testCases) {
      const testCases = JSON.parse(tracker.testCases);

      testCases.forEach((testCase) => {
        const commentElement = document.getElementById(
          `testCase-${testCase.id}`
        );
        const statusElement = document.getElementById(`status-${testCase.id}`);
        const testerNameElement = document.getElementById(
          `testerName-${testCase.id}`
        );

        if (commentElement && statusElement && testerNameElement) {
          testCase.comment = commentElement.value;
          testCase.status = statusElement.value;
          testCase.testerName = testerNameElement.value;
        }
      });

      tracker.testCases = JSON.stringify(testCases);
      await window.cert.saveTrackerDetails(tracker);
      alert("Details saved successfully.");
    } else {
      alert("Tracker not found or no test cases available.");
    }
  } catch (error) {
    console.error("Error saving tracker details:", error);
    alert("Failed to save details.");
  }
}

/**
 * Applies a filter to display test cases based on their status.
 */
function applyFilter() {
  const filterValue = document.getElementById("statusFilter").value;
  const testCasesContainer = document.getElementById("testCasesContainer");
  const testCaseDivs = testCasesContainer.querySelectorAll(".testcase");

  testCaseDivs.forEach((div) => {
    const statusSelect = div.querySelector("select");
    const status = statusSelect.value;

    div.style.display =
      filterValue === "all" || status === filterValue ? "flex" : "none";
  });

  const noTestCasesMessage = document.querySelector(
    "#testCasesContainer .no-test-cases"
  );
  if (noTestCasesMessage) {
    noTestCasesMessage.style.display =
      testCasesContainer.querySelectorAll(".testcase").length > 0
        ? "none"
        : "block";
  }
}
