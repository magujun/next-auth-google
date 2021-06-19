import haversineDistance from 'haversine-distance';
import axios from 'axios';

export const DEFAULT_LOCATION = {
	lat: 0.0,
	lng: 0.0,
};
export type LatLangData = {
	lat: number;
	lng: number;
	maxDistance: number;
};

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

interface StreetViewAPI {
	data: {
		copyright: string;
		date: string;
		location: {
			lat: number;
			lng: number;
		};
		pano_id: string;
		status: string;
	};
}

export async function getRandomStreetView(googleStreetViewStaticApiKey: string) {
	const coord = [Math.random() * 180 - 89, Math.random() * 360 - 179];
	console.log('Test coordinates: ', coord);
	const api_key = googleStreetViewStaticApiKey;
	console.log('API KEY: ', api_key);
	const res: StreetViewAPI = await axios.get(
		`https://maps.googleapis.com/maps/api/streetview/metadata?location=${[
			...coord,
		]}&key=${api_key}&radius=50000&source=outdoor`,
	);
	const response = res.data;
	console.log('Response: ', response);
	if (response.status === 'OK') {
		if (response.copyright.includes('Google')) {
			console.log('Response: ', response.location);
			return response.location;
		}
	}
	return await getRandomStreetView(googleStreetViewStaticApiKey);
}

export function getDistanceInMeters(
	origin: Omit<LatLangData, 'maxDistance'>,
	destination: Omit<LatLangData, 'maxDistance'>,
): number {
	return origin && destination ? haversineDistance(origin, destination) : 0;
}
