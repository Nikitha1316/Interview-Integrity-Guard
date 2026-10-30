import axios from "axios";
import getZoomAccessToken from "./zoomAuth";

export const scheduleZoomMeeting = async (candidate: any) => {
  try {
    const accessToken = await getZoomAccessToken();
    if (!accessToken) {
      console.error("Failed to retrieve Zoom access token.");
      return null;
    }

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: `Interview with ${candidate.name}`,
        type: 2, // Scheduled meeting
        start_time: candidate.date,
        duration: 60, // 1-hour meeting
        timezone: "Asia/Kolkata",
        agenda: "Candidate Interview",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.join_url; // Returns the meeting link
  } catch (error) {
    console.error("Error scheduling Zoom meeting:", error);
    return null;
  }
};
export default scheduleZoomMeeting;