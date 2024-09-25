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
        alert("Success!");
        setTimeout(() => {
          window.location.href = "../index.html";
        }); // Espera antes de redirigir
      } catch (error) {
        console.error("Error: ", error);
        alert("¡Error en el registro! Por favor, inténtalo de nuevo.");
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
        alert("Success!");
        setTimeout(() => {
          window.location.href = "../index.html";
        }); // Espera antes de redirigir
      } catch (error) {
        console.error("Error: ", error);
        alert(
          "¡Error en el inicio de sesión! Por favor, revisa tus credenciales."
        );
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
  // Inicializa mostrando el formulario de login
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
