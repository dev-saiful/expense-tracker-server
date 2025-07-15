import { CronJob } from "cron";
import https from "https";

const URL = process.env.URL;

const job = new CronJob("*/14 * * * *", function(){
    https.get(URL,(res)=>{
        if(res.statusCode===200)
        {
            console.log("Request sent successfully");
        }
        else
        {
            console.log("Request failed",res.statusCode);
        }
    }).on("error",(e)=>{
        console.error("Internel error",e);
    });
});

export default job;