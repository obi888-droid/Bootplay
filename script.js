// ============================================
// BOOTPLAY - SCRIPT PRINCIPAL
// ============================================

let games = [];
let selectedCategory = "Todos";
let selectedLetter = "";

// ============================================
// ELEMENTOS DA PÁGINA
// ============================================

const gamesGrid = document.getElementById("gamesGrid");
const searchInput = document.getElementById("searchInput");

const lettersSection = document.getElementById("lettersSection");
const lettersContainer = document.querySelector(".letters");

const clearFiltersBtn = document.getElementById("clearBtn");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const exploreBtn = document.getElementById("exploreBtn");

// Elementos do carrossel exclusivo de PC
const carouselGrid = document.getElementById("pcCarouselGrid");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
const carouselDots = document.getElementById("carouselDots");

let carouselIndex = 0;
let carouselTimer = null;

// ============================================
// MENU LATERAL
// ============================================

function closeSidebar() {
    if (sidebar) sidebar.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
}

if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener("click", function () {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", closeSidebar);
}

// Fechar menu ao escolher uma categoria
document.querySelectorAll(".category-btn").forEach(function (button) {
    button.addEventListener("click", closeSidebar);
});

// ============================================
// BOTÃO EXPLORAR JOGOS
// ============================================

if (exploreBtn) {
    exploreBtn.addEventListener("click", function () {
        const gamesSection = document.getElementById("gamesSection");

        if (gamesSection) {
            gamesSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}

// ============================================
// CARREGAR JOGOS DO SUPABASE
// ============================================

async function loadGames() {
    try {
        if (typeof supabaseClient === "undefined") {
            console.error("Supabase Client não foi encontrado.");
            showError("Não foi possível conectar ao banco de dados.");
            return;
        }

        // Buscar jogos
        const resultGames = await supabaseClient
            .from("games")
            .select("*")
            .order("name", { ascending: true });

        if (resultGames.error) {
            console.error("Erro ao carregar jogos:", resultGames.error);
            showError("Erro ao carregar os jogos.");
            return;
        }

        const gamesData = resultGames.data || [];

        // Buscar partes/links dos jogos
        const resultParts = await supabaseClient
            .from("game_parts")
            .select("*")
            .order("sort_order", { ascending: true });

        if (resultParts.error) {
            console.error("Erro ao carregar partes:", resultParts.error);
        }

        const partsData = resultParts.data || [];

        // Juntar cada jogo com suas partes
        games = gamesData.map(function (game) {
            const gameParts = partsData
                .filter(function (part) {
                    return String(part.game_id) === String(game.id);
                })
                .sort(function (a, b) {
                    return (Number(a.sort_order) || 0) -
                           (Number(b.sort_order) || 0);
                });

            return {
                ...game,
                parts: gameParts
            };
        });

        renderGames();
        renderPcCarousel();

    } catch (error) {
        console.error("Erro inesperado ao carregar jogos:", error);
        showError("Não foi possível carregar os jogos.");
    }
}

// ============================================
// MOSTRAR ERRO
// ============================================

function showError(message) {
    if (gamesGrid) {
        gamesGrid.innerHTML = `
            <div class="no-results">
                <div>⚠️</div>
                <h3>ERRO</h3>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }

    if (carouselGrid) {
        carouselGrid.innerHTML = `
            <div class="no-results">
                <div>⚠️</div>
                <h3>ERRO AO CARREGAR</h3>
                <p>Não foi possível carregar os jogos de PC.</p>
            </div>
        `;
    }
}

// ============================================
// FORMATAR TAMANHO DO JOGO
// ============================================

function formatGameSize(game) {
    // Aceita os campos novos e antigos
    const rawSize = game.size ?? game.game_size;

    if (
        rawSize === null ||
        rawSize === undefined ||
        rawSize === ""
    ) {
        return "";
    }

    const size = Number(rawSize);

    if (!Number.isFinite(size)) {
        return "";
    }

    const unit = String(
        game.size_unit ??
        game.game_size_unit ??
        "GB"
    ).toUpperCase();

    const allowedUnits = ["KB", "MB", "GB", "TB"];

    if (!allowedUnits.includes(unit)) {
        return "";
    }

    const formattedSize = Number.isInteger(size)
        ? String(size)
        : String(Number(size.toFixed(2)));

    return `${formattedSize} ${unit}`;
}

// ============================================
// CRIAR CARD DE JOGO
// ============================================

function createGameCard(game) {
    const card = document.createElement("article");
    card.className = "game-card";

    const gameSize = formatGameSize(game);

    card.innerHTML = `
        <div class="game-image">
            <img
                src="${escapeHtml(game.image || "")}"
                alt="${escapeHtml(game.name || "")}"
                loading="lazy"
            >
            <span class="game-platform">
                ${escapeHtml(game.platform || "")}
            </span>
        </div>

        <div class="game-info">
            <h3>${escapeHtml(game.name || "")}</h3>

            <p>
                ${escapeHtml(game.platform || "")}
                •
                ${escapeHtml(game.genre || "")}
            </p>

            ${
                gameSize
                    ? `<div class="game-size">💾 ${escapeHtml(gameSize)}</div>`
                    : ""
            }

            <button type="button" class="details-btn">
                VER JOGO
            </button>
        </div>
    `;

    card.addEventListener("click", function () {
        openGameModal(game);
    });

    return card;
}

// ============================================
// CARROSSEL: SOMENTE JOGOS DE PC
// ============================================

function renderPcCarousel() {
    if (!carouselGrid) return;

    const pcGames = games.filter(function (game) {
        return String(game.platform || "")
            .trim()
            .toLowerCase() === "pc";
    });

    carouselGrid.innerHTML = "";

    // Reiniciar carrossel quando a lista for atualizada
    carouselIndex = 0;

    if (pcGames.length === 0) {
        carouselGrid.innerHTML = `
            <div class="no-results">
                <div>🖥️</div>
                <h3>NENHUM JOGO DE PC</h3>
                <p>
                    Cadastre um jogo com a plataforma "PC"
                    para ele aparecer aqui.
                </p>
            </div>
        `;

        updateCarousel();
        return;
    }

    pcGames.forEach(function (game) {
        carouselGrid.appendChild(createGameCard(game));
    });

    updateCarousel();
    restartCarousel();
}

// ============================================
// CATÁLOGO: TODOS OS JOGOS E PLATAFORMAS
// ============================================

function renderGames() {
    if (!gamesGrid) return;

    const searchTerm = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filteredGames = games.filter(function (game) {
        const name = String(game.name || "");
        const genre = String(game.genre || "");
        const platform = String(game.platform || "");

        const matchesCategory =
            selectedCategory === "Todos" ||
            platform.toLowerCase() === selectedCategory.toLowerCase();

        const matchesLetter =
            selectedLetter === "" ||
            name.toUpperCase().startsWith(selectedLetter);

        const matchesSearch =
            name.toLowerCase().includes(searchTerm) ||
            genre.toLowerCase().includes(searchTerm) ||
            platform.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesLetter && matchesSearch;
    });

    gamesGrid.innerHTML = "";

    if (filteredGames.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-results">
                <div>🎮</div>
                <h3>NENHUM JOGO ENCONTRADO</h3>
                <p>
                    Não existem jogos nessa categoria,
                    letra ou pesquisa.
                </p>
            </div>
        `;
        return;
    }

    filteredGames.forEach(function (game) {
        gamesGrid.appendChild(createGameCard(game));
    });
}

// ============================================
// MODAL DO JOGO
// ============================================

function openGameModal(game) {
    const modal = document.getElementById("gameModal");

    if (!modal) {
        console.error("Elemento gameModal não encontrado.");
        return;
    }

    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalPlatform = document.getElementById("modalPlatform");
    const modalGenre = document.getElementById("modalGenre");
    const modalDescription = document.getElementById("modalDescription");
    const modalParts = document.getElementById("modalParts");

    if (modalImage) {
        modalImage.src = game.image || "";
        modalImage.alt = game.name || "";
    }

    if (modalTitle) {
        modalTitle.textContent = game.name || "";
    }

    if (modalPlatform) {
        const gameSize = formatGameSize(game);

        modalPlatform.textContent = gameSize
            ? `${game.platform || ""} • ${gameSize}`
            : (game.platform || "");
    }

    if (modalGenre) {
        modalGenre.textContent = game.genre || "";
    }

    if (modalDescription) {
        modalDescription.textContent = game.description || "";
    }

    // Links/partes do jogo
    if (modalParts) {
        modalParts.innerHTML = "";

        if (!game.parts || game.parts.length === 0) {
            modalParts.innerHTML = `
                <p>Nenhuma parte cadastrada.</p>
            `;
        } else {
            game.parts.forEach(function (part) {
                const link = document.createElement("a");

                link.className = "part-link";
                link.textContent = part.name || "Abrir link";
                link.href = part.link || "#";
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                link.addEventListener("click", function (event) {
                    event.stopPropagation();
                });

                modalParts.appendChild(link);
            });
        }
    }

    modal.classList.add("show");
}

// ============================================
// FECHAR MODAL
// ============================================

const closeModalBtn = document.getElementById("closeModal");
const gameModal = document.getElementById("gameModal");

if (closeModalBtn && gameModal) {
    closeModalBtn.addEventListener("click", function () {
        gameModal.classList.remove("show");
    });
}

if (gameModal) {
    gameModal.addEventListener("click", function (event) {
        if (event.target === gameModal) {
            gameModal.classList.remove("show");
        }
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && gameModal) {
        gameModal.classList.remove("show");
    }
});

// ============================================
// FILTRO POR PLATAFORMA
// ============================================

document.querySelectorAll(".category-btn, .platform").forEach(function (button) {
    button.addEventListener("click", function () {
        selectedCategory = button.dataset.category || "Todos";
        selectedLetter = "";

        document
            .querySelectorAll(".category-btn, .platform")
            .forEach(function (btn) {
                btn.classList.remove("active");
            });

        // Ativar os botões correspondentes à categoria escolhida
        document
            .querySelectorAll(".category-btn, .platform")
            .forEach(function (btn) {
                if ((btn.dataset.category || "Todos") === selectedCategory) {
                    btn.classList.add("active");
                }
            });

        if (lettersSection) {
            if (selectedCategory !== "Todos") {
                lettersSection.classList.add("active");
            } else {
                lettersSection.classList.remove("active");
            }
        }

        renderLetters();
        renderGames();

        // Levar o usuário até o catálogo
        const gamesSection = document.getElementById("gamesSection");

        if (gamesSection) {
            gamesSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ============================================
// FILTRO A-Z
// ============================================

function renderLetters() {
    if (!lettersContainer) return;

    lettersContainer.innerHTML = "";

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // Botão para remover o filtro de letra
    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.textContent = "TODOS";
    allButton.className = selectedLetter === "" ? "active" : "";

    allButton.addEventListener("click", function () {
        selectedLetter = "";
        renderLetters();
        renderGames();
    });

    lettersContainer.appendChild(allButton);

    alphabet.forEach(function (letter) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = letter;
        button.dataset.letter = letter;

        if (letter === selectedLetter) {
            button.classList.add("active");
        }

        button.addEventListener("click", function () {
            selectedLetter = letter;
            renderLetters();
            renderGames();
        });

        lettersContainer.appendChild(button);
    });
}

// ============================================
// PESQUISA
// ============================================

if (searchInput) {
    searchInput.addEventListener("input", function () {
        renderGames();
    });
}

// ============================================
// LIMPAR FILTROS
// ============================================

if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", function () {
        selectedCategory = "Todos";
        selectedLetter = "";

        if (searchInput) {
            searchInput.value = "";
        }

        if (lettersSection) {
            lettersSection.classList.remove("active");
        }

        document
            .querySelectorAll(".category-btn, .platform")
            .forEach(function (button) {
                button.classList.remove("active");

                if ((button.dataset.category || "") === "Todos") {
                    button.classList.add("active");
                }
            });

        renderLetters();
        renderGames();
    });
}

// ============================================
// SEGURANÇA: ESCAPAR HTML
// ============================================

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================
// CARROSSEL AUTOMÁTICO
// ============================================

function getCarouselCards() {
    if (!carouselGrid) return [];

    return Array.from(
        carouselGrid.querySelectorAll(".game-card")
    );
}

function getCardsPerView() {
    const width = window.innerWidth;

    if (width <= 600) return 1;
    if (width <= 900) return 3;

    return 5;
}

function updateCarousel() {
    if (!carouselGrid) return;

    const cards = getCarouselCards();
    const cardsPerView = getCardsPerView();

    if (cards.length === 0) {
        carouselGrid.style.transform = "translateX(0)";
        if (carouselDots) carouselDots.innerHTML = "";
        return;
    }

    const maxIndex = Math.max(0, cards.length - cardsPerView);

    if (carouselIndex > maxIndex) {
        carouselIndex = 0;
    }

    const firstCard = cards[0];
    const cardWidth = firstCard.getBoundingClientRect().width;

    const styles = window.getComputedStyle(carouselGrid);
    const gap = parseFloat(styles.gap) || 0;

    const step = cardWidth + gap;

    carouselGrid.style.transform =
        `translateX(-${carouselIndex * step}px)`;

    cards.forEach(function (card) {
        card.classList.remove("carousel-active");
    });

    const centerOffset = Math.floor((cardsPerView - 1) / 2);
    const activeIndex = Math.min(
        carouselIndex + centerOffset,
        cards.length - 1
    );

    if (cards[activeIndex]) {
        cards[activeIndex].classList.add("carousel-active");
    }

    updateCarouselDots();
}

function updateCarouselDots() {
    if (!carouselDots) return;

    carouselDots.innerHTML = "";

    const cards = getCarouselCards();
    const cardsPerView = getCardsPerView();

    const totalPositions = Math.max(
        1,
        cards.length - cardsPerView + 1
    );

    for (let i = 0; i < totalPositions; i++) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Ir para posição ${i + 1}`);

        if (i === carouselIndex) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", function () {
            carouselIndex = i;
            updateCarousel();
            restartCarousel();
        });

        carouselDots.appendChild(dot);
    }
}

function nextCarousel() {
    const cards = getCarouselCards();

    if (cards.length === 0) return;

    const maxIndex = Math.max(
        0,
        cards.length - getCardsPerView()
    );

    carouselIndex = carouselIndex >= maxIndex
        ? 0
        : carouselIndex + 1;

    updateCarousel();
}

function previousCarousel() {
    const cards = getCarouselCards();

    if (cards.length === 0) return;

    const maxIndex = Math.max(
        0,
        cards.length - getCardsPerView()
    );

    carouselIndex = carouselIndex <= 0
        ? maxIndex
        : carouselIndex - 1;

    updateCarousel();
}

function startCarousel() {
    stopCarousel();

    if (getCarouselCards().length <= getCardsPerView()) {
        return;
    }

    carouselTimer = setInterval(function () {
        nextCarousel();
    }, 3500);
}

function stopCarousel() {
    if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
    }
}

function restartCarousel() {
    startCarousel();
}

// Botão anterior
if (carouselPrev) {
    carouselPrev.addEventListener("click", function () {
        previousCarousel();
        restartCarousel();
    });
}

// Botão próximo
if (carouselNext) {
    carouselNext.addEventListener("click", function () {
        nextCarousel();
        restartCarousel();
    });
}

// Pausar ao passar o mouse
if (carouselGrid) {
    carouselGrid.addEventListener("mouseenter", stopCarousel);
    carouselGrid.addEventListener("mouseleave", startCarousel);
}

// Atualizar ao mudar o tamanho da tela
window.addEventListener("resize", function () {
    updateCarousel();
    restartCarousel();
});

// ============================================
// INICIALIZAÇÃO
// ============================================

// Esconder letras A-Z ao abrir o site
if (lettersSection) {
    lettersSection.classList.remove("active");
}

// Gerar letras e carregar os jogos
renderLetters();
loadGames();
