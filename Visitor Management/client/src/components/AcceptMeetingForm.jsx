import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {Dialog,DialogTitle,DialogContent,TextField,DialogActions,Button} from "@mui/material";

import axios from "../services/api";

function AcceptMeetingForm({ selectedMeeting,openDialog,setOpenDialog, setSelectedMeeting }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleDialogClose = () => {
    setSelectedMeeting(null);
    setOpenDialog(false);
  };

  const handleConfirm = async (event) => {
    event.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("attendantID", selectedMeeting.senderId);
      formData.append("status", "accepted");
      formData.append("date", date);
      formData.append("time", time);
      formData.append("location", location);
      formData.append(
        "meetingDescription",
        selectedMeeting.meetingDescription
      );
      formData.append("attendantName", selectedMeeting.senderName);
      formData.append("meetingId",selectedMeeting.id);

      console.log("Meeting details submitted:", {
        senderId: selectedMeeting.senderId,
        status: "accepted",
        date,
        time,
        location,
        meetingDescription: selectedMeeting.meetingDescription,
        attendantName: selectedMeeting.senderName,
      });

      const response = await axios.post(
        "/createMeetingFromRequest",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        alert("Meeting Created Successfully");
        setTime("");
        setLocation("");
        setDate("");
        navigate("/acceptedrequests");
      }
      setSelectedMeeting(null);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the meeting");
    }
  };

  return (
    <Dialog open={openDialog} onClose={handleDialogClose}>
      <DialogTitle>Enter Date, Time, and Location</DialogTitle>
      <DialogContent>
        <TextField
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <TextField
          label="Time"
          type="time"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <TextField
          label="Location"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AcceptMeetingForm;
