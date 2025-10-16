const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

// LOOKUP OBJECT FUNCTION
/*{object}

Marry Article_ID -> Title
*/

exports.marryFunc = (data, rows) => {
  return data.map((comment) => {
    const marriedComments = rows.find(
      (article) => article.title === comment.article_title
    );
    return {
      article_id: marriedComments.article_id,
      ...comment,
    };
  });
};
