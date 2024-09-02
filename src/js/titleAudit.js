// Initialize Quill editors for rich text fields
const actionItemsEditor = new Quill("#actionItemsEditor", {
  theme: "snow",
  modules: {
    toolbar: true,
  },
});

const bugQualityTrackingEditor = new Quill("#bugQualityTrackingEditor", {
  theme: "snow",
  modules: {
    toolbar: true,
  },
});

// Initialize Bootstrap modal
const modal = new bootstrap.Modal(document.getElementById("editAuditModal"));

/**
 * Function to add a new audit.
 * Collects form data, creates an audit object, and saves it.
 */
async function addAudit() {
  // Collect form data
  const titleName = document.getElementById("titleName").value;
  const submissionIteration = document.getElementById(
    "submissionIteration"
  ).value;
  const generation = document.getElementById("generation").value;
  const testDate = document.getElementById("testDate").value;
  const nonCFRIssuesLogged =
    document.getElementById("nonCFRIssuesLogged").value;
  const cfrIssuesLogged = document.getElementById("cfrIssuesLogged").value;
  const totalCFRMissed = document.getElementById("totalCFRMissed").value;
  const lead = document.getElementById("lead").value;
  const testers = document.getElementById("testers").value;
  const actionItems = actionItemsEditor.root.innerHTML;
  const bugQualityTracking = bugQualityTrackingEditor.root.innerHTML;

  const audit = {
    titleName,
    submissionIteration,
    generation,
    testDate,
    nonCFRIssuesLogged,
    cfrIssuesLogged,
    totalCFRMissed,
    lead,
    testers,
    actionItems,
    bugQualityTracking,
  };

  try {
    await window.cert.addAudit(audit);
    loadAudits(); // Refresh the list of audits
    document.getElementById("evaluationForm").reset();
    actionItemsEditor.root.innerHTML = "";
    bugQualityTrackingEditor.root.innerHTML = "";
  } catch (error) {
    console.error("Error adding audit:", error);
    alert("Failed to add audit. Please try again.");
  }
}

// Event listener for adding an audit
document.getElementById("addAudit").addEventListener("click", addAudit);

/**
 * Function to load and display audits from the database.
 */
async function loadAudits() {
  const reportList = document.getElementById("reportList");
  reportList.innerHTML = ""; // Clear existing content

  try {
    const audits = await window.cert.loadAudits();
    audits.forEach((audit) => {
      const reportItem = document.createElement("div");
      reportItem.className = "report-item";
      reportItem.innerHTML = `<strong>${audit.titleName}</strong><br/>Test Date: ${audit.testDate}`;
      reportItem.onclick = () => showModal(audit);
      reportList.appendChild(reportItem);
    });

    // Handle case where no audits are available
    if (audits.length === 0) {
      reportList.innerHTML = "<p>No audits found.</p>";
    }
  } catch (error) {
    console.error("Error loading audits:", error);
    alert("Failed to load audits. Please try again.");
  }
}

// Function to display the modal with audit details
function showModal(audit) {
  document.getElementById("modalTitleName").innerText = audit.titleName;
  document.getElementById("modalSubmissionIteration").innerText =
    audit.submissionIteration;
  document.getElementById("modalGeneration").innerText = audit.generation;
  document.getElementById("modalTestDate").innerText = audit.testDate;
  document.getElementById("modalNonCFRIssuesLogged").innerText =
    audit.nonCFRIssuesLogged;
  document.getElementById("modalCFRIssuesLogged").innerText =
    audit.cfrIssuesLogged;
  document.getElementById("modalTotalCFRMissed").innerText =
    audit.totalCFRMissed;
  document.getElementById("modalLead").innerText = audit.lead;
  document.getElementById("modalTesters").innerText = audit.testers;
  document.getElementById("modalActionItems").innerHTML = audit.actionItems;
  document.getElementById("modalBugQualityTracking").innerHTML =
    audit.bugQualityTracking;

  document.getElementById("editAuditModal").setAttribute("data-id", audit.id);
  modal.show();
}

// Event listener for deleting an audit
document.getElementById("deleteAudit").addEventListener("click", async () => {
  const auditId = document
    .getElementById("editAuditModal")
    .getAttribute("data-id");

  try {
    await window.cert.deleteAudit(Number(auditId));
    loadAudits(); // Refresh the list after deletion
    modal.hide();
  } catch (error) {
    console.error("Error deleting audit:", error);
    alert("Failed to delete audit. Please try again.");
  }
});

// Event listener for editing an audit
document.getElementById("editAudit").addEventListener("click", async () => {
  const auditId = document
    .getElementById("editAuditModal")
    .getAttribute("data-id");

  try {
    const audit = await window.cert.getAudit(Number(auditId));
    if (audit) {
      // Populate form with existing audit data
      document.getElementById("titleName").value = audit.titleName;
      document.getElementById("submissionIteration").value =
        audit.submissionIteration;
      document.getElementById("generation").value = audit.generation;
      document.getElementById("testDate").value = audit.testDate;
      document.getElementById("nonCFRIssuesLogged").value =
        audit.nonCFRIssuesLogged;
      document.getElementById("cfrIssuesLogged").value = audit.cfrIssuesLogged;
      document.getElementById("totalCFRMissed").value = audit.totalCFRMissed;
      document.getElementById("lead").value = audit.lead;
      document.getElementById("testers").value = audit.testers;
      actionItemsEditor.root.innerHTML = audit.actionItems;
      bugQualityTrackingEditor.root.innerHTML = audit.bugQualityTracking;

      modal.show();
    }
  } catch (error) {
    console.error("Error fetching audit:", error);
    alert("Failed to retrieve audit details. Please try again.");
  }
});

loadAudits();
