import React from "react"
import ReactDOM from "react-dom"
import ReactHowler from 'react-howler'

import PlayerProgressBar from './PlayerProgressBar'

export default class Player extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			position: 0,
			loaded: false,
			howler: undefined
		}

		this.update = this.update.bind(this)
		setInterval(this.update, 1000)
	}

	onPlayerSeekChange(pos) {
		console.log("onPlayerSeekChange")
		var howler = this.state.howler
		this.setState({position: pos})
		if (howler != undefined) {
			var duration = this.state.howler.duration()
			howler.seek(pos / 100 * duration)
		}
	}

	update() {
		console.log("update")
		if (this.state.howler != undefined) {
			var seek = this.state.howler.seek()
			console.log(["seek", seek])
			var duration = this.state.howler.duration()
			var position = 100.0 * seek / duration
			if (!isNaN(position)) {
				console.log(position)
				console.log(this)
				var loaded = true
				this.setState({position, loaded})
			} else {
				var loaded=false
				this.setState({loaded})
				// TODO: Still loading, reflect that in the state
			}
		}
	}

	pad(n, width) {
		var z = '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
	render() {
		var config = this.props.config
		if (config.has_shown) {
			var episode = config.episode
			var is_playing = config.is_playing
			var progress = this.state.position
			var howler = ""
			var title = "[No episode loaded yet]"
			var duration = "--:--"
			if (episode != undefined) {
				var mp3 = episode.mp3
				howler = <ReactHowler src={mp3} playing={is_playing} ref={(ref) => this.state.howler = ref} loop={false} />
				title = episode.title
				duration = episode.duration
				var arr = duration.split(":")
				if (arr.length == 2) {
					var min = parseInt(arr[0])
					var sec = parseInt(arr[1])					
				} else {
					var hr  = parseInt(arr[0])
					var min = parseInt(arr[1]) + 60 * hr
					var sec = parseInt(arr[2])
				}
				var d = min * 60 + sec
				var p = 1.0 * d * progress/100
				var left = d - p
				var m = left / 60
				min = Math.floor(m)
				sec = Math.floor(left - min * 60)
				duration = min + ":" + this.pad(sec, 2)

			}
			var button = undefined
			if (!this.props.episodes_loaded) {
				button = (<button class="episode-button-sm">?</button>)
			} else {
				if (this.state.loaded) {
					if (is_playing) {
						button = (<button class="episode-button-sm" onClick={this.props.onPlayToggle.bind(this, episode)}>&#10073;&#10073;</button>)
					} else {
						button = (<button class="episode-button-sm" onClick={this.props.onPlayToggle.bind(this, episode)}>&#9658;</button>)
					}
				} else {
					button = (<button class="episode-button-sm" onClick={this.props.onPlayToggle.bind(this, episode)}>?</button>)
				}
			}
			return (
				<div class="thin-player-container">
					<div class="center">
						<div class="player" className="thin-player">
							<div class="player-inner">
								{button}
								<div class="player-title-container"><span class="player-title">{title}</span></div>
								<PlayerProgressBar playing={is_playing} progress={progress} onPlayerSeekChange={this.onPlayerSeekChange.bind(this)} />
								<div class="player-duration-container"><span class="player-duration">{duration}</span></div>
								{howler}
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div></div>
			)
		}
	}
}
