/* =========================
   ELEMENTOS
========================= */

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const categoryButtons = document.querySelectorAll(".category-btn");
const platformButtons = document.querySelectorAll(".platform");

const lettersSection = document.getElementById("lettersSection");
const lettersTitle = document.getElementById("lettersTitle");
const lettersDescription = document.getElementById("lettersDescription");
const letterButtons = document.querySelectorAll(".letters button");

const gamesGrid = document.getElementById("gamesGrid");
const gameCards = document.querySelectorAll(".game-card");

const gamesTitle = document.getElementById("gamesTitle");
const gamesSubtitle = document.getElementById("gamesSubtitle");

const searchInput = document.getElementById("searchInput");

const clearBtn = document.getElementById("clearBtn");
const exploreBtn = document.getElementById("exploreBtn");

const noResults = document.getElementById("noResults");


/* =========================
   FILTROS ATUAIS
========================= */

let selectedCategory = "Todos";
let selectedLetter = "";


/* =========================
   MENU
========================= */

function openMenu() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
}

function closeMenu() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

menuBtn.addEventListener("click", openMenu);

overlay.addEventListener("click", closeMenu);


/* =========================
   MOSTRAR / ESCONDER LETRAS
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

    let visibleGames = 0;


    gameCards.forEach(card => {

        const gameName =
            card.dataset.name.toLowerCase();

        const gameCategory =
            card.dataset.category;


        /*
         * Verifica plataforma
         */

        const categoryMatch =
            selectedCategory === "Todos" ||
            gameCategory === selectedCategory;


        /*
         * Verifica letra
         */

        const letterMatch =
            selectedLetter === "" ||
            gameName.startsWith(selectedLetter.toLowerCase());


        /*
         * Verifica pesquisa
         */

        const searchMatch =
            searchText === "" ||
            gameName.includes(searchText);


        /*
         * Resultado final
         */

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


    /*
     * Mostra ou esconde mensagem
     */

    if (visibleGames === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }


    /*
     * Atualiza título
     */

    if (selectedCategory === "Todos") {

        gamesTitle.textContent =
            "JOGOS EM DESTAQUE";

        gamesSubtitle.textContent =
            "Confira alguns jogos disponíveis.";

    } else if (selectedLetter !== "") {

        gamesTitle.textContent =
            `${selectedCategory} — LETRA ${selectedLetter}`;

        gamesSubtitle.textContent =
            `Jogos de ${selectedCategory} começando com a letra ${selectedLetter}.`;

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

    /*
     * Quando troca de plataforma,
     * a letra anterior é apagada.
     */

    selectedLetter = "";


    /*
     * Remove seleção das letras.
     */

    letterButtons.forEach(button => {

        button.classList.remove("active");

    });


    /*
     * Atualiza botões do menu.
     */

    categoryButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.category === category) {

            button.classList.add("active");

        }

    });


    /*
     * Mostra A-Z somente
     * quando uma plataforma foi escolhida.
     */

    updateLettersVisibility();


    /*
     * Filtra jogos.
     */

    filterGames();


    /*
     * Fecha menu lateral.
     */

    closeMenu();


    /*
     * Vai para a área de jogos.
     */

    document.getElementById("gamesSection").scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================
   BOTÕES DO MENU
========================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category =
            button.dataset.category;

        selectCategory(category);

    });

});


/* =========================
   BOTÕES DAS PLATAFORMAS
========================= */

platformButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category =
            button.dataset.category;

        selectCategory(category);

    });

});


/* =========================
   LETRAS A-Z
========================= */

letterButtons.forEach(button => {

    button.addEventListener("click", () => {

        /*
         * Não permite letra sem plataforma.
         */

        if (selectedCategory === "Todos") {

            return;

        }


        /*
         * Pega a letra clicada.
         */

        selectedLetter =
            button.dataset.letter;


        /*
         * Atualiza botão ativo.
         */

        letterButtons.forEach(letterButton => {

            letterButton.classList.remove("active");

        });

        button.classList.add("active");


        /*
         * Filtra jogos.
         */

        filterGames();


        /*
         * Vai para os jogos.
         */

        document.getElementById("gamesSection").scrollIntoView({
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


    /*
     * Remove letras selecionadas.
     */

    letterButtons.forEach(button => {

        button.classList.remove("active");

    });


    /*
     * Ativa "Todos".
     */

    categoryButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.category === "Todos") {

            button.classList.add("active");

        }

    });


    /*
     * Esconde A-Z.
     */

    updateLettersVisibility();


    /*
     * Mostra todos os jogos.
     */

    filterGames();

});


/* =========================
   EXPLORAR JOGOS
========================= */

exploreBtn.addEventListener("click", () => {

    document.getElementById("gamesSection").scrollIntoView({
        behavior: "smooth"
    });

});


/* =========================
   BOTÕES "VER JOGO"
========================= */

const detailsButtons =
    document.querySelectorAll(".details-btn");

detailsButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card =
            button.closest(".game-card");

        const gameName =
            card.dataset.name;

        alert(
            `Página de ${gameName} será adicionada em breve!`
        );

    });

});


/* =========================
   INICIALIZAÇÃO
========================= */

updateLettersVisibility();

filterGames();
