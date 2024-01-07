import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBe-j9_ZzlrEHv8vfaFfCjA1EUHnssCHuY",
	authDomain: "dchat-ecdc3.firebaseapp.com",
	projectId: "dchat-ecdc3",
	storageBucket: "dchat-ecdc3.appspot.com",
	messagingSenderId: "88951102017",
	appId: "1:88951102017:web:ceeaa04d3384b9eae484c0",
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

export default app;
