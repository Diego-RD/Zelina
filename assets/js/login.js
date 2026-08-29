import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';


const supabaseUrl = 'https://qwulavohnlhfnqlvfjhc.supabase.co';
const supabaseKey = 'sb_publishable_UbO01YTgK-QBFGib30RmhA_6wvnmzeM';

const supabaseClient = createClient(supabaseUrl, supabaseKey);

console.log('Supabase conectado!');

const loginForm = document.getElementById('loginForm');
const mensagem = document.getElementById('mensagem');
const botaoEntrar = loginForm.querySelector('button[type="submit"]');

const { data: { session } } = await supabaseClient.auth.getSession();

if (session) {
    window.location.replace('index.html');
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!loginForm.reportValidity() || !email || !senha) {
        return;
    }

    botaoEntrar.disabled = true;
    mensagem.textContent = '';

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {
        mensagem.textContent = 'E-mail ou senha incorretos.';
        botaoEntrar.disabled = false;
        return;
    }

    if (data.session) {
        window.location.replace('index.html');
    } else {
        mensagem.textContent = 'Não foi possível iniciar a sessão.';
        botaoEntrar.disabled = false;
    }
});