import haversineDistance from 'haversine-distance';

export const DEFAULT_LOCATION = {
	lat: 45.85456252178256,
	lng: 8.406235206880227,
};

export type LatLangData = {
	lat: number;
	lng: number;
	maxDistance: number;
};

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNearLocation(
	values: Omit<LatLangData, 'maxDistance'>,
	meters: number = 500,
) {
	var r = meters / 111300, // = 100 meters
		y0 = values.lat,
		x0 = values.lng,
		u = Math.random(),
		v = Math.random(),
		w = r * Math.sqrt(u),
		t = 2 * Math.PI * v,
		x = w * Math.cos(t),
		y1 = w * Math.sin(t),
		x1 = x / Math.cos(y0);

	return {
		lat: y0 + y1,
		lng: x0 + x1,
	};
}

export async function getRandomStreetView() {
	let radius = 50000;
	async function FindRandomLocation(callback) {
		const streetViewService =
			new google.maps.StreetViewService();
		const latLng = new google.maps.LatLng(
			Math.random() * 180 - 89,
			Math.random() * 360 - 179,
		);
		radius = radius * 10;
		console.log(latLng.lat(), latLng.lng());
		await streetViewService.getPanorama(
			{
				location: latLng,
				radius: radius,
				preference: google.maps.StreetViewPreference.BEST,
				source: google.maps.StreetViewSource.DEFAULT,
			},
			callback,
		);
	}
	function HandleCallback(data, status) {
		if (status === 'OK') {
			const response = data.location.latLng;
			console.log(response.lat(), response.lng(), status);
			return response;
		}
		FindRandomLocation(HandleCallback);
	}
	return await FindRandomLocation(HandleCallback);
}

export function getDistanceInMeters(
	origin: Omit<LatLangData, 'maxDistance'>,
	destination: Omit<LatLangData, 'maxDistance'>,
): number {
	return origin && destination
		? haversineDistance(origin, destination)
		: 0;
	// return google.maps.geometry.spherical.computeDistanceBetween(
	//   new google.maps.LatLng(origin),
	//   new google.maps.LatLng(destination)
	// );
}
export async function getRandomStartPoint() {
	const latLng = new google.maps.LatLng(
		Math.random() * 80 - 80,
		Math.random() * 180 - 180,
	);
	return latLng;
}
