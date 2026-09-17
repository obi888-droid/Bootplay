// ===============================
// BOOTPLAY - SCRIPT PRINCIPAL
// ===============================

let games = [];
let selectedCategory = "Todos";
let selectedLetter = "";

// ===============================
// ELEMENTOS
// ===============================

const gamesGrid = document.getElementById("gamesGrid");
const searchInput = document.getElementById("searchInput");

const lettersSection =
    document.getElementById("lettersSection");

const lettersContainer =
    document.querySelector(".letters");

const clearFiltersBtn =
    document.getElementById("clearBtn");

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");

const exploreBtn =
    document.getElementById("exploreBtn");


// ===============================
// MENU LATERAL
// ===============================

if (menuBtn && sidebar && overlay) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");

    });

    overlay.addEventListener("click", () => {

        sidebar.classList.remove("open");
        overlay.classList.remove("active");

    });

}


// ===============================
// FECHAR MENU AO ESCOLHER CATEGORIA
// ===============================

document
    .querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            if (sidebar && overlay) {
                sidebar.classList.remove("open");
                overlay.classList.remove("active");
            }

        });

    });


// ===============================
// BOTÃO EXPLORAR JOGOS
// ===============================

if (exploreBtn) {

    exploreBtn.addEventListener("click", () => {

        const gamesSection =
            document.getElementById("gamesSection");

        if (gamesSection) {

            gamesSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


// ===============================
// CARREGAR JOGOS DO SUPABASE
// ===============================

async function loadGames() {

    try {

        const {
            data: gamesData,
            error: gamesError
        } = await supabaseClient
            .from("games")
            .select("*")
            .order("name", {
                ascending: true
            });


        if (gamesError) {

            console.error(
                "Erro ao carregar jogos:",
                gamesError
            );

            if (gamesGrid) {

                gamesGrid.innerHTML = `
                    <p class="empty-message">
                        Erro ao carregar os jogos.
                    </p>
                `;

            }

            return;
        }


        const {
            data: partsData,
            error: partsError
        } = await supabaseClient
            .from("game_parts")
            .select("*")
            .order("sort_order", {
                ascending: true
            });


        if (partsError) {

            console.error(
                "Erro ao carregar partes:",
                partsError
            );

            return;
        }


        games = (gamesData || []).map(game => ({

            ...game,

            parts: (partsData || [])
                .filter(part =>
                    part.game_id === game.id
                )
                .sort(
                    (a, b) =>
                        a.sort_order - b.sort_order
                )

        }));


        renderGames();

    } catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        if (gamesGrid) {

            gamesGrid.innerHTML = `
                <p class="empty-message">
                    Não foi possível carregar os jogos.
                </p>
            `;

        }

    }

}


// ===============================
// MOSTRAR JOGOS
// ===============================

function renderGames() {

    if (!gamesGrid) return;


    const searchTerm =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredGames =
        games.filter(game => {

            const matchesCategory =
                selectedCategory === "Todos" ||
                game.platform === selectedCategory;


            const matchesLetter =
                selectedLetter === "" ||
                game.name
                    .toUpperCase()
                    .startsWith(selectedLetter);


            const matchesSearch =
                game.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                game.genre
                    .toLowerCase()
                    .includes(searchTerm);


            return (
                matchesCategory &&
                matchesLetter &&
                matchesSearch
            );

        });


    gamesGrid.innerHTML = "";


    if (filteredGames.length === 0) {

        gamesGrid.innerHTML = `
            <div class="no-results">
                <div>🎮</div>

                <h3>
                    NENHUM JOGO ENCONTRADO
                </h3>

                <p>
                    Não existem jogos nessa categoria ou letra.
                </p>
            </div>
        `;

        return;
    }


    filteredGames.forEach(game => {

        const card =
            document.createElement("article");

        card.className = "game-card";


        card.innerHTML = `

            <div class="game-image">

                <img
                    src="${escapeHtml(game.image)}"
                    alt="${escapeHtml(game.name)}"
                >

                <span class="game-platform">
                    ${escapeHtml(game.platform)}
                </span>

            </div>


            <div class="game-info">

                <h3>
                    ${escapeHtml(game.name)}
                </h3>

                <p>
                    ${escapeHtml(game.platform)}
                    •
                    ${escapeHtml(game.genre)}
                </p>

                <button class="details-btn">
                    VER JOGO
                </button>

            </div>

        `;


        card.addEventListener(
            "click",
            () => openGameModal(game)
        );


        gamesGrid.appendChild(card);

    });

}


// ===============================
// MODAL DO JOGO
// ===============================

function openGameModal(game) {

    const modal =
        document.getElementById("gameModal");


    if (!modal) {

        console.error(
            "Modal do jogo não encontrado."
        );

        return;
    }


    const modalImage =
        document.getElementById("modalImage");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalPlatform =
        document.getElementById("modalPlatform");

    const modalGenre =
        document.getElementById("modalGenre");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalParts =
        document.getElementById("modalParts");


    if (modalImage) {

        modalImage.src = game.image;
        modalImage.alt = game.name;

    }


    if (modalTitle) {
        modalTitle.textContent =
            game.name;
    }


    if (modalPlatform) {
        modalPlatform.textContent =
            game.platform;
    }


    if (modalGenre) {
        modalGenre.textContent =
            game.genre;
    }


    if (modalDescription) {
        modalDescription.textContent =
            game.description;
    }


    if (modalParts) {

        modalParts.innerHTML = "";


        if (
            !game.parts ||
            game.parts.length === 0
        ) {

            modalParts.innerHTML = `
                <p>
                    Nenhuma parte cadastrada.
                </p>
            `;

        } else {

            game.parts.forEach(part => {

                const button =
                    document.createElement("button");


                button.className =
                    "part-button";


                button.textContent =
                    part.name;


                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        if (part.link) {

                            window.open(
                                part.link,
                                "_blank",
                                "noopener,noreferrer"
                            );

                        }

                    }
                );


                modalParts.appendChild(button);

            });

        }

    }


    modal.classList.add("active");

}


// ===============================
// FECHAR MODAL
// ===============================

const closeModal =
    document.getElementById("closeModal");


if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            const modal =
                document.getElementById(
                    "gameModal"
                );


            if (modal) {

                modal.classList.remove(
                    "active"
                );

            }

        }
    );

}


