import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Show home section by default
    document.getElementById('home').classList.remove('hidden');

    // Handle balance display
    const balanceAmount = document.getElementById('balance-amount');
    async function updateBalance() {
        try {
            const balance = await backend.icrc2_balance_of(await backend.caller());
            balanceAmount.textContent = `Ξ${balance}`;
        } catch (error) {
            console.error('Error fetching balance:', error);
            balanceAmount.textContent = 'Error fetching balance';
        }
    }
    updateBalance();

    // Handle token transfer
    const transferForm = document.getElementById('transfer-form');
    transferForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const recipient = document.getElementById('recipient').value;
        const amount = BigInt(document.getElementById('amount').value);

        try {
            await backend.icrc2_transfer(recipient, amount);
            alert('Transfer successful!');
            updateBalance();
        } catch (error) {
            console.error('Transfer error:', error);
            alert('Transfer failed. Please try again.');
        }
    });
});
