/* =========================
   ELEMENTOS
========================= */

const loginScreen =
    document.getElementById("loginScreen");

const adminPanel =
    document.getElementById("adminPanel");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const logoutBtn =
    document.getElementById("logoutBtn");

const gameForm =
    document.getElementById("gameForm");

const partsContainer =
    document.getElementById("partsContainer");

const addPartBtn =
    document.getElementById("addPartBtn");

const registeredGames =
    document.getElementById("registeredGames");

const gameCount =
    document.getElementById("gameCount");


/* =========================
   SCREENSHOTS
========================= */

const imagesContainer =
    document.getElementById("imagesContainer");

const addImageBtn =
    document.getElementById("addImageBtn");


/* =========================
   ESTADO DE EDIÇÃO
========================= */

let editingGameId = null;


/* =========================
   VERIFICAR SESSÃO SUPABASE
========================= */

checkSession();


async function checkSession() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (session) {

        showAdminPanel();

    } else {

        showLogin();

    }

}


/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", async event => {

    event.preventDefault();


    loginMessage.textContent =
        "Entrando...";


    const email =
        document.getElementById(
            "adminUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "adminPassword"
        ).value;


    const {
        data,
        error
    } = await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

    });


    if (error) {

        console.error(error);

        loginMessage.textContent =
            "E-mail ou senha incorretos.";

        return;

    }


    loginMessage.textContent = "";

    showAdminPanel();

});


/* =========================
   MOSTRAR LOGIN
========================= */

function showLogin() {

    loginScreen.classList.remove("hidden");

    adminPanel.classList.add("hidden");

}


/* =========================
   MOSTRAR PAINEL
========================= */

function showAdminPanel() {

    loginScreen.classList.add("hidden");

    adminPanel.classList.remove("hidden");

    loadRegisteredGames();

}


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener("click", async () => {

    await supabaseClient.auth.signOut();

    editingGameId = null;

    resetGameForm();

    showLogin();

});


/* =========================
   ADICIONAR PARTE
========================= */

addPartBtn.addEventListener("click", () => {

    createPartForm();

});


function createPartForm(
    partName = "",
    partLink = ""
) {

    const partForm =
        document.createElement("div");

    partForm.className =
        "part-form";


    partForm.innerHTML = `

        <button
            type="button"
            class="remove-part-button"
        >
            × Remover
        </button>

        <div class="part-number">
            PARTE
        </div>

        <label>
            Nome da parte
        </label>

        <input
            type="text"
            class="part-name"
            placeholder="Ex: Parte 2, DVD 2, Bônus..."
            value="${escapeHtml(partName)}"
            required
        >

        <label>
            Link da parte
        </label>

        <input
            type="url"
            class="part-link-input"
            placeholder="Cole o link aqui"
            value="${escapeHtml(partLink)}"
            required
        >

    `;


    partsContainer.appendChild(
        partForm
    );


    partForm
        .querySelector(
            ".remove-part-button"
        )
        .addEventListener(
            "click",
            () => {

                partForm.remove();

                updatePartNumbers();

            }
        );


    updatePartNumbers();

}


/* =========================
   NUMERAR PARTES
========================= */

function updatePartNumbers() {

    const forms =
        document.querySelectorAll(
            "#partsContainer .part-form"
        );


    forms.forEach((form, index) => {

        const number =
            form.querySelector(
                ".part-number"
            );


        if (number) {

            number.textContent =
                `PARTE ${index + 1}`;

        }

    });

}


/* =========================
   ADICIONAR SCREENSHOT
========================= */

if (addImageBtn) {

    addImageBtn.addEventListener(
        "click",
        () => {

            createImageForm();

        }
    );

}


function createImageForm(
    imageUrl = ""
) {

    if (!imagesContainer) {
        return;
    }


    const imageForm =
        document.createElement("div");

    imageForm.className =
        "image-form";


    imageForm.innerHTML = `

        <button
            type="button"
            class="remove-image-button"
        >
            × Remover
        </button>

        <div class="part-number">
            SCREENSHOT
        </div>

        <label>
            Link da imagem
        </label>

        <input
            type="url"
            class="game-image-input"
            placeholder="Cole aqui o link da screenshot"
            value="${escapeHtml(imageUrl)}"
        >

    `;


    imagesContainer.appendChild(
        imageForm
    );


    const removeButton =
        imageForm.querySelector(
            ".remove-image-button"
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            () => {

                imageForm.remove();

                updateImageNumbers();

            }
        );

    }


    updateImageNumbers();

}


