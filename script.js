/* =========================
   ELEMENTOS
========================= */

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const categoryButtons =
    document.querySelectorAll(".category-btn");

const platformButtons =
    document.querySelectorAll(".platform");

const lettersSection =
    document.getElementById("lettersSection");

const lettersTitle =
    document.getElementById("lettersTitle");

const lettersDescription =
    document.getElementById("lettersDescription");

const letterButtons =
    document.querySelectorAll(".letters button");

const gamesGrid =
    document.getElementById("gamesGrid");

const searchInput =
    document.getElementById("searchInput");

const clearBtn =
    document.getElementById("clearBtn");

const exploreBtn =
    document.getElementById("exploreBtn");

const noResults =
    document.getElementById("noResults");

const gamesTitle =
    document.getElementById("gamesTitle");

const gamesSubtitle =
    document.getElementById("gamesSubtitle");


/* =========================
   MODAL
========================= */

const gameModal =
    document.getElementById("gameModal");

const closeModal =
    document.getElementById("closeModal");

const modalImage =
    document.getElementById("modalImage");

const modalPlatform =
    document.getElementById("modalPlatform");

const modalTitle =
    document.getElementById("modalTitle");

const modalGenre =
    document.getElementById("modalGenre");

const modalDescription =
    document.getElementById("modalDescription");

const modalParts =
    document.getElementById("modalParts");


/* =========================
   FILTROS
========================= */

let selectedCategory = "Todos";
let selectedLetter = "";


/* =========================
   MENU
========================= */

menuBtn.addEventListener("click", () => {

    sidebar.classList.add("active");
    overlay.classList.add("active");

});

overlay.addEventListener("click", () => {

    sidebar.classList.remove("active");
    overlay.classList.remove("active");

});


/* =========================
   JOGOS SALVOS PELO ADMIN
========================= */

function loadAdminGames() {

    const savedGames =
        JSON.parse(
            localStorage.getItem("bootplayGames") || "[]"
        );

    savedGames.forEach(game => {

        createGameCard(game);

    });

}


/* =========================
   CRIAR CARD
========================= */

function createGameCard(game) {

    const card =
        document.createElement("article");

    card.className = "game-card";

    card.dataset.name = game.name;
    card.dataset.category = game.category;
    card.dataset.genre = game.genre;
    card.dataset.description = game.description;

    card.dataset.image = game.image;

    card.dataset.parts =
        JSON.stringify(game.parts || []);


    card.innerHTML = `

        <div class="game-image">

            <img
                src="${game.image}"
                alt="${game.name}"
            >

            <span class="game-platform">
                ${game.category}
            </span>

        </div>

        <div class="game-info">

            <h3>${game.name}</h3>

            <p>
                ${game.category} • ${game.genre}
            </p>

            <button class="details-btn">
                VER JOGO
            </button>

        </div>

    `;


    gamesGrid.appendChild(card);


    const button =
        card.querySelector(".details-btn");


    button.addEventListener("click", () => {

        openGameModal(card);

    });

}


/* =========================
   MOSTRAR LETRAS
========================= */

function updateLettersVisibility() {

    if (selectedCategory === "Todos") {

        lettersSection.classList.remove("active");

        return;

    }

    lettersSection.classList.add("active");

    lettersTitle.textContent =
        `JOGOS ${selectedCategory} POR LETRA`;

    lettersDescription.textContent =
        `Escolha uma letra para encontrar jogos de ${selectedCategory}.`;

}


/* =========================
   FILTRAR JOGOS
========================= */

function filterGames() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const cards =
        document.querySelectorAll(".game-card");

    let visibleGames = 0;


    cards.forEach(card => {

        const name =
            card.dataset.name.toLowerCase();

        const category =
            card.dataset.category;


        const categoryMatch =
            selectedCategory === "Todos" ||
            category === selectedCategory;


        const letterMatch =
            selectedLetter === "" ||
            name.startsWith(
                selectedLetter.toLowerCase()
            );


        const searchMatch =
            searchText === "" ||
            name.includes(searchText);


        if (
            categoryMatch &&
            letterMatch &&
            searchMatch
        ) {

            card.style.display = "block";

            visibleGames++;

        } else {

            card.style.display = "none";

        }

    });


    if (visibleGames === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }


    if (selectedCategory === "Todos") {

        gamesTitle.textContent =
            "JOGOS EM DESTAQUE";

        gamesSubtitle.textContent =
            "Confira alguns jogos disponíveis.";

    } else if (selectedLetter !== "") {

        gamesTitle.textContent =
            `${selectedCategory} — LETRA ${selectedLetter}`;

        gamesSubtitle.textContent =
            `Jogos de ${selectedCategory} começando com ${selectedLetter}.`;

    } else {

        gamesTitle.textContent =
            `JOGOS — ${selectedCategory}`;

        gamesSubtitle.textContent =
            `Jogos disponíveis para ${selectedCategory}.`;

    }

}


