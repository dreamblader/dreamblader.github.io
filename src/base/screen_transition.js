const SCREENS = {
	start: "index.html",
	cv: "screens/cv.html",
	play: "screens/playground.html",
	home: "screens/home.html",
	project: "screens/projects.html",
	game: "https://dreamblader.github.io/dreamblade/",
};

export function startTransition(transition_element) {
	const frames = [
		{ backgroundColor: "transparent" },
		{ backgroundColor: "black" },
	];
	const duration = {
		duration: 1000,
		fill: "forwards",
	};
	transition_element.style.visibility = "visible";
	return transition_element.animate(frames, duration);
}

export function addToTarget(root_target, file) {
	return new Promise((res, rej) => {
		const xReq = new XMLHttpRequest();
		xReq.onload = () => {
			if (xReq.status == 200) {
				root_target.innerHTML = xReq.responseText;
				res();
			} else {
				rej(xReq.responseText);
			}
		};
		xReq.open("GET", file);
		xReq.send();
	});
}

export function getPlace(placeId) {
	const place = SCREENS[placeId];
	if (place && place.startsWith("http")) {
		window.location.href = place;
	} else {
		return SCREENS[placeId];
	}
}
