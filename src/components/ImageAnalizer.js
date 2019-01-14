import React, { Component } from "react";

export default class TrafficContainer extends Component {
	renderResponse = response => {
		if (response) {
			return `Response from Analyzing Image: ${response}`;
		}
	};

	render() {
		return <div>{this.renderResponse(this.props.resultToSpeak)}</div>;
	}
}
