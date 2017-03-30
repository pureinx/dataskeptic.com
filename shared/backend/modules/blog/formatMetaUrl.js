const axios = require('axios');
const env = 'dev';
const db_env = 'dev';

const formatMetaUrl = (prettyName) => {
    return `https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/${env}/blog?env=${db_env}&pn=${prettyName}`;
};

export default formatMetaUrl;