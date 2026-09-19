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

const imagesContainer =
    document.getElementById("imagesContainer");

const addImageBtn =
    document.getElementById("addImageBtn");

const registeredGames =
    document.getElementById("registeredGames");

const gameCount =
    document.getElementById("gameCount");


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


    loginMessage.textContent = "Entrando...";


    /*
       IMPORTANTE:
       O Supabase usa o e-mail criado
       em Authentication → Users.
    */

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

    showLogin();

});


/* =========================
   ADICIONAR PARTE
========================= */

addPartBtn.addEventListener("click", () => {

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


    partsContainer.appendChild(partForm);


    partForm
        .querySelector(".remove-part-button")
        .addEventListener("click", () => {

            partForm.remove();

            updatePartNumbers();

        });


    updatePartNumbers();

});


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
            form.querySelector(".part-number");


        number.textContent =
            `PARTE ${index + 1}`;

    });

}


/* =========================
   ADICIONAR SCREENSHOT
========================= */

if (addImageBtn && imagesContainer) {

    addImageBtn.addEventListener("click", () => {

        const imageForms =
            imagesContainer.querySelectorAll(
                ".image-form"
            );

        const imageNumber =
            imageForms.length + 1;


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
                SCREENSHOT ${imageNumber}
            </div>

            <label>
                Link da imagem
            </label>

            <input
                type="url"
                class="game-image-input"
                placeholder="Cole aqui o link da screenshot ${imageNumber}"
            >

        `;


        imagesContainer.appendChild(imageForm);


        const removeButton =
            imageForm.querySelector(
                ".remove-image-button"
            );


        removeButton.addEventListener(
            "click",
            () => {

                imageForm.remove();

                updateImageNumbers();

            }
        );


        updateImageNumbers();

    });

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
            form.querySelector(".part-number");


        if (number) {

            number.textContent =
                `SCREENSHOT ${index + 1}`;

        }


        const input =
            form.querySelector(
                ".game-image-input"
            );


        if (input) {

            input.placeholder =
                `Cole aqui o link da screenshot ${index + 1}`;

        }

    });

}


/* =========================
   ADICIONAR JOGO
========================= */

gameForm.addEventListener("submit", async event => {

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


    const partForms =
        document.querySelectorAll(
            "#partsContainer .part-form"
        );


    const parts = [];


    partForms.forEach((form, index) => {

        const partNameInput =
            form.querySelector(
                ".part-name"
            );


        const partLinkInput =
            form.querySelector(
                ".part-link-input"
            );


        if (!partNameInput || !partLinkInput) {
            return;
        }


        const partName =
            partNameInput.value.trim();


        const partLink =
            partLinkInput.value.trim();


        if (partName && partLink) {

            parts.push({

                name: partName,

                link: partLink,

                sort_order: index

            });

        }

    });


    if (parts.length === 0) {

        alert(
            "Adicione pelo menos uma parte do jogo."
        );

        return;

    }


    /*
       PEGAR SCREENSHOTS
    */

    const imageInputs =
        imagesContainer
            ? imagesContainer.querySelectorAll(
                ".game-image-input"
            )
            : [];


    const screenshots = [];


    imageInputs.forEach((input, index) => {

        const imageUrl =
            input.value.trim();


        /*
           Screenshot vazia é ignorada.
        */

        if (imageUrl) {

            screenshots.push({

                image_url: imageUrl,

                sort_order: index

            });

        }

    });


    /*
       Verifica se o administrador
       ainda está autenticado.
    */

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


    /*
       Desativa o botão enquanto salva.
    */

    const submitButton =
        gameForm.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "SALVANDO...";

    }


    let createdGameId = null;


    try {


        /* =========================
           SALVAR JOGO
        ========================= */

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


        createdGameId = game.id;


        /* =========================
           SALVAR PARTES
        ========================= */

        const partsToInsert =
            parts.map(part => ({

                game_id: game.id,

                name: part.name,

                link: part.link,

                sort_order: part.sort_order

            }));


        const {
            error: partsError
        } = await supabaseClient
            .from("game_parts")
            .insert(partsToInsert);


        if (partsError) {

            /*
               Se as partes falharem,
               remove o jogo criado.
            */

            await supabaseClient
                .from("games")
                .delete()
                .eq("id", game.id);


            createdGameId = null;


            throw partsError;

        }


        /* =========================
           SALVAR SCREENSHOTS
        ========================= */

        if (screenshots.length > 0) {

            const screenshotsToInsert =
                screenshots.map(screenshot => ({

                    game_id: game.id,

                    image_url:
                        screenshot.image_url,

                    sort_order:
                        screenshot.sort_order

                }));


            const {
                error: imagesError
            } = await supabaseClient
                .from("game_images")
                .insert(screenshotsToInsert);


            if (imagesError) {

                console.error(
                    "Erro ao salvar screenshots:",
                    imagesError
                );


                /*
                   Se as screenshots falharem,
                   remove o jogo.

                   Como as tabelas usam
                   ON DELETE CASCADE,
                   as partes também serão removidas.
                */

                await supabaseClient
                    .from("games")
                    .delete()
                    .eq("id", game.id);


                createdGameId = null;


                throw imagesError;

            }

        }


        /* =========================
           LIMPAR FORMULÁRIO
        ========================= */

        gameForm.reset();


        /*
           Restaurar partes
        */

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


        /*
           Restaurar screenshots
        */

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
                        placeholder="Cole aqui o link da screenshot 1"
                    >

                </div>

            `;

        }


        await loadRegisteredGames();


        alert(
            screenshots.length > 0
                ? `Jogo adicionado com sucesso!\n\n${screenshots.length} screenshot(s) salva(s).`
                : "Jogo adicionado com sucesso ao Bootplay!\n\nNenhuma screenshot foi cadastrada."
        );


    } catch (error) {

        console.error(
            "Erro ao adicionar jogo:",
            error
        );


        /*
           Segurança extra:
           se o jogo foi criado mas ocorreu
           algum erro que não conseguimos tratar
           antes, tenta remover.
        */

        if (createdGameId !== null) {

            await supabaseClient
                .from("games")
                .delete()
                .eq("id", createdGameId);

        }


        alert(
            "Erro ao adicionar o jogo.\n\n" +
            (error.message || "Veja o console para mais detalhes.")
        );


    } finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "ADICIONAR JOGO";

        }

    }

});


