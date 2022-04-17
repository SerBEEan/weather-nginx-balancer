# weather-balancer
Балансер nginx для распределения запросов между двумя docker-контейнерами, в каждом из которых экземпляр [сервиса погоды](https://github.com/SerBEEan/express-weather-api "express-weather-api") 

## Изменения в сервисе погоды
Для демонстрации того, с какого контейнера приходит response, в контейнер передается env-переменная `SERVICE_ID <number>`

Добавлено получение env-переменной и отправка ее с response (метод `res.send`):
```
// controllers/current.js

const { API_BASE: BASE_URL, SECRET_KEY, SERVICE_ID } = process.env;

// code

res.send({
    service: SERVICE_ID,
    city: data.name,
    unit: units,
    temperature: Math.round(data.main.temp),
});
```

```
// controllers/forecast.js

const { API_BASE: BASE_URL, SECRET_KEY, SERVICE_ID } = process.env;

// code

res.send(JSON.stringify({
    service: SERVICE_ID,
    city: name,
    unit: 'celsius',
    temperature: Math.round(forecast.temp.day),
}));
```

## Запуск
Указать в `express-weather-api/.env` **SECRET_KEY**

Собрать образы для 2-х погод и запустить контейнеры:
```
docker build -t iwb_1 -f Dockerfile1 .
docker run -d --rm --name wb_1 -p 3000:3000 iwb_1
```
```
docker build -t iwb_2 -f Dockerfile2 .
docker run -d --rm --name wb_2 -p 3010:3000 iwb_2
```

Посмотреть какие ip адреса у этих поднятых контейнеров:
```
docker container inspect wb_1
docker container inspect wb_2
```

Достать значения поля `IPAddress` и подставить в поле `server` в конфиге `nginx.conf`:
```
upstream backend  {
    least_conn;
    server 172.17.0.2:3000;         # <-- сюда, от wb_1
    server 172.17.0.3:3000;         # <-- сюда, от wb_2
}
```

Собрать образ nginx и запустить контейнер:
```
docker build -t iwb_n -f Dockerfile_nginx .
docker run -d --rm --name wb_n -p 8080:80 iwb_n
```
