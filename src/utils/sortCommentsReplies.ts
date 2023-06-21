import * as Commnet from '../types/CommentProjectType';

export const sortForReplies = (comments: Commnet.sortForReplies[]) => {
  try {
    const commentsMap: { [commentId: number]: any } = {};

    const result = [];

    for (const comment of comments) {
      const commentId = comment.comment_id;

      commentsMap[commentId] = {
        comment_id: commentId,
        parent_id: comment.parent_id,
        user_id: comment.user_id,
        user_name: comment.user_name,
        user_img: comment.user_img,
        comment_content: comment.comment_content,
        comment_created_at: comment.comment_created_at,
        replies: [],
      };
    }

    for (const comment of comments) {
      const parentId = comment.parent_id;

      if (parentId !== null) {
        const parentComment = commentsMap[parentId];

        if (parentComment) {
          parentComment.replies.push(commentsMap[comment.comment_id]);
        }
      } else {
        result.push(commentsMap[comment.comment_id]);
      }
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};
