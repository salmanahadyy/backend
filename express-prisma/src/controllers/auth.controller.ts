import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findUser } from "../services/user.service";
import { sign, verify } from "jsonwebtoken";
import { transporter } from "../services/mailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

export class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const { password, confirmPassword, username, email } = req.body;
      if (password != confirmPassword) throw { message: "Password not match" };

      const user = await findUser(username, email);
      if (user) throw { message: "username or email has been used" };

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const newUser = await prisma.user.create({
        data: { username, email, password: hashPassword },
      });

      const payload = { id: newUser.id, role: newUser.role };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });
      const link = `http://localhost:3000/verify/${token}`;

      const templatePath = path.join(__dirname, "../templates", "verify.hbs");
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ username, link });

      await transporter.sendMail({
        from: "ahady1105@gmail.com",
        to: email,
        subject: "welcome to Blogger",
        html,
      });

      res.status(201).send({ message: "Register Successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw { message: "Account not found" };
      if (user.isSuspend) throw { message: "Account Suspended!" };
      if (!user.isVerify) throw { message: "Account Not Verify!" };

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        await prisma.user.update({
          data: { loginAttempt: { increment: 1 } },
          where: { id: user.id },
        });
        if (user.loginAttempt == 2) {
          await prisma.user.update({
            data: { isSuspend: true },
            where: { id: user.id },
          });
        }
        throw { message: "Incorrect Password" };
      }

      await prisma.user.update({
        data: { loginAttempt: { increment: 0 } },
        where: { id: user.id },
      });

      const payload = { id: user.id, role: user.role };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        })
        .send({
          message: "Login Successfully",
          user,
        });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const verifiedUser: any = verify(token, process.env.JWT_KEY!);
      await prisma.user.update({
        data: { isVerify: true },
        where: { id: verifiedUser.id },
      });

      res.status(200).send({message:"Verify successfully"})
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
