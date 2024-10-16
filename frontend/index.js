import { backend } from 'declarations/backend';
import { Principal } from '@dfinity/principal';

async function updateTokenInfo() {
    const name = await backend.icrc2_name();
    const symbol = await backend.icrc2_symbol();
    const decimals = await backend.icrc2_decimals();
    const totalSupply = await backend.icrc2_total_supply();

    document.getElementById('token-name').textContent = name;
    document.getElementById('token-symbol').textContent = symbol;
    document.getElementById('token-decimals').textContent = decimals.toString();
    document.getElementById('token-supply').textContent = totalSupply.toString();
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

async function transferTokens() {
    const toPrincipalId = document.getElementById('transfer-to').value;
    const amount = BigInt(document.getElementById('transfer-amount').value);
    try {
        const toPrincipal = Principal.fromText(toPrincipalId);
        const result = await backend.icrc2_transfer(toPrincipal, amount);
        if ('ok' in result) {
            document.getElementById('transfer-result').textContent = `Transfer successful: ${result.ok} tokens`;
        } else {
            document.getElementById('transfer-result').textContent = `Transfer failed: ${result.err}`;
        }
    } catch (error) {
        document.getElementById('transfer-result').textContent = 'Error: Invalid input';
    }
}

document.getElementById('check-balance').addEventListener('click', checkBalance);
document.getElementById('transfer-tokens').addEventListener('click', transferTokens);

updateTokenInfo();
