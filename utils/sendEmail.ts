import axios from "axios";

export async function sendEmail(to: string, meetingLink: string) {
  try {
    await axios.post("https://your-email-api.com/send", {
      to: to,
      subject: "Your Zoom Interview Meeting",
      body: `Hello,\n\nYour Zoom interview is scheduled. Join using this link: ${meetingLink}\n\nBest regards,\nInterview Integrity Guard`,
    });

    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Failed to send email:", (error as any)?.response?.data || error);
  }
}
export default sendEmail;
