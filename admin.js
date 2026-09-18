// ===============================
// BOOTPLAY - ADMIN
// ===============================


// ===============================
// ELEMENTOS
// ===============================

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

const imagesContainer =
    document.getElementById("imagesContainer");

const addImageBtn =
    document.getElementById("addImageBtn");


// ===============================
// VERIFICAR SESSÃO
// ===============================

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


// ===============================
// LOGIN
// ===============================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            loginMessage.textContent =
                "Entrando...";


            const email =
                document
                    .getElementById("adminUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("adminPassword")
                    .value;


            const {
                error
            } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                console.error(error);

                loginMessage.textContent =
                    "E-mail ou senha incorretos.";

                return;

            }


            loginMessage.textContent =
                "";

            showAdminPanel();

        }
    );

}


// ===============================
// MOSTRAR LOGIN
// ===============================

function showLogin() {

    loginScreen.classList.remove("hidden");

    adminPanel.classList.add("hidden");

}


// ===============================
// MOSTRAR PAINEL
// ===============================

function showAdminPanel() {

    loginScreen.classList.add("hidden");

    adminPanel.classList.remove("hidden");

    loadRegisteredGames();

}


// ===============================
// LOGOUT
// ===============================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            await supabaseClient.auth.signOut();

            showLogin();

        }
    );

}


// ===============================
// ADICIONAR PARTE
// ===============================

if (addPartBtn) {

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

}


// ===============================
// NUMERAR PARTES
// ===============================

