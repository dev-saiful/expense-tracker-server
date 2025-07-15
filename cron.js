import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const URL = process.env.URL;

const query = `
  query {
    __typename
  }
`;

async function sendRequest() {
  try {
    const response = await axios.post(URL, { query }, {
      headers: {
        'Content-Type': 'application/json',
        'x-apollo-operation-name': 'HealthCheck'
      }
    });
    console.log(`[${new Date().toISOString()}] ✅ Success:`, response.data);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Error:`, err.response?.data || err.message);
  }
}

// Call once immediately
sendRequest();

// Then every 14 minutes = 14 * 60 * 1000 ms
setInterval(sendRequest, 14 * 60 * 1000);
