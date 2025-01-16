export default async function handler(req, res) {
    const apiUrl = 'https://api.emarsys.net/api/v2/event/938/trigger';

    const headers = {
        'X-WSSE': req.headers['x-wsse'],
        'Content-Type': 'application/json',
    };

    const body = req.body;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore nella chiamata API' });
    }
}