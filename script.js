// === Data demo halaman utama ===
const novels = [
  {
    title: "The Devil Princess",
    img: "img/novel2.jpg",
    genre: ["Fantasy", "Psychological", "Romance"],
    status: "Ongoing"
  },
  {
    title: "Kurusu-san Who Does Not Speak…",
    img: "img/novel4.jpg",
    genre: ["Slice of Life", "Romance"],
    status: "Completed"
  }
];

// === Elemen DOM utama ===
const listContainer = document.getElementById("novel-list");
const searchBar = document.getElementById("search");
const toggleBtn = document.getElementById("toggle-theme");

// === Kartu novel di halaman utama ===
function createCard(novel) {
  const card = document.createElement("div");
  card.className = "novel-card";
  card.innerHTML = `
    <img src="${novel.img}" alt="${novel.title}" />
    <p>${novel.title}</p>
  `;
  card.addEventListener("click", () => {
    localStorage.setItem("selectedNovel", novel.title);
    navigateWithTransition("detail.html");
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
    .forEach(n => listContainer.appendChild(createCard(n)));

  triggerScrollAnimation();
}

function triggerScrollAnimation() {
  const cards = document.querySelectorAll(".novel-card");
  cards.forEach((card, i) => setTimeout(() => card.classList.add("show"), i * 150));
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function navigateWithTransition(url) {
  document.body.classList.add("fade-exit");
  setTimeout(() => window.location.href = url, 300);
}

// === Event halaman utama ===
if (document.getElementById("genre-filter")) {
  document.getElementById("genre-filter").addEventListener("change", () => displayNovels(searchBar.value));
  document.getElementById("status-filter").addEventListener("change", () => displayNovels(searchBar.value));
  document.getElementById("random-btn").addEventListener("click", () => {
    const random = novels[Math.floor(Math.random() * novels.length)];
    localStorage.setItem("selectedNovel", random.title);
    navigateWithTransition("detail.html");
  });
  searchBar.addEventListener("input", e => displayNovels(e.target.value));
  toggleBtn.addEventListener("click", toggleDarkMode);
  window.onload = () => {
    document.body.classList.add("fade-enter");
    setTimeout(() => {
      document.body.classList.remove("fade-enter");
      document.body.classList.add("fade-active");
    }, 300);
    displayNovels();
  };
}

// === Halaman Detail Novel ===
function loadDetailPage() {
  const selectedTitle = localStorage.getItem("selectedNovel");

  fetch('data/novels.json')
    .then(res => res.json())
    .then(data => {
      const novel = data.find(n => n.title === selectedTitle);
      if (!novel) return;

      // Isi data novel
      document.getElementById("novel-img").src = novel.cover;
      document.getElementById("novel-title").textContent = novel.title;
      document.getElementById("alt-title").textContent = novel.alt_title;
      document.getElementById("status").textContent = novel.status;
      document.getElementById("type").textContent = novel.type;
      document.getElementById("genre").textContent = novel.genre.join(", ");
      document.getElementById("author").textContent = novel.author;
      document.getElementById("artist").textContent = novel.artist;
      document.getElementById("volumes").textContent = novel.volumes;
      document.getElementById("fan-tl").textContent = novel.fan_tl;
      document.getElementById("synopsis").textContent = novel.synopsis;

      // Aura genre
      const genreAuraMap = {
        Fantasy: "aura-fantasy",
        Romance: "aura-romance",
        "Slice of Life": "aura-slice",
        Comedy: "aura-comedy"
      };
      const auraClass = novel.genre.find(g => genreAuraMap[g]);
      if (auraClass) document.body.classList.add(genreAuraMap[auraClass]);

      // Auto theme warna teks info-box
      const genreTextThemes = {
        Fantasy: { text: "#f2eaff", bg: "rgba(50, 30, 100, 0.3)" },
        Romance: { text: "#ffe6e6", bg: "rgba(100, 30, 30, 0.3)" },
        "Slice of Life": { text: "#d9fff2", bg: "rgba(30, 100, 80, 0.3)" },
        Comedy: { text: "#fff7d9", bg: "rgba(100, 70, 0, 0.3)" }
      };
      const dominantGenre = novel.genre.find(g => genreTextThemes[g]) || "Fantasy";
      const theme = genreTextThemes[dominantGenre];
      const infoBox = document.querySelector(".info-box");
      if (theme && infoBox) {
        infoBox.style.backgroundColor = theme.bg;
        infoBox.style.color = theme.text;
      }

      // Tombol Volume dan WhatsApp
      const volNav = document.getElementById("volume-nav");
      const waBtn = document.getElementById("wa-read");
      volNav.innerHTML = "";
      volNav.className = "volume-scroll";

      const genreColors = {
        Fantasy: "#6a5acd",
        Romance: "#e86b6b",
        "Slice of Life": "#1eb980",
        Comedy: "#ff9800",
        Adventure: "#3f51b5",
        Psychological: "#9c27b0"
      };
      const bgColor = genreColors[dominantGenre];

      for (let i = 1; i <= novel.volumes; i++) {
        const btn = document.createElement("button");
        btn.textContent = `Volume ${i}`;
        btn.style.backgroundColor = bgColor;
        btn.style.animationDelay = `${i * 0.2}s`;

        btn.onclick = () => {
          document.querySelectorAll(".volume-scroll button").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          const message = `Hai saya ingin membeli Volume ${i} dari ${novel.title}`;
          waBtn.href = `https://wa.me/6283822046782?text=${encodeURIComponent(message)}`;

          btn.classList.add("pulse");
          setTimeout(() => btn.classList.remove("pulse"), 400);
        };

        volNav.appendChild(btn);
      }
    });
}

// === Event halaman detail ===
if (window.location.pathname.includes("detail.html")) {
  window.onload = () => {
    document.body.classList.add("fade-enter");
    setTimeout(() => {
      document.body.classList.remove("fade-enter");
      document.body.classList.add("fade-active");
    }, 300);
    loadDetailPage();
  };
}

// === Efek Ripple global ===
document.querySelectorAll('.ripple').forEach(button => {
  button.addEventListener('click', function (e) {
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
