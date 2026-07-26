const gifts = [
  {
    date: "2026-07-26",
    dateLabel: "26 julio",
    icon: "🐞",
    clueTitle: "Una heroína muy especial",
    clue: "Rojo, negro y mucha suerte. Algo para llevar contigo que viene directo de París.",
    gift: "Porta Miraculous Ladybug",
    description: "Para guardar tus cositas con el poder de Ladybug siempre cerquita de ti.",
  },
  {
    date: "2026-07-27",
    dateLabel: "27 julio",
    icon: "✨",
    clueTitle: "Pequeños tesoros",
    clue: "Brillan, cuentan historias y uno de ellos lleva la huellita de alguien muy querido.",
    gift: "Charm de huellita, brazalete y anillo rosa Pandora",
    description: "Tres detalles Pandora para llenar de recuerdos, brillo y mucho rosa.",
  },
  {
    date: "2026-07-28",
    dateLabel: "28 julio",
    icon: "💄",
    clueTitle: "Un toque de estrella",
    clue: "Color, actitud y pop. Tu look está a punto de recibir un beso de celebridad.",
    gift: "Labial Dua Lipa",
    description: "Un toque de color digno de escenario para que brilles todavía más.",
  },
  {
    date: "2026-07-29",
    dateLabel: "29 julio",
    icon: "🌸",
    clueTitle: "Una flor de otro mundo",
    clue: "Nació entre pétalos mágicos, pero se siente en casa en las manos de una agente.",
    gift: "Vandal Mystbloom de Valorant en 3D",
    description: "La preciosa Vandal Mystbloom cobra vida fuera de la pantalla, hecha en 3D.",
  },
  {
    date: "2026-07-30",
    dateLabel: "30 julio",
    icon: "🐉",
    clueTitle: "Fuego y coronas",
    clue: "Prepara tus dragones: hoy toca conquistar reinos, superar retos y reclamar el trono.",
    gift: "Juego Rosita Targaryen",
    description: "Una aventura hecha para Rosita Targaryen, la verdadera heredera del trono.",
  },
  {
    date: "2026-07-31",
    dateLabel: "31 julio",
    icon: "👑",
    clueTitle: "Se acerca algo grande",
    clue: "Las casas han sido convocadas. Hay secretos, coronas y personas que te quieren esperando.",
    gift: "¡Fiesta sorpresa con temática de Game of Thrones!",
    description: "El reino entero se reúne para celebrar a su reina favorita. Valar Dohaeris.",
  },
  {
    date: "2026-08-01",
    dateLabel: "1 agosto",
    icon: "🧸",
    clueTitle: "Dos personitas mini",
    clue: "Son pequeños, adorables y se parecen muchísimo a dos seres inseparables.",
    gift: "Funko 3D de Rosita y Bebé",
    description: "Rosita y Bebé convertidos en una mini obra 3D para conservarlos siempre juntos.",
  },
];

const STORAGE_KEY = "rosita-gifts-revealed";
const LIMA_TIME_ZONE = "America/Lima";

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

let revealed = readRevealed();

function getLimaDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LIMA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function readRevealed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function isUnlocked(gift, currentDate) {
  return currentDate >= gift.date;
}

function render() {
  const currentDate = getLimaDate();
  giftGrid.innerHTML = "";

  gifts.forEach((gift, index) => {
    const unlocked = isUnlocked(gift, currentDate);
    const isRevealed = revealed.includes(gift.date);
    const card = document.createElement("article");
    card.className = `gift-card ${unlocked ? "unlocked" : "locked"} ${
      index === 0 ? "featured" : ""
    }`;
    card.id = `gift-${gift.date}`;

    card.innerHTML = `
      <div class="card-top">
        <span class="day-number">${gift.dateLabel}</span>
        <span class="status-pill">${isRevealed ? "Descubierto" : unlocked ? "Disponible" : "Bloqueado"}</span>
      </div>
      <div class="card-icon" aria-hidden="true">${unlocked ? gift.icon : "♡"}</div>
      <h3>${unlocked ? gift.clueTitle : "Todavía es un secreto"}</h3>
      <p class="${isRevealed ? "revealed-name" : ""}">
        ${isRevealed ? gift.gift : unlocked ? gift.clue : `Se abre el ${gift.dateLabel}. La paciencia también es parte de la sorpresa.`}
      </p>
      <button class="card-action" type="button" ${unlocked ? "" : "disabled"}>
        ${isRevealed ? "Ver otra vez" : unlocked ? "Descubrir regalo →" : "Cerrado con amor 🔒"}
      </button>
    `;

    if (unlocked) {
      card.querySelector(".card-action").addEventListener("click", () => revealGift(gift));
    }
    giftGrid.append(card);
  });

  updateProgress();
  updateToday(currentDate);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(revealed));
  }
  dialog.close();
  render();
}

function updateProgress() {
  const count = revealed.filter((date) => gifts.some((gift) => gift.date === date)).length;
  revealedCount.textContent = count;
  progressFill.style.width = `${(count / gifts.length) * 100}%`;
}

function updateToday(currentDate) {
  const todaysGift = gifts.find((gift) => gift.date === currentDate);
  const nextGift = gifts.find((gift) => gift.date > currentDate);
  const target = todaysGift || nextGift || gifts[gifts.length - 1];

  todayDate.textContent = todaysGift
    ? todaysGift.dateLabel
    : nextGift
      ? `Próximo: ${nextGift.dateLabel}`
      : "Todos abiertos";
  todayMessage.textContent = todaysGift
    ? "Tu sorpresa de hoy ya está esperando…"
    : nextGift
      ? "Vuelve ese día para descubrir una nueva pista."
      : "Ya puedes volver a visitar todos tus recuerdos.";
  todayButton.textContent = todaysGift ? "Ver la pista →" : nextGift ? "Ver el calendario →" : "Ver mis regalos →";
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
