// =========================================================
// BOOTPLAY - SCRIPT PRINCIPAL
// =========================================================

let games = [];
let selectedCategory = "Todos";
let selectedLetter = "";

// =========================================================
// ELEMENTOS
// =========================================================

const gamesGrid = document.getElementById("gamesGrid");
const searchInput = document.getElementById("searchInput");
const lettersSection = document.getElementById("lettersSection");
const lettersContainer = document.querySelector(".letters");
const clearFiltersBtn = document.getElementById("clearBtn");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const exploreBtn = document.getElementById("exploreBtn");

// =========================================================
// URL / SLUG
// =========================================================

function slugify(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


// URL DA PLATAFORMA
function getPlatformUrl(platform) {

    const url = new URL(window.location.href);

    url.search = "";
    url.hash = "";

    if (platform && platform !== "Todos") {
        url.searchParams.set("plataforma", platform);
    }

    return url.toString();
}


// URL DO JOGO
function getGameUrl(game) {

    const slug = slugify(game && game.name);

    if (!slug) {
        return window.location.href;
    }

    const url = new URL(window.location.href);

    url.search = "";
    url.hash = "";

    url.searchParams.set("jogo", slug);

    return url.toString();
}


// ATUALIZAR URL DA PLATAFORMA
function updateUrlForPlatform(platform) {

    const url = new URL(window.location.href);

    url.search = "";
    url.hash = "";

    if (platform && platform !== "Todos") {
        url.searchParams.set("plataforma", platform);
    }

    history.pushState(
        {
            plataforma: platform || "Todos"
        },
        "",
        url
    );
}


// ATUALIZAR URL DO JOGO
function updateUrlForGame(game) {

    const slug = slugify(game && game.name);

    if (!slug) {
        return;
    }

    const url = new URL(window.location.href);

    url.search = "";
    url.hash = "";

    url.searchParams.set("jogo", slug);

    history.pushState(
        {
            jogo: slug
        },
        "",
        url
    );
}


// =========================================================
// MENU LATERAL
// =========================================================

if (menuBtn && sidebar && overlay) {

    menuBtn.addEventListener("click", function () {

        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");

    });


    overlay.addEventListener("click", function () {

        sidebar.classList.remove("active");
        overlay.classList.remove("active");

    });

}


// Fechar menu ao escolher categoria

document
    .querySelectorAll(".category-btn")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            if (sidebar) {
                sidebar.classList.remove("active");
            }

            if (overlay) {
                overlay.classList.remove("active");
            }

        });

    });


// =========================================================
// BOTÃO EXPLORAR
// =========================================================

