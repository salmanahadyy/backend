import { Router } from "express";
import { BlogController } from "../controllers/blog.controller";
import { checkAdmin, verifyToken } from "../middleware/verify";
import { uploader } from "../services/uploader";

export class BlogRouter {
  private blogController: BlogController;
  private router: Router;

  constructor() {
    this.blogController = new BlogController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.blogController.getBlogs);
    this.router.post(
      "/",
      verifyToken,
      checkAdmin,
      uploader("memoryStorage", "blog-").single("thumbnail"),
      this.blogController.createBlog
    );
    this.router.get("/:slug", this.blogController.getBlogSlug);

    /* this.router.post("/",this.blogController.createUser)

        this.router.get("/:id", this.blogController.getUserId)
        this.router.patch("/:id",this.blogController.editUser)
        this.router.delete("/:id",this.blogController.deleteUser) */
  }

  getRouter(): Router {
    return this.router;
  }
}
