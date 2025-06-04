
// main.js

// ==================== AUTENTICAZIONE ====================

function registraUtente(username, email, password) {
  let utenti = JSON.parse(localStorage.getItem("utenti")) || [];

  if (utenti.find(u => u.email === email)) {
    alert("Email già registrata!");
    return false;
  }

  utenti.push({ username, email, password });
  localStorage.setItem("utenti", JSON.stringify(utenti));
  alert("Registrazione completata!");
  return true;
}

function loginUtente(email, password) {
  let utenti = JSON.parse(localStorage.getItem("utenti")) || [];

  const utente = utenti.find(u => u.email === email && u.password === password);
  if (utente) {
    localStorage.setItem("utenteLoggato", JSON.stringify(utente));
    alert("Login riuscito!");
    return true;
  } else {
    alert("Credenziali non valide");
    return false;
  }
}

function logoutUtente() {
  localStorage.removeItem("utenteLoggato");
  alert("Logout effettuato.");
  window.location.href = "Login.html";
}

function getUtenteLoggato() {
  return JSON.parse(localStorage.getItem("utenteLoggato"));
}

// ==================== CARRELLO ====================

function getKeyCarrello() {
  const user = getUtenteLoggato();
  return user ? `carrello_${user.email}` : "carrello_anonimo";
}

function AggiungiAlCarrello(button) {
  const container = button.closest(".product-detail");
  const nome = container.querySelector("h2").textContent.trim();
  const prezzoText = container.querySelector("h3").textContent.trim().replace(/[€$]/, '');
  const prezzo = parseFloat(prezzoText);

  const prodotto = { nome, prezzo, quantita: 1 };

  const key = getKeyCarrello();
  let carrello = JSON.parse(localStorage.getItem(key)) || [];

  const esistente = carrello.find(item => item.nome === nome);
  if (esistente) {
    esistente.quantita += 1;
  } else {
    carrello.push(prodotto);
  }

  localStorage.setItem(key, JSON.stringify(carrello));
  alert(`${nome} aggiunto al carrello`);
}

function CaricaCarrello() {
  const tbody = document.querySelector("tbody");
  const totaleSpan = document.querySelector("h4 span");
  const key = getKeyCarrello();
  let carrello = JSON.parse(localStorage.getItem(key)) || [];
  let totale = 0;

  tbody.innerHTML = "";

  carrello.forEach((item, index) => {
    const prezzoTotale = item.prezzo * item.quantita;
    totale += prezzoTotale;

    const riga = document.createElement("tr");
    riga.innerHTML = `
      <td>${item.nome}</td>
      <td>€${item.prezzo.toFixed(2)}</td>
      <td><input type="number" value="${item.quantita}" min="1" class="form-control bg-dark text-white border-secondary" style="width: 80px;" data-index="${index}" /></td>
      <td>€${prezzoTotale.toFixed(2)}</td>
      <td><button class="btn btn-sm btn-danger" onclick="RimuoviDalCarrello(${index})">Rimuovi</button></td>
    `;
    tbody.appendChild(riga);
  });

  totaleSpan.textContent = `€${totale.toFixed(2)}`;
}

function RimuoviDalCarrello(index) {
  const key = getKeyCarrello();
  let carrello = JSON.parse(localStorage.getItem(key)) || [];
  carrello.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(carrello));
  CaricaCarrello();
}

document.addEventListener("input", function (e) {
  if (e.target.matches("input[type='number'][data-index]")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    const key = getKeyCarrello();
    let carrello = JSON.parse(localStorage.getItem(key)) || [];
    const nuovaQuantita = parseInt(e.target.value);

    if (nuovaQuantita > 0) {
      carrello[index].quantita = nuovaQuantita;
      localStorage.setItem(key, JSON.stringify(carrello));
      CaricaCarrello();
    }
  }
});
