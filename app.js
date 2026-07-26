const gifts = [
  {
    date: "2026-07-26",
    dateLabel: "26 julio",
    icon: "🐞",
    clueTitle: "Una heroína muy especial",
    clue: "Rojo, negro y mucha suerte. Algo para llevar contigo que viene directo de París.",
    gift: "Porta Miraculous Ladybug",
    password: "MARIQUITA26",
    description: "Para guardar tus cositas con el poder de Ladybug siempre cerquita de ti.",
  },
  {
    date: "2026-07-27",
    dateLabel: "27 julio",
    icon: "✨",
    clueTitle: "Pequeños tesoros",
    clue: "Brillan, cuentan historias y uno de ellos lleva la huellita de alguien muy querido.",
    gift: "Charm de huellita, brazalete y anillo rosa Pandora",
    password: "HUELLITA27",
    description: "Tres detalles Pandora para llenar de recuerdos, brillo y mucho rosa.",
  },
  {
    date: "2026-07-28",
    dateLabel: "28 julio",
    icon: "💄",
    clueTitle: "Un toque de estrella",
    clue: "Color, actitud y pop. Tu look está a punto de recibir un beso de celebridad.",
    gift: "Labial Dua Lipa",
    password: "ESTRELLA28",
    description: "Un toque de color digno de escenario para que brilles todavía más.",
  },
  {
    date: "2026-07-29",
    dateLabel: "29 julio",
    icon: "🌸",
    clueTitle: "Una flor de otro mundo",
    clue: "Nació entre pétalos mágicos, pero se siente en casa en las manos de una agente.",
    gift: "Vandal Mystbloom de Valorant en 3D",
    password: "FLOR29",
    description: "La preciosa Vandal Mystbloom cobra vida fuera de la pantalla, hecha en 3D.",
  },
  {
    date: "2026-07-30",
    dateLabel: "30 julio",
    icon: "🐉",
    clueTitle: "Fuego y coronas",
    clue: "Prepara tus dragones: hoy toca conquistar reinos, superar retos y reclamar el trono.",
    gift: "Juego Rosita Targaryen",
    password: "DRAGON30",
    description: "Una aventura hecha para Rosita Targaryen, la verdadera heredera del trono.",
  },
  {
    date: "2026-07-31",
    dateLabel: "31 julio",
    icon: "👑",
    clueTitle: "Se acerca algo grande",
    clue: "Las casas han sido convocadas. Hay secretos, coronas y personas que te quieren esperando.",
    gift: "¡Fiesta sorpresa con temática de Game of Thrones!",
    password: "REINA31",
    description: "El reino entero se reúne para celebrar a su reina favorita. Valar Dohaeris.",
  },
  {
    date: "2026-08-01",
    dateLabel: "1 agosto",
    icon: "🧸",
    clueTitle: "Dos personitas mini",
    clue: "Son pequeños, adorables y se parecen muchísimo a dos seres inseparables.",
    gift: "Funko 3D de Rosita y Bebé",
    password: "JUNTOS01",
    description: "Rosita y Bebé convertidos en una mini obra 3D para conservarlos siempre juntos.",
  },
];

const giftGrid = document.querySelector("#gift-grid");
const revealedCount = document.querySelector("#revealed-count");
const progressFill = document.querySelector("#progress-fill");
const todayDate = document.querySelector("#today-date");
const todayMessage = document.querySelector("#today-message");
const todayButton = document.querySelector("#go-to-today");
const dialog = document.querySelector("#reveal-dialog");
const dialogIcon = document.querySelector("#dialog-icon");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");

let revealed = [];

function getLimaDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function render() {
  giftGrid.innerHTML = "";

  gifts.forEach((gift, index) => {
    const isRevealed = revealed.includes(gift.date);
    const card = document.createElement("article");
    card.className = `gift-card unlocked ${index === 0 ? "featured" : ""}`;
    card.id = `gift-${gift.date}`;

    card.innerHTML = `
      <div class="card-top">
        <span class="day-number">${gift.dateLabel}</span>
        <span class="status-pill">${isRevealed ? "Descubierto" : "Con contraseña"}</span>
      </div>
      <div class="card-icon" aria-hidden="true">${isRevealed ? gift.icon : "♡"}</div>
      <h3>${gift.clueTitle}</h3>
      <p class="${isRevealed ? "revealed-name" : ""}">
        ${isRevealed ? gift.gift : gift.clue}
      </p>
      ${
        isRevealed
          ? `<button class="card-action revisit-action" type="button">Ver otra vez →</button>`
          : `<form class="password-form">
              <label class="sr-only" for="password-${gift.date}">Contraseña para ${gift.dateLabel}</label>
              <div class="password-row">
                <input id="password-${gift.date}" type="password" inputmode="text"
                  autocomplete="off" placeholder="Escribe la contraseña" required />
                <button type="submit" aria-label="Abrir regalo del ${gift.dateLabel}">→</button>
              </div>
              <span class="password-error" role="alert"></span>
            </form>`
      }
    `;

    if (isRevealed) {
      card.querySelector(".revisit-action").addEventListener("click", () => revealGift(gift));
    } else {
      card.querySelector(".password-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const input = card.querySelector("input");
        const error = card.querySelector(".password-error");
        if (normalizePassword(input.value) === normalizePassword(gift.password)) {
          error.textContent = "";
          revealGift(gift);
        } else {
          error.textContent = "Esa no es la contraseña. Inténtalo otra vez ♡";
          input.value = "";
          input.focus();
          card.classList.remove("shake");
          void card.offsetWidth;
          card.classList.add("shake");
        }
      });
    }
    giftGrid.append(card);
  });

  updateProgress();
  updateToday();
}

function normalizePassword(value) {
  return value.trim().toLocaleUpperCase("es");
}

function revealGift(gift) {
  dialogIcon.textContent = gift.icon;
  dialogTitle.textContent = gift.gift;
  dialogDescription.textContent = gift.description;
  dialog.dataset.giftDate = gift.date;
  dialog.showModal();
}

function saveCurrentGift() {
  const date = dialog.dataset.giftDate;
  if (date && !revealed.includes(date)) {
    revealed.push(date);
  }
  dialog.close();
  render();
}

function updateProgress() {
  const currentDate = getLimaDate();
  const count = gifts.filter((gift) => gift.date <= currentDate).length;
  revealedCount.textContent = count;
  progressFill.style.width = `${(count / gifts.length) * 100}%`;
}

function updateToday() {
  const target = gifts.find((gift) => !revealed.includes(gift.date)) || gifts[0];
  todayDate.textContent = "Una clave, un regalo";
  todayMessage.textContent = "Cada sorpresa se abre con una contraseña especial.";
  todayButton.textContent = "Ver las pistas →";
  todayButton.onclick = () => {
    document.querySelector(`#gift-${target.date}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
}

document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
document.querySelector("#keep-discovering").addEventListener("click", saveCurrentGift);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

render();
