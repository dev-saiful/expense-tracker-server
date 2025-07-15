import { nodeCron as cron } from "node-cron";
import axios from "axios";

const URL = process.env.URL;

cron.schedule(
  "*/14 * * * *",
  async () => {
    console.log(`[${new Date().toISOString()}] Requesting: ${URL}`);
    try {
      const response = await axios.get(URL);
      console.log(response.status);
    } catch (error) {
      console.error("Error executing cron job:", error.message);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Dhaka",
  }
);
