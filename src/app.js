const api = require('./apiClient');
const { fetchItem } = require('./fetcher');
const TOKEN = process.env.TOKEN || require('../config/token.json').TOKEN;

let API = new api(TOKEN);

let prices = [];

//print time to fetch
console.time("Time to fetch");

//get data from api
API.getItem();
API.getProvider();

//when all request done
API
    .waitForFetch()
    .then(() => {
        //asynchronous fetching
        Promise.all(API.items.map(async(item) => {

                //find provider info for the current item
                let provider = API.providers.find(provider => provider.id === item.ProviderId);
                //fetch data from provider (website)
                prices.push({...await fetchItem(item.url, provider), ItemId: item.id });

            }))
            .then(() => {
                //when the fetching of all items is completed send it back to api
                API.sendPrice(prices)
                    .then((response) => {
                        console.log('Price updated');
                        //print time to fetch
                        console.timeEnd("Time to fetch");
                    })
            })
    })
    .catch(err => {
        console.log(err.message);
    })