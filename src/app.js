//dependency
const cron = require('node-cron')
const api = require('./apiClient');
const { fetchItem } = require('./fetcher');

//initiate apiClient
const API = new api(require('../config/api.json'));
console.log("Updater running");

//run fetcher every hour
cron.schedule('0 * * * *', () => {

    let prices = [];

    //get data from api
    API.getItem();
    API.getProvider();

    //when all request done
    API
        .waitForFetch()
        .then(() => {
            //asynchronous fetching
            Promise
                .all(API.items.map(async(item) => {

                    //find provider info for the current item
                    let provider = API.providers.find(provider => provider.id === item.ProviderId);
                    //fetch data from provider (website)
                    prices.push({...await fetchItem(item.url, provider), ItemId: item.id });

                }))
                .then(() => {
                    if (prices.length > 0) {
                        //when the fetching of all items is completed send it back to api
                        API.sendPrice(prices)
                            .then((response) => {
                                console.log('Price updated');
                            })
                    } else {
                        console.log('No price to update');
                    }

                })
        })
        .catch(err => {
            console.log(err.message);
        })
});