const util = require('node:util');
const requestSync = require('postman-request');
const request = util.promisify(requestSync);

const { getLocation } = require('./geocode.js');

const WEATHERSTACK_API_URL = "http://api.weatherstack.com/current";
const WEATEHRSTACK_API_KEY = "a0bb470263ce11cf234520b13905bdc3";
const apiUrl = (query) => {
    let url = `${WEATHERSTACK_API_URL}?access_key=${WEATEHRSTACK_API_KEY}&units=m`;
    if (typeof query === "string" && query.length) {
        url += `&query=${query}`;
    }
    return url;
}
async function searchWeather(address) {
    const [geoError, place_name, {lat, lng}] = await getLocation(address);
    if (geoError) {
        return {error: `Could not find address for weather check -- ${geoError}`};
    } else {
    const [weatherError, weather] = await getWeather(lat, lng);
        if (weatherError) {
            return {error: `Could not get weather for ${lat},${lng} -- ${weatherError}`};
        } else {
            return {
                location: {lat, lng},
                address: place_name,
                forecast: weather
            };
        }
    }
}

async function getWeather(lat, lng) {
    const url = apiUrl(`${lat},${lng}`);
    try {
        const {statusCode, statusMessage, body} = await request({url, json: true});
        if (statusCode !== 200) {
            throw Error(statusMessage ?? "Request error");
        } else {
            if (body?.error) {
                const {info, type} = body.error;
                throw Error(`Weatherstack Error: ${type} -- ${info}`);
            } else {
                return [null, body?.current ?? {}];
            }
        }
    } catch (err) {
        return [`${err.message} (${url})`, null];
    }
}




module.exports = {
    searchWeather,
    getWeather
}