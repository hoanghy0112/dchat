import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	UserCredential,
	User,
	signInWithRedirect,
	getRedirectResult,
} from "firebase/auth";
import app from "./index";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export const signInWithGoogle = async () => {
	signInWithRedirect(auth, provider);

	const user = await getRedirectResult(auth)
		.then((result) => {
			if (!result) return;
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			const user = result.user;
			return { token, profile: user };
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.customData.email;
			const credential = GoogleAuthProvider.credentialFromError(error);
		});

	return user as unknown as { token: string; profile: User };
};
