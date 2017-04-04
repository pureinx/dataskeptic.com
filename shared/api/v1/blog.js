const express = require('express');
const axios = require('axios');
const router = express.Router();

const ENV = process.env.NODE_ENV || 'dev';

const fetchBlogs = () => {
    const uri = "https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/" + env + "/blogs?env=" + ENV;
    return axios.get(uri).then((res) => res.data)
};

router.get('/', function (req, res) {
    fetchBlogs()
        .then((data) => {
            res.send({
                success: true,
                env: ENV,
                blogs: data
            })
        })
        .catch((error) => {
            res.send({
                success: false,
                error
            })
        })
});

export const getPost = ({category, year, name}) => {
    let key = '/' + category;
    if (year) {
        key += '/' + year;
    }
    key += '/' + name;

    const blogMetaUrl = `https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/dev/blog?env=${ENV}&pn=${key}`;
    return axios.get(blogMetaUrl).then((res) => res.data)
};

export const getPostContent = (rendered) => {
    const contentUrl = `https://s3.amazonaws.com/${ENV}.dataskeptic.com/${rendered}`;
    return axios.get(contentUrl).then((res) => res.data)
};

router.get('/:category/:year/:name', function (req, res) {
    const {category, year, name} = req.params;

    getPost({category, year, name}).then((post) => {
        return getPostContent(post.rendered)
            .then((content) => {
                res.send({
                    success: true,
                    env: ENV,
                    post,
                    content
                })
            })
    })
        .catch((error) => {
            res.send({
                success: false,
                error,
                params: req.params
            })
        })
});

router.get('/:category/:name', function (req, res) {
    const {category, name} = req.params;

    Promise.all([
        getPost({category, name}),
        getPostContent(name)
    ]).then((res) => {
        const post = res[0];
        const content = res[1];

        res.send({
            success: true,
            env: ENV,
            post,
            content
        })
    })
    .catch((error) => {
        res.send({
            success: false,
            error,
            params: req.params
        })
    })
});

module.exports = router;