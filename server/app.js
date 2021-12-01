const express = require("express");
const axios = require("axios");
const sort = require("../functions/sort");
const flatten = require("../functions/flatten");
const dedupe = require("../functions/dedupe");

const app = express();
const PORT = 3000;

const API = "https://api.hatchways.io/assessment/blog/posts";

const cache = {};

app.get("/api/ping", (req, res) => {
  res.send({ success: true });
});

app.get("/api/posts", async (req, res) => {
  const tags = req.query.tags;
  const sortBy = req.query.sortBy || "id";
  const direction = req.query.direction || "asc";
  const testDuplicates = req.query.test || false;

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
    const tagsInCache = [];
    const tagsNotInCache = [];

    splitTrimmedTags.forEach((tag) => {
      if(cache[tag]) {
        tagsInCache.push(cache[tag])
      } else {
        tagsNotInCache.push(tag)
      }
    })
    const requests = tagsNotInCache.map((tag) => {
      return axios.get(API.concat(`?tag=${tag}`))
  });
    Promise.all(requests)
      .then((response) => response.map((resp) => resp.data))
      .then((uncachedData) => {
        tagsNotInCache.forEach((tag, i) => {
          cache[tag] = uncachedData[i].posts;
          tagsInCache.push(cache[tag]);
        })
        return flatten(tagsInCache);
      }).then((flattened) => {
        if (testDuplicates) {
          return [ ...flattened, ...flattened ]
        } else {
          return flattened
        }
      })
      .then((tested) => dedupe(tested))
      .then((allData) => res.send(sort(allData, sortBy, direction)))
      .catch((err) => res.status(400).send(err));
  }
});

module.exports = app;