if (exploreBtn) {

    exploreBtn.addEventListener("click", function () {

        const gamesSection =
            document.getElementById("gamesSection");

        if (gamesSection) {

            gamesSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


// =========================================================
// CARREGAR JOGOS
// =========================================================

async function loadGames() {

    try {

        const resultGames =
            await supabaseClient
                .from("games")
                .select("*")
                .order("name", {
                    ascending: true
                });


        if (resultGames.error) {

            console.error(
                "Erro ao carregar jogos:",
                resultGames.error
            );

            showError(
                "Erro ao carregar os jogos."
            );

            return;

        }


        const gamesData =
            resultGames.data || [];


        const resultParts =
            await supabaseClient
                .from("game_parts")
                .select("*")
                .order("sort_order", {
                    ascending: true
                });


        if (resultParts.error) {

            console.error(
                "Erro ao carregar partes:",
                resultParts.error
            );

        }


        const partsData =
            resultParts.data || [];


        games =
            gamesData.map(function (game) {

                return {

                    ...game,

                    parts:
                        partsData
                            .filter(function (part) {

                                return (
                                    part.game_id ===
                                    game.id
                                );

                            })
                            .sort(function (a, b) {

                                return (
                                    a.sort_order -
                                    b.sort_order
                                );

                            })

                };

            });


        renderGames();

        return true;

    } catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        showError(
            "Não foi possível carregar os jogos."
        );

        return false;

    }

}


// =========================================================
// ERRO
// =========================================================

function showError(message) {

    if (!gamesGrid) {
        return;
    }


    gamesGrid.innerHTML = `

        <div class="no-results">

            <div>⚠️</div>

            <h3>ERRO</h3>

            <p>
                ${escapeHtml(message)}
            </p>

        </div>

    `;

}


// =========================================================
// FORMATAR TAMANHO
// =========================================================

function formatGameSize(game) {

    const rawSize =
        game.size ??
        game.game_size;


    if (
        rawSize === null ||
        rawSize === undefined ||
        rawSize === ""
    ) {

        return "";

    }


    const size =
        Number(rawSize);


    if (!Number.isFinite(size)) {
        return "";
    }


    const unit =
        String(
            game.size_unit ??
            game.game_size_unit ??
            "GB"
        ).toUpperCase();


    const allowedUnits = [
        "KB",
        "MB",
        "GB",
        "TB"
    ];


    if (!allowedUnits.includes(unit)) {
        return "";
    }


    const formattedSize =
        Number.isInteger(size)
            ? String(size)
            : String(
                Number(
                    size.toFixed(2)
                )
            );


    return `${formattedSize} ${unit}`;

}


// =========================================================
// MOSTRAR JOGOS
// =========================================================

function renderGames() {

    if (!gamesGrid) {
        return;
    }


    const searchTerm =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredGames =
        games.filter(function (game) {

            const name =
                String(game.name || "");

            const genre =
                String(game.genre || "");

            const platform =
                String(game.platform || "");


            const matchesCategory =
                selectedCategory === "Todos" ||
                platform === selectedCategory;


            const matchesLetter =
                selectedLetter === "" ||
                name
                    .toUpperCase()
                    .startsWith(selectedLetter);


            const matchesSearch =
                name
                    .toLowerCase()
                    .includes(searchTerm) ||

                genre
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


    filteredGames.forEach(function (game) {

        const card =
            document.createElement("article");


        card.className =
            "game-card";


        const gameSize =
            formatGameSize(game);


        card.innerHTML = `

            <div class="game-image">

                <img
                    src="${escapeHtml(game.image)}"
                    alt="${escapeHtml(game.name)}"
                    loading="lazy"
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


                ${
                    gameSize
                        ? `
                            <div class="game-size">
                                💾 ${escapeHtml(gameSize)}
                            </div>
                          `
                        : ""
                }


                <button
                    type="button"
                    class="details-btn"
                >
                    VER JOGO
                </button>

            </div>

        `;


        card.addEventListener(
            "click",
            function () {

                openGameModal(game);

            }
        );


        gamesGrid.appendChild(card);

    });

}


// =========================================================
// MODAL
// =========================================================

function openGameModal(
    game,
    updateUrl = true
) {

    const modal =
        document.getElementById("gameModal");


    if (!modal) {

        console.error(
            "gameModal não encontrado."
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


    // Atualiza URL quando abrir normalmente
    if (updateUrl) {
        updateUrlForGame(game);
    }


    if (modalImage) {

        modalImage.src =
            game.image || "";

        modalImage.alt =
            game.name || "";

    }


    if (modalTitle) {

        modalTitle.textContent =
            game.name || "";

    }


    if (modalPlatform) {

        const gameSize =
            formatGameSize(game);


        modalPlatform.textContent =
            gameSize
                ? `${game.platform} • ${gameSize}`
                : game.platform || "";

    }


    if (modalGenre) {

        modalGenre.textContent =
            game.genre || "";

    }


    if (modalDescription) {

        modalDescription.textContent =
            game.description || "";

    }


    // =====================================================
    // PARTES
    // =====================================================

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

            game.parts.forEach(
                function (part) {

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


                    link.addEventListener(
                        "click",
                        function (event) {

                            event.stopPropagation();

                        }
                    );


                    modalParts.appendChild(
                        link
                    );

                }
            );

        }

    }


    modal.classList.add("show");

}


// =========================================================
// FECHAR MODAL
// =========================================================

function closeGameModal(
    updateUrl = true
) {

    const modal =
        document.getElementById("gameModal");


    if (modal) {

        modal.classList.remove("show");

    }


    if (updateUrl) {

        history.replaceState(
            {},
            "",
            getPlatformUrl(
                selectedCategory
            )
        );

    }

}


const closeModal =
    document.getElementById("closeModal");


if (closeModal) {

    closeModal.addEventListener(
        "click",
        function () {

            closeGameModal();

        }
    );

}


const gameModal =
    document.getElementById("gameModal");


if (gameModal) {

    gameModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === gameModal
            ) {

                closeGameModal();

            }

        }
    );

}


// =========================================================
// ESC FECHA MODAL
// =========================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeGameModal();

        }

    }
);


