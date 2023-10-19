const util = require('util');
const requestSync = require('postman-request');
const request = util.promisify(requestSync);

const MAPBOX_KEY = "pk.eyJ1IjoiamFtZXMtc2ltcGxlY2xpY2siLCJhIjoiY2xudmg3NGY5MG5wcTJybzVtajFiN2QyMiJ9.qIJIKL65dFUrsPwo9wDeJw";
const MAPBOX_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const geoUrl = (query) => `${MAPBOX_URL}/${query}.json?access_token=${MAPBOX_KEY}&limit=1`;

async function getLocation(query) {
    const url = geoUrl(query);
    try {
        const resp = await request({url, json: true});
        const {statusCode, statusMessage, body} = resp
        //console.log(statusCode, statusMessage, body)//, {error, statusCode, statusMessage, body})
        if (statusCode !== 200) {
            throw Error(statusMessage ?? "Request error");
        } else {
            const {features} = body;
            if (!features.length) {
                throw Error("Could not find location.")
            } else {
                // Note "center" property is Lon,Lat not Lat,Lon (https://docs.mapbox.com/api/search/geocoding/?size=n_10_n#geocoding-response-object)
                const {place_name, center: [lng, lat] = []} = features[0];
                return [null, place_name, {lat, lng}];
            }
        }
    } catch (err) {
        return [`${err.message}`, null, {}];
    }
}

module.exports = {
    getLocation
}