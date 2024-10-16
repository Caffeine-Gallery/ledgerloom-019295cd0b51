import { backend } from 'declarations/backend';
import { Principal } from '@dfinity/principal';

async function updateTokenInfo() {
    const name = await backend.icrc2_name();
    const symbol = await backend.icrc2_symbol();
    const decimals = await backend.icrc2_decimals();

    document.getElementById('token-name').textContent = name;
    document.getElementById('token-symbol').textContent = symbol;
    document.getElementById('token-decimals').textContent = decimals.toString();
}

async function checkBalance() {
    const principalId = document.getElementById('balance-principal').value;
    try {
        const principal = Principal.fromText(principalId);
        const balance = await backend.icrc2_balance_of(principal);
        document.getElementById('balance-result').textContent = balance.toString();
    } catch (error) {
        document.getElementById('balance-result').textContent = 'Error: Invalid Principal ID';
    }
}

async function fetchTotalSupply() {
    try {
        const totalSupply = await backend.icrc1_total_supply();
        document.getElementById('total-supply-result').textContent = totalSupply.toString();
    } catch (error) {
        document.getElementById('total-supply-result').textContent = 'Error: Unable to fetch total supply';
    }
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

function setInitialTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('checkbox').checked = true;
    }
}

document.getElementById('check-balance').addEventListener('click', checkBalance);
document.getElementById('fetch-total-supply').addEventListener('click', fetchTotalSupply);
document.getElementById('checkbox').addEventListener('change', toggleDarkMode);

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

updateTokenInfo();
setInitialTheme();
