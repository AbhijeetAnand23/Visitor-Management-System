import React from "react";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { Button } from "../components";

import { useStateContext } from "../contexts/ContextProvider";

const HomeScreen = () => {
  const { profileUpdated, currentColor } = useStateContext();
  return (
    <div className="mt-24">
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-500 text-xl">Today's Meetings</p>
            <p className="text-4xl">2</p>
          </div>
        </div>
        {!profileUpdated && (
          <div className="mt-4 flex">
            <Button
              color="white"
              bgColor={currentColor}
              text="Update your profile"
              borderRadius="10px"
              icon={<ErrorOutlineIcon style={{ color: "red" }} />}
              to="/form"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
