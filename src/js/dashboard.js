const ctx = document.getElementById("reviewsOverAll").getContext("2d");
const reviewsChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Overall Rating",
        data: [],
        backgroundColor: "#c7c7c7",
        borderColor: "#c7c7c7",
        borderWidth: 1,
      },
    ],
  },
  options: {
    indexAxis: "y",
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

let reviewsData = [];

const loadReviewsData = async () => {
  try {
    const reviews = await window.cert.getReviews();
    reviewsData = reviews;

    const testers = [...new Set(reviews.map((review) => review.testerName))];

    const testerSelect = document.getElementById("testerSelect");
    testers.forEach((tester) => {
      const option = document.createElement("option");
      option.value = tester;
      option.textContent = tester;
      testerSelect.appendChild(option);
    });

    updateChart("all");
  } catch (error) {
    console.error("Error loading reviews data:", error);
  }
};

//Dropdown Testers
const updateChart = (testerName) => {
  let filteredReviews;

  if (testerName === "all") {
    filteredReviews = reviewsData;
  } else {
    filteredReviews = reviewsData.filter(
      (review) => review.testerName === testerName
    );
  }

  const labels = filteredReviews.map((review) => review.testerName || "Reseña");
  const data = filteredReviews.map((review) => review.overallRating);
  reviewsChart.data.labels = labels;
  reviewsChart.data.datasets[0].data = data;
  reviewsChart.update();
};

document.getElementById("testerSelect").addEventListener("change", (event) => {
  const selectedTester = event.target.value;
  updateChart(selectedTester);
});
//Dropdown Testers

const submissionCount = async () => {
  try {
    const submissionCount = await window.cert.loadTrackers();
    const submissionLength = submissionCount.length;

    document.getElementById(
      "submissionCount"
    ).textContent = `${submissionLength} Submissions`;
  } catch (error) {
    console.error("Error loading submission count:", error);
  }
};

const activeTrackersTitleName = async () => {
  try {
    const activeTrackers = await window.cert.loadTrackers();
    const activeTrackersTitleNames = activeTrackers.map(
      (tracker) => tracker.titleName
    );
    const trackersListContainer = document.getElementById("activeTrackersList");

    trackersListContainer.innerHTML = "";

    activeTrackersTitleNames.forEach((title) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item"; // Clase de Bootstrap para los items de lista
      listItem.textContent = title; // Establecer el texto del <li>
      trackersListContainer.appendChild(listItem); // Agregar el <li> al contenedor
    });
  } catch (error) {
    console.error("Error loading active trackers:", error);
  }
};

