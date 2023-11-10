import React, { useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';

export const VerticalMenuItems = () => {
  const [userData, setUserData] = React.useState<any>("");

  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      setUserData(JSON.parse(localData));
    }
  }, []);

  if (userData && userData?.role_id === 2) {
    return [
      {
        title: "Dashboard",
        icon: HomeOutlinedIcon,
        path: "/user/dashboard",
        disable: false,
      },
      {
        title: "Profile",
        icon: ManageAccountsOutlinedIcon,
        path: "/user/profile",
        disable: false,
      },
      {
        title: "Subscriptions",
        icon: SubscriptionsOutlinedIcon,
        path: "/user/subscription",
        disable: false,
      },
      {
        title: "Courses",
        icon: DescriptionOutlinedIcon,
        path: "/user/course",
        disable: false,
      },
      {
        title: "Chat",
        icon: ChatOutlinedIcon,
        path: "/user/chat",
        disable: false,
      },
      {
        title: "Logout",
        icon: PowerSettingsNewOutlinedIcon,
        disable: false,
      },
    ];
  } else {
    return [
      {
        title: "Dashboard",
        icon: HomeOutlinedIcon,
        path: "/admin/dashboard",
        disable: false,
      },
      {
        title: "Users",
        icon: PeopleAltOutlinedIcon,
        path: "/admin/users",
        disable: false,
      },
      {
        title: "Courses",
        icon: DescriptionOutlinedIcon,
        children: [
          {
            title: "All Courses",
            icon: ContentPasteOutlinedIcon,
            path: "/admin/courses/allcourses",
            disable: false,
          },
          {
            title: "All Modules",
            icon: ViewModuleOutlinedIcon,
            path: "/admin/courses/allmodules",
            disable: false,
          },
          {
            title: "All Sessions",
            icon: CalendarTodayOutlinedIcon,
            path: "/admin/courses/allsessions",
            disable: false,
          },
          {
            title: "Live Sessions",
            icon: LiveTvIcon,
            path: "/admin/courses/livesessions",
            disable: false,
          },
        ],
      },
      {
        title: "Subscriptions",
        icon: SubscriptionsOutlinedIcon,
        children: [
          {
            title: "All Subs.",
            icon: PaidOutlinedIcon,
            path: "/admin/subscriptions/allsubscription",
            disable: false,
          },
          {
            title: "Subs. Plans",
            icon: GradingOutlinedIcon,
            path: "/admin/subscriptions/plans",
            disable: false,
          },
          {
            title: "Invoices",
            icon: DescriptionOutlinedIcon,
            path: "/admin/subscriptions/invoices",
            disable: false,
          },
        ],
      },
      {
        title: "Configurations",
        icon: QueryStatsOutlinedIcon,
        children: [
          {
            title: "Email Mngmt",
            icon: EmailOutlinedIcon,
            path: "/admin/configurations/emailmanagement",
            disable: false,
          },
          {
            title: "Site Config",
            icon: LanguageOutlinedIcon,
            path: "/admin/configurations/site",
            disable: false,
          },
          {
            title: "Stripe Config",
            icon: PaymentOutlinedIcon,
            path: "/admin/configurations/stripe",
            disable: false,
          },
          {
            title:"Zoom Config",
            icon:VideoSettingsIcon,
            path: "/admin/configurations/zoom",
            disable: false,
          },
        ],
      },
      {
        title: "Chat",
        icon: ChatOutlinedIcon,
        path: "/user/chat",
        disable: false,
      },
      {
        title: "Logout",
        icon: PowerSettingsNewOutlinedIcon,
        disable: false,
      },
    ];
  }
};
