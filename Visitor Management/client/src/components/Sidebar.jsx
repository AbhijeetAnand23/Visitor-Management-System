import React from "react";
import { Link, NavLink } from "react-router-dom";

import CloseIcon from '@mui/icons-material/Close';
import { CiSquarePlus } from "react-icons/ci";

import { links } from "../data";
import { Button } from "../components";

import Logo from "../../public/Logo.png";
import { useStateContext } from "../contexts/ContextProvider";

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize, currentColor, userData } =
    useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  const userLinks = links.find((link) => link.title === userData.userType);

  return (
    <div
      className={`ml-3 h-screen overflow-auto pb-10 ${
        screenSize <= 900 ? "md:overflow-hidden" : "md:overflow-auto"
      }`}
    >
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <img src={Logo} alt="Logo" className="h-8 w-auto" /> 
              <span>Visitor Management</span>
            </Link>
            {/* <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block"
            >
              <CloseIcon />
            </button> */}
          </div>
          <div className="mt-10">
            {userLinks &&
              userLinks.sections.map((section) => (
                <div key={section.title}>
                  <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                    {section.title}
                  </p>
                  {section.links.map((link) => {
                    const toPath = `/${link.name
                      .replace(/\s+/g, "")
                      .toLowerCase()}`;
                    return (
                      <NavLink
                        to={toPath}
                        key={link.name}
                        onClick={handleCloseSideBar}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? currentColor : "",
                        })}
                        className={({ isActive }) =>
                          isActive ? activeLink : normalLink
                        }
                      >
                        {link.icon}
                        <span className="capitalize ">{link.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              ))}
          </div>
          <div className="absolute bottom-10 w-full">
            <div className="pr-6">
              <Button
                color="white"
                bgColor={currentColor}
                text="New Meeting"
                width="full"
                borderRadius="10px"
                icon={<CiSquarePlus />}
                to="/newmeeting"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
