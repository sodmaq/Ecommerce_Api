const Blog = require('../model/blogModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      status: 'success',
      Blog: newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      status: 'success',
      updatedBlog: updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getABlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    // Find the blog by its ID and increment the numViews field by 1
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id },
      { $inc: { numViews: 1 } },
      { new: true }
    )
      .populate('likes')
      .populate('dislikes');

    // Respond with the updated blog object
    res.json({
      status: 'success',
      blog: updatedBlog,
    });
  } catch (error) {
    // Handle errors
    throw new Error(error);
  }
});

const getAllBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const allBlogs = await Blog.find().populate('likes').populate('dislikes');

    res.json({
      status: 'success',
      Blogs: allBlogs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);

    res.json({
      status: 'success',
      msg: 'blog successfully deleted!',
    });
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  try {
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    // Find login user
    const loginUserId = req.user._id;

    // Check if user has liked the blog
    const isLiked = blog.likes.includes(loginUserId);

    // Check if user has disliked the blog
    const alreadyDisliked = blog.dislikes.includes(loginUserId);

    // If the user has already disliked the blog, remove the dislike
    if (alreadyDisliked) {
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      });
    }

    // If the user has not already liked the blog, add the like
    if (!isLiked) {
      await Blog.findByIdAndUpdate(blogId, {
        $push: { likes: loginUserId },
        isLiked: true,
      });
    }

    res.json({ status: 'success', message: 'Blog liked successfully' });
  } catch (error) {
    // Handle errors
    throw new Error(error);
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  try {
    // Find the blog which you want to be disliked
    const blog = await Blog.findById(blogId);

    // Find login user
    const loginUserId = req.user._id;

    // Check if user has disliked the blog
    const isDisliked = blog.dislikes.includes(loginUserId);

    // Check if user has liked the blog
    const alreadyLiked = blog.likes.includes(loginUserId);

    // If the user has already liked the blog, remove the like
    if (alreadyLiked) {
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { likes: loginUserId },
        isLiked: false,
      });
    }

    // If the user has not already disliked the blog, add the dislike
    if (!isDisliked) {
      await Blog.findByIdAndUpdate(blogId, {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      });
    }

    res.json({ status: 'success', message: 'Blog disliked successfully' });
  } catch (error) {
    // Handle errors
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getABlog,
  deleteBlog,
  getAllBlog,
  likeBlog,
  dislikeBlog,
};
