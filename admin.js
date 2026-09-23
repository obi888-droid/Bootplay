<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Bootplay Admin</title>

    <link rel="stylesheet" href="style.css">

<style>
    .messages-admin-card {
        margin-top: 24px;
    }

    .message-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 18px 0;
    }

    .message-filter {
        border: 1px solid rgba(139, 92, 246, 0.28);
        background: rgba(139, 92, 246, 0.06);
        color: inherit;
        border-radius: 8px;
        padding: 9px 12px;
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        transition: 0.2s ease;
    }

    .message-filter:hover {
        transform: translateY(-1px);
        border-color: rgba(139, 92, 246, 0.55);
    }

    .message-filter.active {
        background: rgba(139, 92, 246, 0.18);
        border-color: rgba(139, 92, 246, 0.7);
    }

    .received-message {
        border: 1px solid rgba(139, 92, 246, 0.18);
        border-radius: 12px;
        padding: 18px;
        margin-bottom: 14px;
        background: rgba(255, 255, 255, 0.025);
    }

    .received-message-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        margin-bottom: 10px;
    }

    .received-message-type {
        font-size: 13px;
        font-weight: 900;
        letter-spacing: 0.5px;
    }

    .received-message-date {
        font-size: 11px;
        opacity: 0.65;
        white-space: nowrap;
    }

    .received-message-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 8px 0 12px;
    }

    .received-message-meta span {
        display: inline-flex;
        align-items: center;
        border: 1px solid rgba(139, 92, 246, 0.18);
        border-radius: 6px;
        padding: 5px 8px;
        font-size: 11px;
    }

    .received-message-text {
        margin: 0 0 14px;
        line-height: 1.6;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
    }

    .delete-message-button {
        border: 1px solid rgba(239, 68, 68, 0.35);
        background: rgba(239, 68, 68, 0.08);
        color: inherit;
        border-radius: 7px;
        padding: 8px 11px;
        font: inherit;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
    }

    .delete-message-button:hover {
        background: rgba(239, 68, 68, 0.16);
    }

    .delete-message-button:disabled {
        opacity: 0.55;
        cursor: wait;
    }

    .message-status-admin {
        margin: 10px 0;
        font-size: 12px;
        opacity: 0.8;
    }

    @media (max-width: 600px) {
        .received-message-header {
            flex-direction: column;
            gap: 6px;
        }

        .received-message-date {
            white-space: normal;
        }

        .message-filter {
            flex: 1 1 auto;
        }
    }
</style>


</head>

