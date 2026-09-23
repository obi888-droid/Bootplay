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
   ELEMENTOS DE EDIÇÃO
========================= */

const saveGameBtn =
    document.getElementById("saveGameBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const gameFormTitle =
    document.getElementById("gameFormTitle");

const gameFormDescription =
    document.getElementById("gameFormDescription");


/* =========================
   ELEMENTOS DO TAMANHO
========================= */

const gameSizeInput =
    document.getElementById("gameSize");

const gameSizeUnit =
    document.getElementById("gameSizeUnit");


/* =========================
   ELEMENTOS DAS MENSAGENS
========================= */

const receivedMessages =
    document.getElementById("receivedMessages");

const messageCount =
    document.getElementById("messageCount");

const messageFilters =
    document.getElementById("messageFilters");


/* =========================
   ESTADO
========================= */

let editingGameId = null;

let receivedMessagesData = [];

let selectedMessageFilter = "all";


/* =========================
   TIPOS DE MENSAGEM
========================= */

const MESSAGE_TYPES = {

    error: "🐛 RELATAR ERRO",

    link: "🔗 LINK QUEBRADO",

    request: "🎮 PEDIDO DE JOGO",

    other: "💬 OUTRA MENSAGEM"

};


/* =========================
   VERIFICAR SESSÃO
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

loginForm.addEventListener(
    "submit",
    async event => {

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

    }
);


/* =========================
   MOSTRAR LOGIN
========================= */

function showLogin() {

    loginScreen.classList.remove(
        "hidden"
    );

    adminPanel.classList.add(
        "hidden"
    );

}


/* =========================
   MOSTRAR PAINEL
========================= */

function showAdminPanel() {

    loginScreen.classList.add(
        "hidden"
    );

    adminPanel.classList.remove(
        "hidden"
    );


    loadRegisteredGames();

    loadReceivedMessages();

}


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        await supabaseClient.auth.signOut();

        resetGameForm();

        showLogin();

    }
);


/* =========================
   ADICIONAR PARTE
========================= */

