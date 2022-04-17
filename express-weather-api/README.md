# express-weather-api
Возращает данные о текущей погоде и прогноз (врепед до 7 дней) \
В качестве внешнего АПИ используется openWeatherMap

## Запуск
Указать в .env **SECRET_KEY** и запустить
```
npm start
```

Или сразу запустить
```
SECRET_KEY={your key} npm start
```

## .env
Тут конфиг-переменные \
**PORT** - порт на котором поднимается сервер \
**API_BASE** - урл для внешего АПИ погоды \
**SECRET_KEY** - ключ от внешнего АПИ

## Конечные точки
* /v1/current - текущая погода \
Get параметры: \
[**require**] city (*string*) - навание города \
units (*"kelvin" | "celsius" | "fahrenheit"*) - единицы измерения, стандартно celsius

* /v1/forecast - прогноз \
[**require**] city (*string*) - навание города \
[**require**] dt (*number*) - timestamp \
units (*"kelvin" | "celsius" | "fahrenheit"*) - единицы измерения, стандартно celsius

## Docker
Запустить по очереди из корневой папки проекта:
```
docker build . -t weather
```
```
docker run -p 3000:3000 -d weather
```
