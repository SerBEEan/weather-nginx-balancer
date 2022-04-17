const fetch = require('node-fetch');
const { unit: unitsMap } = require('../enums/unit');

const { API_BASE: BASE_URL, SECRET_KEY, SERVICE_ID } = process.env;

// прогноз на 7 дней
module.exports.getForecast = function(req, res) {
    const city = req.param('city');
    const dt = req.param('dt');
    const units = req.param('units') ?? 'celsius';

    if (!city) {
        res.send('Введите город');
        return;
    }

    if (!dt) {
        res.send('Введите timestamp');
        return;
    }

    if (!SECRET_KEY) {
        res.send('Введите секретный ключ');
    }

    const timestamp = dt * 1000;
    
    if (new Date(timestamp) < new Date()) {
        res.send('Не корректный timestamp: меньше текущей даты');
        return;
    }

    const date = new Date(timestamp);
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);

    if (date > nextDate) {   
        res.send('Не корректный timestamp: Запрос превышает 7 дней');
        return;
    }

    fetch(`${BASE_URL}/geo/1.0/direct?q=${city}&appid=${SECRET_KEY}&limit=1`)
        .then((res) => res.json())
        .then((result) => {
            if (result.cod === '400' || result.length === 0) {   
                res.send('Нет такого города');
                return;
            }

            const [{ lat, lon, name }] = result;
        
            fetch(`${BASE_URL}/data/2.5/onecall?&appid=${SECRET_KEY}&lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=${unitsMap[units]}`)
                .then((res) => res.json())
                .then((data) => {
                    const forecast = getForecastByDay(data.daily, date.getDate());

                    if (!forecast) {
                        res.send('Прогноз не найден');
                        return;
                    }

                    res.send(JSON.stringify({
                        service: SERVICE_ID,
                        city: name,
                        unit: 'celsius',
                        temperature: Math.round(forecast.temp.day),
                    }));
                });
        
        });
}

function getForecastByDay(forecasts, day) {
    const index = forecasts.findIndex((f) => new Date(f.dt * 1000).getDate() === day)
    return forecasts[index];
}
