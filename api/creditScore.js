import axios from 'axios';

export default async function handler(req, res) {
    try {
        // Get OAuth token
        const tokenResponse = await axios.post(
            process.env.TOKEN_URL,
            new URLSearchParams({
                client_id: process.env.EXPERIAN_CLIENT_ID,
                client_secret: process.env.EXPERIAN_CLIENT_SECRET,
                grant_type: 'client_credentials',
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const token = tokenResponse.data.access_token;

        // Fetch credit profile
        const creditResponse = await axios.post(
            process.env.PROFILE_URL,
            { customerReferenceNumber: "12345" }, // Replace with actual reference if required
            { headers: { Authorization: `Bearer ${token}` } }
        );

        res.status(200).json({ score: creditResponse.data.creditScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch credit score' });
    }
}
