import superagent from "superagent";
import enquirer from 'enquirer';
import formData from 'form-data';
import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import { LOGIN_URL } from "../constants/url.js";

const { prompt } = enquirer;
const Agent = superagent.agent();

export async function getToken () {
  const response = await axios(LOGIN_URL);
  const $ = await cheerio.load(response.data);
  
  let token = $(`input[name="token"]`).attr("value");
  return token;
}

export async function login () {
  const input = await prompt([
    {
      type: "input",
      name: "user",
      message: "input username"
    },
    {
      type: "password",
      name: "password",
      message: "input password"
    }
  ]);
  const token = await getToken();
  const credentials = {
    ...input,
    token: token,
    connect: true,
    remember: true
  };
  
  const dashboard = await Agent()
    .post(LOGIN_URL)
    .field("user", credentials.user)
    .field("password", credentials.password)
    .field("connect", credentials.connect)
    .field("remember", credentials.remember)
    .field("token", credentials.token)
    .set("Content-Type", "multipart/form-data");
  console.log(dashboard.text)
  fs.writeFileSync("response.html", dashboard.text);
}


export async function mine () {
  
}