const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const redis = require('redis');
let client;

app.get('/recommendation/:city', async (req, res) => {
    const city = req.params.city;

    try {
        if (!client) {
            client = redis.createClient({
                host: 'localhost',
                port: 6379
            });
            client.connect();
        }
        const cacheKey = `weather:${city}`;
        let cachedData = await client.get(cacheKey);
        cachedData = cachedData !== null ? JSON.parse(cachedData) : null;

        if (!cachedData) {
            cachedData = await axios.get(`http://localhost:3001/weather/${city}`);
            client.set(
                cacheKey,
                JSON.stringify(cachedData.data),
                {
                    EX: 60
                }
            )
        }

        const temp = cachedData.data.Temperatura;

        let recommendation;
        if (temp > 30) {
            recommendation = 'Se hidrate e use protetor solar... no minimo fator 30';
        } else if (temp >= 15 && temp <= 30) {
            recommendation = 'O clima esta agradavel! So curticao em povao!';
        } else {
            recommendation = 'Leve um casaco! Se ta frio aqui, imagine em Curitiba';
        }

        res.json({
            Cidade: city,
            Temperatura: temp,
            Recomendamos: recommendation
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar a API B' });
    }
});

app.listen(port, () => {
    console.log(`API A esta rodando na porta ${port}`);
});