// =========================================================
// FILTRO POR PLATAFORMA
// =========================================================

document
    .querySelectorAll(
        ".category-btn, .platform"
    )
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                selectedCategory =
                    button.dataset.category ||
                    "Todos";


                selectedLetter =
                    "";


                // URL DA PLATAFORMA
                updateUrlForPlatform(
                    selectedCategory
                );


                document
                    .querySelectorAll(
                        ".category-btn, .platform"
                    )
                    .forEach(function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                if (
                    lettersSection &&
                    selectedCategory !== "Todos"
                ) {

                    lettersSection.classList.add(
                        "active"
                    );

                } else if (
                    lettersSection
                ) {

                    lettersSection.classList.remove(
                        "active"
                    );

                }


                renderLetters();
                renderGames();

            }
        );

    });


// =========================================================
// LETRAS A-Z
// =========================================================

function renderLetters() {

    if (!lettersContainer) {
        return;
    }


    lettersContainer.innerHTML = "";


    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");


    alphabet.forEach(function (letter) {

        const button =
            document.createElement("button");


        button.type =
            "button";


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
            function () {

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


// =========================================================
// PESQUISA
// =========================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            renderGames();

        }
    );

}


// =========================================================
// LIMPAR FILTROS
// =========================================================

if (clearFiltersBtn) {

    clearFiltersBtn.addEventListener(
        "click",
        function () {

            selectedCategory =
                "Todos";


            selectedLetter =
                "";


            if (searchInput) {

                searchInput.value =
                    "";

            }


            if (lettersSection) {

                lettersSection.classList.remove(
                    "active"
                );

            }


            document
                .querySelectorAll(
                    ".category-btn, .platform"
                )
                .forEach(function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                });


            document
                .querySelectorAll(
                    '[data-category="Todos"]'
                )
                .forEach(function (button) {

                    button.classList.add(
                        "active"
                    );

                });


            history.pushState(
                {},
                "",
                getPlatformUrl("Todos")
            );


            renderLetters();
            renderGames();

        }
    );

}


// =========================================================
// SEGURANÇA
// =========================================================

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


// =========================================================
// ABRIR PLATAFORMA/JOGO PELA URL
// =========================================================

function openGameFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const platformParam =
        params.get("plataforma");


    const gameParam =
        params.get("jogo");


    // =====================================================
    // JOGO
    // =====================================================

    if (gameParam) {

        const game =
            games.find(function (item) {

                return (
                    slugify(item.name) ===
                    gameParam
                );

            });


        if (game) {

            selectedCategory =
                game.platform ||
                "Todos";


            selectedLetter =
                game.name
                    ? game.name
                        .charAt(0)
                        .toUpperCase()
                    : "";


            document
                .querySelectorAll(
                    ".category-btn, .platform"
                )
                .forEach(function (button) {

                    button.classList.remove(
                        "active"
                    );


                    if (
                        button.dataset.category ===
                        selectedCategory
                    ) {

                        button.classList.add(
                            "active"
                        );

                    }

                });


            if (
                lettersSection &&
                selectedCategory !== "Todos"
            ) {

                lettersSection.classList.add(
                    "active"
                );

            }


            renderLetters();
            renderGames();


            // false = não altera novamente a URL
            openGameModal(
                game,
                false
            );


            return;

        }

    }


    // =====================================================
    // PLATAFORMA
    // =====================================================

    if (platformParam) {

        const validPlatform =
            Array.from(
                document.querySelectorAll(
                    ".category-btn, .platform"
                )
            ).some(function (button) {

                return (
                    button.dataset.category ===
                    platformParam
                );

            });


        if (validPlatform) {

            selectedCategory =
                platformParam;


            selectedLetter =
                "";


            document
                .querySelectorAll(
                    ".category-btn, .platform"
                )
                .forEach(function (button) {

                    button.classList.toggle(
                        "active",
                        button.dataset.category ===
                        selectedCategory
                    );

                });


            if (lettersSection) {

                lettersSection.classList.add(
                    "active"
                );

            }


            renderLetters();
            renderGames();


            return;

        }

    }


    // =====================================================
    // SEM URL
    // =====================================================

    selectedCategory =
        "Todos";


    selectedLetter =
        "";


    renderLetters();
    renderGames();

}


// =========================================================
// BOTÃO VOLTAR / AVANÇAR DO NAVEGADOR
// =========================================================

window.addEventListener(
    "popstate",
    function () {

        closeGameModal(false);

        openGameFromUrl();

    }
);


// =========================================================
// CARROSSEL
// =========================================================

let carouselIndex = 0;
let carouselTimer = null;
let carouselCards = [];


const carouselGrid =
    document.getElementById("gamesGrid");


const carouselPrev =
    document.getElementById("carouselPrev");


const carouselNext =
    document.getElementById("carouselNext");


const carouselDots =
    document.getElementById("carouselDots");


// =========================================================
// PEGAR CARDS
// =========================================================

function getCarouselCards() {

    if (!carouselGrid) {
        return [];
    }


    return Array.from(
        carouselGrid.querySelectorAll(
            ".game-card"
        )
    );

}


// =========================================================
// CARDS POR TELA
// =========================================================

function getCardsPerView() {

    const width =
        window.innerWidth;


    if (width <= 600) {
        return 1;
    }


    if (width <= 900) {
        return 3;
    }


    return 5;

}


// =========================================================
// ATUALIZAR CARROSSEL
// =========================================================

function updateCarousel() {

    carouselCards =
        getCarouselCards();


    if (!carouselCards.length) {
        return;
    }


    const cardsPerView =
        getCardsPerView();


    const maxIndex =
        Math.max(
            0,
            carouselCards.length -
            cardsPerView
        );


    if (
        carouselIndex >
        maxIndex
    ) {

        carouselIndex = 0;

    }


    const firstCard =
        carouselCards[0];


    if (!firstCard) {
        return;
    }


    const cardWidth =
        firstCard.offsetWidth;


    const gap =
        parseFloat(
            window.getComputedStyle(
                carouselGrid
            ).gap
        ) || 0;


    const step =
        cardWidth + gap;


    carouselGrid.style.transform =
        `translateX(-${carouselIndex * step}px)`;


    carouselCards.forEach(function (card) {

        card.classList.remove(
            "carousel-active"
        );

    });


    const centerOffset =
        Math.floor(
            (cardsPerView - 1) / 2
        );


    const activeIndex =
        Math.min(
            carouselIndex +
            centerOffset,
            carouselCards.length - 1
        );


    if (
        carouselCards[activeIndex]
    ) {

        carouselCards[activeIndex]
            .classList
            .add(
                "carousel-active"
            );

    }


    updateCarouselDots();

}


// =========================================================
// DOTS
// =========================================================

