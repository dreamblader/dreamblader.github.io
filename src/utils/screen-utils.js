export function addToTarget(root_target, file) {
	return getContent(file)
		.then((res) => {
			root_target.innerHTML = res;
		})
		.catch((err) => {
			console.error(err);
			rej(err);
		});
}

export function getContent(file) {
	return new Promise((res, rej) => {
		const xReq = new XMLHttpRequest();
		xReq.onload = () => {
			if (xReq.status == 200) {
				res(xReq.responseText);
			} else {
				rej(xReq.responseText);
			}
		};
		xReq.open("GET", file);
		xReq.send();
	});
}
