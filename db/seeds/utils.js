const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.marryFunc = (arr1, arr2, key, arg, arg2) => {
  return arr1.map((object) => {
    const marriedData = arr2.find((content) => content[key] === object[arg]);
    return {
      [arg2]: marriedData.article_id,
      ...object,
    };
  });
};
