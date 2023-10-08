import Comment from "../mongodb/models/comment.js";

const createComment = async (req, res) => {
  try {
    const commentData = req.body;
    const comment = await Comment.create(commentData);
    req.booking.comments.push(comment._id);
    await req.booking.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const commentData = req.body;
    const foundComment = await Comment.findById(req.params.commentId);
    if (req.userId !== foundComment.by.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      commentData,
      {
        new: true,
      }
    );
    res.status(200).json(comment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    if (req.params.commentId) {
      const deletedComment = await Comment.findByIdAndDelete(
        req.params.commentId
      );
      req.booking.comments = req.booking.comments.filter(
        (comment) => comment.toString() !== req.params.commentId
      );
      await req.booking.save();
      res.status(200).json(deletedComment);
    } else {
      req.booking.comments.forEach(async (comment) => {
        await Comment.findByIdAndDelete(comment);
      });
      req.booking.comments = [];
      await req.booking.save();
      res.status(200).json({ message: "All comments deleted from booking." });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { createComment, updateComment, deleteComment };