/* =========================
   NUMERAR SCREENSHOTS
========================= */

function updateImageNumbers() {

    if (!imagesContainer) {
        return;
    }


    const forms =
        imagesContainer.querySelectorAll(
            ".image-form"
        );


    forms.forEach((form, index) => {

        const number =
            form.querySelector(
                ".part-number"
            );


        if (number) {

            number.textContent =
                `SCREENSHOT ${index + 1}`;

        }

    });

}


/* =========================
   ADICIONAR JOGO / EDITAR JOGO
========================= */

gameForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "gameName"
            ).value.trim();


        const category =
            document.getElementById(
                "gameCategory"
            ).value;


        const genre =
            document.getElementById(
                "gameGenre"
            ).value.trim();


        const image =
            document.getElementById(
                "gameImage"
            ).value.trim();


        const description =
            document.getElementById(
                "gameDescription"
            ).value.trim();


        /* =========================
           PEGAR PARTES
        ========================= */

        const partForms =
            document.querySelectorAll(
                "#partsContainer .part-form"
            );


        const parts = [];


        partForms.forEach(
            (form, index) => {

                const partName =
                    form.querySelector(
                        ".part-name"
                    ).value.trim();


                const partLink =
                    form.querySelector(
                        ".part-link-input"
                    ).value.trim();


                if (
                    partName &&
                    partLink
                ) {

                    parts.push({

                        name: partName,

                        link: partLink,

                        sort_order: index

                    });

                }

            }
        );


        if (parts.length === 0) {

            alert(
                "Adicione pelo menos uma parte do jogo."
            );

            return;

        }


        /* =========================
           PEGAR SCREENSHOTS
        ========================= */

        const imageForms =
            imagesContainer
                ? imagesContainer.querySelectorAll(
                    ".image-form"
                )
                : [];


        const screenshots = [];


        imageForms.forEach(
            (form, index) => {

                const input =
                    form.querySelector(
                        ".game-image-input"
                    );


                if (!input) {
                    return;
                }


                const imageUrl =
                    input.value.trim();


                if (imageUrl) {

                    screenshots.push({

                        image_url: imageUrl,

                        sort_order: index

                    });

                }

            }
        );


        /* =========================
           VERIFICAR SESSÃO
        ========================= */

        const {
            data: { session }
        } = await supabaseClient.auth.getSession();


        if (!session) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            showLogin();

            return;

        }


        /* =========================
           BOTÃO
        ========================= */

        const submitButton =
            gameForm.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                editingGameId
                    ? "SALVANDO ALTERAÇÕES..."
                    : "SALVANDO...";

        }


        try {

            /* =================================================
               MODO EDIÇÃO
            ================================================= */

            if (editingGameId) {

                await updateExistingGame({

                    id: editingGameId,

                    name: name,

                    platform: category,

                    genre: genre,

                    image: image,

                    description: description,

                    parts: parts,

                    screenshots: screenshots

                });


                alert(
                    "Jogo atualizado com sucesso!"
                );


                resetGameForm();

                await loadRegisteredGames();

                return;

            }


            /* =================================================
               MODO NOVO JOGO
            ================================================= */

            const {
                data: game,
                error: gameError
            } = await supabaseClient
                .from("games")
                .insert({

                    name: name,

                    platform: category,

                    genre: genre,

                    image: image,

                    description: description

                })
                .select()
                .single();


            if (gameError) {

                throw gameError;

            }


            /* =========================
               SALVAR PARTES
            ========================= */

            const partsToInsert =
                parts.map(part => ({

                    game_id: game.id,

                    name: part.name,

                    link: part.link,

                    sort_order:
                        part.sort_order

                }));


            const {
                error: partsError
            } = await supabaseClient
                .from("game_parts")
                .insert(partsToInsert);


            if (partsError) {

                await supabaseClient
                    .from("games")
                    .delete()
                    .eq("id", game.id);


                throw partsError;

            }


            /* =========================
               SALVAR SCREENSHOTS
            ========================= */

            if (
                screenshots.length > 0
            ) {

                const imagesToInsert =
                    screenshots.map(
                        screenshot => ({

                            game_id:
                                game.id,

                            image_url:
                                screenshot.image_url,

                            sort_order:
                                screenshot.sort_order

                        })
                    );


                const {
                    error: imagesError
                } = await supabaseClient
                    .from("game_images")
                    .insert(
                        imagesToInsert
                    );


                if (imagesError) {

                    await supabaseClient
                        .from("games")
                        .delete()
                        .eq("id", game.id);


                    throw imagesError;

                }

            }


            /* =========================
               LIMPAR
            ========================= */

            resetGameForm();


            await loadRegisteredGames();


            alert(
                "Jogo adicionado com sucesso ao Bootplay!"
            );


        } catch (error) {

            console.error(
                "Erro ao salvar jogo:",
                error
            );


            alert(
                "Erro ao salvar o jogo. Veja o console para mais detalhes."
            );


        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    editingGameId
                        ? "SALVAR ALTERAÇÕES"
                        : "ADICIONAR JOGO";

            }

        }

    }
);


