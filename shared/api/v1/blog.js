const express = require('express');
const axios = require('axios');
const router = express.Router();

const ENV = process.env.NODE_ENV || 'dev';

const RSS = require('rss');

const map = require('lodash/map');
const each = require('lodash/each');
const filter= require('lodash/filter');


const BASE_URL = 'https://dataskeptic.com/';
const RELATED_CONTENT = {
    "/episodes/2017/studying-competition-and-gender-through-chess": [
        {
            uri: "/blog/episodes/2014/economic-modeling-and-prediction-charitable-giving-and-a-follow-up-with-peter-backus",
            title: "More with Peter Backus",
            desc: "Peter Backus is a returning guest on Data Skeptic.  Check out our first conversation with him."
        },
        {
            uri: "/blog/episodes/2015/detecting-cheating-in-chess",
            title: "Detecting Cheating in Chess",
            desc: "Kenneth Regan has developed a methodology for looking at a long series of modes and measuring the likelihood that the moves may have been selected by an algorithm."
        }
    ],
    "/methods/2017/dropout-isnt-just-for-deep-learning": [
        {
            uri: "/blog/episodes/2017/dropout",
            title: "Dropout episode",
            desc: "Our mini-episode on dropout in deep learning"
        },
        {
            uri: "/blog/episodes/2016/adaboost",
            title: "AdaBoost",
            desc: "Our mini-episode on AdaBoost"
        }
    ],
    "/meta/2016/microsoft-connect-conference": [
        {
            uri: "/blog/infrastructure/2016/working-with-azure-blob-store",
            title: "Working with Azure Blob Store",
            desc: "A project I was building required regular appends to files.  I checked out Azure Blob Store to see if it could meet my needs."
        },
        {
            uri: "/blog/tools-and-techniques/2017/trying-the-microsoft-computer-vision-api",
            title: "Trying the Microsoft Computer Vision API",
            desc: "An afternoon spent kicking the tires of this API"
        },
        {
            uri: "/blog/tools-and-techniques/2017/review-of-azure-text-analytics",
            title: "Review of Azure Text Analytics",
            desc: "Summarizing Data Skeptic blog posts with Azure Text Analytics"
        }
    ]
};

const extractFolders = (blogs) => {
    var folders = []
    if (blogs != undefined) {
        for (var i in blogs) {
            var b = blogs[i]
            var pn = b["prettyname"]
            if (pn != undefined) {
                var arr = pn.split("/")
                var level = 0
                if (arr.length >= level+2) {
                    var folder = arr[level+1]
                    folders.push(folder)
                }
            }
        }
        folders = folders.reduce((a, x) => a.includes(x) ? a : [...a, x], []).sort()
    }
    return folders
};

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

const generateKey = ({category, year, name}) => {
    let key = '/' + category;
    if (year) {
        key += '/' + year;
    }
    key += '/' + name;
    return key;
};

export const getPost = (key) => {
    const blogMetaUrl = `https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/dev/blog?env=${ENV}&pn=${key}`;
    return axios.get(blogMetaUrl).then((res) => res.data)
};

export const getPostContent = (rendered) => {
    const contentUrl = `https://s3.amazonaws.com/${ENV}.dataskeptic.com/${rendered}`;
    return axios.get(contentUrl).then((res) => res.data)
};

export const getRelated = (key) => {
  return RELATED_CONTENT[key] || false;
};

router.get('/:category/:year/:name', (req, res) => {
    const {category, year, name} = req.params;

    const key = generateKey({category, year, name});
    getPost(key).then((post) => {
        return getPostContent(post.rendered)
            .then((content) => {
                const related = getRelated(key);

                res.send({
                    success: true,
                    env: ENV,
                    post,
                    content,
                    related,
                    key
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

router.get('/categories', (req, res) => {
    fetchBlogs()
        .then((blogs) => {
            const folders = extractFolders(blogs);

            res.send({
                success: true,
                env: ENV,
                folders
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

const BlogItemModel = ({ title, publish_date, prettyname, desc, author, guid }) => (
    {
        title: title,
        description: desc,
        url: BASE_URL + 'blog' + prettyname,
        guid: guid,
        author: author,
        categories: '',
        date: Date.parse(publish_date)
    }
);

router.get('/rss', (req, res) => {
    fetchBlogs()
        .then((blogs) => {

            let feed = new RSS({
                title: 'Data Skeptic',
                description: 'Data Skeptic is your source for a perseptive of scientific skepticism on topics in statistics, machine learning, big data, artificial intelligence, and data science. Our weekly podcast and blog bring you stories and tutorials to help understand our data-driven world.',
                feed_url: `${BASE_URL}/api/blog/rss`,
                site_url: BASE_URL,
                managingEditor: 'Kyle',
                language: 'en'
            });

            each(blogs, (blog) => {
                // if (blog.env === 'master') { // don't share dev on master
                    feed.item(BlogItemModel(blog));
                // }
            });

            const xml = feed.xml();
            return res.status(200).end(xml)
        })
});


module.exports = router;