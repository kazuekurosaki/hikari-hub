const novels = [
  {
    title: "The Devil Princess",
    img: "img/novel2.jpg",
    genre: ["Fantasy", "Psychological", "Romance"],
    status: "Ongoing"
  },
  {
    title: "I Started Working As A Lover Agent…",
    img: "img/novel3.jpg",
    genre: ["Comedy", "Romance"],
    status: "Ongoing"
  },
  {
    title: "Kurusu-san Who Does Not Speak…",
    img: "img/novel4.jpg",
    genre: ["Slice of Life", "Romance"],
    status: "Completed"
  }
  // Tambahkan lebih banyak entri sesuai `novels.json`
];

const listContainer = document.getElementById("novel-list");
const searchBar = document.getElementById("search");
const toggleBtn = document.getElementById("toggle-theme");

function createCard(novel) {
  const card = document.createElement("div");
  card.className = "novel-card";
  card.innerHTML = `
    <img src="${novel.img}" alt="${novel.title}" />
    <p>${novel.title}</p>
  `;
  card.addEventListener("click", () => {
    localStorage.setItem("selectedNovel", novel.title);
    window.location.href = "detail.html";
  });
  return card;
}

function displayNovels(filter = "") {
  const genreVal = document.getElementById("genre-filter")?.value || "";
  const statusVal = document.getElementById("status-filter")?.value || "";

  listContainer.innerHTML = "";
  novels
    .filter(n =>
      n.title.toLowerCase().includes(filter.toLowerCase()) &&
      (!genreVal || n.genre.includes(genreVal)) &&
      (!statusVal || n.status === statusVal)
    )
    .forEach(n => {
      const card = createCard(n);
      listContainer.appendChild(card);
    });
  triggerScrollAnimation();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function triggerScrollAnimation() {
  const cards = document.querySelectorAll(".novel-card");
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add("show"), i * 150);
  });
}

// Filter, search, theme toggle, random
document.getElementById("genre-filter").addEventListener("change", () => displayNovels(searchBar.value));
document.getElementById("status-filter").addEventListener("change", () => displayNovels(searchBar.value));
searchBar.addEventListener("input", e => displayNovels(e.target.value));
toggleBtn.addEventListener("click", toggleDarkMode);

document.getElementById("random-btn").addEventListener("click", () => {
  const random = novels[Math.floor(Math.random() * novels.length)];
  localStorage.setItem("selectedNovel", random.title);
  window.location.href = "detail.html";
});

window.onload = () => displayNovels();
