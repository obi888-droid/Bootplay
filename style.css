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

    menuBtn.addEventListener("click", function () {

        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");

    });

    overlay.addEventListener("click", function () {

        sidebar.classList.remove("active");
        overlay.classList.remove("active");

    });

}


// ===============================
// FECHAR MENU AO ESCOLHER CATEGORIA
// ===============================

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


// ===============================
// BOTÃO EXPLORAR
// ===============================

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


// ===============================
// CARREGAR JOGOS DO SUPABASE
// ===============================

async function loadGames() {

    try {

        // ===============================
        // JOGOS
        // ===============================

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


        // ===============================
        // PARTES
        // ===============================

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


        // ===============================
        // SCREENSHOTS
        // ===============================

        const resultImages =
            await supabaseClient
                .from("game_images")
                .select("*")
                .order("sort_order", {
                    ascending: true
                });


        if (resultImages.error) {

            console.error(
                "Erro ao carregar screenshots:",
                resultImages.error
            );

        }


        const imagesData =
            resultImages.data || [];


        // ===============================
        // JUNTAR DADOS
        // ===============================

        games =
            gamesData.map(function (game) {

                return {

                    ...game,

                    // PARTES
                    parts:
                        partsData
                            .filter(function (part) {

                                return (
                                    Number(part.game_id) ===
                                    Number(game.id)
                                );

                            })
                            .sort(function (a, b) {

                                return (
                                    a.sort_order -
                                    b.sort_order
                                );

                            }),

                    // SCREENSHOTS
                    images:
                        imagesData
                            .filter(function (image) {

                                return (
                                    Number(image.game_id) ===
                                    Number(game.id)
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

    } catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        showError(
            "Não foi possível carregar os jogos."
        );

    }

}


// ===============================
// MOSTRAR ERRO
// ===============================

function showError(message) {

    if (!gamesGrid) return;

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
                    .startsWith(
                        selectedLetter
                    );


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


// ===============================
// MODAL
// ===============================

function openGameModal(game) {

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


    // ===============================
    // IMAGEM PRINCIPAL
    // ===============================

    if (modalImage) {

        modalImage.src =
            game.image || "";

        modalImage.alt =
            game.name || "";

    }


    // ===============================
    // INFORMAÇÕES
    // ===============================

    if (modalTitle) {

        modalTitle.textContent =
            game.name || "";

    }


    if (modalPlatform) {

        modalPlatform.textContent =
            game.platform || "";

    }


    if (modalGenre) {

        modalGenre.textContent =
            game.genre || "";

    }


    if (modalDescription) {

        modalDescription.textContent =
            game.description || "";

    }


    // ===============================
    // GALERIA DE SCREENSHOTS
    // ===============================

    createScreenshotGallery(game);


    // ===============================
    // PARTES
    // ===============================

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


    // IMPORTANTE:
    // O CSS usa .show
    modal.classList.add("show");

}


// ===============================
// CRIAR GALERIA
// ===============================

function createScreenshotGallery(game) {

    const oldGallery =
        document.getElementById(
            "screenshotGallery"
        );


    // Remover galeria anterior
    if (oldGallery) {

        oldGallery.remove();

    }


    // Se não houver screenshots,
    // não criar galeria
    if (
        !game.images ||
        game.images.length === 0
    ) {

        return;

    }


    const modalImage =
        document.getElementById("modalImage");


    if (!modalImage) {

        return;

    }


    // ===============================
    // CONTAINER PRINCIPAL
    // ===============================

    const gallery =
        document.createElement("div");


    gallery.id =
        "screenshotGallery";


    gallery.className =
        "screenshot-gallery";


    // ===============================
    // TÍTULO
    // ===============================

    const galleryTitle =
        document.createElement("div");


    galleryTitle.className =
        "screenshot-gallery-title";


    galleryTitle.innerHTML = `
        <span>📸 SCREENSHOTS</span>
        <small>${game.images.length} imagem${
            game.images.length !== 1
                ? "ns"
                : ""
        }</small>
    `;


    gallery.appendChild(
        galleryTitle
    );


    // ===============================
    // ÁREA DA GALERIA
    // ===============================

    const galleryWrapper =
        document.createElement("div");


    galleryWrapper.className =
        "screenshot-gallery-wrapper";


    // ===============================
    // BOTÃO ESQUERDO
    // ===============================

    const prevButton =
        document.createElement("button");


    prevButton.type =
        "button";


    prevButton.className =
        "gallery-arrow gallery-prev";


    prevButton.innerHTML =
        "‹";


    prevButton.setAttribute(
        "aria-label",
        "Screenshot anterior"
    );


    // ===============================
    // CONTAINER SCROLL
    // ===============================

    const galleryTrack =
        document.createElement("div");


    galleryTrack.className =
        "screenshot-track";


    // ===============================
    // SCREENSHOTS
    // ===============================

    game.images.forEach(
        function (imageData, index) {

            const image =
                document.createElement("img");


            image.className =
                "screenshot-item";


            image.src =
                imageData.image_url;


            image.alt =
                `${game.name} - Screenshot ${index + 1}`;


            image.loading =
                "lazy";


            /*
             * IMPORTANTE:
             *
             * A screenshot NÃO altera
             * a imagem principal.
             *
             * Por isso não existe aqui:
             *
             * modalImage.src = ...
             *
             */


            image.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                }
            );


            galleryTrack.appendChild(
                image
            );

        }
    );


    // ===============================
    // BOTÃO DIREITO
    // ===============================

    const nextButton =
        document.createElement("button");


    nextButton.type =
        "button";


    nextButton.className =
        "gallery-arrow gallery-next";


    nextButton.innerHTML =
        "›";


    nextButton.setAttribute(
        "aria-label",
        "Próxima screenshot"
    );


    // ===============================
    // NAVEGAÇÃO
    // ===============================

    prevButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            galleryTrack.scrollBy({

                left:
                    -galleryTrack.clientWidth * 0.75,

                behavior:
                    "smooth"

            });

        }
    );


    nextButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            galleryTrack.scrollBy({

                left:
                    galleryTrack.clientWidth * 0.75,

                behavior:
                    "smooth"

            });

        }
    );


    // ===============================
    // MONTAR GALERIA
    // ===============================

    galleryWrapper.appendChild(
        prevButton
    );

    galleryWrapper.appendChild(
        galleryTrack
    );

    galleryWrapper.appendChild(
        nextButton
    );


    gallery.appendChild(
        galleryWrapper
    );


    // ===============================
    // INSERIR DEPOIS DA CAPA
    // ===============================

    /*
     * A galeria fica depois da imagem
     * principal.
     *
     * A capa continua sendo a imagem
     * principal e nunca é substituída.
     */

    const modalContent =
        modalImage.parentElement;


    if (
        modalContent &&
        modalContent.parentElement
    ) {

        modalContent.parentElement.insertBefore(
            gallery,
            modalContent.nextSibling
        );

    }

}


