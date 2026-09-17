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
   LOGIN TEMPORÁRIO
========================= */

/*
   ATENÇÃO:
   Este login é apenas para a versão
   de demonstração.

   Quando conectarmos o Supabase,
   o login real será feito através
   do sistema de autenticação.
*/

const DEMO_USER = "Tobi";
const DEMO_PASSWORD = "856980";


/* =========================
   VERIFICAR LOGIN
========================= */

if (
    sessionStorage.getItem("bootplayAdmin") === "true"
) {

    showAdminPanel();

}


/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", event => {

    event.preventDefault();


    const username =
        document.getElementById(
            "adminUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "adminPassword"
        ).value;


    if (
        username === DEMO_USER &&
        password === DEMO_PASSWORD
    ) {

        sessionStorage.setItem(
            "bootplayAdmin",
            "true"
        );

        loginMessage.textContent = "";

        showAdminPanel();

    } else {

        loginMessage.textContent =
            "Usuário ou senha incorretos.";

    }

});


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

logoutBtn.addEventListener("click", () => {

    sessionStorage.removeItem(
        "bootplayAdmin"
    );

    adminPanel.classList.add("hidden");

    loginScreen.classList.remove("hidden");

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
            ".part-form"
        );


    forms.forEach((form, index) => {

        const number =
            form.querySelector(".part-number");

        number.textContent =
            `PARTE ${index + 1}`;

    });

}


/* =========================
   ADICIONAR JOGO
========================= */

gameForm.addEventListener("submit", event => {

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
            ".part-form"
        );


    const parts = [];


    partForms.forEach(form => {

        const partName =
            form.querySelector(
                ".part-name"
            ).value.trim();


        const partLink =
            form.querySelector(
                ".part-link-input"
            ).value.trim();


        if (partName && partLink) {

            parts.push({

                name: partName,

                link: partLink

            });

        }

    });


    const game = {

        id: Date.now(),

        name: name,

        category: category,

        genre: genre,

        image: image,

        description: description,

        parts: parts

    };


    /*
       Pega os jogos existentes.
    */

    const games =
        JSON.parse(
            localStorage.getItem(
                "bootplayGames"
            ) || "[]"
        );


    /*
       Adiciona o novo jogo.
    */

    games.push(game);


    /*
       Salva.
    */

    localStorage.setItem(
        "bootplayGames",
        JSON.stringify(games)
    );


    /*
       Limpa formulário.
    */

    gameForm.reset();


    /*
       Deixa somente uma parte.
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


    loadRegisteredGames();


    alert(
        "Jogo adicionado com sucesso!"
    );

});


/* =========================
   LISTAR JOGOS
========================= */

function loadRegisteredGames() {

    const games =
        JSON.parse(
            localStorage.getItem(
                "bootplayGames"
            ) || "[]"
        );


    gameCount.textContent =
        `${games.length} jogo${games.length !== 1 ? "s" : ""}`;


    registeredGames.innerHTML = "";


    if (games.length === 0) {

        registeredGames.innerHTML = `

            <div class="empty-games">

                Nenhum jogo cadastrado ainda.

            </div>

        `;

        return;

    }


    games.forEach(game => {

        const item =
            document.createElement("div");

        item.className =
            "registered-game";


        item.innerHTML = `

            <img
                src="${game.image}"
                alt="${game.name}"
            >

            <div class="registered-game-info">

                <h3>
                    ${game.name}
                </h3>

                <p>
                    ${game.category}
                    •
                    ${game.genre}
                    •
                    ${game.parts.length}
                    parte(s)
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
            () => {

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


                let games =
                    JSON.parse(
                        localStorage.getItem(
                            "bootplayGames"
                        ) || "[]"
                    );


                games =
                    games.filter(
                        game =>
                            game.id !== id
                    );


                localStorage.setItem(
                    "bootplayGames",
                    JSON.stringify(games)
                );


                loadRegisteredGames();

            }
        );

    });

}