function updateCarouselDots() {

    if (!carouselDots) {
        return;
    }


    carouselDots.innerHTML = "";


    const cardsPerView =
        getCardsPerView();


    const totalPositions =
        Math.max(
            1,
            carouselCards.length -
            cardsPerView +
            1
        );


    for (
        let i = 0;
        i < totalPositions;
        i++
    ) {

        const dot =
            document.createElement(
                "button"
            );


        dot.type =
            "button";


        dot.className =
            "carousel-dot";


        if (
            i === carouselIndex
        ) {

            dot.classList.add(
                "active"
            );

        }


        dot.addEventListener(
            "click",
            function () {

                carouselIndex =
                    i;

                updateCarousel();
                restartCarousel();

            }
        );


        carouselDots.appendChild(
            dot
        );

    }

}


// =========================================================
// PRÓXIMO
// =========================================================

function nextCarousel() {

    carouselCards =
        getCarouselCards();


    if (!carouselCards.length) {
        return;
    }


    const cardsPerView =
        getCardsPerView();


    const maxIndex =
        Math.max(
            0,
            carouselCards.length -
            cardsPerView
        );


    if (
        carouselIndex >=
        maxIndex
    ) {

        carouselIndex = 0;

    } else {

        carouselIndex++;

    }


    updateCarousel();

}


// =========================================================
// ANTERIOR
// =========================================================

function previousCarousel() {

    carouselCards =
        getCarouselCards();


    if (!carouselCards.length) {
        return;
    }


    const cardsPerView =
        getCardsPerView();


    const maxIndex =
        Math.max(
            0,
            carouselCards.length -
            cardsPerView
        );


    if (
        carouselIndex <= 0
    ) {

        carouselIndex =
            maxIndex;

    } else {

        carouselIndex--;

    }


    updateCarousel();

}


// =========================================================
// TIMER
// =========================================================

function startCarousel() {

    stopCarousel();


    carouselTimer =
        setInterval(
            function () {

                nextCarousel();

            },
            3500
        );

}


function stopCarousel() {

    if (carouselTimer) {

        clearInterval(
            carouselTimer
        );

        carouselTimer = null;

    }

}


function restartCarousel() {

    startCarousel();

}


// =========================================================
// BOTÃO ANTERIOR
// =========================================================

if (carouselPrev) {

    carouselPrev.addEventListener(
        "click",
        function () {

            previousCarousel();

            restartCarousel();

        }
    );

}


// =========================================================
// BOTÃO PRÓXIMO
// =========================================================

if (carouselNext) {

    carouselNext.addEventListener(
        "click",
        function () {

            nextCarousel();

            restartCarousel();

        }
    );

}


// =========================================================
// PAUSAR COM MOUSE
// =========================================================

if (carouselGrid) {

    carouselGrid.addEventListener(
        "mouseenter",
        stopCarousel
    );


    carouselGrid.addEventListener(
        "mouseleave",
        startCarousel
    );

}


// =========================================================
// RESIZE
// =========================================================

window.addEventListener(
    "resize",
    function () {

        updateCarousel();

    }
);


// =========================================================
// OBSERVAR MUDANÇAS DOS CARDS
// =========================================================

if (carouselGrid) {

    const carouselObserver =
        new MutationObserver(
            function () {

                setTimeout(
                    function () {

                        carouselCards =
                            getCarouselCards();

                        carouselIndex =
                            0;

                        updateCarousel();

                        startCarousel();

                    },
                    50
                );

            }
        );


    carouselObserver.observe(
        carouselGrid,
        {
            childList: true
        }
    );

}


// =========================================================
// ESCONDER A-Z INICIALMENTE
// =========================================================

if (lettersSection) {

    lettersSection.classList.remove(
        "active"
    );

}


// =========================================================
// INICIAR
// =========================================================

renderLetters();


// Primeiro carrega os jogos.
// Depois verifica se existe ?plataforma= ou ?jogo=

loadGames().then(
    function () {

        openGameFromUrl();

    }
);


// =========================================================
// INICIAR CARROSSEL
// =========================================================

setTimeout(
    function () {

        updateCarousel();

        startCarousel();

    },
    500
);
