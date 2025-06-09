// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2RRKwiT1Jd1_yXggyRTBOr6yH_eqdi2I",
  authDomain: "sistem-majemen-karyawan.firebaseapp.com",
  projectId: "sistem-majemen-karyawan",
  storageBucket: "sistem-majemen-karyawan.firebasestorage.app",
  messagingSenderId: "72788171670",
  appId: "1:72788171670:web:993ac33d7e18ca1ca4dbb7",
  measurementId: "G-EPNLGX2S01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;