// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// 인증을 위한 getAuth가져오기
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    // env를 사용하여 process.env.에 접근해서 값을 가져올 수 있다.
    apiKey: "AIzaSyBQHAzU4C6hYoWjBMWXCBU18TPZDIIfHnc",
    authDomain: "book-project-b247e.firebaseapp.com",
    projectId: "book-project-b247e",
    storageBucket: "book-project-b247e.appspot.com",
    messagingSenderId: "44542819214",
    appId: "1:44542819214:web:9645d3179cf2250ea902df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//console.log(app);

// 사용하고자하는 서비스를 들고와서 사용
// 인증서비스에 관한 내용 들고와서 사용
export const auth = getAuth(app);
export const db = getFirestore(app)
