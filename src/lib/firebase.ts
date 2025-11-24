import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <--- NUEVO IMPORT

const firebaseConfig = {
  apiKey: "AIzaSyC_BQ_eyx9o_-7T-BVGTsj852Dk3KTe_3g",
  authDomain: "studyflowapp-eb29e.firebaseapp.com",
  projectId: "studyflowapp-eb29e",
  storageBucket: "studyflowapp-eb29e.firebasestorage.app",
  messagingSenderId: "718417852047",
  appId: "1:718417852047:web:37ec1eb4bbd36ccd7922fa",
  measurementId: "G-LREYLP942S"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // <--- EXPORTAR AUTH