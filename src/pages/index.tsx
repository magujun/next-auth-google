import React from 'react';
import {
	useSession,
	signIn,
	signOut,
} from 'next-auth/client';
import Map from '../components/map';
import StreetMap from '../components/streetmap';
import { GetStaticProps } from 'next';
import { GameProvider } from '../context/gameContext';

export function Login() {
	const [session, loading] = useSession();

	// console.log(session);

	if (session) {
		return (
			<>
				Signed in as {session.user.email} <br />
				<button onClick={() => signOut()}>Sign out</button>
			</>
		);
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn('google')}>
				Sign in
			</button>
		</>
	);
}

type HomeProps = {
	googleMapsApiKey: string;
};

export default function Home({
	googleMapsApiKey,
}: HomeProps) {
	return (
		<GameProvider>
			<>
				<Login />
				<Map googleMapsApiKey={googleMapsApiKey} />
				<StreetMap googleMapsApiKey={googleMapsApiKey} />
			</>
		</GameProvider>
	);
}

const removeUndefinedForNextJsSerializing = <T,>(
	props: T,
): T =>
	Object.fromEntries(
		Object.entries(props).filter(
			([, value]) => value !== undefined,
		),
	) as T;

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: removeUndefinedForNextJsSerializing({
			googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
		}),
	};
};
