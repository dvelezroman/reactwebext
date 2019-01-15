import axios from "axios";

function getToken(apiKey) {
	const header = {
		"Ocp-Apim-Subscription-Key": apiKey,
		"Content-type": "application/x-www-form-urlencoded",
		"Content-Length": 0
	};
}

export default (TextToSpeech = {
	getToken
});