const recentAudits = async () => {
  try {
    const recentAudits = await window.cert.loadAudits();
    console.log("Audits Recientes:", recentAudits); // Log para depuración
    const recentAuditsTitleNames = recentAudits.map((audit) => audit.titleName);

    const auditsListContainer = document.getElementById("recentAuditsList");
    auditsListContainer.innerHTML = "";
    recentAuditsTitleNames.forEach((title) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item"; // Clase de Bootstrap para los items de lista
      listItem.textContent = title;
      auditsListContainer.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading recent audits:", error);
  }
};

const lastestSGC = async () => {
  try {
    const lastestSGC = await window.cert.loadAllData();
    const SGC = lastestSGC.map((data) => data.title_name);

    const sgcListContainer = document.getElementById("sgcList");
    sgcListContainer.innerHTML = "";
    SGC.forEach((title) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item"; // Clase de Bootstrap para los items de lista
      listItem.textContent = `${title}`;
      sgcListContainer.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading SGC:", error);
  }
};

const lastestIssues = async () => {
  try {
    const lastestIssues = await window.cert.getIssues();
    const lastestIssuesTitleNames = lastestIssues.map((issue) => issue.name);
    const issuesListContainer = document.getElementById("issuesList");
    issuesListContainer.innerHTML = "";
    lastestIssuesTitleNames.forEach((title) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item"; // Clase de Bootstrap para los items de lista
      listItem.textContent = title;
      issuesListContainer.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading issues:", error);
  }
};

const activeTickets = async () => {
  try {
    const tickets = await window.cert.getTickets(); // Obtén la lista de tickets
    const ticketsListContainer = document.getElementById("ticketsList");
    ticketsListContainer.innerHTML = ""; // Limpia el contenedor antes de agregar nuevos elementos

    tickets.forEach((ticket) => {
      if (ticket.status === "Open") {
        // Asegúrate de que 'status' es una propiedad de 'ticket'
        const listItem = document.createElement("li"); // Crea un nuevo elemento <li>
        listItem.className = "list-group-item"; // Clase de Bootstrap para los items de lista
        listItem.textContent = ticket.name; // Asigna el nombre del ticket
        ticketsListContainer.appendChild(listItem); // Agrega el <li> al contenedor
      } else {
        console.log(`Ticket "${ticket.name}" is closed`); // Mensaje para tickets cerrados
      }
    });
  } catch (error) {
    console.error("Error loading tickets:", error); // Manejo de errores
  }
};

const topPerformance = async () => {
  try {
    const reviews = await window.cert.getReviews();

    // Extraer datos de calificaciones y nombres de testers
    const performanceArray = reviews.map((review) => ({
      name: review.testerName,
      rating: review.overallRating,
    }));

    // Ordenar el array por calificación en orden descendente
    performanceArray.sort((a, b) => b.rating - a.rating);

    // Obtener los tres mejores performances
    const topThreePerformance = performanceArray.slice(0, 3);

    // Obtener el contenedor de la lista de top performance
    const topPerformanceList = document.getElementById("topPerformance");
    topPerformanceList.innerHTML = ""; // Limpiar la lista actual

    // Crear elementos <li> para cada performance y añadirlos a la lista
    topThreePerformance.forEach((performance) => {
      const listItem = document.createElement("p");
      listItem.textContent = `${performance.name} - Score: ${performance.rating}`;
      topPerformanceList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading top performance:", error);
  }
};

const averageBugScore = async () => {
  try {
    const issues = await window.cert.getIssues();
    console.log("Issues:", issues);
    const bugScoreArray = issues.map((issue) => issue.bqScore);
    const averageBugScore =
      bugScoreArray.reduce((total, current) => total + current, 0) /
      bugScoreArray.length;
    console.log("Average Bug Score:", averageBugScore);
    document.getElementById(
      "averageBugScore"
    ).textContent = `${averageBugScore}`;
  } catch (error) {
    console.error("Error loading issues:", error);
  }
};

const highPriorityTickets = async () => {
  try {
    const tickets = await window.cert.getTickets();
    const highPriorityTickets = tickets.filter(
      (ticket) => ticket.priority === "High"
    );
    const highPriorityTicketsListContainer = document.getElementById(
      "highPriorityTicketsList"
    );
    highPriorityTicketsListContainer.innerHTML = "";
    highPriorityTickets.forEach((ticket) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = ticket.name;
      highPriorityTicketsListContainer.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading high priority tickets:", error);
  }
};

const lastestNews = async () => {
  try {
    const news = await window.cert.loadUpdates();
    const newsListContainer = document.getElementById("newsList");
    newsListContainer.innerHTML = "";
    news.forEach((news) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = news.title;
      newsListContainer.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading news:", error);
  }
};

let lastSeenTicketId = null;
let lastSeenNewsId = null; // Para controlar las noticias
let hasLoadedInitially = false; // Para evitar la notificación inicial

const realTimeNotifications = async () => {
  try {
    const ticketNotifications = await window.cert.getTickets(); // Cargar tickets
    const lastestNews = await window.cert.loadUpdates(); // Cargar noticias

    // Marca la carga inicial
    if (!hasLoadedInitially) {
      hasLoadedInitially = true; // Ahora se ha cargado inicialmente
      // Almacenamos el último ID de ticket y noticias para evitar mostrar inicialmente
      if (ticketNotifications.length > 0) {
        lastSeenTicketId =
          ticketNotifications[ticketNotifications.length - 1].id; // Marca el último ticket como visto
      }
      if (lastestNews.length > 0) {
        lastSeenNewsId = lastestNews[lastestNews.length - 1].id; // Marca la última noticia como vista
      }
      return; // Salimos de la función para evitar mostrar notificaciones
    }

    // Verifica si hay tickets nuevos
    if (ticketNotifications.length > 0) {
      const mostRecentTicket =
        ticketNotifications[ticketNotifications.length - 1]; // Obtener el último ticket

      if (
        mostRecentTicket &&
        mostRecentTicket.status === "Open" &&
        mostRecentTicket.id !== lastSeenTicketId
      ) {
        lastSeenTicketId = mostRecentTicket.id; // Actualiza el último ticket visto

        // Actualiza el contenido del modal para mostrar el ticket
        const notificationContent = document.getElementById(
          "notificationContent"
        );
        notificationContent.textContent = `Nuevo Ticket: ${mostRecentTicket.name}`; // Aquí puedes personalizar el texto

        const notificationModal = new bootstrap.Modal(
          document.getElementById("notificationModal")
        );
        notificationModal.show();

        // Cierra el modal automáticamente después de 2 segundos
        setTimeout(() => {
          notificationModal.hide();
        }, 2000); // 2 segundos
      }
    }

    // Verifica si hay noticias nuevas
    if (lastestNews.length > 0) {
      const mostRecentNews = lastestNews[lastestNews.length - 1]; // Obtener la última noticia (la más reciente)

      // Solo mostramos la noticia si hay una nueva y no ha sido vista
      if (mostRecentNews && mostRecentNews.id !== lastSeenNewsId) {
        lastSeenNewsId = mostRecentNews.id; // Marca la noticia como vista

        // Actualiza el contenido del modal para mostrar la noticia
        const notificationContent = document.getElementById(
          "notificationContent"
        );
        notificationContent.textContent = `Última Noticia: ${mostRecentNews.title}`; // Personaliza el mensaje

        const notificationModal = new bootstrap.Modal(
          document.getElementById("notificationModal")
        );
        notificationModal.show();

        // Cierra el modal automáticamente después de 3 segundos
        setTimeout(() => {
          notificationModal.hide();
        }, 3000); // 3 segundos
      }
    }
  } catch (error) {
    console.error("Error loading notifications:", error);
  }
};

const TesterMostCFR = async () => {
  try {
    const testerCFRList = await window.cert.getIssues(); // Get the list of issues
    const testersWithCFR = testerCFRList.filter((tester) =>
      tester.tags.includes("CFR")
    ); // Filter testers with CFR tag

    if (testersWithCFR.length > 0) {
      // Sort testers by the number of CFR tags
      testersWithCFR.sort(
        (a, b) =>
          b.tags.filter((tag) => tag === "CFR").length -
          a.tags.filter((tag) => tag === "CFR").length
      );

      // The first tester in the sorted list has the most CFR tags
      const testerWithMostCFR = testersWithCFR[0];
      console.log("The Tester with the most CFR is:", testerWithMostCFR);

      const testerMostCFR = document.getElementById("testerMostCFR");
    } else {
      console.log("No testers with CFR.");
    }
  } catch (error) {
    console.error("Error loading issues:", error);
  }
};

window.onload = () => {
  loadReviewsData();
  submissionCount();
  activeTrackersTitleName();
  recentAudits();
  lastestSGC();
  lastestIssues();
  activeTickets();
  realTimeNotifications();
  setInterval(realTimeNotifications, 5000);
  topPerformance();
  averageBugScore();
  highPriorityTickets();
  lastestNews();
};
