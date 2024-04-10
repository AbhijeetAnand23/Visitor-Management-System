import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  IconButton,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Draggable from "react-draggable";


const socket = io("http://localhost:8080");

const StyledPaper = styled(Paper)({
  minWidth: 500,
  width: "33vw",
  height: "35vh",
  position: "relative",
  overflow: "auto",
});

const HeaderContainer = styled("div")({
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backgroundColor: "white",
});

function PopUp() {
  const [openDialogs, setOpenDialogs] = useState([]);
  const draggableRef = useRef();

  useEffect(() => {
    socket.on("newEntry", (data) => {
      console.log("Received notification about a new entry");
      console.log("Entry details:", data.data);

      setOpenDialogs((prevDialogs) => [
        ...prevDialogs,
        { id: Date.now(), open: true, entryData: data },
      ]);
    });

    return () => {
      socket.off("newEntry");
    };
  }, []);

  const handleClose = (id) => {
    setOpenDialogs((prevDialogs) =>
      prevDialogs.filter((dialog) => dialog.id !== id)
    );
  };

  return (
    <div>
      {openDialogs.map((dialog) => (
        <Dialog
          key={dialog.id}
          open={dialog.open}
          onClose={() => handleClose(dialog.id)}
          maxWidth="md"
          // scroll="paper"
          PaperComponent={(props) => (
            <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
              <div ref={draggableRef}>
                <StyledPaper {...props} />
              </div>
            </Draggable>
          )}
        >
          <DialogContent sx={{ display: "flex" }}>
            {/* Left half for image */}
            <div
              style={{
                position: "sticky",
                top: 0,
                height: "100%",
                flex: "0 0 50%",
                maxWidth: "50%",
              }}
            >
              <Avatar
                src={dialog.entryData.data[0].ImageUrl}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
              />
            </div>
            {/* Right half for information */}
            <div style={{ overflowY: "auto", flex: "1", margin: "15px" }}>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  padding: 0,
                }}
              >
                {Object.entries(dialog.entryData.data[0])
                  .filter(([key]) => key !== "ImageUrl")
                  .map(([key, value]) => (
                    <div>
                      <Typography fontWeight="bold" noWrap gutterBottom>
                        {`${key}: `}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="regular"
                        >
                          {value}
                        </Typography>
                      </Typography>
                    </div>
                  ))}
              </List>
            </div>
          </DialogContent>

          {/* <HeaderContainer>
            <CardHeader
              avatar={
                <Avatar
                  src={avatar}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "10px",
                  }}
                />
              }
              action={
                <IconButton
                  aria-label="close"
                  onClick={() => handleClose(dialog.id)}
                >
                  <CloseIcon />
                </IconButton>
              }
              title={
                <Typography variant="h5" fontWeight="bold" noWrap gutterBottom>
                  {dialog.entryData.data[0].Name}
                </Typography>
              }
              subheader={
                <>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    fontWeight="regular"
                    noWrap
                  >
                    {dialog.entryData.data[0].Email}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    fontWeight="regular"
                    noWrap
                  >
                    {dialog.entryData.data[0].UserType}
                  </Typography>
                </>
              }
            />

            <Divider />
          </HeaderContainer>
          <CardContent>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                padding: "0",
              }}
            >
              {Object.entries(dialog.entryData.data[0])
                .filter(
                  ([key]) =>
                    key !== "UserType" && key !== "ImageUrl" && key !== "Name"
                )
                .map(([key, value]) => (
                  <Grid item xs={6} key={key}>
                    <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
                      <ListItemText
                        primary={key}
                        secondary={
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {value}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Grid>
                ))}
            </List>
          </CardContent> */}
        </Dialog>
      ))}
    </div>
  );
}

export default PopUp;
