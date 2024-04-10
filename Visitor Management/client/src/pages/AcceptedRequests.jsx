import React, { useState, useEffect } from "react";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { Grid, Paper, Typography } from "@mui/material";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "../services/api";
import request from "../services/requests";

function AcceptedRequests() {
  const [meetings, setMeetings] = useState([]);
  const { userData } = useStateContext();

  useEffect(() => {
    const fetchAcceptedMeetings = async () => {
      try {
        const response = await axios.get(request.showAcceptedMeetings, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (response.status === 200) {
          console.log(response.data.data);
          setMeetings(response.data.data);
        } else {
          console.error(
            "Error fetching accepted meetings:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAcceptedMeetings();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(2);

    let daySuffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = "st";
    } else if (day === 2 || day === 22) {
      daySuffix = "nd";
    } else if (day === 3 || day === 23) {
      daySuffix = "rd";
    }

    return `${day}${daySuffix} ${month} '${year}`;
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Meetings" title="Accepted Requests" />
      <Grid container spacing={3}>
        {meetings.map((meeting, index) => (
          <Grid item key={index} xs="auto" sm={6} md={4} lg={3}>
            <Paper
              elevation={0}
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <button
                  type="button"
                  style={{
                    fontSize: "2rem",
                    borderRadius: "20%",
                    padding: "1rem",
                    backgroundColor: "#E5FAFB",
                    color: "#03C9D7",
                  }}
                  onClick={() => handleAccept(request.id)}
                >
                  <MdOutlineSupervisorAccount />
                </button>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "0.5rem",
                  }}
                >
                  <Typography variant="h6">
                    {userData.userType === "faculty"
                      ? meeting.AttendantName
                      : meeting.HostName}
                  </Typography>
                  <div>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(meeting.MeetingDate)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {meeting.MeetingLocation}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography
                variant="body1"
                style={{ color: "rgba(0, 0, 0, 0.4)", marginTop: "1rem" }}
              >
                {meeting.MeetingDescription}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default AcceptedRequests;
