const axios = require('axios');
import formatMetaUrl from './formatMetaUrl';

const getMeta = (prettyName) => {
    const metaUrl = formatMetaUrl(prettyName);

    return axios.get(metaUrl)
        .then(function(result) {
            return result.data;
        })
};

export default getMeta;