addPartBtn.addEventListener(
    "click",
    () => {

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
);


/* =========================
   NUMERAR PARTES
========================= */

function updatePartNumbers() {

    const forms =
        document.querySelectorAll(
            ".part-form"
        );


    forms.forEach(
        (form, index) => {

            const number =
                form.querySelector(
                    ".part-number"
                );


            if (number) {

                number.textContent =
                    `PARTE ${index + 1}`;

            }

        }
    );

}


/* =========================
   EDITAR JOGO
========================= */

async function editGame(gameId) {

    gameId = Number(gameId);


    if (!gameId) {

        alert(
            "ID do jogo inválido."
        );

        return;

    }


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


    try {

        const {
            data: game,
            error: gameError
        } = await supabaseClient
            .from("games")
            .select("*")
            .eq("id", gameId)
            .single();


        if (gameError) {

            throw gameError;

        }


        const {
            data: parts,
            error: partsError
        } = await supabaseClient
            .from("game_parts")
            .select("*")
            .eq("game_id", gameId)
            .order(
                "sort_order",
                {
                    ascending: true
                }
            );


        if (partsError) {

            throw partsError;

        }


        editingGameId =
            gameId;


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


        /* TAMANHO */

        if (gameSizeInput) {

            gameSizeInput.value =
                game.game_size ?? "";

        }


        if (gameSizeUnit) {

            gameSizeUnit.value =
                game.game_size_unit || "GB";

        }


        document.getElementById(
            "gameImage"
        ).value =
            game.image || "";


        document.getElementById(
            "gameDescription"
        ).value =
            game.description || "";


        partsContainer.innerHTML =
            "";


        if (
            parts &&
            parts.length > 0
        ) {

            parts.forEach(
                (part, index) => {

                    createPartForm(
                        part.name,
                        part.link,
                        index
                    );

                }
            );

        } else {

            createPartForm(
                "",
                "",
                0
            );

        }


        updatePartNumbers();


        if (gameFormTitle) {

            gameFormTitle.textContent =
                "✏️ EDITAR JOGO";

        }


        if (gameFormDescription) {

            gameFormDescription.textContent =
                "Altere as informações do jogo e salve as mudanças.";

        }


        if (saveGameBtn) {

            saveGameBtn.textContent =
                "💾 SALVAR ALTERAÇÕES";

        }


        if (cancelEditBtn) {

            cancelEditBtn.style.display =
                "block";

        }


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


/* =========================
   CRIAR FORMULÁRIO DE PARTE
========================= */

function createPartForm(
    partName = "",
    partLink = "",
    index = 0
) {

    const partForm =
        document.createElement("div");

    partForm.className =
        "part-form";


    const removeButton =
        index > 0
            ? `

                <button
                    type="button"
                    class="remove-part-button"
                >
                    × Remover
                </button>

            `
            : "";


    partForm.innerHTML = `

        ${removeButton}

        <div class="part-number">
            PARTE ${index + 1}
        </div>

        <label>
            Nome da parte
        </label>

        <input
            type="text"
            class="part-name"
            placeholder="Ex: Parte Única, DVD 1, CD 1..."
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


    const removeButtonElement =
        partForm.querySelector(
            ".remove-part-button"
        );


    if (removeButtonElement) {

        removeButtonElement.addEventListener(
            "click",
            () => {

                partForm.remove();

                updatePartNumbers();

            }
        );

    }

}


/* =========================
   CANCELAR EDIÇÃO
========================= */

if (cancelEditBtn) {

    cancelEditBtn.addEventListener(
        "click",
        () => {

            resetGameForm();

            gameForm.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }
    );

}


/* =========================
   RESETAR FORMULÁRIO
========================= */

function resetGameForm() {

    editingGameId = null;


    gameForm.reset();


    if (gameSizeUnit) {

        gameSizeUnit.value =
            "GB";

    }


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


    if (gameFormTitle) {

        gameFormTitle.textContent =
            "➕ ADICIONAR JOGO";

    }


    if (gameFormDescription) {

        gameFormDescription.textContent =
            "Cadastre as informações do jogo.";

    }


    if (saveGameBtn) {

        saveGameBtn.textContent =
            "💾 ADICIONAR JOGO";

    }


    if (cancelEditBtn) {

        cancelEditBtn.style.display =
            "none";

    }

}


/* =========================
   ADICIONAR / EDITAR JOGO
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


        /* TAMANHO */

        const sizeValue =
            gameSizeInput
                ? gameSizeInput.value.trim()
                : "";


        const sizeUnit =
            gameSizeUnit
                ? gameSizeUnit.value
                : "GB";


        const gameSize =
            Number(sizeValue);


        if (
            sizeValue === "" ||
            !Number.isFinite(gameSize) ||
            gameSize <= 0
        ) {

            alert(
                "Informe um tamanho válido para o jogo."
            );

            return;

        }


        const allowedUnits = [
            "KB",
            "MB",
            "GB",
            "TB"
        ];


        if (
            !allowedUnits.includes(
                sizeUnit
            )
        ) {

            alert(
                "Escolha uma unidade de tamanho válida."
            );

            return;

        }


        const image =
            document.getElementById(
                "gameImage"
            ).value.trim();


        const description =
            document.getElementById(
                "gameDescription"
            ).value.trim();


        /* PARTES */

        const partForms =
            document.querySelectorAll(
                ".part-form"
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

                        name:
                            partName,

                        link:
                            partLink,

                        sort_order:
                            index

                    });

                }

            }
        );


        if (
            parts.length === 0
        ) {

            alert(
                "Adicione pelo menos uma parte do jogo."
            );

            return;

        }


        /* SESSÃO */

        const {
            data: { session }
        } =
            await supabaseClient.auth.getSession();


        if (!session) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            showLogin();

            return;

        }


        if (saveGameBtn) {

            saveGameBtn.disabled =
                true;

            saveGameBtn.textContent =
                editingGameId
                    ? "SALVANDO ALTERAÇÕES..."
                    : "SALVANDO...";

        }


        try {

            /* =========================
               EDITAR
            ========================== */

            if (
                editingGameId !== null
            ) {

                const gameId =
                    editingGameId;


                const {
                    error: gameError
                } =
                    await supabaseClient
                        .from("games")
                        .update({

                            name:
                                name,

                            platform:
                                category,

                            genre:
                                genre,

                            game_size:
                                gameSize,

                            game_size_unit:
                                sizeUnit,

                            image:
                                image,

                            description:
                                description

                        })
                        .eq(
                            "id",
                            gameId
                        );


                if (gameError) {

                    throw gameError;

                }


                const {
                    error:
                        deletePartsError
                } =
                    await supabaseClient
                        .from("game_parts")
                        .delete()
                        .eq(
                            "game_id",
                            gameId
                        );


                if (
                    deletePartsError
                ) {

                    throw deletePartsError;

                }


                const partsToInsert =
                    parts.map(
                        part => ({

                            game_id:
                                gameId,

                            name:
                                part.name,

                            link:
                                part.link,

                            sort_order:
                                part.sort_order

                        })
                    );


                const {
                    error:
                        insertPartsError
                } =
                    await supabaseClient
                        .from("game_parts")
                        .insert(
                            partsToInsert
                        );


                if (
                    insertPartsError
                ) {

                    throw insertPartsError;

                }


                resetGameForm();

                await loadRegisteredGames();


                alert(
                    "Jogo atualizado com sucesso!"
                );

                return;

            }


            /* =========================
               ADICIONAR
            ========================== */

            const {
                data: game,
                error: gameError
            } =
                await supabaseClient
                    .from("games")
                    .insert({

                        name:
                            name,

                        platform:
                            category,

                        genre:
                            genre,

                        game_size:
                            gameSize,

                        game_size_unit:
                            sizeUnit,

                        image:
                            image,

                        description:
                            description

                    })
                    .select()
                    .single();


            if (gameError) {

                throw gameError;

            }


            const partsToInsert =
                parts.map(
                    part => ({

                        game_id:
                            game.id,

                        name:
                            part.name,

                        link:
                            part.link,

                        sort_order:
                            part.sort_order

                    })
                );


            const {
                error: partsError
            } =
                await supabaseClient
                    .from("game_parts")
                    .insert(
                        partsToInsert
                    );


            if (partsError) {

                await supabaseClient
                    .from("games")
                    .delete()
                    .eq(
                        "id",
                        game.id
                    );

                throw partsError;

            }


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

            if (saveGameBtn) {

                saveGameBtn.disabled =
                    false;

                saveGameBtn.textContent =
                    editingGameId !== null
                        ? "💾 SALVAR ALTERAÇÕES"
                        : "💾 ADICIONAR JOGO";

            }

        }

    }
);


/* =========================
   LISTAR JOGOS
========================= */

async function loadRegisteredGames() {

    registeredGames.innerHTML = `

        <div class="empty-games">
            Carregando jogos...
        </div>

    `;


    const {
        data: games,
        error: gamesError
    } =
        await supabaseClient
            .from("games")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


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


    const {
        data: parts,
        error: partsError
    } =
        await supabaseClient
            .from("game_parts")
            .select("*")
            .order(
                "sort_order",
                {
                    ascending: true
                }
            );


    if (partsError) {

        console.error(
            "Erro ao carregar partes:",
            partsError
        );

        return;

    }


    const gamesWithParts =
        games.map(
            game => ({

                ...game,

                parts:
                    parts.filter(
                        part =>
                            part.game_id ===
                            game.id
                    )

            })
        );


    gameCount.textContent =
        `${gamesWithParts.length} jogo${
            gamesWithParts.length !== 1
                ? "s"
                : ""
        }`;


    registeredGames.innerHTML =
        "";


    if (
        gamesWithParts.length === 0
    ) {

        registeredGames.innerHTML = `

            <div class="empty-games">

                Nenhum jogo cadastrado ainda.

            </div>

        `;

        return;

    }


    gamesWithParts.forEach(
        game => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "registered-game";


            const sizeText =
                game.game_size !== null &&
                game.game_size !== undefined &&
                game.game_size !== ""
                    ? `${game.game_size} ${game.game_size_unit || "GB"}`
                    : "Tamanho não informado";


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
                        ${sizeText}
                        •
                        ${game.parts.length}
                        parte(s)
                    </p>

                </div>

                <div class="registered-game-actions">

                    <button
                        type="button"
                        class="edit-game-button"
                        data-id="${game.id}"
                    >
                        ✏️ EDITAR
                    </button>

                    <button
                        type="button"
                        class="delete-game-button"
                        data-id="${game.id}"
                    >
                        🗑️ EXCLUIR
                    </button>

                </div>

            `;


            registeredGames.appendChild(
                item
            );

        }
    );


    activateEditButtons();

    activateDeleteButtons();

}


/* =========================
   BOTÕES EDITAR
========================= */

function activateEditButtons() {

    const buttons =
        document.querySelectorAll(
            ".edit-game-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    button.disabled =
                        true;

                    button.textContent =
                        "CARREGANDO...";


                    await editGame(id);


                    button.disabled =
                        false;

                    button.textContent =
                        "✏️ EDITAR";

                }
            );

        }
    );

}


