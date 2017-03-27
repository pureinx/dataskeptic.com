const notFound = require('./notFound');

export const endpoints = [
    { url: 'not_found', handler: notFound },
    { url: 'blogs', handler: require('./blogs') },
    { url: 'content', handler: require('./content') },
    { url: 'contributors', handler: require('./contributors') },
    { url: 'email', handler: require('./email') },
    { url: 'invoices', handler: require('./invoices') },
    { url: 'orders', handler: require('./orders') },
    { url: 'products', handler: require('./products') },
    { url: 'slack', handler: require('./slack') },
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

    matchedEndpoint.handler.default(req, res);
};