// ==========================================
// BOOTPLAY - JAVASCRIPT
// ==========================================

// MENU LATERAL
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

// Fechar menu clicando no fundo
overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});


// ==========================================
// ELEMENTOS
// ==========================================

const games = document.querySelectorAll(".game-card");
const categoryButtons = document.querySelectorAll(".category-btn");
const platformButtons = document.querySelectorAll(".platform");
const letterButtons = document.querySelectorAll(".letters button");
const searchInput = document.getElementById("searchInput");
const clearFilters = document.getElementById("clearFilters");
const noResults = document.getElementById("noResults");


// ==========================================
// FILTROS ATUAIS
// ==========================================

let selectedCategory = "Todos";
let selectedLetter = "";


// ==========================================
// MOSTRAR / ESCONDER JOGOS
// ==========================================

function filterGames() {

    const searchText = searchInput.value
        .toLowerCase()
        .trim();

    let visibleGames = 0;

    games.forEach(game => {

        const gameName =
            game.dataset.name.toLowerCase();

        const gameCategory =
            game.dataset.category;

        const firstLetter =
            gameName.charAt(0).toUpperCase();


        // Verifica categoria
        const categoryMatch =
            selectedCategory === "Todos" ||
            gameCategory === selectedCategory;


        // Verifica letra
        const letterMatch =
            selectedLetter === "" ||
            firstLetter === selectedLetter;


        // Verifica pesquisa
        const searchMatch =
            gameName.includes(searchText);


        // Resultado final
        if (
            categoryMatch &&
            letterMatch &&
            searchMatch
        ) {

            game.style.display = "block";

            visibleGames++;

        } else {

            game.style.display = "none";

        }

    });


    // Mostrar mensagem quando não encontrar
    if (visibleGames === 0) {

        noResults.style.display = "block";

    } else {

        noResults.style.display = "none";

    }

}


// ==========================================
// CATEGORIAS DO MENU
// ==========================================

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedCategory =
            button.dataset.category;

        // Limpa letra
        selectedLetter = "";

        // Remove seleção das letras
        letterButtons.forEach(letter => {
            letter.classList.remove("active");
        });

        filterGames();

        // Fecha o menu
        sidebar.classList.remove("active");
        overlay.classList.remove("active");

        // Vai para os jogos
        document.getElementById("gamesGrid")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


// ==========================================
// CATEGORIAS DA PÁGINA PRINCIPAL
// ==========================================

platformButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedCategory =
            button.dataset.category;

        selectedLetter = "";

        letterButtons.forEach(letter => {
            letter.classList.remove("active");
        });

        filterGames();

        document.getElementById("gamesGrid")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


// ==========================================
// FILTRO POR LETRA
// ==========================================

letterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const clickedLetter =
            button.dataset.letter;


        // Se clicar novamente, remove o filtro
        if (selectedLetter === clickedLetter) {

            selectedLetter = "";

            button.classList.remove("active");

        } else {

            selectedLetter = clickedLetter;

            letterButtons.forEach(letter => {
                letter.classList.remove("active");
            });

            button.classList.add("active");

        }


        filterGames();

        document.getElementById("gamesGrid")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


// ==========================================
// PESQUISA
// ==========================================

searchInput.addEventListener("input", () => {

    filterGames();

});


// ==========================================
// LIMPAR FILTROS
// ==========================================

clearFilters.addEventListener("click", () => {

    selectedCategory = "Todos";

    selectedLetter = "";

    searchInput.value = "";


    // Remove seleção das letras
    letterButtons.forEach(letter => {

        letter.classList.remove("active");

    });


    filterGames();

});


// ==========================================
// BOTÃO "EXPLORAR JOGOS"
// ==========================================

const heroButton =
    document.querySelector(".hero-btn");

heroButton.addEventListener("click", () => {

    document.getElementById("gamesGrid")
        .scrollIntoView({
            behavior: "smooth"
        });

});


// ==========================================
// BOTÕES "VER JOGO"
// ==========================================

const detailsButtons =
    document.querySelectorAll(".details-btn");

detailsButtons.forEach(button => {

    button.addEventListener("click", () => {

        const gameCard =
            button.closest(".game-card");

        const gameName =
            gameCard.dataset.name;

        alert(
            "Você selecionou: " +
            gameName +
            "\n\nA página deste jogo poderá ser adicionada depois."
        );

    });

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

filterGames();

console.log("Bootplay carregado com sucesso! 🎮");
