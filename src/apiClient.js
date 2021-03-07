const axios = require('axios').create({ url: '/', baseURL: 'http://127.0.0.1:3000' });

class apiClient {

    constructor(token) {
        this.token = token;
        this.items = [];
        this.providers = [];
        this.promises = [];
    }

    whenAllDone = (callback) => {
        return Promise.all(this.promises).then(callback);
    }

    //get token
    auth = async() => {
        let promise = axios
            .post('auth', this.user)
            .then(response => {
                this.token = response.data.token;
            })
            .catch(error => {
                console.log('Unable to get token from api')
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
            .catch(error => {
                console.log('Unable to get Item from api')
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
            .catch(error => {
                console.log('Unable to get provider');
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

module.exports = apiClient;