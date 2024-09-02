document
  .getElementById("issueForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const issue = {
      name: document.getElementById("name").value,
      date: document.getElementById("date").value,
      observedBehavior: quillObserved.root.innerHTML,
      reproductionSteps: quillReproduction.root.innerHTML,
      expectedBehavior: quillExpected.root.innerHTML,
      notes: quillNotes.root.innerHTML,
      bqScore: document.getElementById("bqScore").value,
      tags: document.getElementById("tags").value,
      xr: document.getElementById("xr").value,
      scenario: document.getElementById("scenario").value,
    };

    try {
      await window.cert.addIssue(issue);
      event.target.reset();
      quillObserved.root.innerHTML = "";
      quillReproduction.root.innerHTML = "";
      quillExpected.root.innerHTML = "";
      quillNotes.root.innerHTML = "";

      displayIssues(); // Fetch and display issues again after adding a new one
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  });

const displayIssues = async () => {
  try {
    const issues = await window.cert.getIssues();
    const issueList = document.getElementById("issueList");
    issueList.innerHTML = "";

    issues.forEach((issue) => {
      const issueItem = document.createElement("a");
      issueItem.classList.add("list-group-item", "list-group-item-action");
      issueItem.href = "#";
      issueItem.dataset.issue = JSON.stringify(issue);
      issueItem.innerHTML = `
      <div>
        <strong>${issue.name}</strong> - ${issue.tags}
      </div>
      <small>${issue.observedBehavior}</small>
    `;
      issueItem.addEventListener("click", () => showIssueDetails(issue));
      issueList.appendChild(issueItem);
    });
  } catch (error) {
    console.error("Error displaying issues:", error);
  }
};

const showIssueDetails = (issue) => {
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `
  <h5>${issue.name}</h5>
  <p><strong>Date:</strong> ${issue.date}</p>
  <p><strong>Observed Behavior:</strong> ${issue.observedBehavior}</p>
  <p><strong>Reproduction Steps:</strong> ${issue.reproductionSteps}</p>
  <p><strong>Expected Behavior:</strong> ${issue.expectedBehavior}</p>
  <p><strong>Notes:</strong> ${issue.notes}</p>
  <p><strong>BQ Score:</strong> ${issue.bqScore}</p>
  <p><strong>Tags:</strong> ${issue.tags}</p>
  <p><strong>XR:</strong> ${issue.xr}</p>
  <p><strong>Scenario:</strong> ${issue.scenario}</p>
  `;
  document.getElementById("sidepeekModal").classList.add("open");
};

const closeModal = () => {
  document.getElementById("sidepeekModal").classList.remove("open");
};

document
  .getElementById("searchInput")
  .addEventListener("input", async (event) => {
    const query = event.target.value.toLowerCase();
    try {
      const issues = await window.cert.searchIssues(query);

      const issueList = document.getElementById("issueList");
      issueList.innerHTML = "";

      issues.forEach((issue) => {
        const issueItem = document.createElement("a");
        issueItem.classList.add("list-group-item", "list-group-item-action");
        issueItem.href = "#";
        issueItem.dataset.issue = JSON.stringify(issue);
        issueItem.innerHTML = `
        <div>
          <strong>${issue.name}</strong> - ${issue.tags}
        </div>
        <small>${issue.observedBehavior}</small>
      `;
        issueItem.addEventListener("click", () => showIssueDetails(issue));
        issueList.appendChild(issueItem);
      });
    } catch (error) {
      console.error("Error searching issues:", error);
    }
  });

// Initialize Quill editors
const quillObserved = new Quill("#observedBehavior", {
  theme: "snow",
  placeholder: "Describe the observed behavior...",
});
const quillReproduction = new Quill("#reproductionSteps", {
  theme: "snow",
  placeholder: "Describe the reproduction steps...",
});
const quillExpected = new Quill("#expectedBehavior", {
  theme: "snow",
  placeholder: "Describe the expected behavior...",
});
const quillNotes = new Quill("#notes", {
  theme: "snow",
  placeholder: "Add any additional notes...",
});

// Call displayIssues initially to load existing issues
displayIssues();