/* =========================================================
   ATUALIZAR JOGO EXISTENTE
========================================================= */

async function updateExistingGame(gameData) {

    /* =========================
       ATUALIZAR DADOS DO JOGO
    ========================= */

    const {
        error: gameError
    } = await supabaseClient
        .from("games")
        .update({

            name: gameData.name,

            platform: gameData.platform,

            genre: gameData.genre,

            image: gameData.image,

            description:
                gameData.description

        })
        .eq(
            "id",
            gameData.id
        );


    if (gameError) {

        throw gameError;

    }


    /* =========================
       APAGAR PARTES ANTIGAS
    ========================= */

    const {
        error: deletePartsError
    } = await supabaseClient
        .from("game_parts")
        .delete()
        .eq(
            "game_id",
            gameData.id
        );


    if (deletePartsError) {

        throw deletePartsError;

    }


    /* =========================
       INSERIR PARTES NOVAS
    ========================= */

    if (
        gameData.parts.length > 0
    ) {

        const partsToInsert =
            gameData.parts.map(
                part => ({

                    game_id:
                        gameData.id,

                    name:
                        part.name,

                    link:
                        part.link,

                    sort_order:
                        part.sort_order

                })
            );


        const {
            error: insertPartsError
        } = await supabaseClient
            .from("game_parts")
            .insert(
                partsToInsert
            );


        if (insertPartsError) {

            throw insertPartsError;

        }

    }


    /* =========================
       APAGAR SCREENSHOTS ANTIGAS
    ========================= */

    const {
        error: deleteImagesError
    } = await supabaseClient
        .from("game_images")
        .delete()
        .eq(
            "game_id",
            gameData.id
        );


    if (deleteImagesError) {

        throw deleteImagesError;

    }


    /* =========================
       INSERIR SCREENSHOTS NOVAS
    ========================= */

    if (
        gameData.screenshots.length > 0
    ) {

        const imagesToInsert =
            gameData.screenshots.map(
                screenshot => ({

                    game_id:
                        gameData.id,

                    image_url:
                        screenshot.image_url,

                    sort_order:
                        screenshot.sort_order

                })
            );


        const {
            error: insertImagesError
        } = await supabaseClient
            .from("game_images")
            .insert(
                imagesToInsert
            );


        if (insertImagesError) {

            throw insertImagesError;

        }

    }

}


/* =========================================================
   RESETAR FORMULÁRIO
========================================================= */

function resetGameForm() {

    editingGameId = null;


    gameForm.reset();


    /* =========================
       PARTES
    ========================= */

    partsContainer.innerHTML = `

        <div class="part-form">

            <div class="part-number">
                PARTE 1
            </div>

            <label>
                Nome da parte
            </label>

            <input
                type="text"
                class="part-name"
                placeholder="Ex: Parte Única, DVD 1, CD 1..."
                required
            >

            <label>
                Link da parte
            </label>

            <input
                type="url"
                class="part-link-input"
                placeholder="Cole o link aqui"
                required
            >

        </div>

    `;


    /* =========================
       SCREENSHOTS
    ========================= */

    if (imagesContainer) {

        imagesContainer.innerHTML = `

            <div class="image-form">

                <div class="part-number">
                    SCREENSHOT 1
                </div>

                <label>
                    Link da imagem
                </label>

                <input
                    type="url"
                    class="game-image-input"
                    placeholder="Cole aqui o link da screenshot"
                >

            </div>

        `;

    }


    /* =========================
       BOTÃO
    ========================= */

    const submitButton =
        gameForm.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.textContent =
            "ADICIONAR JOGO";

    }


    /* =========================
       BOTÃO CANCELAR
    ========================= */

    removeCancelEditButton();

}


