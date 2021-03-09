const axios = require('axios').create({ url: '/', baseURL: 'http://127.0.0.1:3000', timeout: 1000, });

class apiClient {

    constructor(token) {
        this.token = token;
        this.items = [];
        this.providers = [];
        this.promises = [];
    }

    waitForFetch = () => {
        return Promise.all(this.promises).catch(err => {
            if (!err || !err.response || !err.response.data) throw err;
            throw new APIError(err);
        });
    }

    //get token
    auth = async() => {
        let promise = axios
            .post('auth', this.user)
            .then(response => {
                this.token = response.data.token;
            })
        this.promises.push(promise)
        return promise;
    }

    //get all item
    getItem = () => {
        let promise = axios
            .get('item')
            .then(response => {
                this.items = response.data;
            })
        this.promises.push(promise)
        return promise;
    }

    //get provider (tag) 
    getProvider = () => {
        let promise = axios
            .get('provider', { headers: { authorization: this.token } })
            .then(response => {
                this.providers = response.data;
            })
        this.promises.push(promise)
        return promise;
    }

    sendPrice = (prices) => {
        let promise = axios
            .post('item/price', [...prices], { headers: { authorization: this.token } })
            .then(response => {
                console.log('Price updated');
            })
            .catch(error => {
                console.log('Unable to send fetched price');
            })
        this.promises.push(promise)
        return promise;
    }
}

class APIError extends Error {
    constructor(err) {
        super(err.response.data.message);
        Object.keys(err.response.data.err).forEach(key => {
            this[key] = err.response.data.err[key]
        });
    }
}

module.exports = apiClient;