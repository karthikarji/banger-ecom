import UserModel, { UserDocument } from "@models/userModel";
import { NewUserRequest } from "@/app/types";
import startDB from "@lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import EmailVerificationToken from "@/app/models/emailVerificationToken";
import crypto from "crypto";

export async function POST(req: Request) {
  const userObj = (await req.json()) as NewUserRequest;
  await startDB();

  const newUser: UserDocument = await UserModel.create({
    ...userObj,
  });

  const token = crypto.randomBytes(36).toString("hex");

  EmailVerificationToken.create({
    user: newUser._id,
    token: token,
  });

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "16602e5af212f6",
      pass: "f528bc29d3fa4d",
    },
  });

  const verificationURL = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  await transport.sendMail({
    from: "verification@bangerecom.com",
    to: newUser.email,
    html: `<h1>Please verify your email by clicking on <a href="${verificationURL}">this link</a> </h1>`,
  });
  return NextResponse.json({
    message: "Please check your email to verify the account",
  });
}