/* =========================================================
   LISTAR JOGOS
========================================================= */

async function loadRegisteredGames() {

    registeredGames.innerHTML = `
        <div class="empty-games">
            Carregando jogos...
        </div>
    `;


    /* =========================
       BUSCAR JOGOS
    ========================= */

    const {
        data: games,
        error: gamesError
    } = await supabaseClient
        .from("games")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (gamesError) {

        console.error(
            "Erro ao carregar jogos:",
            gamesError
        );


        registeredGames.innerHTML = `
            <div class="empty-games">
                Erro ao carregar os jogos.
            </div>
        `;

        return;

    }


    /* =========================
       BUSCAR PARTES
    ========================= */

    const {
        data: parts,
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


    /* =========================
       BUSCAR SCREENSHOTS
    ========================= */

    let images = [];


    const {
        data: gameImages,
        error: imagesError
    } = await supabaseClient
        .from("game_images")
        .select("*")
        .order("sort_order", {
            ascending: true
        });


    if (imagesError) {

        console.error(
            "Erro ao carregar screenshots:",
            imagesError
        );

    } else {

        images =
            gameImages || [];

    }


    /* =========================
       JUNTAR DADOS
    ========================= */

    const gamesWithData =
        games.map(game => ({

            ...game,

            parts:
                parts.filter(
                    part =>
                        part.game_id ===
                        game.id
                ),

            screenshots:
                images.filter(
                    screenshot =>
                        screenshot.game_id ===
                        game.id
                )

        }));


    /* =========================
       CONTADOR
    ========================= */

    gameCount.textContent =
        `${gamesWithData.length} jogo${
            gamesWithData.length !== 1
                ? "s"
                : ""
        }`;


    registeredGames.innerHTML = "";


    if (
        gamesWithData.length === 0
    ) {

        registeredGames.innerHTML = `

            <div class="empty-games">

                Nenhum jogo cadastrado ainda.

            </div>

        `;

        return;

    }


    /* =========================
       CRIAR LISTA
    ========================= */

    gamesWithData.forEach(game => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "registered-game";


        item.innerHTML = `

            <img
                src="${escapeHtml(game.image)}"
                alt="${escapeHtml(game.name)}"
            >

            <div class="registered-game-info">

                <h3>
                    ${escapeHtml(game.name)}
                </h3>

                <p>
                    ${escapeHtml(game.platform)}
                    •
                    ${escapeHtml(game.genre)}
                    •
                    ${game.parts.length}
                    parte(s)
                    •
                    ${game.screenshots.length}
                    screenshot(s)
                </p>

            </div>


            <div class="registered-game-actions">

                <button
                    type="button"
                    class="edit-game-button"
                    data-id="${game.id}"
                >
                    EDITAR
                </button>

                <button
                    type="button"
                    class="delete-game-button"
                    data-id="${game.id}"
                >
                    EXCLUIR
                </button>

            </div>

        `;


        registeredGames.appendChild(
            item
        );

    });


    activateEditButtons();

    activateDeleteButtons();

}


/* =========================================================
   ATIVAR BOTÕES EDITAR
========================================================= */

function activateEditButtons() {

    const buttons =
        document.querySelectorAll(
            ".edit-game-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const id =
                    Number(
                        button.dataset.id
                    );


                await editGame(id);

            }
        );

    });

}


/* =========================================================
   EDITAR JOGO
========================================================= */

