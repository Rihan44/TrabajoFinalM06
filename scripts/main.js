
const search = document.getElementById('input--search');
const formSearch = document.getElementById('form--search');
const container = document.getElementById('main--container');
const title = document.getElementById('text--title');
const titleInfo = document.getElementById('text--title--info');

if(container) {
    if(search.value === ''){
        getAllCountries();
    }
    
    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
    })
    
    search.addEventListener('input', (e) => {
        getCountrieByName(search.value);
    });
    
} else {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");
    titleInfo.innerHTML = `Información de: <strong>${name}</strong>`;
    getCountriInfo(name);
}

async function getAllCountries(){

    title.innerHTML = "Todos los paises";
    await fetch('https://restcountries.com/v3.1/all')
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            let content = ''; 
            for (let i = 0; i < data.length; i++) {
                    content += `
                        <div class="card shadow-lg">
                            <img src="${data[i].flags.png}" class="card-img-top" alt="${data[i].flags.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${data[i].name.common}</h5>
                                <p class="card-text"><strong>Región:</strong> ${data[i].region}</p>
                                <button type="button" class="btn btn-info" onclick="getCountrie('pages/info.html?name=${encodeURIComponent(data[i].name.common)}')">Más Info</button>
                            </div>
                        </div>
                    `;
                }
                container.innerHTML = content;
        })
        .catch((err) => {
            console.log(err);
        })
}

async function getCountrieByName(name) {
    title.innerHTML = `Paises por nombre: ${name}`
    await fetch(`https://restcountries.com/v3.1/name/${name}`)
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            let content = ''; 
            if(name.length > 0){
                if(data.status !== 404) {
                    for (let i = 0; i < data.length; i++) {
                        content += `
                            <div class="card shadow-lg">
                                <img src="${data[i].flags.png}" class="card-img-top" alt="${data[i].flags.alt}">
                                <div class="card-body">
                                    <h5 class="card-title">${data[i].name.common}</h5>
                                    <p class="card-text"><strong>Región:</strong> ${data[i].region}</p>
                                    <button type="button" class="btn btn-info" onclick="getCountrie('pages/info.html?name=${encodeURIComponent(data[i].name.common)}')">Más Info</button>
                                </div>
                            </div>
                        `;
                    }
                } else {
                    content = `<h3 class="text-center container mt-2">No existe un país por ese nombre...</h3> `;
                }
            } else {
                content = `<h3 class="text-center container mt-2">Aún no se ha buscado nada...</h3>`; 
            }
            container.innerHTML = content;
        })
        .catch((err) => {
            console.log(err);
            container.innerHTML = `<h3 class="text-center container mt-2 text-danger-emphasis">Ha habido un error en el búsqueda</h3>`;
        });
}

async function getCountrieByLanguage(lang) {

    await fetch(`https://restcountries.com/v3.1/lang/${lang}`)
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            let content = ''; 
            const tituloPrevio = "Países en los que se habla: ";
            switch (lang) {
                case "spanish":
                    title.innerHTML = tituloPrevio + "Español";     
                    break;
                case "english":
                    title.innerHTML = tituloPrevio + "Inglés";     
                    break;
                case "chinese":
                    title.innerHTML = tituloPrevio + "Chino";     
                    break;
                case "french":
                    title.innerHTML = tituloPrevio + "Francés";     
                    break;
                case "arabic":
                    title.innerHTML = tituloPrevio + "Árabe";     
                    break;
                case "russian":
                    title.innerHTML = tituloPrevio + "Ruso";     
                    break;
                default:
                    title.innerHTML = tituloPrevio;
                    break;
            }
            
            if(data.status !== 404) {
                for (let i = 0; i < data.length; i++) {
                    content += `
                        <div class="card shadow-lg">
                            <img src="${data[i].flags.png}" class="card-img-top" alt="${data[i].flags.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${data[i].name.common}</h5>
                                <p class="card-text"><strong>Región:</strong> ${data[i].region}</p>
                                <button type="button" class="btn btn-info" onclick="getCountrie('pages/info.html?name=${encodeURIComponent(data[i].name.common)}')">Más Info</button>
                            </div>
                        </div>
                    `;
                }
            } 
            container.innerHTML = content;
        })
        .catch((err) => {
            console.log(err);
            container.innerHTML = `<h3 class="text-center container mt-2 text-danger-emphasis">Ha habido un error en el búsqueda</h3>`;
        });
}

function getCountrie(url){
    location.href = url;
}

