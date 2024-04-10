import React from "react";

import { AiOutlineCalendar } from "react-icons/ai";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import avatar from "./avatar.jpg";

export const links = [
  {
    title: "student",
    sections: [
      {
        title: "Dashboard",
        links: [
          {
            name: "homescreen",
            icon: <HomeIcon />,
          },
          {
            name: "Accepted Requests",
            icon: <GroupsIcon />,
          },
        ],
      },
      // {
      //   title: "Meeting",
      //   links: [
      //     {
      //       name: "Accepted Requests",
      //       icon: <GroupsIcon />,
      //     },
      //     {
      //       name: "calendar",
      //       icon: <AiOutlineCalendar />,
      //     },
      //   ],
      // },
    ],
  },
  {
    title: "faculty",
    sections: [
      {
        title: "Dashboard",
        links: [
          {
            name: "homescreen",
            icon: <HomeIcon />,
          },
          {
            name: "Meeting Requests",
            icon: <PersonSearchIcon />,
          },
          {
            name: "Accepted Requests",
            icon: <GroupsIcon />,
          },
        ],
      },
      // {
      //   title: "Meeting",
      //   links: [
      //     {
      //       name: "Meeting Requests",
      //       icon: <PersonSearchIcon />,
      //     },
      //     {
      //       name: "Accepted Requests",
      //       icon: <GroupsIcon />,
      //     },
      //     {
      //       name: "calendar",
      //       icon: <AiOutlineCalendar />,
      //     },
      //   ],
      // },
    ],
  },
  {
    title: "visitor",
    sections: [
      {
        title: "Dashboard",
        links: [
          {
            name: "homescreen",
            icon: <HomeIcon />,
          },
          {
            name: "Accepted Requests",
            icon: <GroupsIcon />,
          },
        ],
      },
      // {
      //   title: "Meeting",
      //   links: [
      //     {
      //       name: "Accepted Requests",
      //       icon: <GroupsIcon />,
      //     },
      //     // {
      //     //   name: "calendar",
      //     //   icon: <AiOutlineCalendar />,
      //     // },
      //   ],
      // },
    ],
  },
];

export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];

export const userProfileData = [
  {
    icon: <ManageAccountsIcon />,
    title: "Update Profile",
    // desc: "Update Profile",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    link: "/form",
  },
];

export const chatData = [
  {
    image: avatar,
    message: "Mahansh requested a new meeting",
    desc: "Please go to the meeting request section",
  },
];
