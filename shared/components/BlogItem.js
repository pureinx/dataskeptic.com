import React from "react"
import ReactDOM from "react-dom"
import { Link } from 'react-router'
import { connect } from 'react-redux'
import ReactDisqusComments from 'react-disqus-comments'

import LatestEpisodePlayer from "./LatestEpisodePlayer"
import MailingListBlogFooter from "./MailingListBlogFooter"
import BlogLink from './BlogLink'

class BlogItem extends React.Component {
	constructor(props) {
		super(props)
		var title = this.props.title
		var dispatch = this.props.dispatch
		var pathname = this.props.pathname

	    dispatch({type: "SET_TITLE", payload: title })
	    dispatch({type: "LOAD_BLOG", payload: {dispatch, pathname} })
	}

    handleNewComment(comment) {
        console.log(comment.text);
    }

    onClick(event) {
        var href = event.target.href
        var b = "/blog/"
        var i = href.indexOf(b)
        if (i >= 0) {
            href = href.substring(i+b.length-1, href.length)
            var dispatch = this.props.dispatch
            dispatch({type: "LOAD_BLOG", payload: {dispatch, pathname: href} })
        }
    }

	render() {
		var oepisodes = this.props.episodes.toJS()
		var oblogs = this.props.blogs.toJS()
		var osite = this.props.site.toJS()
		var disqus_username = osite.disqus_username
		var blog_focus = oblogs.blog_focus
		var title = this.props.title
		var isEpisode = false
		var top = <div></div>
		if (blog_focus.blog != undefined && blog_focus.blog.guid != undefined) {
			var ep = oepisodes.episodes_map[blog_focus.blog.guid]
			try {
				top = (
					<div className="home-player">
						<LatestEpisodePlayer guid={blog_focus.blog.guid} />
					</div>
				)
				isEpisode = true					
			}
			catch (err) {
				console.log(err)
				top = <div></div>
			}
		}
		var bot = <div></div>
		if (isEpisode) {
			var tm = oblogs.transcript_map
			if (tm != undefined) {
				var guid = blog_focus.blog.guid
				var b = tm[guid]
				if (b != undefined) {
					var pn = "/blog" + b.prettyname
					var bot = (
						<div className='blog-transcript-link'>
							Read the full transcript here:
							<Link onClick={this.onClick.bind(this)} to={pn}>{title} transcripts</Link>.
						</div>
					)					
				}
			}
		}
		var content = blog_focus.content || "Loading...."
		if (content == "") {
			content = "Loading....."
		}
		
		var uid = 'http://dataskeptic.com/blog' + this.props.pathname
		
		return (
			<div className="center">
				{top}
				<span dangerouslySetInnerHTML={{__html: content}} />
				{bot}
				<MailingListBlogFooter />
	            <ReactDisqusComments
	                shortname={disqus_username}
	                identifier={uid}
	                title={title}
	                url={uid}
	                onNewComment={this.handleNewComment}/>
			</div>
		)
	}
}
export default connect(state => ({ site: state.site, episodes: state.episodes, blogs: state.blogs }))(BlogItem)

