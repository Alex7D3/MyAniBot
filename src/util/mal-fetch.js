const { all_fields, api_base_url } = require('../config.json');
require('dotenv').config();

const get_settings = {
    method: 'GET',
    headers: { 'X-MAL-CLIENT-ID': process.env.client_id },
    redirect: 'follow'
};

const put_settings = {
    method: 'PUT',
    headers: { 'X-MAL-CLIENT-ID': process.env.client_id },
    redirect: 'follow'
};

const sleep = async t => new Promise(res => setTimeout(res, t));

module.exports = {

    sleep,
    /**
     * @param {list} reqtype
     * @param {object} options
     * @param {...string} details
     * @return {string}
     */
    async fetchAnimeDetails(id) {
        return fetch(`${api_base_url}/anime/${id}?${all_fields}`, get_settings)
            .then(response => {
                if(!response.ok)
                    throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            });
    },

    async fetchList(request, all_results = true) {
        const data_list = [];
        let result;
        do {
            result = await fetch(request, get_settings)
            .then(response => {
                if(!response.ok)
                    throw new Error(`HTTP error: ${response.status}`);
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

    async update() {
        return fetch();
    }
};