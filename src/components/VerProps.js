import React, { Component } from "react";

export default class TrafficContainer extends Component {
	render() {
		return (
			<div>
				<ul>
					<li>{this.props.token}</li>
					<li>{this.props.playing ? "Playing" : "Not playing"}</li>
					<li>{this.props.time}</li>
					<li>{this.props.audioFile ? "Si hay" : "No hay"}</li>
				</ul>
			</div>
		);
	}
}