function updatePartNumbers() {

    const forms =
        document.querySelectorAll(
            "#partsContainer .part-form"
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


// ===============================
// ADICIONAR SCREENSHOT
// ===============================

if (addImageBtn) {

    addImageBtn.addEventListener(
        "click",
        () => {

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

                <div class="image-number">
                    SCREENSHOT
                </div>

                <label>
                    Link da imagem
                </label>

                <input
                    type="url"
                    class="game-image-input"
                    placeholder="Cole aqui o link da screenshot"
                >

            `;


            imagesContainer.appendChild(
                imageForm
            );


            imageForm
                .querySelector(
                    ".remove-image-button"
                )
                .addEventListener(
                    "click",
                    () => {

                        imageForm.remove();

                        updateImageNumbers();

                    }
                );


            updateImageNumbers();

        }
    );

}


// ===============================
// NUMERAR SCREENSHOTS
// ===============================

function updateImageNumbers() {

    const forms =
        document.querySelectorAll(
            "#imagesContainer .image-form"
        );


    forms.forEach(
        (form, index) => {

            const number =
                form.querySelector(
                    ".image-number"
                );


            if (number) {

                number.textContent =
                    `SCREENSHOT ${index + 1}`;

            }

        }
    );

}


// ===============================
// ADICIONAR JOGO
// ===============================

if (gameForm) {

    gameForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("gameName")
                    .value
                    .trim();


            const category =
                document
                    .getElementById("gameCategory")
                    .value;


            const genre =
                document
                    .getElementById("gameGenre")
                    .value
                    .trim();


            const image =
                document
                    .getElementById("gameImage")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("gameDescription")
                    .value
                    .trim();


            // ===============================
            // PEGAR PARTES
            // ===============================

            const partForms =
                document.querySelectorAll(
                    "#partsContainer .part-form"
                );


            const parts = [];


            partForms.forEach(
                (form, index) => {

                    const partName =
                        form
                            .querySelector(".part-name")
                            .value
                            .trim();


                    const partLink =
                        form
                            .querySelector(
                                ".part-link-input"
                            )
                            .value
                            .trim();


                    if (partName && partLink) {

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


            // ===============================
            // PEGAR SCREENSHOTS
            // ===============================

            const imageInputs =
                document.querySelectorAll(
                    ".game-image-input"
                );


            const galleryImages = [];


            imageInputs.forEach(
                (input, index) => {

                    const url =
                        input.value.trim();


                    if (url) {

                        galleryImages.push({

                            image_url: url,

                            sort_order: index

                        });

                    }

                }
            );


            // ===============================
            // VERIFICAR LOGIN
            // ===============================

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


            // ===============================
            // DESATIVAR BOTÃO
            // ===============================

            const submitButton =
                gameForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "SALVANDO...";

            }


            try {

                // ===============================
                // SALVAR JOGO
                // ===============================

                const {
                    data: game,
                    error: gameError
                } =
                    await supabaseClient
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


                // ===============================
                // SALVAR PARTES
                // ===============================

                const partsToInsert =
                    parts.map(
                        part => ({

                            game_id: game.id,

                            name: part.name,

                            link: part.link,

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


                // ===============================
                // SALVAR SCREENSHOTS
                // ===============================

                if (
                    galleryImages.length > 0
                ) {

                    const imagesToInsert =
                        galleryImages.map(
                            imageData => ({

                                game_id:
                                    game.id,

                                image_url:
                                    imageData.image_url,

                                sort_order:
                                    imageData.sort_order

                            })
                        );


                    const {
                        error: imagesError
                    } =
                        await supabaseClient
                            .from("game_images")
                            .insert(
                                imagesToInsert
                            );


                    if (imagesError) {

                        await supabaseClient
                            .from("games")
                            .delete()
                            .eq(
                                "id",
                                game.id
                            );

                        throw imagesError;

                    }

                }


                // ===============================
                // LIMPAR FORMULÁRIO
                // ===============================

                gameForm.reset();


                // Restaurar partes

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


                // Restaurar screenshots

                imagesContainer.innerHTML = `

                    <div class="image-form">

                        <div class="image-number">
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


                await loadRegisteredGames();


                alert(
                    "Jogo adicionado com sucesso ao Bootplay!"
                );


            } catch (error) {

                console.error(
                    "Erro ao adicionar jogo:",
                    error
                );


                alert(
                    "Erro ao adicionar o jogo. Veja o console para mais detalhes."
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "ADICIONAR JOGO";

                }

            }

        }
    );

}


// ===============================
// LISTAR JOGOS
// ===============================

async function loadRegisteredGames() {

    registeredGames.innerHTML = `

        <div class="empty-games">
            Carregando jogos...
        </div>

    `;


    // ===============================
    // JOGOS
    // ===============================

    const {
        data: games,
        error: gamesError
    } =
        await supabaseClient
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


    // ===============================
    // PARTES
    // ===============================

    const {
        data: parts,
        error: partsError
    } =
        await supabaseClient
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


    // ===============================
    // SCREENSHOTS
    // ===============================

    const {
        data: images,
        error: imagesError
    } =
        await supabaseClient
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

        return;

    }


    // ===============================
    // JUNTAR DADOS
    // ===============================

    const gamesWithData =
        games.map(
            game => ({

                ...game,

                parts:
                    parts.filter(
                        part =>
                            Number(part.game_id) ===
                            Number(game.id)
                    ),

                images:
                    images.filter(
                        image =>
                            Number(image.game_id) ===
                            Number(game.id)
                    )

            })
        );


    gameCount.textContent =
        `${gamesWithData.length} jogo${
            gamesWithData.length !== 1
                ? "s"
                : ""
        }`;


    registeredGames.innerHTML = "";


    if (gamesWithData.length === 0) {

        registeredGames.innerHTML = `

            <div class="empty-games">
                Nenhum jogo cadastrado ainda.
            </div>

        `;

        return;

    }


    // ===============================
    // MOSTRAR JOGOS
    // ===============================

    gamesWithData.forEach(
        game => {

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
                        ${game.images.length}
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


            registeredGames.appendChild(
                item
            );

        }
    );


    activateDeleteButtons();

}


// ===============================
// EXCLUIR JOGO
// ===============================

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


                    if (!confirmDelete) {

                        return;

                    }


                    button.disabled = true;

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


                        button.disabled = false;

                        button.textContent =
                            "EXCLUIR";

                        return;

                    }


                    await loadRegisteredGames();

                }
            );

        }
    );

}


// ===============================
// SEGURANÇA
// ===============================

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
