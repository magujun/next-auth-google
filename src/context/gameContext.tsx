import { createContext, ReactElement, useContext, useState } from 'react';
import {
	DEFAULT_LOCATION,
	getDistanceInMeters,
	getRandomNearLocation,
	getRandomStreetView,
} from '../services/map';

type Point = {
	lat: number;
	lng: number;
};

type GameData = {
	hasStart: boolean;
	goalPoint: Point;
	startPoint: Point;
	guessPoint: Point;
	streetPoint: Point;
	distance: number;
	sendGuessPoint: (point: Point) => void;
	setStreetPoint: (point: Point) => void;
	setupGame: () => void;
};

const GameContext = createContext({} as GameData);

type GameProviderProps = {
	children: ReactElement;
};

export const GameProvider = ({ children }: GameProviderProps) => {
	const [hasStart, setHasStart] = useState(false);
	const [streetPoint, setStreetPoint] = useState(DEFAULT_LOCATION as Point);
	const [goalPoint, setGoalPoint] = useState(DEFAULT_LOCATION as Point);
	const [startPoint, setStartPoint] = useState(DEFAULT_LOCATION as Point);
	const [guessPoint, setGuessPoint] = useState(DEFAULT_LOCATION as Point);
	const [distance, setDistance] = useState(0);

	const setupGame = async () => {
		try {
			setHasStart(false);
			// const googleStreetViewStaticApiKey = process.env.GOOGLE_STREETVIEWSTATIC_API_KEY;
			const googleStreetViewStaticApiKey = '';
			const point = await getRandomStreetView(googleStreetViewStaticApiKey);
			console.log('Point: ', point);
			const streetPoint = {
				lat: point.lat,
				lng: point.lng,
			};

			if (streetPoint.lat) {
				const nearPoint = getRandomNearLocation(streetPoint, 100);
				setGoalPoint(nearPoint);
				setStartPoint(streetPoint);
				setGuessPoint(guessPoint);

				if (streetPoint.lat && nearPoint.lat)
					setDistance(getDistanceInMeters(streetPoint, nearPoint));
			} else {
				setGoalPoint(DEFAULT_LOCATION);
				setStartPoint(DEFAULT_LOCATION);
				setGuessPoint(DEFAULT_LOCATION);
			}
		} catch {}
		setHasStart(true);
	};

	const sendGuessPoint = (point: Point) => {
		setGuessPoint(point);
		if (point && goalPoint) setDistance(getDistanceInMeters(point, goalPoint));
	};

	const data = {
		goalPoint,
		startPoint,
		distance,
		guessPoint,
		sendGuessPoint,
		setupGame,
		hasStart,
		streetPoint,
		setStreetPoint,
	} as GameData;

	return <GameContext.Provider value={data}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
	const context = useContext(GameContext);

	return context;
};
