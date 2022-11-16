import './css/styles.css';

const DEBOUNCE_DELAY = 300;

// ===========================
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';



const BASE_URL = 'https://restcountries.com/v3.1';


const refs = {
    inputSearch: document.querySelector('#search-box'),
    listCountry: document.querySelector('.country-list'),
    infoCountry: document.querySelector('.country-info'),
};

refs.inputSearch.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY))

function onInputSearch(evt) {
    const qeury = evt.target.value;
    
    if (!qeury) {
        refs.listCountry.innerHTML = '';
        refs.infoCountry.innerHTML = '';
        return
    }
    
    fetchCountries(qeury)
        .then(data => {
           
            if (!data) {
                refs.listCountry.innerHTML = '';
                refs.infoCountry.innerHTML = '';
                return
            }
                       
            if (data.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
                return;
            }

            if (data.length > 1 && data.length < 10) {
                createCountryList(data);
                return;
            }
            
            if (data.length > 0) {
                createCountryInfo(data);
                return;
            }
        });
    
}


function createCountryInfo(country) {
    // console.log("I'm here too")
    // console.log(country);
    const markup = country
        .map(({ name, capital, population, flags, languages }) => {
            const lang = Object.values(languages).join(','); // create array languages
            return `
                <li>
                    <div>
                        <img src="${flags.svg}" alt="${name.official}">
                        <h1>${name.official}</h1>
                    </div>
                    <p>Capital of ${name.official} is <b>${capital}</b></p>
                    <p>Population is <b>${population}</b> people</p>
                    <p>Language is <b>${lang}</b></p>
                </li>
            `;
        });
    refs.listCountry.innerHTML = "";
    refs.infoCountry.innerHTML = markup;
}


function createCountryList(countries) {
    const markup = countries
        .map(({ name: { official }, flags: { svg } }) => {
            return `
                <li class="country-list-item">
                    <img src="${svg}" alt="${official}">
                    <p>${official}</p>
                </li>
            `;
        })
        .join("");
    refs.listCountry.innerHTML = markup;
    refs.infoCountry.innerHTML = "";
}