async function getCountriInfo(paramName) {
    const containerInfo = document.getElementById('container--info');

    // Función para obtener la hora
    async function getTime(region, ciudad) {
        const url = `http://worldtimeapi.org/api/timezone/${region}/${ciudad}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al obtener la hora de la ciudad');
            }
            const data = await response.json();
            const hora = new Date(data.datetime).toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit' });
            return hora;
        } catch (error) {
            return 'No está disponible la hora de esta capital';
        }
    }

    // Función para obtener los datos meteorológicos
    async function getWeatherData(ciudad) {
        const apiKey = "ef6cedfdcad6f45b047948cc72981394";
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al obtener los datos meteorológicos');
            }
            const data = await response.json();
            const temperatura = data.main.temp;
            const descripcionClima = data.weather[0].description;
            return { temperatura, descripcionClima };
        } catch (error) {
            return 'No está disponible el clima de la capital del pais';
        }
    }

    // Función para actualizar la información del país
    async function updateInfo() {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${paramName}`);
            if (!response.ok) {
                throw new Error('Error al obtener la información del país');
            }
            const data = await response.json();
            let content = ''; 
            if (data.status !== 404) {
                const hora = await getTime(data[0].region, data[0].capital[0]);
                const weatherData = await getWeatherData(data[0].capital[0]);
                content += `
                    <div class="card--info d-flex shadow-lg">
                        <img src="${data[0].flags.png}" class="card-img-info" alt="${data[0].flags.alt}">
                        <div class="container--info--countrie">
                            <h4 id="name--info">Nombre: <strong>${data[0].name.common}</strong></h4>
                            <h5 id="oficial--info">Nombre Oficial: <strong>${data[0].name.official}</strong></h5>
                            <p>Capital: <strong>${data[0].capital[0]}</strong></p>
                            <p id="hora--info">Hora: <strong>${hora}</strong></p>
                            <p id="tiempo--info">Tiempo: <strong>${weatherData.descripcionClima}</strong></p>
                            <p>Temperatura: <strong>${weatherData.temperatura}°C</strong></p>
                            <p>Idiomas: <strong>${Object.values(data[0].languages)[0]}</strong></p>
                            <p>Region: <strong>${data[0].region}</strong></p>
                            <p id="subregion--info">Subregion: <strong>${data[0].subregion}</strong></p>
                            ${data[0].flags.alt ? 
                                `<p id="description--info" class="info--description"><strong>${data[0].flags.alt}</strong></p>`
                                :`<p id="description--info" class="text-danger"><strong>${data[0].flags.alt ? data[0].flags.alt : 'Esta bandera no tiene descripción'}</strong></p>`
                            }
                            <button type="button" class="btn btn-info" onclick="toCountrie('${data[0].maps.googleMaps}')">Mostrar ubicación país</button>
                            <button type="button" class="btn btn-success mt-2" onclick="translateText('${data[0].name.common}','${data[0].flags.alt ? data[0].flags.alt : 'Esta bandera no tiene descripción'}', '${data[0].name.official}', '${data[0].subregion}', '${weatherData.descripcionClima}')">Traducir</button>
                        </div>
                    </div>
                `;
            } else {
                content = `<h3 class="text-center container mt-2">No existe un país por ese nombre...</h3> `;
            }
            containerInfo.innerHTML = content;
        } catch (err) {
            console.log(err);
            container.innerHTML = `<h3 class="text-center container mt-2 text-danger-emphasis">Ha habido un error en el búsqueda</h3>`;
        }
    }

    updateInfo();
}

function toCountrie(url){
    window.open(url, '_blank');
}

async function getTranslation(text, targetLang){
    const apiKey = 'ab95479e-c957-4e30-95bb-b47b70abd20d:fx';
    const url = 'https://api-free.deepl.com/v2/translate';
    const params = {
        auth_key: apiKey,
        text: text,
        target_lang: targetLang
    };
    
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(params)
        });
        const data = await response.json();
        return data.translations[0].text;
    } catch (error) {
        console.error(error);
        return text; 
    } finally {
        spinner.style.display = 'none';
    }
}

async function translateText(nombre, descripcion, oficial, subregion, tiempo) {
    const name = await getTranslation(nombre, 'es');
    const description = await getTranslation(descripcion, 'es');
    const oficialName = await getTranslation(oficial, 'es');
    const subregionCountry = await getTranslation(subregion, 'es');
    const tiempoCountry = await getTranslation(tiempo, 'es');

    const nameInfo = document.getElementById("name--info");
    const descriptionInfo = document.getElementById("description--info");
    const oficialInfo = document.getElementById("oficial--info");
    const subregionInfo = document.getElementById("subregion--info");
    const tiempoInfo = document.getElementById("tiempo--info");

    nameInfo.innerHTML = `Nombre: <strong>${name}</strong>`;
    descriptionInfo.innerHTML = `<strong>${description}</strong>`;
    oficialInfo.innerHTML = `Nombre Oficial: <strong>${oficialName}</strong>`;
    subregionInfo.innerHTML = `Subregion: <strong>${subregionCountry}</strong>`;
    tiempoInfo.innerHTML = `Tiempo: <strong>${tiempoCountry}</strong>`;
}
