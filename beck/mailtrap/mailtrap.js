import mailtrapPkg from "mailtrap";
const { MailtrapClient } = mailtrapPkg;

import dotenv from "dotenv";
dotenv.config();


const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailtrapclient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "itamar",
};


