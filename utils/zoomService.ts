import axios from "axios";
import { getZoomAccessToken } from "./zoomAuth";

const ZOOM_BASE_URL = "https://api.zoom.us/v2";

export const createZoomMeeting = async (candidateEmail: string) => {
  const accessToken = await getZoomAccessToken();
  if (!accessToken) return null;

  try {
    const response = await axios.post(
      `${ZOOM_BASE_URL}/users/me/meetings`,
      {
        topic: "Interview with Candidate",
        type: 2, // Scheduled meeting
        start_time: new Date().toISOString(),
        duration: 30, // 30-minute meeting
        timezone: "UTC",
        agenda: "Interview Integrity Guard Meeting",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Contains join_url for candidate
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating Zoom meeting:", error.response?.data || error.message);
    } else {
      console.error("Error creating Zoom meeting:", (error as Error).message);
    }
    return null;
  }
};
export default createZoomMeeting;
