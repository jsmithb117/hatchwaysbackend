const server = require("./server.js");
const supertest = require("supertest");
requestWithSupertest = supertest(server);

describe("Endpoints", () => {
  it("GET /api/ping", async () => {
    const res = await requestWithSupertest.get("/api/ping");
    expect(res.status).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.type).toBe("application/json");
  });
  it("responds to /api/posts with error if tags are not defined", async () => {
    const res = await requestWithSupertest.get("/api/posts?");
    expect(res.body.error).toBe('Tags parameter is required')
  });
  it("responds to /api/posts with error if sortBy is an invalid string", async () => {
    const res = await requestWithSupertest.get("/api/posts?tags=tech&sortBy=like");
    expect(res.body.error).toBe('sortBy parameter is invalid')
  });
  it("responds to /api/posts with error if direction is an invalid string", async () => {
    const res = await requestWithSupertest.get("/api/posts?tags=tech&sortBy=likes&direction=as");
    expect(res.body.error).toBe('direction parameter is invalid')
  });

  it("responds to /api/posts with data sorted in ascending order by ID if sortBy and direction are not defined", async () => {
    const res = await requestWithSupertest.get("/api/posts?tags=tech");
    const ids = res.body.map((elem, index) => {
      return index > 0 ? elem.id <= res.body[index - 1].id : false;
    })
    expect(res.body.length).toBe(28);
    expect(ids).toEqual(expect.not.arrayContaining([true]))
  });

  it("responds to /api/posts with data sorted by ID if sortBy is defined as 'id'", async () => {
    const res = await requestWithSupertest.get("/api/posts?tags=tech&sortBy=id");
    const ids = res.body.map((elem, index) => {
      return index > 0 ? elem.id <= res.body[index - 1].id : false;
    })
    expect(res.body.length).toBe(28);
    expect(ids).toEqual(expect.not.arrayContaining([true]))
  });

  it("responds to /api/posts with data sorted by reads if sortBy is defined as 'reads'", async () => {
    const res = await requestWithSupertest.get("/api/posts?tags=tech&sortBy=reads");
    const ids = res.body.map((elem, index) => {
      return index > 0 ? elem.reads <= res.body[index - 1].reads : false;
    })
    expect(res.body.length).toBe(28);
    expect(ids).toEqual(expect.not.arrayContaining([true]))
  });

  it("responds to /api/posts with data sorted by likes if sortBy is defined as 'likes'", async () => {
    const res = await requestWithSupertest.get("/api/posts?tags=tech&sortBy=likes");
    const ids = res.body.map((elem, index) => {
      return index > 0 ? elem.likes <= res.body[index - 1].likes : false;
    })
    expect(res.body.length).toBe(28);
    expect(ids).toEqual(expect.not.arrayContaining([true]))
  });

  it("responds to /api/posts with data sorted by popularity if sortBy is defined as 'popularity'", async () => {
    const res = await requestWithSupertest.get("/api/posts?tags=tech&sortBy=popularity");
    const ids = res.body.map((elem, index) => {
      return index > 0 ? elem.popularity >= res.body[index - 1].popularity : true;
    })
    expect(res.body.length).toBe(28);
    expect(ids).toEqual(expect.not.arrayContaining([false]))
  });

  it("responds to /api/posts with data sorted in descending order if descending is defined as 'desc'", async () => {
    const res = await requestWithSupertest.get("/api/posts?tags=tech&sortBy=popularity&direction=desc");
    const ids = res.body.map((elem, index) => {
      return index > 0 ? elem.popularity <= res.body[index - 1].popularity : true;
    })
    expect(res.body.length).toBe(28);
    expect(ids).toEqual(expect.not.arrayContaining([false]))
  });
});
