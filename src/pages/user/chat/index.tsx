import Navbar, { ChatIdContext } from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  arrayUnion,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";
import { v4 as uuid } from "uuid";
import { Avatar, Backdrop, Badge, Box, Button, Fade, Grid, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableRow, TextField, TextareaAutosize, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SearchOutlined } from "@mui/icons-material";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import SidebarStyles from "../../../styles/sidebar.module.css";
import { auth } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Messages from "./chatComponents/Messages";
import { HandleUserGet } from "@/services/user";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { BASE_URL } from "@/config/config";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { MyChatContext } from "@/GlobalStore/MyContext";
import { Textarea } from "@mui/joy";
import SendIcon from '@mui/icons-material/Send';


const classes = {
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center !important",
    "&:hover": {
      backgroundcolor: "red"
    }
  },
  img: {
    outline: "none"
  }
};

export const AuthContext: any = createContext('');
export const ChatContext: any = createContext('');

const Chat = () => {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<any>([]);
  const [chatId, setchatId] = useState<any>("");
  const [row, setRow] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState<any>(false);
  const [combineIDD, setCombineIDD] = useState<any>(null);
  const [allchats, setChats] = useState<any>([]);
  const [liveChatDetail, setLiveChatDetail] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userDataFromLocalStorage, setUserDataFromLocalStorage] = useState<any>('')
  const { textuid }: any = useContext<any>(MyChatContext);
  const [dt, setdt] = useState<any>("");

  // const classes = useStyles();
  useEffect(() => {
    const dtt: any = localStorage.getItem("userData")
    setdt(JSON.parse(dtt));
    const unsub = onAuthStateChanged(auth, (getUser: any) => {
      setCurrentUser(getUser);
      getUsereData();
    });
    return () => {
      unsub();
    };
  }, []);

  const getUsereData = () => {
    setLoading(true);
    HandleUserGet("", "").then((users) => {
      setLoading(false);
      let localData: any;
      if (typeof window !== "undefined") {
        localData = window.localStorage.getItem("userData");
      }
      const LoginUser = JSON.parse(localData)
      if (LoginUser) {
        setUserDataFromLocalStorage(LoginUser)
        const dataUsers = users?.data?.filter((user: { id: any; }) => user.id !== LoginUser?.id)
        dataUsers.sort((a: any, b: any) => a?.first_name?.localeCompare(b?.first_name));
        setRows(dataUsers);
      }
    });
  };


  useEffect(() => {
    const getChats = () => {
      if (!currentUser?.uid) {
        return;
      }
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc: any) => {
        const data: any = doc.data();
        setChats(data);
        const chatEntries: any = data && Object.entries(data).map((chat) => chat[1]);
        const greatestDateObject = chatEntries?.reduce((greatest: any, current: any) => {
          if (current.date) {
            const currentDateTime = new Date(current.date.seconds * 1000 + current.date.nanoseconds / 1000000);
            if (!greatest || currentDateTime > new Date(greatest.date.seconds * 1000 + greatest.date.nanoseconds / 1000000)) {
              return current;
            }
          }
          return greatest;
        }, null);
        setLiveChatDetail(greatestDateObject);
      });
      return () => {
        unsub();
      };
    };
    getChats();
  }, [currentUser?.uid]);

  const reorderUsers = () => {
    const users = rows
    const chatData = allchats
    if (!chatData) return users;
    const currentChatUserId = liveChatDetail?.userInfo?.uid
    const sortedUsers = users.sort((userA: any, userB: any) => {
      if (userA.firebase_id === currentChatUserId) return -1;
      if (userB.firebase_id === currentChatUserId) return 1;
      return 0;
    });
    return sortedUsers;
  };

  const reorderedUsers = reorderUsers();
  const handleSearch = (e: any, identifier: any) => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    const LoginUser = JSON.parse(localData)
    if (identifier === "reset") {
      HandleUserGet("", "").then((itemSeached) => {
        const dataUsers = itemSeached?.data?.filter((user: { id: any; }) => user.id !== LoginUser?.id)
        dataUsers.sort((a: any, b: any) => a.first_name.localeCompare(b.first_name));
        setRows(dataUsers);
        // setRows(itemSeached.data);
      });
      setSearch(e);
    } else {
      const search = e.target.value;
      setSearch(e.target.value);
      HandleUserGet(search, "").then((itemSeached) => {
        const dataUsers = itemSeached?.data?.filter((user: { id: any; }) => user.id !== LoginUser?.id)
        dataUsers.sort((a: any, b: any) => a.first_name.localeCompare(b.first_name));
        setRows(dataUsers);
        // setRows(itemSeached.data);
      });
    }
  };

  const handleclick = async (e: any) => {
    setchatId(e);
    setRow(e)
    let user: any
    const q = query(
      collection(db, "users"),
      where("uid", "==", e?.firebase_id)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc: any) => {
        user = doc.data();
        setUser(doc.data())
      });
    } catch (err) {
      setErr(true);
    }
    const combinedId =
      currentUser?.uid > user?.uid
        ? currentUser?.uid + user?.uid
        : user?.uid + currentUser?.uid
    setCombineIDD(combinedId);
    try {
      //check whether the group(chats in firestore) exists, if not create
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      } else {
        // Update the messages to mark them as read when the chat is opened
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo.isRead"]: 1,
        });
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo.isRead"]: 1,
        });
      }
    } catch (err) { }
    setLiveChatDetail([])
  }

  const handleSend = async () => {
    if (text.length > 0 && text !== "") {
      await updateDoc(doc(db, "chats", combineIDD), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      // sender message 
      await updateDoc(doc(db, "userChats", currentUser?.uid), {
        [combineIDD + ".lastMessage"]: {
          text,
        },
        [combineIDD + ".userInfo"]: {
          uid: user?.uid,
          displayName: user?.displayName,
          email: user?.email,
          messageSenderId: currentUser?.uid,
          messageRecieverId: user?.uid,
          combineID: combineIDD,
          isRead: 0,
          isPushNotification: false
        },
        [combineIDD + ".date"]: serverTimestamp(),
      });

      // receiver message
      await updateDoc(doc(db, "userChats", user.uid), {
        [combineIDD + ".lastMessage"]: {
          text,
        },
        [combineIDD + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: (userDataFromLocalStorage?.first_name + " " + userDataFromLocalStorage.last_name),
          email: currentUser.email,
          messageSenderId: currentUser?.uid,
          messageRecieverId: user?.uid,
          isRead: 0,
          combineID: combineIDD,
          isPushNotification: false
        },
        [combineIDD + ".date"]: serverTimestamp(),
      });

      setText("");
    }
  };

  function stringAvatar(first_name: string, last_name: string) {
    return {
      children: `${capitalizeFirstLetter(
        first_name?.split(" ")[0][0]
      )}${capitalizeFirstLetter(last_name?.split(" ")[0][0])}`,
    };
  }

  useEffect(() => {
    const chatuserdata = reorderedUsers?.length > 0 && reorderedUsers.filter(function (arrdata: any) {
      return arrdata.firebase_id == textuid?.userInfo?.uid
    });
    if (chatuserdata.length > 0) {
      handleclick(chatuserdata[0]);
    }
  }, [textuid]);
  const chatEntries: any = allchats && Object.entries(allchats).map((chat) => chat[1]);
  const chatFinder = chatEntries?.filter((chat: any) => chat.userInfo.messageRecieverId === userDataFromLocalStorage.firebase_id && chat.userInfo.isRead === 0)

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<any>("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleImage = (value: any) => {
    setImage(value);
    setOpen(true);
  };

  const filteredObject: any = {};
  for (const key in allchats) {
    if (allchats.hasOwnProperty(key) && allchats[key]?.userInfo?.isRead === 0) {
      filteredObject[key] = allchats[key];
    }
  }
  const keys = Object.keys(filteredObject);
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && e.shiftKey) {
      setText(text + '\n');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (text.trim() !== '') {
        handleSend();
      }
    }
  };

  // console.log(rows)

  return (
    <AuthContext.Provider value={{ currentUser, combineIDD, user, chatId }}>
      <Navbar />
      <Grid className={SidebarStyles.combineContentAndSidebar}>
        <SideBar />

        <Grid className={SidebarStyles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Chat"
            Text="CHAT"
            Link="/user/chat"
          />
          {/* main content */}
          {!isLoading ? (<Grid sx={{ maxWidth: 'auto', display: 'flex', background: "#f3f3f3" }}>
            <Grid xs={4} sm={4} md={12} lg={12} >

              <TextField
                id="standard-search"
                value={search}
                variant="outlined"
                size="small"
                placeholder="Find a user"
                onChange={(e) => handleSearch(e, "")}
                InputProps={{
                  endAdornment: !search ? (
                    <IconButton>
                      <SearchOutlined />
                    </IconButton>
                  ) : (
                    <IconButton onClick={(e) => handleSearch("", "reset")}>
                      {" "}
                      <CloseIcon />
                    </IconButton>
                  ),
                }}
              />

              {/* ---------------------------------  all  chat users ---------------------------------- */}
              < TableContainer sx={{ width: 'auto', marginTop: "4px" }}
                style={{
                  msOverflowY: "auto",
                  height: "calc(100vh - 200px)",
                  minHeight: "91%",
                  overflow: "auto"
                }}
              >
                <Table>
                  <TableBody>
                    {reorderedUsers.map((maprow: any) => {
                      const styleOfSelectedRow = maprow?.id === row?.id ? {
                        "&:hover": {
                          background: "#d3d3d3c7 !important",
                        }, background: "#d3d3d3c7"
                      } : {};
                      return (
                        <TableRow
                          hover
                          key={maprow?.id}
                          onClick={() => { handleclick(maprow) }}
                          sx={styleOfSelectedRow}
                        >
                          <TableCell sx={{ display: 'flex', cursor: "pointer" }} >
                            <Avatar
                              src={
                                maprow?.profile_pic
                                && `${BASE_URL}/${maprow.profile_pic}`

                              }
                              {...stringAvatar(maprow?.first_name, maprow?.last_name)}
                              sx={{ fontSize: "medium" }}
                            />
                            <Box>
                              <span style={{ fontSize: '14px', fontWeight: ' 600', padding: '5px' }}>{capitalizeFirstLetter(maprow?.first_name + " " + maprow?.last_name)}</span>
                              <Typography sx={{ fontSize: '11px', paddingLeft: '5px' }}>{maprow?.role_id === 2 ? "User" : "Admin"}</Typography>
                            </Box>
                            {keys.map((key) => {
                              if (filteredObject[key]?.userInfo?.uid === maprow?.firebase_id && filteredObject[key]?.userInfo?.isRead === 0 && filteredObject[key]?.userInfo?.messageRecieverId === dt?.firebase_id
                              ) {
                                if (chatFinder?.length > 0)
                                  return (
                                    <Box sx={{ float: 'right' }}>
                                      <Badge badgeContent={"1+"} color="warning" style={{ marginTop: "20px", marginLeft: "85px" }}>
                                      </Badge></Box>
                                  )
                              }
                            })}
                            {/* Show all the count of unread messages */}

                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {rows.length > 0 ? "" : <Typography style={{ textAlign: "center", marginTop: "20px" }}>User Not Found</Typography>}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <Chats /> */}
            </Grid>

            {/* ---------------------- chat user ------------------------------------------- */}
            <Grid xs={8} sm={8}  md={12} lg={12} sx={{width:'100%'}}>
              {user ? (
                <Grid xs={8} sm={8}  md={12} lg={12} sx={{ width: 'auto', background: '#ffffff' }}>
                  <TableCell sx={{ display: 'flex', background: "#d3d3d3c7", padding: "10px" }} >
                    <Avatar
                      src={
                        row?.profile_pic
                        && `${BASE_URL}/${row.profile_pic}`

                      }
                      onClick={(e) => handleImage(row)}
                      {...stringAvatar(row?.first_name, row?.last_name)}
                      sx={{ height: "40px", width: "40px", fontSize: "medium", cursor: "pointer" }}
                    />
                    <Box>
                      <Typography sx={{ fontSize: '15px', fontWeight: ' 700', padding: '6px 10px', lineHeight: 0.5 }}>{capitalizeFirstLetter(row?.first_name + " " + row?.last_name)}</Typography>
                      <Typography sx={{ fontSize: '13px', padding: '0px 10px' }}>{row?.role_id === 2 ? "User" : "Admin"}</Typography>
                    </Box>
                  </TableCell>
                  {/* ----------------- Messages component --------------------------- */}
                  <Box className="messagebox" sx={{ overflow: 'auto' }} style={{
                    height: "calc(100vh - 300px)",
                    minHeight: "70%",
                    width:"auto"
                  }} >
                    <Messages
                      data={{ combineIDD, row }}
                    />
                  </Box>
                  { /*---------------- input field for send messages ------------------ */}
                  <Box sx={{
                    padding: '6px',
                    color: '#fff',
                    width: '100%',
                    display: 'flex',
                    marginTop: "15px"
                  }}>
                    <Textarea
                      minRows={1}
                      maxRows={3}
                      id="standard-search"
                      value={text}
                      variant="outlined"
                      onChange={(e) => setText(e.target.value)}
                      onKeyPress={handleKeyPress} // Attach the event handler
                      placeholder="Type something..."
                      style={{ width: "inherit", borderRadius: "20px 0px 0px 20px", fontSize: "16.5px" }}
                    />
                    <Button
                      id={SidebarStyles.muibuttonBackgroundColor}
                      sx={{ color: "#fff", borderRadius: '0px 20px 20px 0px', height: "50px" }}
                      onClick={handleSend}><SendIcon />
                    </Button>
                  </Box>
                </Grid>
              ) : <Grid className="testIcon" xs={12} sx={{
                color: "grey",
                margin: "auto",
                textAlign: "center"
              }}>
                <ForumOutlinedIcon sx={{ fontSize: "130px" }} />
                <Typography sx={{ fontSize: "larger" }}>Lets chat</Typography></Grid>}
            </Grid>

          </Grid>) : (
            <SpinnerProgress />
          )}
        </Grid>

      </Grid >
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        sx={classes.modal}
      >
        <Fade in={open} timeout={500}
          style={classes.img}
        >
          <Avatar
            src={
              image?.profile_pic
              && `${BASE_URL}/${image.profile_pic}`
            }
            {...stringAvatar(image?.first_name, image?.last_name)}
            style={{ height: "300px", width: "300px", borderRadius: "50%", fontSize: "100px" }}
          />
        </Fade>
      </Modal>
    </AuthContext.Provider >
  );
}

export default Chat;