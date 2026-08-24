import { sendVerificationEmail } from "../src/lib/services/emailService";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  console.log("Sending luxury branded verification email test...");
  const res = await sendVerificationEmail("muhammad.rovaid@zaxiss.com", "938104", "Muhammad Rovaid");
  console.log("Result:", res);
}

run();
