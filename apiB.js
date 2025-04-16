const express = require('express');
const app = express();
const port = 3001; 

app.get('/weather/:city', (req, res) => {  
  const city = req.params.city;

  const weatherData = {
    'SP': 25,
    'RJ': 40,
    'CWB': 22,
    'POA': 12,
    'BH': 30
  };

  if (weatherData[city]) {
    return res.json({
      Cidade: city,
      Temperatura: weatherData[city],
      unit: 'Celsius'
    });
  }

  return res.status(404).json({ error: 'Cidade nao encontrada' });
});

app.listen(port, () => {
  console.log(`API B esta rodando na porta ${port}`);
});
