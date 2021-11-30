module.exports = (nestedData) => {
  let flat = [];
  nestedData.forEach((elem) => {
    flat = [...flat, ...elem.posts];
  });
  return flat;
};
