const express = require("express");
const axios = require("axios");
const sort = require("../functions/sort");
const flatten = require("../functions/flatten");
const dedupe = require("../functions/dedupe")
const app = express();
const PORT = 3000;

const API = "https://api.hatchways.io/assessment/blog/posts";

app.get("/api/ping", (req, res) => {
  res.send({ success: true });
});

app.get("/api/posts", async (req, res) => {
  const tags = req.query.tags;
  const sortBy = req.query.sortBy || "id";
  const direction = req.query.direction || "asc";

  const sortByIsValid = ["id", "reads", "likes", "popularity"].includes(sortBy);
  const directionIsValid = ["asc", "desc"].includes(direction);

  if (!tags) {
    res.status(400).send({ error: "Tags parameter is required" });
  } else if (!sortByIsValid) {
    res.status(400).send({ error: "sortBy parameter is invalid" });
  } else if (!directionIsValid) {
    res.status(400).send({ error: "direction parameter is invalid" });
  } else {
    const splitTrimmedTags = tags.split(",").map((tag) => tag.trim());
    const requests = splitTrimmedTags.map((tag) =>
      axios.get(API.concat(`?tag=${tag}`))
    );
    Promise.all(requests)
      .then((responses) => responses.map((response) => response.data))
      .then((nestedData) => flatten(nestedData))
      .then((unsorted) => sort(unsorted, sortBy, direction))
      .then((sorted) => res.send(dedupe(sorted)));
  }
});

app.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`);
});
