const qrcode = require('qrcode-terminal');
const {Client, MessageTypes, MessageMedia, List, Buttons, LocalAuth} = require ('whatsapp-web.js');
const client = new Client ({
    authStrategy: new LocalAuth()
});

client.on ('qr', qr => {
    qrcode.generate (qr, {small: true})
});

client.on ('ready', async () => {
    console.log ('E lá vamos nós');
});

client.initialize();

//Função para enviar Bom dia, Boa tarde e Boa noite.
function saudacao () {
    const data = new Date();
    const hora = data.getHours();
    let str = '';

    if (hora >= 6 && hora < 12){
        str = '🌞 *Bom dia!*';
        
    }else if (hora >= 12 && hora < 18){
        str = '🌅 *Boa tarde!*';

    }else {
        str = '🌙 *Boa noite!*';
    }
    return str;
};

const state = {};


const delay = ms => new Promise (res => setTimeout (res, ms));

client.on ('message', async msg => {


    if (msg.isGroup || msg.from.endsWith ('@g.us')){
        return;
    };

    //Função para enviar mensagem de texto com digitação sem imagem
    async function enviarMensagemTexto (texto){
            await delay (3000);
            await chat.sendStateTyping();
            await delay (3000);
            await client.sendMessage (msg.from, texto);
    };

    //Função para enviar mensagem de texto com digitação e imagem
    async function enviarMensagemInicial (img, texto){
            await delay (3000);
            await chat.sendStateTyping();
            await delay (3000);
            await client.sendMessage (msg.from, img, {caption: texto});
    };

    const from = msg.from;
    const mensagem = msg.body || msg.from.endsWith('@c.us');
    const chat = await msg.getChat();
    const contato = await msg.getContact();
    const nome = contato.pushname;
    const saudacoes = ['oi', 'bom dia', 'boa tarde', 'olá', 'Olá', 'Oi', 'Boa noite', 'Bom Dia', 'Bom dia', 'Boa Tarde', 'Boa tarde', 'Boa Noite', 'boa noite'];
    const logo = MessageMedia.fromFilePath('./logo_exemplo.jpg');
    const sauda = saudacao();
    const mensagemInicial = `${sauda}\n${nome} \n*Sou o Bot, seu assistente virtual!*\n_Como posso ajudar?_\n\n➡️ Por favor, digite o *NÚMERO* de uma das opções abaixo:\n\n1️⃣ - Opção 1\n2️⃣ - Opção 2\n3️⃣ - Opção 3\n4️⃣ - Opção 4\n5️⃣ - Opção 5`;
    const MAX_ATTEMPTS = 3;
    if (!state[from]) state[from] = {attempts: 0 , step: 0};
    const userState = state[from];

    if (userState.step === 0){
        if (saudacoes.some (palavra => msg.body.includes(palavra))){
            state.step = 'mainMenu';
            await enviarMensagemInicial(logo, mensagemInicial);
            state[from] = {step: 1};
            return;
        }
    }else if (userState.step === 1){
        switch(mensagem){
            case"1":
            await enviarMensagemTexto('Este é um exemplo de navegação para a opção 1');
            await enviarMensagemTexto('*O que deseja fazer agora?*\n\n0️⃣ - Sair\n1️⃣ - Menu inicial');
            state[from] = {step: 2};
            return;

            case"2":
            await enviarMensagemTexto('Este é um exemplo de navegação para a opção 2');
            await enviarMensagemTexto('*O que deseja fazer agora?*\n\n0️⃣ - Sair\n1️⃣ - Menu inicial');
            state[from] = {step: 2};
            return;

            case"3":
            await enviarMensagemTexto('Este é um exemplo de navegação para a opção 3');
            await enviarMensagemTexto('*O que deseja fazer agora?*\n\n0️⃣ - Sair\n1️⃣ - Menu inicial');
            state[from] = {step: 2};
            return;

            case"4":
            await enviarMensagemTexto('Este é um exemplo de navegação para a opção 4');
            await enviarMensagemTexto('*O que deseja fazer agora?*\n\n0️⃣ - Sair\n1️⃣ - Menu inicial');
            state[from] = {step: 2};
            return;

            case"5":
            await enviarMensagemTexto('Este é um exemplo de navegação para a opção 5');
            await enviarMensagemTexto('*O que deseja fazer agora?*\n\n0️⃣ - Sair\n1️⃣ - Menu inicial');
            state[from] = {step: 2};
            return;

            default:
                if (userState.attempts === undefined) userState.attempts = 0;
                userState.attempts++;
                const tentativasRestantes = MAX_ATTEMPTS - userState.attempts;
                if (userState.attempts >= MAX_ATTEMPTS) {
                    await client.sendMessage(
                        msg.from,
                        '❌ *Número de tentativas excedido!*\nAtendimento finalizado!\n\nDigite *Oi* para iniciar.'
                    );
                    state[from] = { step: 0, attempts: 0 };
                    delete state[from]; 
                } else {
                    await client.sendMessage(
                        msg.from,
                        `❌ *Opção inválida!*\nVocê tem mais ${tentativasRestantes} tentativa(s).`
                    );
                }
                return;
        }
    }else if (userState.step === 2){
        switch(mensagem){
        case"0":
        await enviarMensagemTexto('😉 Tudo bem!\n👋 *Até logo!*');
        delete state[from];
        return;

        case"1":
        await enviarMensagemTexto('😉 Tudo bem!\nVamos começar de novo...');
        await enviarMensagemInicial(logo, mensagemInicial);
        state[from] = {step:1};
        return;

        default:
                if (userState.attempts === undefined) userState.attempts = 0;
                userState.attempts++;
                const tentativasRestantes = MAX_ATTEMPTS - userState.attempts;
                if (userState.attempts >= MAX_ATTEMPTS) {
                    await client.sendMessage(
                        msg.from,
                        '❌ *Número de tentativas excedido!*\nAtendimento finalizado!\n\nDigite *Oi* para iniciar.'
                    );
                    state[from] = { step: 0, attempts: 0 };
                    delete state[from]; 
                } else {
                    await client.sendMessage(
                        msg.from,
                        `❌ *Opção inválida!*\nVocê tem mais ${tentativasRestantes} tentativa(s).`
                    );
                }
                return;
        }
    }


});
