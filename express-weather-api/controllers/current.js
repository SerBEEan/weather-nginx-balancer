const fetch = require('node-fetch');
const { unit: unitsMap } = require('../enums/unit');

const { API_BASE: BASE_URL, SECRET_KEY, SERVICE_ID } = process.env;

module.exports.getCurrent = function(req, res) {
    const city = req.param('city');
    const units = req.param('units') ?? 'celsius';

    if (!city) {
        res.send('Введите город');
    }

    if (!SECRET_KEY) {
        res.send('Введите секретный ключ');
    }

    fetch(`${BASE_URL}/data/2.5/weather?q=${city}&appid=${SECRET_KEY}&units=${unitsMap[units]}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.cod === '404') {
                res.send(data.message);
                return;
            }

            res.send({
                service: SERVICE_ID,
                city: data.name,
                unit: units,
                temperature: Math.round(data.main.temp),
            });
        });
}