console.log("App JS loaded!")

const fetchWeather = (searchAddress) => {
    searchMessage(true)
    fetch(`/weather?address=${searchAddress}`)
        .then(resp => {
            if (resp.ok !== true) {
                //console.warn();
                searchMessage(false, `${resp.status} ${resp.statusText}`)
            } else {
                resp.json()
                    .then(result => {
                        if (result.error) {
                            searchMessage(false, result.error);
                        } else {
                            searchMessage(false, null, result);
                        }
                    })
                    .catch(err => searchMessage(false, err));
            }
        })
        .catch(err => searchMessage(false, err));
};

function searchMessage(loading, error, data) {
    console.warn({loading, error, data})
    const loadingElem = document.querySelector(".loading");
    const errorElem = document.querySelector(".error");
    const dataElem = document.querySelector(".data");
    loadingElem.classList.toggle("hide", !loading);
    errorElem.classList.toggle("hide", loading || !error);
    dataElem.classList.toggle("hide", loading || error);
    errorElem.textContent = error || "";
    dataElem.textContent = "";
    if (data) {
        const {address, location, forecast:{weather_descriptions, temperature, feelslike}} = data;
        const feelslikeText = temperature === feelslike ? "" : ` (feels like ${feelslike} degrees)`
        dataElem.innerHTML = `
            <dl>
                <dt>Address</dt><dd>${address}</dd>
                <dt>Location</dt><dd>${location.lat},${location.lng}</dd>
                <dt>Outlook</dt><dd>${weather_descriptions.join("\n")}</dd>
                <dt>Temperature</dt><dd>${temperature}°C${feelslikeText}</dd>
            </dl>
        `;
    }
}

addEventListener('load', () => {
    const weatherSearchForm = document.getElementById("weatherSearchForm");
    weatherSearchForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const address = event.target.elements["address"]?.value;
        if (address) {
            fetchWeather(address);
        }
    });
})