<body class="admin-page">


    <!-- LOGIN -->

    <section id="loginScreen" class="admin-container">

        <div class="admin-box">

            <div class="logo admin-logo">
                <span>BOOT</span>PLAY
            </div>

            <h1>ÁREA ADMIN</h1>

            <p>
                Acesso restrito ao administrador.
            </p>


            <form id="loginForm">

                <label>
                    E-mail do administrador
                </label>

                <input
                    type="email"
                    id="adminUsername"
                    placeholder="Digite o e-mail"
                    required
                >


                <label>
                    Senha
                </label>

                <input
                    type="password"
                    id="adminPassword"
                    placeholder="Digite a senha"
                    required
                >


                <button type="submit" class="admin-button">
                    ENTRAR
                </button>

            </form>


            <p
                id="loginMessage"
                class="login-message"
            ></p>


            <a href="index.html" class="back-link">
                ← Voltar para o Bootplay
            </a>

        </div>

    </section>



    <!-- PAINEL -->

    <section
        id="adminPanel"
        class="admin-container hidden"
    >

        <div class="admin-dashboard">

            <div class="admin-top">

                <div>

                    <div class="logo">
                        <span>BOOT</span>PLAY
                    </div>

                    <h1>
                        PAINEL ADMIN
                    </h1>

                </div>

                <button
                    id="logoutBtn"
                    class="logout-button"
                >
                    SAIR
                </button>

            </div>


            <!-- ADICIONAR / EDITAR JOGO -->

            <div class="admin-card">

                <h2 id="gameFormTitle">
                    ➕ ADICIONAR JOGO
                </h2>

                <p
                    class="admin-description"
                    id="gameFormDescription"
                >
                    Cadastre as informações do jogo.
                </p>


                <form id="gameForm">


                    <!-- NOME -->

                    <label>
                        Nome do jogo
                    </label>

                    <input
                        type="text"
                        id="gameName"
                        placeholder="Ex: God of War III"
                        required
                    >


                    <!-- PLATAFORMA -->

                    <label>
                        Plataforma
                    </label>

                    <select
                        id="gameCategory"
                        required
                    >

                        <option value="">
                            Escolha uma plataforma
                        </option>

                        <option value="PS1">
                            PS1
                        </option>

                        <option value="PS2">
                            PS2
                        </option>

                        <option value="PS3">
                            PS3
                        </option>

                        <option value="PS4">
                            PS4
                        </option>

                        <option value="PS5">
                            PS5
                        </option>

                        <option value="PSP">
                            PSP
                        </option>

                        <option value="PC">
                            PC
                        </option>

                        <option value="Mobile">
                            Mobile
                        </option>

                    </select>


                    <!-- GÊNERO -->

                    <label>
                        Gênero
                    </label>

                    <input
                        type="text"
                        id="gameGenre"
                        placeholder="Ex: Ação"
                        required
                    >


                    <!-- TAMANHO DO JOGO -->

                    <label>
                        Tamanho do jogo
                    </label>

                    <div class="game-size-row">

                        <input
                            type="number"
                            id="gameSize"
                            placeholder="Ex: 10"
                            min="0"
                            step="any"
                            required
                        >

                        <select
                            id="gameSizeUnit"
                            required
                        >

                            <option value="KB">
                                KB
                            </option>

                            <option value="MB">
                                MB
                            </option>

                            <option
                                value="GB"
                                selected
                            >
                                GB
                            </option>

                            <option value="TB">
                                TB
                            </option>

                        </select>

                    </div>

                    <small class="field-help">
                        Informe o tamanho aproximado do jogo.
                    </small>


                    <!-- IMAGEM -->

                    <label>
                        Imagem do jogo
                    </label>

                    <input
                        type="url"
                        id="gameImage"
                        placeholder="Cole aqui o link da imagem"
                        required
                    >

                    <small class="field-help">
                        Nesta primeira versão use o link de uma imagem.
                    </small>


                    <!-- DESCRIÇÃO -->

                    <label>
                        Descrição do jogo
                    </label>

                    <textarea
                        id="gameDescription"
                        rows="6"
                        placeholder="Escreva aqui a descrição do jogo..."
                        required
                    ></textarea>


                    <!-- PARTES -->

                    <div class="parts-header">

                        <div>

                            <h3>
                                PARTES DO JOGO
                            </h3>

                            <p>
                                Você pode adicionar quantas partes quiser.
                            </p>

                        </div>

                    </div>


                    <div id="partsContainer">

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

                    </div>


                    <button
                        type="button"
                        id="addPartBtn"
                        class="add-part-button"
                    >
                        + ADICIONAR OUTRA PARTE
                    </button>


                    <!-- BOTÕES DO FORMULÁRIO -->

                    <div class="form-actions">

                        <button
                            type="submit"
                            id="saveGameBtn"
                            class="save-game-button"
                        >
                            💾 ADICIONAR JOGO
                        </button>


                        <button
                            type="button"
                            id="cancelEditBtn"
                            class="cancel-edit-button"
                            style="display: none;"
                        >
                            ❌ CANCELAR EDIÇÃO
                        </button>

                    </div>


                </form>

            </div>


            <!-- MENSAGENS RECEBIDAS -->

            <div class="admin-card messages-admin-card">

                <div class="registered-header">

                    <div>
                        <h2>📩 MENSAGENS RECEBIDAS</h2>

                        <p>
                            Relatórios de erros, links, pedidos de jogos e outras mensagens.
                        </p>
                    </div>

                    <span id="messageCount">
                        0 mensagens
                    </span>

                </div>

                <div id="messageFilters" class="message-filters">

                    <button
                        type="button"
                        class="message-filter active"
                        data-message-filter="all"
                    >
                        📩 Todas
                    </button>

                    <button
                        type="button"
                        class="message-filter"
                        data-message-filter="error"
                    >
                        🐛 Erros
                    </button>

                    <button
                        type="button"
                        class="message-filter"
                        data-message-filter="link"
                    >
                        🔗 Links
                    </button>

                    <button
                        type="button"
                        class="message-filter"
                        data-message-filter="request"
                    >
                        🎮 Pedidos
                    </button>

                    <button
                        type="button"
                        class="message-filter"
                        data-message-filter="other"
                    >
                        💬 Outros
                    </button>

                </div>

                <div id="receivedMessages">

                    <div class="empty-games">
                        Carregando mensagens...
                    </div>

                </div>

            </div>



            <!-- JOGOS CADASTRADOS -->

            <div class="admin-card">

                <div class="registered-header">

                    <div>

                        <h2>
                            🎮 JOGOS CADASTRADOS
                        </h2>

                        <p>
                            Jogos cadastrados online no Bootplay.
                        </p>

                    </div>

                    <span id="gameCount">
                        0 jogos
                    </span>

                </div>


                <div id="registeredGames">

                </div>

            </div>


        </div>

    </section>



    <!-- SUPABASE -->

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <script src="supabase.js"></script>

    <script src="admin.js"></script>


</body>

</html>
