module.exports = (unsorted, sortBy, direction) => {
  const sorted = direction === "asc"
    ? unsorted.sort((a, b) => a[sortBy] - b[sortBy])
    : unsorted.sort((a, b) => b[sortBy] - a[sortBy])
  return sorted
};
