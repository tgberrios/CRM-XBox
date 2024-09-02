document
  .getElementById("exportToExcelBtn")
  .addEventListener("click", async function () {
    try {
      const reviews = await window.cert.getReviews();

      // Convertir los datos a formato JSON
      const ws = XLSX.utils.json_to_sheet(reviews);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Revisiones");

      // Exportar el archivo Excel
      XLSX.writeFile(wb, "revisiones.xlsx");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
    }
  });

document.getElementById("closeModalBtn").addEventListener("click", function () {
  closeModal();
});

const quill = new Quill("#observations", {
  theme: "snow",
  modules: {
    toolbar: true,
  },
});

const editQuill = new Quill("#editObservations", {
  theme: "snow",
  modules: {
    toolbar: true,
  },
});

async function addReview(review) {
  try {
    await window.cert.addReview(review);
    loadReviews();
    document.getElementById("reviewForm").reset();
    quill.setContents([]);
  } catch (err) {
    console.error("Error adding review:", err);
  }
}

async function loadReviews() {
  try {
    const reviews = await window.cert.getReviews();
    const reviewList = document.getElementById("reviewList");
    reviewList.innerHTML = "";

    reviews.forEach((review) => {
      const reviewItem = document.createElement("div");
      reviewItem.classList.add("review-item");
      reviewItem.dataset.id = review.id;
      reviewItem.innerHTML = `
        <span>${review.testerName}</span>
        <span>${new Date(review.date).toLocaleDateString()}</span>
      `;
      reviewItem.addEventListener("click", function () {
        openModal(review.id);
      });
      reviewList.appendChild(reviewItem);
    });
  } catch (err) {
    console.error("Error loading reviews:", err);
  }
}

async function loadTesters() {
  try {
    const testers = await window.cert.getTesters();
    const testerSelect = document.querySelectorAll(
      "#testerName, #editTesterName"
    );
    testerSelect.forEach((select) => {
      select.innerHTML = "";
      testers.forEach((tester) => {
        select.innerHTML += `<option value="${tester.name}">${tester.name}</option>`;
      });
    });
  } catch (err) {
    console.error("Error loading testers:", err);
  }
}

async function updateReview(review) {
  try {
    await window.cert.updateReview(review);
    loadReviews();
    closeModal();
  } catch (err) {
    console.error("Error updating review:", err);
  }
}

async function deleteReview(id) {
  try {
    await window.cert.deleteReview(id);
    loadReviews();
    closeModal();
  } catch (err) {
    console.error("Error deleting review:", err);
  }
}

async function openModal(id) {
  try {
    const review = await window.cert.getReviewById(id);

    document.getElementById("editReviewId").value = review.id;
    document.getElementById("editTesterName").value = review.testerName;
    document.getElementById("editPerformanceScore").value =
      review.performanceScore;
    document.getElementById("editBugDetectionAccuracy").value =
      review.bugDetectionAccuracy;
    document.getElementById("editTestingEfficiency").value =
      review.testingEfficiency;
    document.getElementById("editCommunicationSkills").value =
      review.communicationSkills;
    document.getElementById("editCreativity").value = review.creativity;
    document.getElementById("editResponsiveness").value = review.responsiveness;
    document.getElementById("editPunctuality").value = review.punctuality;
    document.getElementById("editProblemAnalysis").value =
      review.problemAnalysis;
    document.getElementById("editToolsKnowledge").value = review.toolsKnowledge;
    document.getElementById("editOverallRating").value = review.overallRating;
    editQuill.root.innerHTML = review.observations;
    document.getElementById("reviewModal").classList.add("show");
  } catch (err) {
    console.error("Error fetching review:", err);
  }
}

function closeModal() {
  document.getElementById("reviewModal").classList.remove("show");
  document.getElementById("editReviewForm").reset();
  editQuill.setContents([]);
}

document.addEventListener("DOMContentLoaded", function () {
  loadReviews();
  loadTesters();

  document
    .getElementById("reviewForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const review = {
        testerName: document.getElementById("testerName").value,
        performanceScore: parseInt(
          document.getElementById("performanceScore").value
        ),
        bugDetectionAccuracy: parseInt(
          document.getElementById("bugDetectionAccuracy").value
        ),
        testingEfficiency: parseInt(
          document.getElementById("testingEfficiency").value
        ),
        communicationSkills: parseInt(
          document.getElementById("communicationSkills").value
        ),
        creativity: parseInt(document.getElementById("creativity").value),
        responsiveness: parseInt(
          document.getElementById("responsiveness").value
        ),
        punctuality: parseInt(document.getElementById("punctuality").value),
        problemAnalysis: parseInt(
          document.getElementById("problemAnalysis").value
        ),
        toolsKnowledge: parseInt(
          document.getElementById("toolsKnowledge").value
        ),
        overallRating: parseInt(document.getElementById("overallRating").value),
        observations: quill.root.innerHTML,
        date: new Date().toISOString(),
      };
      addReview(review);
    });

  document
    .getElementById("addTesterBtn")
    .addEventListener("click", function () {
      $("#testerModal").modal("show");
    });

  document
    .getElementById("addTesterForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const testerName = document.getElementById("newTesterName").value;
      if (testerName) {
        window.cert
          .addTester(testerName)
          .then(() => {
            loadTesters();
            $("#testerModal").modal("hide");
          })
          .catch((err) => console.error("Error adding tester:", err));
      }
    });

  document
    .getElementById("editReviewForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const review = {
        id: parseInt(document.getElementById("editReviewId").value),
        testerName: document.getElementById("editTesterName").value,
        performanceScore: parseInt(
          document.getElementById("editPerformanceScore").value
        ),
        bugDetectionAccuracy: parseInt(
          document.getElementById("editBugDetectionAccuracy").value
        ),
        testingEfficiency: parseInt(
          document.getElementById("editTestingEfficiency").value
        ),
        communicationSkills: parseInt(
          document.getElementById("editCommunicationSkills").value
        ),
        creativity: parseInt(document.getElementById("editCreativity").value),
        responsiveness: parseInt(
          document.getElementById("editResponsiveness").value
        ),
        punctuality: parseInt(document.getElementById("editPunctuality").value),
        problemAnalysis: parseInt(
          document.getElementById("editProblemAnalysis").value
        ),
        toolsKnowledge: parseInt(
          document.getElementById("editToolsKnowledge").value
        ),
        overallRating: parseInt(
          document.getElementById("editOverallRating").value
        ),
        observations: editQuill.root.innerHTML,
        date: new Date().toISOString(),
      };
      updateReview(review);
    });

  document
    .getElementById("deleteReviewBtn")
    .addEventListener("click", function () {
      const id = parseInt(document.getElementById("editReviewId").value);
      deleteReview(id);
    });
});