/* =========================
   SELECIONAR CATEGORIA
========================= */

function selectCategory(category) {

    selectedCategory = category;

    selectedLetter = "";


    letterButtons.forEach(button => {

        button.classList.remove("active");

    });


    categoryButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.category === category) {

            button.classList.add("active");

        }

    });


    updateLettersVisibility();

    filterGames();


    sidebar.classList.remove("active");
    overlay.classList.remove("active");


    document
        .getElementById("gamesSection")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================
   CATEGORIAS DO MENU
========================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectCategory(
            button.dataset.category
        );

    });

});


/* =========================
   PLATAFORMAS
========================= */

platformButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectCategory(
            button.dataset.category
        );

    });

});


/* =========================
   LETRAS
========================= */

letterButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (selectedCategory === "Todos") {

            return;

        }


        selectedLetter =
            button.dataset.letter;


        letterButtons.forEach(
            letter => {
                letter.classList.remove("active");
            }
        );


        button.classList.add("active");


        filterGames();


        document
            .getElementById("gamesSection")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* =========================
   PESQUISA
========================= */

searchInput.addEventListener("input", () => {

    filterGames();

});


/* =========================
   LIMPAR FILTROS
========================= */

clearBtn.addEventListener("click", () => {

    selectedCategory = "Todos";
    selectedLetter = "";

    searchInput.value = "";


    letterButtons.forEach(button => {

        button.classList.remove("active");

    });


    categoryButtons.forEach(button => {

        button.classList.remove("active");

        if (
            button.dataset.category === "Todos"
        ) {

            button.classList.add("active");

        }

    });


    updateLettersVisibility();

    filterGames();

});


/* =========================
   EXPLORAR
========================= */

exploreBtn.addEventListener("click", () => {

    document
        .getElementById("gamesSection")
        .scrollIntoView({
            behavior: "smooth"
        });

});


/* =========================
   ABRIR MODAL
========================= */

function openGameModal(card) {

    const name =
        card.dataset.name;

    const category =
        card.dataset.category;

    const genre =
        card.dataset.genre;

    const description =
        card.dataset.description;

    const image =
        card.dataset.image ||
        card.querySelector("img").src;


    let parts = [];


    try {

        parts =
            JSON.parse(
                card.dataset.parts || "[]"
            );

    } catch {

        parts = [];

    }


    modalImage.src = image;
    modalImage.alt = name;

    modalPlatform.textContent =
        category;

    modalTitle.textContent =
        name;

    modalGenre.textContent =
        genre;

    modalDescription.textContent =
        description || "Sem descrição.";


    modalParts.innerHTML = "";


    if (parts.length === 0) {

        modalParts.innerHTML =
            `<p class="no-parts">
                Nenhuma parte cadastrada.
            </p>`;

    } else {

        parts.forEach(part => {

            const link =
                document.createElement("a");

            link.className =
                "part-link";

            link.textContent =
                part.name;

            link.href =
                part.link;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

            modalParts.appendChild(link);

        });

    }


    gameModal.classList.add("show");

}


/* =========================
   FECHAR MODAL
========================= */

closeModal.addEventListener("click", () => {

    gameModal.classList.remove("show");

});


gameModal.addEventListener("click", event => {

    if (event.target === gameModal) {

        gameModal.classList.remove("show");

    }

});


/* =========================
   BOTÕES DOS JOGOS
   QUE JÁ ESTÃO NO HTML
========================= */

function activateExistingButtons() {

    const buttons =
        document.querySelectorAll(
            ".game-card .details-btn"
        );


    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".game-card");

            openGameModal(card);

        });

    });

}


/* =========================
   INICIAR
========================= */

activateExistingButtons();

loadAdminGames();

updateLettersVisibility();

filterGames();
