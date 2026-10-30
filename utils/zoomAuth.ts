import axios from "axios";

const ZOOM_CLIENT_ID = "PnoXQzFuRsqDyZGebDlPsw";
const ZOOM_CLIENT_SECRET = "9Ns4A9SSwghofMxvVpKT4CtUjyPIQhDt";
const ZOOM_ACCOUNT_ID = "KqR89_nKRxqVw6dISKV1MQ";

export const getZoomAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://zoom.us/oauth/token",
      new URLSearchParams({
        grant_type: "account_credentials",
        account_id: ZOOM_ACCOUNT_ID,
      }),
      {
        headers: {
          Authorization: `Basic ${btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error getting Zoom access token:", error.response?.data || error.message);
    } else {
      console.error("Error getting Zoom access token:", error);
    }
    return null;
  }
};
export default getZoomAccessToken;