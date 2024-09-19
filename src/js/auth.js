document.addEventListener("DOMContentLoaded", () => {
  setupFormHandlers();
  setupFormToggles();
  initializeForms();
});

function setupFormHandlers() {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;

      try {
        await window.cert.registerUser(username, password);
        $("#successModal").modal("show");
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 2000); // Opcional: espera un poco antes de redirigir
      } catch (error) {
        console.error("Registration failed: ", error);
        $("#errorModal").modal("show");
      }
    });

  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      try {
        await window.cert.loginUser(username, password);
        window.location.href = "../index.html";
      } catch (error) {
        console.error("Login failed: ", error);
        alert("Login Failed!");
      }
    });
}

function setupFormToggles() {
  document.getElementById("showRegisterForm").addEventListener("click", () => {
    toggleFormVisibility(true);
  });

  document.getElementById("showLoginForm").addEventListener("click", () => {
    toggleFormVisibility(false);
  });
}

function initializeForms() {
  // Initialize to show the login form
  toggleFormVisibility(false);
}

function toggleFormVisibility(showRegisterForm) {
  const registerFormContainer = document.getElementById(
    "registerFormContainer"
  );
  const loginFormContainer = document.getElementById("loginFormContainer");

  if (showRegisterForm) {
    registerFormContainer.style.display = "block";
    loginFormContainer.style.display = "none";
  } else {
    registerFormContainer.style.display = "none";
    loginFormContainer.style.display = "block";
  }
}
