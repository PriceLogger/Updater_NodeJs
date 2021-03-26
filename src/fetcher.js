const http = require('https');

const fetchItem = (url, tag) => {
    url = extractUrl(url);

    const httpOptions = {
        host: url.hostname,
        port: 443,
        path: url.path,
        timeout: 300,
    };

    return new Promise((resolve) => {
        //page reading
        http
            .get(httpOptions, (res) => {
                res.setEncoding("utf8");
                let body;
                res.on("data", (chunk) => {
                    //save the html page in a string
                    body += chunk;
                })
                res.on("end", () => {
                    //fetch the data of the page
                    //resolve is a callback
                    resolve({...extractInformation(body, tag) });
                })
            })
            .on('error', (err) =>
                console.log('Unable to Contact : ' + httpOptions.host)
            );
    })
}

const extractInformation = (data, tag) => {
    //find the index of the tag on the page
    let get = (tag) => {
        let start = data.indexOf(tag) + tag.length;
        while (start < data.length && data.charAt(start) !== '>') {
            start++;
        }

        //find the index of the closing tag
        let end = start + 1;
        while (end < data.length && data.charAt(end) !== '<') {
            end++;
        }

        //return what is between start and end
        return data.substring(start + 1, end);
    }

    let price = get(tag.priceTag).replace(/([^\d.,])/gi, ""); //keep only number , comma and dot

    return { price: price };
}

// Divide url in two part (hostname and path)
// Exemple : 
//    - Hostname : www.topchat.com
//    - Path /pages/detail2_cat_est_micro_puis_rubrique_est_wdi_sata_puis_ref_est_in20005234.html 
const extractUrl = (url) => {
    let hostname;
    let path;

    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove "?"
    hostname = hostname.split('?')[0];

    //find path
    path = url.substring(url.indexOf(hostname) + hostname.length, url.length);

    return { hostname: hostname, path: path };
}

module.exports = { fetchItem }