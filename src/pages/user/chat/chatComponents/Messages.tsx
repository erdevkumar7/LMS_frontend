import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";
import Message from "./Message";
import { AuthContext, ChatContext } from "../index";

const Messages = (props: any) => {
  const [messages, setMessages] = useState([]);
  // const { data }:any = useContext(ChatContext);
  // const { currentUser }:any = useContext(AuthContext);



  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", props?.data?.combineIDD), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unSub();
    };
  }, [props]);

  // console.log('messages', messages);
  return (
    <>
      {messages && messages?.map((m: any) => (
        <Message message={{ m, props }} key={m.id} />
      ))}
    </>
  );
};

export default Messages;


