import express from 'express';
import getMeta from '../../modules/blog/getMeta';
import getContent from '../../modules/blog/getContent';

const router = express.Router();

const getPrettyName = (category, year, title) => {
    let prettyName = `/${category}`;

    if (year) {
        prettyName += '/' + year;
    }

    prettyName += '/' + title;

    return prettyName;
};


router.get('/:category/:title', function(req, res) {
    const {category, title} = req.params;
    const prettyName = getPrettyName(category, null, title);

    const db_env = 'dev';
    const uri = "https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/" + env + "/blog?env=" + db_env + "&pn=" + prettyName;
    res.send({
        message: 'GET handler for /blog ' + prettyName + ' route.',
        uri
    });
});

router.get('/:category/:year/:title', function(req, res) {
    const {category, year, title} = req.params;
    const prettyName = getPrettyName(category, year, title);

    getMeta(prettyName)
        .then((data) => {
            return data.rendered;
            // return getContent(data.rendered)
            //     .then((content) => {
            //         return {
            //             content
            //         }
            //     })
        })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        })

    /*const uri = "https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/" + env + "/blog?env=" + db_env + "&pn=" + prettyName;
    res.send({
        message: 'GET handler for /blog ' + prettyName + ' route.',
        uri
    });*/
});

module.exports = router;