// ===============================
// FECHAR MODAL
// ===============================

const closeModal =
    document.getElementById("closeModal");


if (closeModal) {

    closeModal.addEventListener(
        "click",
        function () {

            const modal =
                document.getElementById(
                    "gameModal"
                );


            if (modal) {

                modal.classList.remove(
                    "show"
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
        function (event) {

            if (
                event.target === gameModal
            ) {

                gameModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


// ===============================
// ESC FECHA MODAL
// ===============================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            if (gameModal) {

                gameModal.classList.remove(
                    "show"
                );

            }

        }

    }
);


// ===============================
// FILTRO POR PLATAFORMA
// ===============================

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


                selectedLetter = "";


                // Remover ativo
                document
                    .querySelectorAll(
                        ".category-btn, .platform"
                    )
                    .forEach(function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    });


                // Ativar botão clicado
                button.classList.add(
                    "active"
                );


                // Mostrar A-Z somente
                // quando escolher plataforma
                if (
                    lettersSection &&
                    selectedCategory !== "Todos"
                ) {

                    lettersSection.classList.add(
                        "active"
                    );

                } else if (lettersSection) {

                    lettersSection.classList.remove(
                        "active"
                    );

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


// ===============================
// PESQUISA
// ===============================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

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
        function () {

            selectedCategory =
                "Todos";


            selectedLetter =
                "";


            if (searchInput) {

                searchInput.value =
                    "";

            }


            // Esconder A-Z
            if (lettersSection) {

                lettersSection.classList.remove(
                    "active"
                );

            }


            // Remover ativos
            document
                .querySelectorAll(
                    ".category-btn, .platform"
                )
                .forEach(function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                });


            // Ativar Todos
            document
                .querySelectorAll(
                    '[data-category="Todos"]'
                )
                .forEach(function (button) {

                    button.classList.add(
                        "active"
                    );

                });


            renderLetters();
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

    lettersSection.classList.remove(
        "active"
    );

}


// Gerar letras
renderLetters();


// Carregar jogos
loadGames();
