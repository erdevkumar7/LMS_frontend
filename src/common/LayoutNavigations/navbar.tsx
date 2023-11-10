import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useProSidebar } from "react-pro-sidebar";
import { Avatar, Badge, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import styles from "../../styles/appbar.module.css";
import { HandleLogout } from "@/services/auth";
import { capitalizeFirstLetter } from "../CapitalFirstLetter/capitalizeFirstLetter";
import { BASE_URL } from "@/config/config";
import Link from "next/link";
import { HandleSiteGetByID } from "@/services/site";
import { arrayUnion, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';
import moment from "moment";
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import { MyChatContext } from "@/GlobalStore/MyContext";
import { pushNotification } from "@/firebase/Notification";
interface appbar {
  portalData?: any;
  profilePic?: any;
  firstName?: any;
  lastName?: any;
}

function stringAvatar(first_name: string, last_name: string) {
  return {
    children: `${capitalizeFirstLetter(
      first_name?.split(" ")[0][0]
    )}${capitalizeFirstLetter(last_name?.split(" ")[0][0])}`,
  };
}
export const ChatIdContext: any = React.createContext('');
export default function Navbar({
  portalData,
  profilePic,
  firstName,
  lastName,
}: appbar) {
  const { textuid, setTextuid } = React.useContext<any>(MyChatContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [orgLogo, setOrgLogo] = React.useState<string>("");
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [userData, setUserData] = React.useState<any>("");
  const { collapseSidebar, toggleSidebar, toggled } = useProSidebar();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [allchats, setChats] = React.useState<any>([]);
  const [liveChatDetail, setLiveChatDetail] = React.useState<any>([]);
  const [notifications, setNotifications] = React.useState({});
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    setOpen(true)
    if (!open) {
      handleCloseUserMenu();
    }
    if (open) {
      setOpen(false)
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    let localData: any, parseLocalData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      parseLocalData = JSON.parse(localData);
      setUserData(JSON.parse(localData));
    }
    handleGetSiteOptionsDataById(parseLocalData.id);
  }, []);

  React.useEffect(() => {
    const getChats = () => {
      if (!userData?.firebase_id) {
        return;
      }
      const unsub = onSnapshot(doc(db, "userChats", userData?.firebase_id), (doc) => {
        const data: any = doc.data();
        setChats(data);
        const chatEntries: any = data && Object?.entries(data).map((chat) => chat[1]);
        const greatestDateObject = chatEntries?.reduce((greatest: any, current: any) => {
          if (current.date) {
            const currentDateTime = new Date(current.date.seconds * 1000 + current.date.nanoseconds / 1000000);
            if (!greatest || currentDateTime > new Date(greatest.date.seconds * 1000 + greatest.date.nanoseconds / 1000000)) {
              return current;
            }
          }
          return greatest;
        }, null);
        setLiveChatDetail(greatestDateObject)
      });
      return () => {
        unsub();
      };
    };
    getChats();
  }, [userData?.firebase_id]);

  const handleGetSiteOptionsDataById = async (userId: any) => {
    await HandleSiteGetByID(userId)
      .then((res) => {
        const hasOLOrOFOrT = res.data.filter(
          (item: any) => item.key === "org_logo"
        );

        setOrgLogo(hasOLOrOFOrT && hasOLOrOFOrT[0]?.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggle = () => {
    toggleSidebar();
    if (toggled) {
      collapseSidebar();
    } else {
      collapseSidebar();
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const OpenChat = (chat: any) => {
    setTextuid(chat);
    router.replace(`/user/chat/`);
  }
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      sx={{ marginTop: "25px !important" }}
      onClose={handleMenuClose}
    >
      {userData && userData?.role_id === 1 ? (
        <Box>
          <MenuItem
            onClick={() => {
              router.push("/profile"), handleMenuClose();
            }}
          >
            <Typography>Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/"), handleMenuClose();
            }}
          >
            <Typography>View Site</Typography>
          </MenuItem>
        </Box>
      ) : (
        <Box>
          <MenuItem
            onClick={() => {
              router.push("/user/profile"), handleMenuClose();
            }}
          >
            <Typography>Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/"), handleMenuClose();
            }}
          >
            <Typography>View Site</Typography>
          </MenuItem>
        </Box>
      )}
      <MenuItem onClick={HandleLogout}>
        <Typography>Logout</Typography>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      sx={{ marginTop: "25px !important" }}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => router.push("/profile")}>
        <Typography variant="body1">Welcome</Typography>&nbsp;
        <Typography variant="body2">
          {capitalizeFirstLetter(userData?.first_name)}{" "}
          {capitalizeFirstLetter(userData?.last_name)}
        </Typography>
      </MenuItem>

      <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
      <MenuItem onClick={() => router.push("/")}>View Site</MenuItem>
      <MenuItem onClick={HandleLogout}>
        <Typography>Logout</Typography>
      </MenuItem>
    </Menu>
  );
  const chatEntries: any = allchats && Object.entries(allchats).map((chat) => chat[1]);
  const chatFinder = chatEntries?.filter((chat: any) => chat?.userInfo?.messageRecieverId === userData.firebase_id && chat.userInfo.isRead === 0)

  React.useEffect(() => {
    if (chatFinder?.length > 0 && chatFinder[0]?.userInfo?.isPushNotification === false) {
      pushNotification(chatFinder);
      updateDoc(doc(db, "userChats", chatFinder[0]?.userInfo?.uid), {
        [chatFinder[0]?.userInfo?.combineID + ".userInfo.isPushNotification"]: true,
      })
      updateDoc(doc(db, "userChats", chatFinder[0]?.userInfo?.messageRecieverId), {
        [chatFinder[0]?.userInfo?.combineID + ".userInfo.isPushNotification"]: true,
      })
    }
  }, [allchats])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={styles.appBarCss}>
        <Toolbar>
          <Link href="/">
            <Box
              component="img"
              src={
                portalData
                  ? BASE_URL + "/" + portalData?.org_logo
                  : orgLogo
                    ? BASE_URL + "/" + orgLogo
                    : "/Images/pages_icon/company_logo.png"
              }
              width={"180px"}
              height={"50px"}
              sx={{ display: { xs: "block", sm: "block" } }}
              alt="Company logo"
            />
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Box
              sx={{ margin: '10px', cursor: "pointer" }}
              onClick={handleOpenUserMenu}
            >
              {chatFinder?.length > 0 ? <Badge color="error" variant="dot" >
                <NotificationsNoneIcon />
              </Badge> : <NotificationsNoneIcon />}
              {/* <Box> */}
              <Menu
                sx={{ mt: '30px', height: '277px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
              >
                {chatFinder?.length > 0 ? chatFinder.map((chat: any, index: number) => {
                  const timestampSeconds = chat?.date?.seconds;
                  const timestampNanoseconds = chat?.date?.nanoseconds;
                  // Convert nanoseconds to milliseconds (1 second = 1000 milliseconds)
                  const timestampMilliseconds = timestampSeconds * 1000 + Math.floor(timestampNanoseconds / 1e6);
                  // Create a Date object from the timestamp in milliseconds
                  const date = moment(new Date(timestampMilliseconds)).format("DD MMM YY");
                  return (
                    <MenuItem key={index} sx={{ borderBottom: '1px solid #e1e1e1' }}
                      onClick={() => OpenChat(chat)}
                    >
                      <Box sx={{ display: "flex" }}>
                        <Box sx={{
                          background: '#ffeee5',
                          borderRadius: "50%",
                          textAlign: "center",
                          padding: "3px 12px"
                        }}>
                          <MarkUnreadChatAltOutlinedIcon sx={{ margin: "-12px 0px", fill: '#6a5f5f', fontSize: "20px" }} />
                        </Box>
                        <Box sx={{ margin: "0px 20px" }}>
                          <Box display={"flex"}><Typography variant="body1" sx={{ fontSize: "small" }}>{capitalizeFirstLetter(chat?.userInfo?.displayName)}</Typography><CircleRoundedIcon sx={{ fontSize: "3px", margin: "auto 7px" }} /><Typography component={'span'} variant="caption">{date}</Typography></Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "14px" }}>{chat?.lastMessage?.text?.length > 30 ? chat?.lastMessage?.text?.substring(0, 30) + "..." : chat?.lastMessage?.text}</Typography>
                        </Box>
                      </Box>
                    </MenuItem>

                  )
                }
                ) : <Box sx={{ padding: "10px 40px", textAlign: "center" }}>
                  <NotificationImportantOutlinedIcon sx={{ fontSize: "30px" }} />
                  <Typography sx={{ fontSize: "16px" }}>No Notification Yet</Typography>
                </Box>
                }
              </Menu>
            </Box>
            <Box className={styles.createVrLine}>
            </Box>
            <Avatar
              src={
                profilePic && profilePic
                  ? `${BASE_URL}/${profilePic}`
                  : userData && userData?.profile_pic !== null
                    ? `${BASE_URL}/${userData?.profile_pic}`
                    : "/"
              }
              {...stringAvatar(userData?.first_name, userData?.last_name)}
              alt={userData && userData?.first_name}
              className={styles.windowFullWidthAvatar}
            />
            <Typography
              variant="body2"
              className={styles.windowFullWidthNameAlign}
            >
              {capitalizeFirstLetter(
                firstName && firstName ? firstName : userData?.first_name
              )}{" "}
              {capitalizeFirstLetter(
                lastName && lastName ? lastName : userData?.last_name
              )}
            </Typography>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <KeyboardArrowDownOutlinedIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon
                onClick={() => {
                  toggle();
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
