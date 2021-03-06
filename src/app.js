const api = require('./apiClient');
const { fetchItem } = require('./fetcher');
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJzY3JpcHRVcGRhdGVyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE1MDU5NjQxLCJleHAiOjE2MTU1NzgwNDF9.KoJEXF0ztp-1v7MaexFuQIb9cFQxMePaT7zlbDqfYDM";

let API = new api(TOKEN);

let prices = [];

//get data from api
API.getItem();
API.getProvider();

//when all request done
API.whenAllDone(() => {
    Promise.all(API.items.map(async(item) => {
            //find provider info for the current item
            let provider = API.providers.find(provider => provider.id === item.ProviderId);

            //fetch data from provider (website)
            prices.push({...await fetchItem(item.url, provider), itemId: item.id });

        }))
        .then(() => {
            prices.forEach((price) => {
                console.log(price)
            })
        })
})