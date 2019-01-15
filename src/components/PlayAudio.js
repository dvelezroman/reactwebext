import React, { Component } from "react";
import Sound from "react-sound";
//import soundfile from "../assets/sound.mp3";

export default class PlayAudio extends Component {
	render() {
		const { audioFile } = this.props;
		return <Sound url={audioFile} playStatus={Sound.status.PLAYING} />;
	}
}
