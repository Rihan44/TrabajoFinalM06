
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

async function getCountriInfo(paramName){
    const containerInfo = document.getElementById('container--info');

    await fetch(`https://restcountries.com/v3.1/name/${paramName}`)
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            let content = ''; 
            if(data.status !== 404) {
                content += `
                    <div class="card--info d-flex shadow-lg">
                        <img src="${data[0].flags.png}" class="card-img-info" alt="${data[0].flags.alt}">
                        <div class="container--info--countrie">
                            <h4 id="name--info">Nombre: <strong>${data[0].name.common}</strong></h4>
                            <h5 id="oficial--info">Nombre Oficial: <strong>${data[0].name.official}</strong></h5>
                            <p>Capital: <strong>${data[0].capital[0]}</strong></p>
                            <p>Idiomas: <strong>${Object.values(data[0].languages)[0]}</strong></p>
                            <p>Region: <strong>${data[0].region}</strong></p>
                            <p id="subregion--info">Subregion: <strong>${data[0].subregion}</strong></p>
                            ${data[0].flags.alt ? 
                                `<p id="description--info" class="info--description"><strong>${data[0].flags.alt}</strong></p>`
                                :`<p id="description--info" class="text-danger"><strong>${data[0].flags.alt ? data[0].flags.alt : 'Esta bandera no tiene descripción'}</strong></p>`
                            }
                            <button type="button" class="btn btn-info" onclick="toCountrie('${data[0].maps.googleMaps}')">Ir a la ubicación</button>
                            <button type="button" class="btn btn-success mt-2" onclick="translateText('${data[0].name.common}','${data[0].flags.alt ? data[0].flags.alt : 'Esta bandera no tiene descripción'}', '${data[0].name.official}', '${data[0].subregion}')">Traducir</button>
                        </div>
                    </div>
                `;
            } else {
                content = `<h3 class="text-center container mt-2">No existe un país por ese nombre...</h3> `;
            }
           
            containerInfo.innerHTML = content;
        })
        .catch((err) => {
            console.log(err);
            container.innerHTML = `<h3 class="text-center container mt-2 text-danger-emphasis">Ha habido un error en el búsqueda</h3>`;
        });
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

async function translateText(nombre, descripcion, oficial, subregion) {
    const name = await getTranslation(nombre, 'es');
    const description = await getTranslation(descripcion, 'es');
    const oficialName = await getTranslation(oficial, 'es');
    const subregionCountry = await getTranslation(subregion, 'es');

    const nameInfo = document.getElementById("name--info");
    const descriptionInfo = document.getElementById("description--info");
    const oficialInfo = document.getElementById("oficial--info");
    const subregionInfo = document.getElementById("subregion--info");

    nameInfo.innerHTML = `Nombre: <strong>${name}</strong>`;
    descriptionInfo.innerHTML = `<strong>${description}</strong>`;
    oficialInfo.innerHTML = `Nombre Oficial: <strong>${oficialName}</strong>`;
    subregionInfo.innerHTML = `Subregion: <strong>${subregionCountry}</strong>`;
}


