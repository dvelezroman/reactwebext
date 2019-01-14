import React, { Component } from "react";

export default class TrafficContainer extends Component {
	renderResponse = response => {
		if (response) {
			return `Response from Analyzing Image: ${response}`;
		}
	};

	renderImages = images => {
		if (images.length > 0) {
			return images.map((image, i) => (
				<li index={i}>{`Image: ${image.url}`}</li>
			));
		}
	};

	render() {
		return (
			<div>
				<li>
					<ul>{this.renderResponse(this.props.response)}</ul>
				</li>
				{/* <div>{this.props.images.length}</div> */}
				<div>
					<li>{this.renderImages(this.props.images)}</li>
				</div>
			</div>
		);
	}
}
