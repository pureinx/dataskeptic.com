const notFound = require('./notFound');

export const endpoints = [
    {url: 'not_found', method: 'get', handler: notFound},
    {url: 'blogs', method: 'get', handler: require('./blogs')},
    {url: 'content', method: 'get', handler: require('./content')},
    {url: 'contributors', method: 'get', handler: require('./contributors')},
    {url: 'email', method: 'get', handler: require('./email')},
    {url: 'invoices', method: 'get', handler: require('./invoices')},
    {url: 'orders', method: 'get', handler: require('./orders')},
    {url: 'products', method: 'get', handler: require('./products')},
    {url: 'slack', method: 'get', handler: require('./slack')},
];

const urlMatch = (candidate, url) => {
    console.info('match', candidate, url);
    return url.match(candidate);
};

export default function handler(baseUrl, req, res) {
    let matchedEndpoint = endpoints.filter(endpoint => urlMatch(`${baseUrl}/${endpoint.url}`, req.url));

    console.dir(matchedEndpoint);

    if (matchedEndpoint.length === 0) {
        matchedEndpoint = endpoints[0];
    } else {
        matchedEndpoint = matchedEndpoint[0];
    }

    console.info('notfound handler');
    console.dir(matchedEndpoint);

    if (matchedEndpoint) {
        matchedEndpoint.handler.default(req, res);
    }
};