import axios from 'axios';

let api;

function getApi() {
    api = axios.create({
        baseURL: 'https://api.thecatapi.com/v1/',
        headers: { 'x-api-key': 'e9247d15-c6dc-4614-8481-053a6e3c6de8' }
    });
}

if (api === undefined) {
    getApi();
}

export { api };
