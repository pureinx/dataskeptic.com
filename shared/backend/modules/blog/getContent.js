const axios = require('axios');

const getContent = (renderedPath, env = 'dev') => {
    const postUrl = "https://s3.amazonaws.com/" + env + 'dataskeptic.com/' + renderedPath;

    return axios.get(postUrl)
        .then(function(result) {
            return result.data
        })
};

export default getContent;