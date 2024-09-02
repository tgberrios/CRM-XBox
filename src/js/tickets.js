document.addEventListener("DOMContentLoaded", async () => {
  try {
    await showTickets(); // Call showTickets when the page is ready
  } catch (error) {
    console.error("Error loading tickets:", error);
  }
});

const ticketForm = document.querySelector("#ticketForm");
const ticketList = document.getElementById("ticketList");
const sidePeek = document.getElementById("sidePeek");
const closePeek = document.getElementById("closePeek");
const deleteButtonPeek = document.getElementById("deleteButtonPeek");

// Function to handle form submission
ticketForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value.trim();
  const status = document.getElementById("status").value.trim();
  const date = document.getElementById("date").value.trim();

  if (!name || !category || !description || !priority || !status || !date) {
    console.error("Please fill out all fields.");
    return;
  }

  const ticket = {
    name,
    category,
    description,
    priority,
    status,
    date,
  };

  try {
    await window.cert.addTicket(ticket);
    ticketForm.reset();
    await showTickets();
  } catch (error) {
    console.error("Error adding ticket:", error);
  }
});

// Function to display tickets in the list
async function showTickets() {
  if (!ticketList) return;

  ticketList.innerHTML = "";

  try {
    const tickets = await window.cert.getTickets();

    tickets.forEach((ticket) => {
      const descriptionPreview =
        ticket.description.length > 50
          ? ticket.description.substring(0, 50) + "..."
          : ticket.description;

      const ticketItem = document.createElement("div");
      ticketItem.className = "ticket-item";
      ticketItem.dataset.id = ticket.id;
      ticketItem.innerHTML = `
        <p><strong>Category:</strong> ${ticket.category}</p>
        <p><strong>Description:</strong> ${descriptionPreview}</p>
        <p><strong>Date:</strong> ${ticket.date}</p>
      `;
      ticketItem.addEventListener("click", () => showPeek(ticket));
      ticketList.appendChild(ticketItem);
    });
  } catch (error) {
    console.error("Error displaying tickets:", error);
  }
}

// Function to show the side peek with ticket details
function showPeek(ticket) {
  document.getElementById("peekName").innerText = ticket.name;
  document.getElementById("peekCategory").innerText = ticket.category;
  document.getElementById("peekDescription").innerText = ticket.description;
  document.getElementById("peekPriority").innerText = ticket.priority;
  document.getElementById("peekStatus").innerText = ticket.status;
  document.getElementById("peekDate").innerText = ticket.date;

  sidePeek.dataset.id = ticket.id;
  sidePeek.classList.add("show");
}

// Function to close the side peek
closePeek.addEventListener("click", () => {
  sidePeek.classList.remove("show");
});

// Function to delete a ticket from the side peek
deleteButtonPeek.addEventListener("click", async () => {
  const id = sidePeek.dataset.id;

  if (id) {
    try {
      await window.cert.deleteTicket(Number(id));
      await showTickets();
      sidePeek.classList.remove("show");
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  }
});
