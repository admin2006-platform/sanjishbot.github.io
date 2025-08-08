const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Калиди API-и худро аз тағйирёбандаҳои муҳити зист (Environment Variables) дар Netlify мегирем.
    // Ин роҳи бехатари нигоҳ доштани маълумоти махфӣ аст.
    const apiKey = process.env.GOOGLE_API_KEY;

    // Ин URL-и намунавӣ барои Google Search Console API аст.
    // Шумо бояд онро бо URL-и воқеии дархости худ иваз кунед.
    // Масалан, барои гирифтани рӯйхати сайтҳо:
    const siteUrl = event.queryStringParameters.siteUrl || 'https://example.com'; // Гирифтани URL-и сайт аз дархост
    const apiUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                // Калиди API-ро ба сарлавҳаи (header) дархост илова мекунем
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            }
        });

        // Агар дархост ба Google номуваффақ бошад, хатогиро бармегардонем
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Хатогӣ аз Google API: ${response.statusText}` })
            };
        }

        const data = await response.json();

        // Ҷавоби муваффақро ба frontend (вебсайти шумо) бармегардонем
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        // Дар сурати рух додани хатогии умумӣ
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Хатогии дохилӣ дар сервер: ${error.message}` })
        };
    }
};