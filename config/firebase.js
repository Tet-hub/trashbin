import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuxzg1wYoi3O9aDA7Ev1tY6Ie37jcUqIE",
  authDomain: "konbini-trashduino.firebaseapp.com",
  databaseURL: "https://konbini-trashduino-default-rtdb.firebaseio.com",
  projectId: "konbini-trashduino",
  storageBucket: "konbini-trashduino.appspot.com",
  messagingSenderId: "991711940701",
  appId: "1:991711940701:web:68fa7f12ce4c3ef8357db4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