const gameModal =
    document.getElementById("gameModal");


if (gameModal) {

    gameModal.addEventListener(
        "click",
        event => {

            if (
                event.target === gameModal
            ) {

                gameModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ===============================
// FILTRO POR PLATAFORMA
// ===============================

document
    .querySelectorAll(
        ".category-btn, .platform"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectedCategory =
                    button.dataset.category;

                selectedLetter = "";


                document
                    .querySelectorAll(
                        ".category-btn, .platform"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add("active");


                if (
                    lettersSection &&
                    selectedCategory !== "Todos"
                ) {

                    lettersSection.style.display =
                        "block";

                }


                renderLetters();

                renderGames();

            }
        );

    });


// ===============================
// LETRAS A-Z
// ===============================

function renderLetters() {

    if (!lettersContainer) return;


    lettersContainer.innerHTML = "";


    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            .split("");


    alphabet.forEach(letter => {

        const button =
            document.createElement("button");


        button.textContent =
            letter;


        button.dataset.letter =
            letter;


        if (
            letter === selectedLetter
        ) {

            button.classList.add(
                "active"
            );

        }


        button.addEventListener(
            "click",
            () => {

                selectedLetter =
                    letter;


                renderLetters();

                renderGames();

            }
        );


        lettersContainer.appendChild(
            button
        );

    });

}


// ===============================
// PESQUISA
// ===============================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            renderGames();

        }
    );

}


// ===============================
// LIMPAR FILTROS
// ===============================

if (clearFiltersBtn) {

    clearFiltersBtn.addEventListener(
        "click",
        () => {

            selectedCategory =
                "Todos";

            selectedLetter =
                "";


            if (searchInput) {

                searchInput.value =
                    "";

            }


            if (lettersSection) {

                lettersSection.style.display =
                    "none";

            }


            document
                .querySelectorAll(
                    ".category-btn, .platform"
                )
                .forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


            const allButton =
                document.querySelector(
                    '.category-btn[data-category="Todos"]'
                );


            if (allButton) {

                allButton.classList.add(
                    "active"
                );

            }


            renderGames();

        }
    );

}


// ===============================
// SEGURANÇA
// ===============================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ===============================
// INICIALIZAÇÃO
// ===============================

// Esconder A-Z inicialmente
if (lettersSection) {

    lettersSection.style.display =
        "none";

}


// Carregar jogos do Supabase
loadGames();
