import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';


const supabaseUrl = 'https://qwulavohnlhfnqlvfjhc.supabase.co';
const supabaseKey = 'sb_publishable_UbO01YTgK-QBFGib30RmhA_6wvnmzeM';

const supabaseClient = createClient(supabaseUrl, supabaseKey);

console.log('Supabase conectado!');

const loginForm = document.getElementById('loginForm');
const mensagem = document.getElementById('mensagem');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        mensagem.textContent = 'E-mail ou senha incorretos.';
        console.error(error);
        return;
    }

    console.log('Login realizado!', data);

    window.location.href = 'index.html';
});