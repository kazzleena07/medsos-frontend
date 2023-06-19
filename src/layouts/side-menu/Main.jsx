import { Transition } from "react-transition-group";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { helper as $h } from "@/utils";
import { sideMenu as useSideMenuStore } from "@/stores/side-menu";
import { useRecoilValue } from "recoil";
import { linkTo, nestedMenu, enter, leave } from "./index";
import classnames from "classnames";
import MobileMenu from "@/components/mobile-menu/Main";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main";
import {
  Lucide,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
} from "@/base-components";

import { faker as $f } from "@/utils";
import AuthService from "../../services/auth";

const profile = localStorage.getItem("userProfile");
const userss = localStorage.getItem("userData");
function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState([]);
  const sideMenuStore = useRecoilValue(useSideMenuStore);
  const sideMenu = () => nestedMenu($h.toRaw(sideMenuStore.menu), location);

  const [userProfile, setUserProfile] = useState({})
  const [userData, setUserData] = useState({})

  const onLogout = async () => {
    let response = await AuthService.Logout();
    if (response.error === 0) {
      AuthService.RemoveToken();
      localStorage.removeItem("userData")
      localStorage.removeItem("userProfile")
      navigate("/");
      navigate(0);
    } else {

    }
  }

  const initUser = () => {
    setUserProfile(JSON.parse(profile));
    setUserData(JSON.parse(userss));
  }

  useEffect(() => {
    dom("html").addClass("dark");
    dom("body").removeClass("error-page").removeClass("login").addClass("main");
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);

  useEffect(() => {
    initUser();
  }, [profile, userss])

  return (
    <div className="py-5 md:py-0 -mx-3 px-3 sm:-mx-8 sm:px-8 bg-black/[0.15] dark:bg-transparent">
      {/* <DarkModeSwitcher />
      <MainColorSwitcher /> */}
      <MobileMenu />
      <div className="flex mt-[4.7rem] md:mt-0 overflow-hidden">
        {/* BEGIN: Side Menu */}
        <nav className="side-nav">
          {/* BEGIN: Account Menu */}
          <div className="intro-x flex items-center pl-5 pt-4 mt-3">
            <Dropdown
            >
              <DropdownToggle
                tag="div"
                role="button"
                className="w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in"
              >
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-6"
                  src={userProfile.profilePicture}
                />
              </DropdownToggle>
              <DropdownMenu className="w-56">
                <DropdownContent className="bg-primary text-white">
                  <DropdownHeader tag="div" className="!font-normal">
                    <div className="font-medium">{userProfile.firstName + " " + userProfile.lastName}</div>
                    <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                      {userData.email}
                    </div>
                  </DropdownHeader>
                  <DropdownDivider className="border-white/[0.08]" />
                  <DropdownItem className="hover:bg-white/5">
                    <Lucide icon="User" className="w-4 h-4 mr-2" /> Profile
                  </DropdownItem>
                  <DropdownItem className="hover:bg-white/5">
                    <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Reset Password
                  </DropdownItem>
                  <DropdownDivider className="border-white/[0.08]" />
                  <DropdownItem className="hover:bg-white/5" onClick={onLogout}>
                    <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Logout
                  </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            </Dropdown>
            <span className="xl:block text-white text-lg ml-3">
              {userData.username}
            </span>
          </div>
          <div className="side-nav__devider my-6"></div>
          <ul>
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              menu == "devider" ? (
                <li
                  className="side-nav__devider my-6"
                  key={menu + menuKey}
                ></li>
              ) : (
                <li key={menu + menuKey}>
                  <SideMenuTooltip
                    tag="a"
                    content={menu.title}
                    href={menu.subMenu ? "#" : menu.pathname}
                    className={classnames({
                      "side-menu": true,
                      "side-menu--active": menu.active,
                      "side-menu--open": menu.activeDropdown,
                    })}
                    onClick={(event) => {
                      event.preventDefault();
                      linkTo(menu, navigate);
                      setFormattedMenu($h.toRaw(formattedMenu));
                    }}
                  >
                    <div className="side-menu__icon">
                      <Lucide icon={menu.icon} />
                    </div>
                    <div className="side-menu__title">
                      {menu.title}
                      {menu.subMenu && (
                        <div
                          className={classnames({
                            "side-menu__sub-icon": true,
                            "transform rotate-180": menu.activeDropdown,
                          })}
                        >
                          <Lucide icon="ChevronDown" />
                        </div>
                      )}
                    </div>
                  </SideMenuTooltip>
                  {/* BEGIN: Second Child */}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={classnames({
                          "side-menu__sub-open": menu.activeDropdown,
                        })}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={subMenuKey}>
                            <SideMenuTooltip
                              tag="a"
                              content={subMenu.title}
                              href={subMenu.subMenu ? "#" : subMenu.pathname}
                              className={classnames({
                                "side-menu": true,
                                "side-menu--active": subMenu.active,
                              })}
                              onClick={(event) => {
                                event.preventDefault();
                                linkTo(subMenu, navigate);
                                setFormattedMenu($h.toRaw(formattedMenu));
                              }}
                            >
                              <div className="side-menu__icon">
                                <Lucide icon="Activity" />
                              </div>
                              <div className="side-menu__title">
                                {subMenu.title}
                                {subMenu.subMenu && (
                                  <div
                                    className={classnames({
                                      "side-menu__sub-icon": true,
                                      "transform rotate-180":
                                        subMenu.activeDropdown,
                                    })}
                                  >
                                    <Lucide icon="ChevronDown" />
                                  </div>
                                )}
                              </div>
                            </SideMenuTooltip>
                            {/* BEGIN: Third Child */}
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={classnames({
                                    "side-menu__sub-open":
                                      subMenu.activeDropdown,
                                  })}
                                >
                                  {subMenu.subMenu.map(
                                    (lastSubMenu, lastSubMenuKey) => (
                                      <li key={lastSubMenuKey}>
                                        <SideMenuTooltip
                                          tag="a"
                                          content={lastSubMenu.title}
                                          href={
                                            lastSubMenu.subMenu
                                              ? "#"
                                              : lastSubMenu.pathname
                                          }
                                          className={classnames({
                                            "side-menu": true,
                                            "side-menu--active":
                                              lastSubMenu.active,
                                          })}
                                          onClick={(event) => {
                                            event.preventDefault();
                                            linkTo(lastSubMenu, navigate);
                                          }}
                                        >
                                          <div className="side-menu__icon">
                                            <Lucide icon="Zap" />
                                          </div>
                                          <div className="side-menu__title">
                                            {lastSubMenu.title}
                                          </div>
                                        </SideMenuTooltip>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </Transition>
                            )}
                            {/* END: Third Child */}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
          </ul>
        </nav>
        {/* END: Side Menu */}
        {/* BEGIN: Content */}
        <div className="content">
          {/* <TopBar /> */}
          <Outlet />
        </div>
        {/* END: Content */}
      </div>
    </div>
  );
}

export default Main;
