let quill;

$(document).ready(() => {
  initializeQuill();
  displayTestCases();
  attachEventListeners();
});

/**
 * Initializes the Quill editor.
 */
function initializeQuill() {
  quill = new Quill("#documentation", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
      ],
    },
  });
}

/**
 * Attaches event listeners to DOM elements.
 */
function attachEventListeners() {
  $("#searchInput").on("input", function () {
    displayTestCases(this.value.toLowerCase());
  });

  $("#testCaseForm").on("submit", async (e) => {
    e.preventDefault();
    await saveTestCase();
  });

  // Use event delegation for dynamically added elements
  $("#testCasesList").on("click", ".clickable", function () {
    const id = $(this).data("id");
    viewTestCase(id);
  });
}

/**
 * Saves a new or existing test case.
 */
async function saveTestCase() {
  const id = $("#testCaseId").val();
  const testCaseData = {
    xr: $("#xr").val(),
    documentation: quill.root.innerHTML,
    passExample: $("#passExample").val(),
    failExample: $("#failExample").val(),
    naExample: $("#naExample").val(),
  };

  try {
    if (id) {
      await window.cert.updateTestCase({ id, ...testCaseData });
    } else {
      await window.cert.insertTestCase(testCaseData);
    }
    $("#testCaseModal").modal("hide");
    await displayTestCases();
  } catch (error) {
    handleError("Failed to save test case", error);
  }
}

/**
 * Displays test cases filtered by a search value.
 * @param {string} searchValue - The string to filter test cases by XR or documentation.
 */
async function displayTestCases(searchValue = "") {
  try {
    const testCases = await window.cert.getAllTestCases();
    const filteredTestCases = testCases.filter(
      (testCase) =>
        testCase.xr.toLowerCase().includes(searchValue) ||
        testCase.documentation.toLowerCase().includes(searchValue)
    );

    const list = $("#testCasesList");
    list.empty();

    filteredTestCases.forEach((testCase) => {
      const item = $(`
          <div class="card mb-2">
            <div class="card-body">
              <h5 class="card-title clickable" data-id="${testCase.id}">XR: ${testCase.xr}</h5>
            </div>
          </div>
        `);
      list.append(item);
    });
  } catch (error) {
    handleError("Failed to display test cases", error);
  }
}

/**
 * Retrieves and displays the details of a specific test case.
 * @param {number} id - The ID of the test case to be viewed.
 */
async function viewTestCase(id) {
  try {
    const testCase = await window.cert.getTestCaseById(id);

    $("#viewXR").text(testCase.xr);
    $("#viewDocumentation").html(testCase.documentation);
    $("#viewPassExample").text(testCase.passExample);
    $("#viewFailExample").text(testCase.failExample);
    $("#viewNAExample").text(testCase.naExample);
    $("#viewImage").html(
      testCase.image ? `<img src="${testCase.image}" class="img-fluid" />` : ""
    );

    $("#viewModal").modal("show");

    $("#editButton")
      .off("click")
      .on("click", () => {
        populateTestCaseForm(testCase);
        $("#testCaseModal").modal("show");
      });

    $("#deleteButton")
      .off("click")
      .on("click", () => deleteTestCase(testCase.id));
  } catch (error) {
    handleError("Failed to view test case", error);
  }
}

/**
 * Populates the form fields with the details of a specific test case.
 * @param {Object} testCase - The test case object containing the details.
 */
function populateTestCaseForm(testCase) {
  $("#xr").val(testCase.xr);
  quill.root.innerHTML = testCase.documentation;
  $("#passExample").val(testCase.passExample);
  $("#failExample").val(testCase.failExample);
  $("#naExample").val(testCase.naExample);
  $("#testCaseId").val(testCase.id);
}

/**
 * Deletes a test case by its ID and refreshes the test case list.
 * @param {number} id - The ID of the test case to be deleted.
 */
async function deleteTestCase(id) {
  try {
    await window.cert.deleteTestCase(id);
    $("#viewModal").modal("hide");
    await displayTestCases();
  } catch (error) {
    handleError("Failed to delete test case", error);
  }
}

/**
 * Handles errors by logging them and optionally notifying the user.
 * @param {string} message - The error message.
 * @param {Error} error - The error object.
 */
function handleError(message, error) {
  console.error(message, error);
  // Implement user notification (e.g., toast message) if needed
}