/* =========================
   EXCLUIR JOGO
========================= */

function activateDeleteButtons() {

    const buttons =
        document.querySelectorAll(
            ".delete-game-button"
        );


    buttons.forEach(
        button => {

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


                    if (
                        !confirmDelete
                    ) {

                        return;

                    }


                    button.disabled =
                        true;

                    button.textContent =
                        "EXCLUINDO...";


                    const {
                        error
                    } =
                        await supabaseClient
                            .from("games")
                            .delete()
                            .eq(
                                "id",
                                id
                            );


                    if (error) {

                        console.error(
                            "Erro ao excluir:",
                            error
                        );


                        alert(
                            "Não foi possível excluir o jogo."
                        );


                        button.disabled =
                            false;

                        button.textContent =
                            "🗑️ EXCLUIR";

                        return;

                    }


                    if (
                        editingGameId === id
                    ) {

                        resetGameForm();

                    }


                    await loadRegisteredGames();

                }
            );

        }
    );

}


/* =========================================================
   MENSAGENS RECEBIDAS
========================================================= */


/* =========================
   FILTROS
========================= */

if (messageFilters) {

    messageFilters.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".message-filter"
                );


            if (!button) {
                return;
            }


            selectedMessageFilter =
                button.dataset.filter ||
                "all";


            document
                .querySelectorAll(
                    ".message-filter"
                )
                .forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


            button.classList.add(
                "active"
            );


            renderReceivedMessages();

        }
    );

}


