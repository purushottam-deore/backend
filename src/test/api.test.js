const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

beforeAll(async () => {
  // Connect to MongoDB (make sure MongoDB is running)
  await mongoose.connect("mongodb://127.0.0.1:27017/youtubeSubscribersTest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /subscribers", () => {
  it("should return all subscribers", async () => {
    const res = await request(app).get("/subscribers");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /subscribers/names", () => {
  it("should return only name and subscribedChannel fields", async () => {
    const res = await request(app).get("/subscribers/names");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("subscribedChannel");
    }
  });
});

describe("GET /subscribers/:id", () => {
  it("should return a subscriber by ID", async () => {
    const allSubs = await request(app).get("/subscribers");
    if (allSubs.body.length > 0) {
      const id = allSubs.body[0]._id;
      const res = await request(app).get(`/subscribers/${id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id", id);
    }
  });

  it("should return 400 for invalid ID", async () => {
    const res = await request(app).get("/subscribers/invalidid");
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });
});
