import React, { Component } from "react";
import "../App.css";

export default class ImagesContainer extends Component {
	renderImages = (images, analize) => {
		if (images.length > 0) {
			return images.map((image, i) => (
				<div className="Image" index={i} onClick={() => analize(image.url)}>
					<img src={image.url} alt={image.alt} />
				</div>
			));
		}
	};

	render() {
		return (
			<div>{this.renderImages(this.props.images, this.props.analizeImage)}</div>
		);
	}
}
