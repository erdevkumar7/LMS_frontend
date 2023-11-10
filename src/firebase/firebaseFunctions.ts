import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const CurrentUser = async () => {
  let user: any;
  await onAuthStateChanged(auth, (getUser) => {
    if (getUser) {
      user = getUser;
    }
  });
  return user;
};

export const CreateFirebase = async (event: any, db_id: any) => {
  const displayName = event?.first_name + " " + event.last_name;
  const email = event?.email;
  const password = event?.password;
  const res = await createUserWithEmailAndPassword(auth, email, password);
  //create user on firestore
  await setDoc(doc(db, "users", res.user.uid), {
    uid: res.user.uid,
    displayName,
    email,
    db_id,
  }).catch((e) => {
    console.log(e);
  });
  //create empty user chats on firestore
  await setDoc(doc(db, "userChats", res.user.uid), {}).catch((e) => {
    console.log(e);
  });
  return res;
};

export const LoginFirestore = async (event: any) => {
  const email = event?.email;
  const password = event?.password;
  const dt = await signInWithEmailAndPassword(auth, email, password);
  return dt;
};

export const UpdateFireStoreData = async (data: any) => {
  // await updateProfile(user, {
  //     displayName
  // });
  // return user;
};

// // Custom Hook
// export function getUserChats(currentUser:any) {
//     const [chats, setChats] = useState<any>([]);

//     useEffect(() => {
//         const getChats = () => {
//           const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
//             setChats(doc.data());
//           });

//           return () => {
//             unsub();
//           };
//         };

//         currentUser.uid && getChats();
//       }, [currentUser.uid]);

//     return chats;
//   }
