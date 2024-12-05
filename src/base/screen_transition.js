const SCREENS = {
	start: "index.html",
	cv: "screens/cv.html",
	play: "screens/playground.html",
	home: "screens/home.html",
	project: "screens/projects.html",
	game: "https://dreamblader.github.io/dreamblade/",
};

export function startTransition(transition_element, root_target, placeId) {
	const frames = [
		{ backgroundColor: "transparent" },
		{ backgroundColor: "black" },
	];
	const duration = {
		duration: 1000,
		fill: "forwards",
	};
	transition_element.style.visibility = "visible";
	const t = transition_element.animate(frames, duration);
	t.onfinish = (e) => {
		addToTarget(root_target, getPlace(placeId)).then(
			() => {
				t.reverse();
				t.onfinish = null;
			},
			(err) => {
				console.log(err);
			}
		);
	};
}

function addToTarget(root_target, file) {
	return new Promise((res, rej) => {
		const xReq = new XMLHttpRequest();
		xReq.onload = () => {
			try {
				root_target.innerHTML = xReq.responseText;
				res();
			} catch (err) {
				rej(err);
			}
		};
		xReq.open("GET", file);
		xReq.send();
	});
}

function getPlace(placeId) {
	const place = SCREENS[placeId];
	if (place.startsWith("http")) {
		window.location.href = place;
	} else {
		return SCREENS[placeId];
	}
}
