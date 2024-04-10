import axios from "../services/api";
import request from "../services/requests";

const RejectMeetingFromRequest = async (requests) => {
  try {
    const formData = new URLSearchParams();
    formData.append("meetingId", requests.id);

    const response = await axios.post(
      request.deleteMeetingFromRequest,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "An error occurred during the API call" };
  }
};

export default RejectMeetingFromRequest;
