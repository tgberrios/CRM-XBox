function nextSection(sectionNumber) {
  const section = document.getElementById(`section${sectionNumber}`);

  // Forzar un retraso para dar tiempo al renderizado
  setTimeout(() => {
    section.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      // Simula varios clics en el body para forzar el renderizado
      document.body.click();

      // Aplicar la clase visible para hacer el renderizado suave
      section.classList.add("visible");

      // Forzar el repaint/redibujado forzando una transformación en la sección
      section.style.transform = "scale(1)";

      // Aplicar un ligero cambio temporal en el DOM para forzar el reflow
      section.style.border = "1px solid transparent"; // Cambio pequeño en el DOM
      setTimeout(() => {
        section.style.border = ""; // Revertir el cambio para finalizar el reflow
      }, 100);

      // Restaurar el foco a la ventana principal o sección activa
      section.focus();
    }, 50);
  }, 50);
}

window.onload = function () {
  const section1 = document.getElementById("section1");

  // Verificar si estamos en la sección 1 y si no hemos recargado antes
  if (section1 && !localStorage.getItem("pageReloaded")) {
    // Si estamos en la sección 1, simular el refresco automático
    localStorage.setItem("pageReloaded", "true"); // Marcar que la página ya ha sido recargada
    location.reload(); // Refrescar la página automáticamente
  }
};

// Función para manejar la pulsación de teclas
document.addEventListener("keydown", function (event) {
  // Detectar Ctrl + R
  if (event.ctrlKey && event.key === "r") {
    const section1 = document.getElementById("section1");

    // Verificar si la primera sección es visible
    const section1Visible = section1.classList.contains("visible");

    if (!section1Visible) {
      // Prevenir el refresco si no estamos en la primera sección
      event.preventDefault();
      alert("El refresco solo está permitido en la primera sección.");
    }
    // Si estamos en la primera sección, permitimos el refresco
  }
});

let arrCMTAnswers = {
  q1o1: "Agree.",
  q1o2: "Agree.",
  q1o3: "Agree.",
  q1o4: "Disagree.",
  q1o5: "Disagree.",
  q1o6: "Disagree.",

  q2o1: "Mark the ‘Remained seated and focused’.",
  q2o2: "Don’t mark",
  q2o3: "Don’t mark",

  q3o1: "Mark ‘Did not chat excessively’.",
  q3o2: "Don’t mark",
  q3o3: "Don’t mark",

  q4o1: "Agree",
  q4o2: "Disagree",
  q4o3: "Disagree",

  q5o1: "Agree",
  q5o2: "Agree",
  q5o3: "Disagree",
  q5o1: "Disagree",

  q6o1: "Agree",
  q6o2: "Agree",
  q6o3: "Disagree",
  q6o1: "Disagree",

  q7o1: "Select: Reluctant or refused to assist the team, preferred to continue playing the game for example.",
  q7o2: "Select: Reluctant or refused to assist the team, preferred to continue playing the game for example.",
  q7o3: "Select: Continued to help out when required or requested but did not actively volunteer.",
  q7o3: "Select: Went above and beyond to assist the team, showing a very keen interest to help out.",
  q7o1: "Select: Went above and beyond to assist the team, showing a very keen interest to help out.",

  q8o1: "Select: Required a large amount of supervision, either from the lead or the team, to remain focused on testing.",
  q8o2: "Select: Required a large amount of supervision, either from the lead or the team, to remain focused on testing.",
  q8o3: "The tester handles his own cases without the need for supervision, however he does not help his coworkers, waiting for instructions.",
  q8o1: "Select: Demonstrated strong leadership qualities, taking ownership of an aspect of test such as multiplayer or guiding a sub-SKU.",
  q8o3: "Select: Demonstrated strong leadership qualities, taking ownership of an aspect of test such as multiplayer or guiding a sub-SKU.",
  q8o1: "Select: Demonstrated strong leadership qualities, taking ownership of an aspect of test such as multiplayer or guiding a sub-SKU.",
};

function showResultCombined() {
  let resultCodes = "";
  let resultCodesArray = [];
  let resultAnswers = "";

  for (let i = 1; i <= 10; i++) {
    const selectedOption = document.querySelector(
      `input[name="question${i}"]:checked`
    );
    if (selectedOption) {
      resultCodesArray.push(selectedOption.value);
      resultCodes = resultCodesArray.join(" ");

      if (arrCMTAnswers[selectedOption.id]) {
        resultAnswers += ` ${arrCMTAnswers[selectedOption.id]}<br>`;
      }
    }
  }

  document.getElementById("resultCodes").innerHTML = resultCodes;
  document.getElementById("resultAnswers").innerHTML = resultAnswers;
  document.getElementById("resultSection").style.display = "flex";
  document
    .getElementById("resultSection")
    .scrollIntoView({ behavior: "smooth" });
}
