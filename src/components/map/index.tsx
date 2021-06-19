import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import React from 'react';
import { useGameContext } from '../../context/gameContext';

const mapContainerStyle = {
	height: '300px',
	width: '450px',
};

// const initialPosition = getRandomStartPoint();

const MAX_DISTANCE_GOAL = 100;
const MAX_DISTANCE_START = 800;

type MapProps = {
	googleMapsApiKey: string;
};

type Position = {
	lat: number;
	lng: number;
};

export default function Map({ googleMapsApiKey }: MapProps) {
	const { setupGame, sendGuessPoint, startPoint, goalPoint, distance, guessPoint } =
		useGameContext();

	const handleMapClick = (e: any) => {
		const { latLng } = e;

		const destination = {
			lat: latLng.lat() as number,
			lng: latLng.lng() as number,
		};

		sendGuessPoint(destination);
	};

	const handleMapLoad = (map: google.maps.Map) => {
		setupGame();
	};

	return (
		<>
			<strong>{distance}</strong>
			<LoadScriptNext googleMapsApiKey={googleMapsApiKey}>
				<GoogleMap
					mapContainerStyle={mapContainerStyle}
					center={startPoint}
					zoom={1}
					onClick={handleMapClick}
					clickableIcons={false}
					options={{
						clickableIcons: false,
						disableDefaultUI: true,
					}}
					onLoad={handleMapLoad}>
					<Marker position={goalPoint} />
					<Marker position={guessPoint} />
				</GoogleMap>
			</LoadScriptNext>
		</>
	);
}
