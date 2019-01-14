/*global chrome*/
import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import { getCurrentTab } from "./common/Utils";
import ImagesContainer from "./components/ImagesContainer";
import ImageAnalizer from "./components/ImageAnalizer";

const COMPUTERVISIONKEY = "4994fafce3424c049cf59da0b9d203ad";
const BINGSPEECHKEY = "85eeba70a719471a9791865ac9fbb90f";
const TRANSLATEKEY = "ac70922ac26c44ee8592529da637c7d1";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			traffic: {},
			error: {},
			images: [],
			resultToSpeak: ""
		};
	}

	translateText = text => {
		const headers = {
			"Content-type": "application/json",
			"Ocp-Apim-Subscription-Key": TRANSLATEKEY
		};
		axios
			.post(
				"https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=es",
				[{ text: text }],
				{ headers: headers }
			)
			.then(response => {
				let translatedText = response.data[0].translations[0].text;
				this.setState({ resultToSpeak: translatedText });
			})
			.catch(error => this.setState({ resultToSpeak: error }));
	};

	analizeImage = url => {
		const headers = {
			"Content-Type": "application/json",
			"Ocp-Apim-Subscription-Key": COMPUTERVISIONKEY
		};
		let resultToSpeak;
		axios
			.post(
				`https://eastus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description&language=en`,
				{ url: url },
				{ headers: headers }
			)
			.then(response => {
				resultToSpeak = `With a confidence of ${Math.round(
					response.data.description.captions[0].confidence * 100
				)}%, I think it's ${response.data.description.captions[0].text}`;
				this.translateText(resultToSpeak);
			})
			.catch(error => {
				this.setState({ error });
			});
	};

	componentDidMount() {
		getCurrentTab(tab => {
			chrome.tabs.sendMessage(
				tab.id,
				{
					type: "getImages",
					tabId: tab.id
				},
				response => {
					if (response) {
						this.setState({ images: response });
					}
				}
			);
		});
	}

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<h1 className="App-title">Image Analyzer</h1>
				</div>
				<div className="App-images">
					<p className="App-Intro">
						<ImageAnalizer resultToSpeak={this.state.resultToSpeak} />
						<ImagesContainer
							images={this.state.images}
							analizeImage={this.analizeImage}
						/>
					</p>
				</div>
			</div>
		);
	}
}

export default App;
