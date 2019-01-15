/*global chrome*/
import React, { Component } from "react";
import axios from "axios";
import Sound from "react-sound";
import "./App.css";
import { getCurrentTab } from "./common/Utils";
import ImagesContainer from "./components/ImagesContainer";
import ImageAnalizer from "./components/ImageAnalizer";
import VerProps from "./components/VerProps";
import PlayAudio from "./components/PlayAudio";

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
			audioFile: false,
			resultToSpeak: "",
			token: "",
			time: 0,
			playing: false
		};
	}

	translateText = text => {
		const headers = {
			"Content-type": "application/json",
			"Ocp-Apim-Subscription-Key": TRANSLATEKEY
		};
		return axios.post(
			"https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=es",
			[{ text: text }],
			{ headers: headers }
		);
	};

	analizeImage = async url => {
		const headers = {
			"Content-Type": "application/json",
			"Ocp-Apim-Subscription-Key": COMPUTERVISIONKEY
		};
		let resultToSpeak = await axios
			.post(
				`https://eastus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description&language=en`,
				{ url: url },
				{ headers: headers }
			)
			.then(response => {
				return `With a confidence of ${Math.round(
					response.data.description.captions[0].confidence * 100
				)}%, It is ${response.data.description.captions[0].text}`;
			})
			.catch(error => "error");
		if (resultToSpeak !== "error") {
			let translatedText = await this.translateText(resultToSpeak).then(
				response => response.data[0].translations[0].text
			);
			this.setState({ resultToSpeak: translatedText }); // hasta aqui todo bien
			let time = this.state.time;
			let token = this.state.token;
			let tokenTime = Math.floor(Date.now() / 1000) - Math.floor(time / 1000);
			if (time === 0 || tokenTime > 590) {
				// get another token
				try {
					token = await this.getToken(BINGSPEECHKEY).then(res => res.data);
				} catch (error) {
					alert(error);
				}
				time = Date.now();
			}
			let audioFile = await this.text2Speech(token).then(res => res.body);
			this.setState({ token: token, time: time, audioFile: audioFile });
		}
	};

	getToken = apiKey => {
		const headers = {
			"Ocp-Apim-Subscription-Key": `${apiKey}`,
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": "0"
		};
		return axios.post(
			"https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken",
			{ body: {} },
			{ headers: headers }
		);
	};

	text2Speech = token => {
		const headers = {
			"X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
			Authorization: `bearer ${token}`,
			"Content-Type": "application/ssml+xml",
			"User-Agent": "225"
		};
		let xmlString = `
		<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='es-MX'>
				<voice xml:lang='es-MX' xml:gender='Female' name='Microsoft Server Speech Text to Speech Voice (es-MX, HildaRUS)'>
					${this.state.resultToSpeak}
				</voice>
			</speak>`;
		const url = "https://eastus.tts.speech.microsoft.com/cognitiveservices/v1";
		let xhr = new XMLHttpRequest();
		xhr.open("POST", encodeURI(url), true);
		xhr.setRequestHeader("Content-Type", "application/ssml+xml");
		xhr.setRequestHeader(
			"X-Microsoft-OutputFormat",
			"audio-16khz-128kbitrate-mono-mp3"
		);
		xhr.setRequestHeader("Authorization", `bearer ${token}`);
		xhr.setRequestHeader("User-Agent", "225");
		xhr.responseType = "blob";
		let audio = new Audio();
		xhr.onload = function(evt) {
			let blob = new Blob([xhr.response], { type: "audio/mpeg" });
			let objectUrl = URL.createObjectURL(blob);
			audio.src = objectUrl;
			// Release resource when it's loaded
			audio.onload = function(evt) {
				URL.revokeObjectURL(objectUrl);
			};
			audio.play();
		};
		xhr.send();

		// return axios.post(
		// 	"https://eastus.tts.speech.microsoft.com/cognitiveservices/v1",
		// 	xmlString,
		// 	{ headers: headers }
		// );
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
						<VerProps
							playing={this.state.playing}
							time={this.state.time}
							audioFile={true}
						/>
						<ImageAnalizer resultToSpeak={this.state.resultToSpeak} />
						<ImagesContainer
							images={this.state.images}
							analizeImage={this.analizeImage}
						/>
						{/* <Sound
							url={this.state.audioFile}
							playStatus={Sound.status.PLAYING}
						/> */}
					</p>
				</div>
			</div>
		);
	}
}

export default App;
