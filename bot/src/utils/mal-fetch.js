const { all_fields, api_base_url } = require('../config.json');
require('dotenv').config();

const headers = { 'X-MAL-CLIENT-ID': process.env.client_id };

module.exports = {

    async fetchAnimeDetails(id) {

        const res = fetch(`${api_base_url}/anime/${id}?${all_fields}`, {
            method: 'GET', headers
        });

        if(!res.ok)
            throw new Error(`HTTP error fetching details: ${res.status}`);

        return res.json();
    },

    async fetchUserStats(user, id) {
        return fetch();
    },

    async animeSearch(request, all_results = true) {
        const data_list = [];
        let result;
        do {
            result = await fetch(request, {
                method: 'GET',
                headers
            })
            .then(response => {
                if(!response.ok)
                    throw new Error(`HTTP error fetching search results: ${response.status}`);
                return response.json();
            });
            data_list.push(...result.data);
        } while((request = result.paging.next) && all_results);
        return data_list;
    },

    appendParams(URL, params) {
        for (const [key, val] in Object.entries(params))
            URL.searchParams.append(key, val);
    },

    async update(request, user) {

        return fetch();
    }
};