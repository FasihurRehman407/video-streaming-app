import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDJ-Y8TPE3yZxw9Gf-n9PciZyPTnuyK1DQ",
  authDomain: "video-streaming-1d9df.firebaseapp.com",
  projectId: "video-streaming-1d9df",
  storageBucket: "video-streaming-1d9df.appspot.com",
  messagingSenderId: "741811828481",
  appId: "1:741811828481:web:7e75cb97f83392f980cd00",
  measurementId: "G-N8Y9BWDJLN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;