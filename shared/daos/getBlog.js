import axios from "axios"

import { extractFolders } from '../utils/blog_utils'
import getBlogContent from './getBlogContent'

export default function getBlog(dispatch, env, prettyname) {
	var db_env = env
	if (db_env == "prod") {
		db_env = "master"
	} else {
		console.log("Network: retrieving single blog metadata: " + prettyname)
	}
	var uri = "https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/" + env + "/blog?env=" + db_env + "&pn=" + prettyname
	console.log('fetch', uri);
	// TODO: check cache
	axios
		.get(uri)
		.then(function(result) {
			console.dir(result);

			const blog = result['data'];
			if (blog) {
				const uri = blog["uri"];
				if (uri) {
					dispatch({type: "ADD_BLOG", payload: {blog} });
					getBlogContent(dispatch, blog, env)
				} else {
					console.log("Did not get blog back as expected");
					console.log(result)
				}
			} else {
				console.log("Didn't get blog back as expected");
				console.log(uri)
				console.log(result)
			}
		})
		.catch((err) => {
			console.error(err)
			dispatch({type: "FETCH_BLOGS_ERROR", playload: err})
		})

}

