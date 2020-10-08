import firebase from 'firebase';

const fire = {
  apiKey: "AIzaSyC8B01OCF63ZtY8JY6CrqSUMFB_jRPp0K0",
  authDomain: "ticket-2-ride.firebaseapp.com",
  databaseURL: "https://ticket-2-ride.firebaseio.com",
  projectId: "ticket-2-ride",
  storageBucket: "ticket-2-ride.appspot.com",
  messagingSenderId: "684536349082",
  appId: "1:684536349082:web:eb9db9421d0f3781843a23",
  measurementId: "G-P7EM467X3P"
};
// Initialize Firebase
firebase.initializeApp(fire);
firebase.analytics();

export default firebase;