import { Request, Response } from "express";
import prisma from "../prisma";

export class BlogController {
  async getBlogs(req: Request, res: Response) {
    try {
      const blogs = await prisma.blog.findMany({
        select: {
          id: true,
          title: true,
          thumbnail: true,
          category: true,
          slug: true,
          user: {
            select: {
              username: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
      res.status(200).send({ blogs });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  async getBlogSlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const blog = await prisma.blog.findUnique({
        where: { slug: slug },
        select: {
          id: true,
          title: true,
          category: true,
          thumbnail: true,
          slug: true,
          createdAt: true,
          content: true,
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });
      res.status(200).send({ blog });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