async function editGame(id) {

    try {

        /* =========================
           BUSCAR JOGO
        ========================= */

        const {
            data: game,
            error: gameError
        } = await supabaseClient
            .from("games")
            .select("*")
            .eq("id", id)
            .single();


        if (gameError) {

            throw gameError;

        }


        /* =========================
           BUSCAR PARTES
        ========================= */

        const {
            data: parts,
            error: partsError
        } = await supabaseClient
            .from("game_parts")
            .select("*")
            .eq("game_id", id)
            .order("sort_order", {
                ascending: true
            });


        if (partsError) {

            throw partsError;

        }


        /* =========================
           BUSCAR SCREENSHOTS
        ========================= */

        const {
            data: screenshots,
            error: screenshotsError
        } = await supabaseClient
            .from("game_images")
            .select("*")
            .eq("game_id", id)
            .order("sort_order", {
                ascending: true
            });


        if (screenshotsError) {

            throw screenshotsError;

        }


        /* =========================
           ATIVAR MODO EDIÇÃO
        ========================= */

        editingGameId = id;


        /* =========================
           PREENCHER JOGO
        ========================= */

        document.getElementById(
            "gameName"
        ).value =
            game.name || "";


        document.getElementById(
            "gameCategory"
        ).value =
            game.platform || "";


        document.getElementById(
            "gameGenre"
        ).value =
            game.genre || "";


        document.getElementById(
            "gameImage"
        ).value =
            game.image || "";


        document.getElementById(
            "gameDescription"
        ).value =
            game.description || "";


        /* =========================
           PREENCHER PARTES
        ========================= */

        partsContainer.innerHTML = "";


        if (
            parts &&
            parts.length > 0
        ) {

            parts.forEach(part => {

                createPartForm(

                    part.name,

                    part.link

                );

            });

        } else {

            createPartForm();

        }


        /* =========================
           PREENCHER SCREENSHOTS
        ========================= */

        if (imagesContainer) {

            imagesContainer.innerHTML = "";


            if (
                screenshots &&
                screenshots.length > 0
            ) {

                screenshots.forEach(
                    screenshot => {

                        createImageForm(
                            screenshot.image_url
                        );

                    }
                );

            } else {

                createImageForm();

            }

        }


        /* =========================
           ALTERAR BOTÃO
        ========================= */

        const submitButton =
            gameForm.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.textContent =
                "SALVAR ALTERAÇÕES";

        }


        createCancelEditButton();


        /* =========================
           IR PARA O FORMULÁRIO
        ========================= */

        gameForm.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });


    } catch (error) {

        console.error(
            "Erro ao carregar jogo para edição:",
            error
        );


        alert(
            "Não foi possível carregar o jogo para edição."
        );

    }

}


/* =========================================================
   BOTÃO CANCELAR EDIÇÃO
========================================================= */

function createCancelEditButton() {

    removeCancelEditButton();


    const submitButton =
        gameForm.querySelector(
            'button[type="submit"]'
        );


    if (!submitButton) {
        return;
    }


    const cancelButton =
        document.createElement(
            "button"
        );


    cancelButton.type =
        "button";


    cancelButton.id =
        "cancelEditBtn";


    cancelButton.className =
        "cancel-edit-button";


    cancelButton.textContent =
        "CANCELAR EDIÇÃO";


    cancelButton.addEventListener(
        "click",
        () => {

            resetGameForm();

        }
    );


    submitButton.parentNode.insertBefore(
        cancelButton,
        submitButton.nextSibling
    );

}


function removeCancelEditButton() {

    const cancelButton =
        document.getElementById(
            "cancelEditBtn"
        );


    if (cancelButton) {

        cancelButton.remove();

    }

}


/* =========================================================
   EXCLUIR JOGO
========================================================= */

function activateDeleteButtons() {

    const buttons =
        document.querySelectorAll(
            ".delete-game-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const id =
                    Number(
                        button.dataset.id
                    );


                const confirmDelete =
                    confirm(
                        "Tem certeza que deseja excluir este jogo?"
                    );


                if (!confirmDelete) {

                    return;

                }


                button.disabled = true;

                button.textContent =
                    "EXCLUINDO...";


                const {
                    error
                } = await supabaseClient
                    .from("games")
                    .delete()
                    .eq("id", id);


                if (error) {

                    console.error(
                        "Erro ao excluir:",
                        error
                    );


                    alert(
                        "Não foi possível excluir o jogo."
                    );


                    button.disabled = false;

                    button.textContent =
                        "EXCLUIR";

                    return;

                }


                /*
                   O ON DELETE CASCADE
                   remove automaticamente:
                   - partes
                   - screenshots
                */


                if (
                    editingGameId === id
                ) {

                    resetGameForm();

                }


                await loadRegisteredGames();

            }
        );

    });

}


/* =========================================================
   PROTEÇÃO CONTRA HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")

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
