import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

function base64URLEncode(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer: Buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

function generatePKCE() {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(sha256(Buffer.from(verifier)));
  return { verifier, challenge };
}

let twitterCodeVerifier = "";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/auth/google", (_, res) => {
  const redirectUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: "http://localhost:4000/auth/google/callback",
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

  res.redirect(redirectUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code as string;

  const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: "http://localhost:4000/auth/google/callback",
      grant_type: "authorization_code",
    },
  );

  const { access_token } = tokenResponse.data;

  const userInfo = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  // console.log(userInfo.data);

  res.redirect("http://localhost:5173/");
});

app.get("/auth/microsoft", (req, res) => {
  const url =
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
    new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      response_type: "code",
      redirect_uri: "http://localhost:4000/auth/microsoft/callback",
      response_mode: "query",
      scope: "openid email profile User.Read",
    });

  res.redirect(url);
});

app.get("/auth/microsoft/callback", async (req, res) => {
  const code = req.query.code as string;

  const tokenRes = await axios.post(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:4000/auth/microsoft/callback",
      code,
    }),
  );

  const userRes = await axios.get("https://graph.microsoft.com/v1.0/me", {
    headers: {
      Authorization: `Bearer ${tokenRes.data.access_token}`,
    },
  });

  // console.log(userRes.data);

  res.redirect("http://localhost:5173/");
});

app.get("/auth/github", (req, res) => {
  const url =
    "https://github.com/login/oauth/authorize?" +
    new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      redirect_uri: "http://localhost:4000/auth/github/callback",
      scope: "read:user user:email",
      prompt: "login"
    });

  res.redirect(url);
});

app.get("/auth/github/callback", async (req, res) => {
  const code = req.query.code as string;

  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  const userRes = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenRes.data.access_token}`,
    },
  });

  // console.log(userRes.data);

  res.redirect("http://localhost:5173/");
});

app.get("/auth/twitter", (req, res) => {
  const { verifier, challenge } = generatePKCE();
  twitterCodeVerifier = verifier;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.TWITTER_CLIENT_ID!,
    redirect_uri: process.env.TWITTER_CALLBACK_URL!,
    scope: "users.read tweet.read",
    state: "state",
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  res.redirect(`https://twitter.com/i/oauth2/authorize?${params.toString()}`);
});

app.get("/auth/twitter/callback", async (req, res) => {
  try {
    const code = req.query.code as string;

    const basicAuth = Buffer.from(
      `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`,
    ).toString("base64");

    const tokenRes = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: process.env.TWITTER_CALLBACK_URL!,
        code,
        code_verifier: twitterCodeVerifier,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
      },
    );

    const userRes = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${tokenRes.data.access_token}`,
      },
    });

    // console.log("TWITTER USER 👉", userRes.data);

    res.redirect("http://localhost:5173/");
  } catch (err: any) {
    console.error("TWITTER LOGIN ERROR:", err.response?.data || err.message);
    res.status(500).send("Twitter login failed");
  }
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