/* =========================
   LISTAR JOGOS DO SUPABASE
========================= */

async function loadRegisteredGames() {

    registeredGames.innerHTML = `
        <div class="empty-games">
            Carregando jogos...
        </div>
    `;


    /*
       Busca jogos.
    */

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


    /*
       Busca todas as partes.
    */

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


    /*
       Busca todas as screenshots.
    */

    const {
        data: gameImages,
        error: imagesError
    } = await supabaseClient
        .from("game_images")
        .select("*")
        .order("sort_order", {
            ascending: true
        });


    /*
       Se houver erro nas screenshots,
       não vamos impedir a lista de jogos
       de aparecer.
    */

    if (imagesError) {

        console.error(
            "Erro ao carregar screenshots:",
            imagesError
        );

    }


    const screenshots =
        gameImages || [];


    /*
       Junta as partes e screenshots
       aos respectivos jogos.
    */

    const gamesWithParts =
        games.map(game => ({

            ...game,

            parts:
                parts.filter(
                    part =>
                        part.game_id === game.id
                ),

            screenshots:
                screenshots.filter(
                    screenshot =>
                        screenshot.game_id === game.id
                )

        }));


    gameCount.textContent =
        `${gamesWithParts.length} jogo${
            gamesWithParts.length !== 1
                ? "s"
                : ""
        }`;


    registeredGames.innerHTML = "";


    if (gamesWithParts.length === 0) {

        registeredGames.innerHTML = `

            <div class="empty-games">

                Nenhum jogo cadastrado ainda.

            </div>

        `;

        return;

    }


    gamesWithParts.forEach(game => {

        const item =
            document.createElement("div");

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

            <button
                class="delete-game-button"
                data-id="${game.id}"
            >
                EXCLUIR
            </button>

        `;


        registeredGames.appendChild(item);

    });


    activateDeleteButtons();

}


/* =========================
   EXCLUIR JOGO
========================= */

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


                /*
                   Graças ao ON DELETE CASCADE,
                   as partes e screenshots
                   também serão apagadas.
                */

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


                await loadRegisteredGames();

            }
        );

    });

}


/* =========================
   PROTEÇÃO CONTRA HTML
========================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
