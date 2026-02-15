
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

console.log('Account ID in env:', accountId);

async function verify() {
    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const response = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Verify Status:', data.success ? 'OK' : 'FAIL');

        // List accounts
        const accResponse = await fetch('https://api.cloudflare.com/client/v4/accounts', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const accData = await accResponse.json();
        console.log('Accounts Response:', JSON.stringify(accData, null, 2));

    } catch (e) {
        console.error('Check Failed:', e);
    }
}

verify();
