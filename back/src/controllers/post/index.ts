import { Request, Response } from "express";
import {
  getPostsService,
  getPostService,
  addPostService,
  editPostService,
  deletePostService,
} from "../../services/post";

export const getPosts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const search = req.query.search as string;
    const posts = await getPostsService(search);
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).send(e);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id } = req.params;

    const post = await getPostService(id as string);
    if (!post) return res.status(404).send({ message: "post does not exist" });
    return res.status(200).json(post);
  } catch (e) {
    return res.status(400).send(e);
  }
};

export const addPost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { title, content } = req.body;
    const post = await addPostService({ title, content });
    return res.status(200).json(post);
  } catch (e) {
    return res.status(400).send(e);
  }
};

export const editPost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = await editPostService(id as string, { title, content });
    if (!post) return res.status(404).send({ message: "post does not exist" });
    return res.status(200).json(post);
  } catch (e) {
    return res.status(400).send(e);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id } = req.params;

    const deletedId = await deletePostService(id as string);

    if (!deletedId) {
      return res.status(404).json({
        message: "Post does not exist",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      id: deletedId,
    });
  } catch (e) {
    return res.status(400).send(e);
  }
};
