/*global chrome*/

chrome.runtime.onMessage.addListener(function(request, sender, response) {
	if (request.type === "getImages") {
		let images = document.getElementsByTagName("img");
		let imagesList = [];
		for (var i = 0; i < images.length; i++) {
			if (
				(images[i].src.toLowerCase().endsWith(".jpg") ||
					images[i].src.toLowerCase().endsWith(".png")) &&
				(images[i].width > 64 && images[i].height > 64)
			) {
				imagesList.push({ url: images[i].src, alt: images[i].alt });
			}
		}
		response(imagesList);
	}
});