/* =========================
   CARREGAR MENSAGENS
========================= */

async function loadReceivedMessages() {

    if (!receivedMessages) {
        return;
    }


    receivedMessages.innerHTML = `

        <div class="empty-messages">
            Carregando mensagens...
        </div>

    `;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("messages")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar mensagens:",
            error
        );


        receivedMessages.innerHTML = `

            <div class="empty-messages">
                Erro ao carregar as mensagens.
            </div>

        `;

        return;

    }


    receivedMessagesData =
        data || [];


    updateMessageCount();

    renderReceivedMessages();

}


/* =========================
   CONTADOR
========================= */

function updateMessageCount() {

    if (!messageCount) {
        return;
    }


    const total =
        receivedMessagesData.length;


    messageCount.textContent =
        `${total} mensagem${total !== 1 ? "s" : ""}`;

}


/* =========================
   RENDERIZAR MENSAGENS
========================= */

function renderReceivedMessages() {

    if (!receivedMessages) {
        return;
    }


    let messages =
        receivedMessagesData;


    if (
        selectedMessageFilter !==
        "all"
    ) {

        messages =
            messages.filter(
                message =>
                    message.type ===
                    selectedMessageFilter
            );

    }


    if (
        messages.length === 0
    ) {

        receivedMessages.innerHTML = `

            <div class="empty-messages">

                Nenhuma mensagem encontrada.

            </div>

        `;

        return;

    }


    receivedMessages.innerHTML =
        messages
            .map(
                message => {

                    const type =
                        MESSAGE_TYPES[
                            message.type
                        ] ||
                        "💬 OUTRA MENSAGEM";


                    const date =
                        message.created_at
                            ? new Date(
                                message.created_at
                            ).toLocaleString(
                                "pt-BR",
                                {
                                    dateStyle:
                                        "short",
                                    timeStyle:
                                        "short"
                                }
                            )
                            : "Data desconhecida";


                    const name =
                        message.name
                            ? escapeHtml(
                                message.name
                            )
                            : "Visitante";


                    const game =
                        message.game
                            ? escapeHtml(
                                message.game
                            )
                            : "";


                    const messageText =
                        escapeHtml(
                            message.message
                        );


                    return `

                        <div
                            class="received-message"
                        >

                            <div
                                class="received-message-top"
                            >

                                <div
                                    class="received-message-type"
                                >
                                    ${type}
                                </div>

                                <div
                                    class="received-message-date"
                                >
                                    ${date}
                                </div>

                            </div>


                            <div
                                class="received-message-info"
                            >

                                <span>
                                    👤 ${name}
                                </span>

                                ${
                                    game
                                        ? `
                                            <span>
                                                🎮 ${game}
                                            </span>
                                          `
                                        : ""
                                }

                            </div>


                            <div
                                class="received-message-text"
                            >
                                ${messageText}
                            </div>


                            <button
                                type="button"
                                class="delete-message-button"
                                data-id="${message.id}"
                            >
                                🗑️ EXCLUIR
                            </button>

                        </div>

                    `;

                }
            )
            .join("");


    activateDeleteMessageButtons();

}


/* =========================
   EXCLUIR MENSAGEM
========================= */

function activateDeleteMessageButtons() {

    const buttons =
        document.querySelectorAll(
            ".delete-message-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    if (!id) {
                        return;
                    }


                    const confirmDelete =
                        confirm(
                            "Tem certeza que deseja excluir esta mensagem?"
                        );


                    if (
                        !confirmDelete
                    ) {

                        return;

                    }


                    button.disabled =
                        true;

                    button.textContent =
                        "EXCLUINDO...";


                    const {
                        error
                    } =
                        await supabaseClient
                            .from("messages")
                            .delete()
                            .eq(
                                "id",
                                id
                            );


                    if (error) {

                        console.error(
                            "Erro ao excluir mensagem:",
                            error
                        );


                        alert(
                            "Não foi possível excluir a mensagem."
                        );


                        button.disabled =
                            false;

                        button.textContent =
                            "🗑️ EXCLUIR";

                        return;

                    }


                    await loadReceivedMessages();

                }
            );

        }
    );

}


/* =========================
   PROTEÇÃO CONTRA HTML
========================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
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
