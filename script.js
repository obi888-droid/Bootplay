// ===============================
// BOOTPLAY - SCRIPT PRINCIPAL
// ===============================


let games = [];
let selectedCategory = "Todos";
let selectedLetter = "";


// ===============================
// ELEMENTOS
// ===============================

const gamesGrid =
    document.getElementById("gamesGrid");

const searchInput =
    document.getElementById("searchInput");

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


            showError(
                "Erro ao carregar as partes dos jogos."
            );


            return;

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


        /*
           Se houver erro ao carregar screenshots,
           não vamos quebrar o site inteiro.

           Os jogos continuam aparecendo.
        */

        let imagesData = [];


        if (resultImages.error) {

            console.error(
                "Erro ao carregar screenshots:",
                resultImages.error
            );

        } else {

            imagesData =
                resultImages.data || [];

        }


        // ===============================
        // MONTAR JOGOS
        // ===============================

        games =
            gamesData.map(function (game) {

                return {

                    ...game,


                    // ===============================
                    // PARTES
                    // ===============================

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

                            }),


                    // ===============================
                    // SCREENSHOTS
                    // ===============================

                    images:
                        imagesData
                            .filter(function (image) {

                                return (
                                    image.game_id ===
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

            <h3>
                ERRO
            </h3>

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
    // TÍTULO
    // ===============================

    if (modalTitle) {

        modalTitle.textContent =
            game.name || "";

    }


    // ===============================
    // PLATAFORMA
    // ===============================

    if (modalPlatform) {

        modalPlatform.textContent =
            game.platform || "";

    }


    // ===============================
    // GÊNERO
    // ===============================

    if (modalGenre) {

        modalGenre.textContent =
            game.genre || "";

    }


    // ===============================
    // DESCRIÇÃO
    // ===============================

    if (modalDescription) {

        modalDescription.textContent =
            game.description || "";

    }


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


    // ===============================
    // SCREENSHOTS
    // ===============================

    createScreenshotsGallery(
        modal,
        game
    );


    // ===============================
    // ABRIR MODAL
    // ===============================

    modal.classList.add("show");

}


// ===============================
// GALERIA DE SCREENSHOTS
// ===============================

function createScreenshotsGallery(modal, game) {

    /*
       Procura uma galeria já existente.
    */

    let gallery =
        modal.querySelector(
            "#modalScreenshots"
        );


    /*
       Se ainda não existir,
       cria automaticamente.
    */

    if (!gallery) {

        gallery =
            document.createElement("div");


        gallery.id =
            "modalScreenshots";


        gallery.className =
            "modal-screenshots";


        /*
           Coloca a galeria depois
           das partes do jogo.
        */

        const modalParts =
            document.getElementById(
                "modalParts"
            );


        if (
            modalParts &&
            modalParts.parentNode
        ) {

            modalParts.parentNode.insertBefore(
                gallery,
                modalParts.nextSibling
            );

        } else {

            modal.appendChild(
                gallery
            );

        }

    }


    /*
       Limpa a galeria anterior.
    */

    gallery.innerHTML = "";


    /*
       Se não houver screenshots,
       não mostra a seção.
    */

    if (
        !game.images ||
        game.images.length === 0
    ) {

        gallery.style.display =
            "none";


        return;

    }


    gallery.style.display =
        "";


    // ===============================
    // TÍTULO
    // ===============================

    const title =
        document.createElement("h3");


    title.className =
        "screenshots-title";


    title.textContent =
        "SCREENSHOTS";


    gallery.appendChild(title);


    // ===============================
    // CONTAINER DAS IMAGENS
    // ===============================

    const grid =
        document.createElement("div");


    grid.className =
        "screenshots-grid";


    gallery.appendChild(grid);


    // ===============================
    // IMAGENS
    // ===============================

    game.images.forEach(
        function (screenshot, index) {

            const imageWrapper =
                document.createElement("button");


            imageWrapper.type =
                "button";


            imageWrapper.className =
                "screenshot-item";


            imageWrapper.title =
                `Abrir screenshot ${index + 1}`;


            const image =
                document.createElement("img");


            image.src =
                screenshot.image_url;


            image.alt =
                `${game.name} - Screenshot ${index + 1}`;


            image.loading =
                "lazy";


            image.onerror =
                function () {

                    imageWrapper.style.display =
                        "none";

                };


            imageWrapper.appendChild(
                image
            );


            imageWrapper.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    openScreenshotViewer(
                        screenshot.image_url,
                        game.name
                    );

                }
            );


            grid.appendChild(
                imageWrapper
            );

        }
    );

}


// ===============================
// VISUALIZADOR DE SCREENSHOT
// ===============================

function openScreenshotViewer(imageUrl, gameName) {

    /*
       Cria o visualizador somente
       quando for necessário.
    */

    let viewer =
        document.getElementById(
            "screenshotViewer"
        );


    if (!viewer) {

        viewer =
            document.createElement("div");


        viewer.id =
            "screenshotViewer";


        viewer.className =
            "screenshot-viewer";


        viewer.innerHTML = `

            <button
                type="button"
                class="screenshot-viewer-close"
                aria-label="Fechar screenshot"
            >
                ×
            </button>

            <img
                class="screenshot-viewer-image"
                alt=""
            >

        `;


        document.body.appendChild(
            viewer
        );


        /*
           Fechar pelo botão.
        */

        const closeButton =
            viewer.querySelector(
                ".screenshot-viewer-close"
            );


        closeButton.addEventListener(
            "click",
            function () {

                closeScreenshotViewer();

            }
        );


        /*
           Fechar clicando fora da imagem.
        */

        viewer.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === viewer
                ) {

                    closeScreenshotViewer();

                }

            }
        );

    }


    const viewerImage =
        viewer.querySelector(
            ".screenshot-viewer-image"
        );


    viewerImage.src =
        imageUrl;


    viewerImage.alt =
        `${gameName || "Jogo"} - Screenshot`;


    viewer.classList.add("show");


    document.body.classList.add(
        "screenshot-viewer-open"
    );

}


// ===============================
// FECHAR VISUALIZADOR
// ===============================

function closeScreenshotViewer() {

    const viewer =
        document.getElementById(
            "screenshotViewer"
        );


    if (!viewer) {
        return;
    }


    viewer.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "screenshot-viewer-open"
    );

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


// ===============================
// CLICAR FORA DO MODAL
// ===============================

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
// ESC FECHA MODAL / SCREENSHOT
// ===============================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            const viewer =
                document.getElementById(
                    "screenshotViewer"
                );


            if (
                viewer &&
                viewer.classList.contains("show")
            ) {

                closeScreenshotViewer();

                return;

            }


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


                // ===============================
                // REMOVER ATIVO
                // ===============================

                document
                    .querySelectorAll(
                        ".category-btn, .platform"
                    )
                    .forEach(function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    });


                // ===============================
                // ATIVAR BOTÃO CLICADO
                // ===============================

                button.classList.add(
                    "active"
                );


                // ===============================
                // MOSTRAR A-Z SOMENTE
                // QUANDO ESCOLHER PLATAFORMA
                // ===============================

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


            // ===============================
            // ESCONDER A-Z
            // ===============================

            if (lettersSection) {

                lettersSection.classList.remove(
                    "active"
                );

            }


            // ===============================
            // REMOVER ATIVOS
            // ===============================

            document
                .querySelectorAll(
                    ".category-btn, .platform"
                )
                .forEach(function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                });


            // ===============================
            // ATIVAR TODOS
            // ===============================

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
