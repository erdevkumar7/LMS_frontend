import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { VerticalMenuItems } from "../RoutingMenuItems/verticalMenuItems";
import { HandleLogout } from "@/services/auth";
import { useRouter } from "next/router";
import styles from "../../styles/sidebar.module.css";
import { Fragment, useState } from "react";

const SideBar = () => {
  const router = useRouter();
  const NavItem = VerticalMenuItems();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  let submenuTitles: any;

  if (typeof window !== "undefined") {
    const convertStringg: any = localStorage.getItem("submenuTitle");
    submenuTitles = JSON?.parse(convertStringg);
  }

  const navigateURL = (item: any, identifier: string) => {
    if (identifier === "menu") {
      handleSubMenuClick(item?.title);
    }
    router.push(item?.path);
  };

  const handleSubMenuClick = (submenuTitle: string) => {
    // if(submenuTitle === submenuTitles && router.pathname.includes('courses'){
    //   setOpenSubMenu((prevSubMenu) => (prevSubMenu === submenuTitle ? null : 'none'));
    //   localStorage.setItem("submenuTitle", JSON.stringify('none'))
    // }else{
    localStorage.setItem("submenuTitle", JSON.stringify(submenuTitle));
    setOpenSubMenu((prevSubMenu) =>
      prevSubMenu === submenuTitle ? null : submenuTitle
    );
    // }
  };

  return (
    <>
      <Sidebar
        className={styles.asideTag}
        breakPoint="sm"
        transitionDuration={500}
        backgroundColor={"rgb(255, 255, 255)"}
      >
        <Menu>
          {NavItem?.map((item: any, index: number) => {
            const pathnameMatch =
              router.pathname === item?.path ||
              router.pathname.includes(item.path)
                ? styles.activeMenuItem
                : styles.nonActiveMenuItem;

            const isSubMenuOpen = item.title === submenuTitles;
            return (
              <Fragment key={index}>
                {item?.children ? (
                  <SubMenu
                    key={index}
                    icon={<item.icon />}
                    label={item.title}
                    // defaultOpen={isSubMenuOpen}
                    className={pathnameMatch}
                    disabled={item.disable}
                    open={isSubMenuOpen}
                    onClick={() => handleSubMenuClick(item.title)}
                  >
                    {item?.children.map((subItem: any, idx: number) => {
                      const subPathnameMatch = router.pathname.includes(
                        subItem.path
                      )
                        ? styles.activeMenuItem
                        : styles.nonActiveMenuItem;

                      return (
                        <MenuItem
                          key={idx}
                          icon={<subItem.icon />}
                          onClick={() => navigateURL(subItem, "submenu")}
                          active={
                            router.pathname.includes(subItem.path)
                              ? true
                              : false
                          }
                          className={`${subPathnameMatch} ${styles.menuItemHover}`}
                          disabled={subItem.disable}
                          rootStyles={{
                            li: {
                              // the active class will be added automatically by react router
                              // so we can use it to style the active menu item
                              [`&.hover`]: {
                                backgroundColor: "yellow",
                                color: "#b6c8d9",
                              },
                            },
                          }}
                        >
                          {subItem.title}
                        </MenuItem>
                      );
                    })}
                  </SubMenu>
                ) : item.title !== "Logout" ? (
                  <MenuItem
                    key={index}
                    icon={<item.icon />}
                    onClick={() => navigateURL(item, "menu")}
                    active={router.pathname === item.path}
                    className={pathnameMatch}
                    disabled={item.disable}
                  >
                    {item.title}
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={index}
                    icon={<item.icon />}
                    active={router.pathname === item.path}
                    onClick={() => {
                      HandleLogout();
                    }}
                    className={pathnameMatch}
                    disabled={item.disable}
                  >
                    {item.title}
                  </MenuItem>
                )}
              </Fragment>
            );
          })}
        </Menu>
      </Sidebar>
    </>
  );
};

export default SideBar;
