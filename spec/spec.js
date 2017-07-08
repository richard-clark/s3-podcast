const sync = require("../index.js"),
  assert = require("assert"),
  X2JS = require("x2js"),
  axios = require("axios"),
  fs = require("fs"),
  winston = require("winston");

async function test() {
  const bucketName = process.env.S3_PODCAST_TEST_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("No test bucket specified. Ensure the " +
      "S3_PODCAST_TEST_BUCKET_NAME environment variable is set.");
  }
  console.log(bucketName);
  const data = {
    title: "Literature Podcast",
    description: "The first paragraph from popular books.",
    pubDate: new Date("2017-01-01T00:00:00Z"),
    lastBuildDate: new Date("2017-01-02T00:00:00Z"),
    items: [{
      title: "Alice in Wonderland",
      description: "Lewis Carroll",
      localPath: "./alice.mp3",
      pubDate: new Date("2006-11-11T00:00:00Z")
    }, {
      title: "A Tale of Two Cities",
      description: "Charles Dickens",
      localPath: "./cities.mp3",
      pubDate: new Date("2014-03-30T00:00:00Z")
    }]
  };
  await sync(bucketName, data, winston);
  const response = await axios.get(`https://s3.amazonaws.com/${bucketName}/feed.rss`);
  const actualString = response.data;

  const x2js = new X2JS();
  const actual = x2js.xml2js(actualString);

  const expectedString = fs.readFileSync("./expected.xml", "utf8")
    .replace(/::bucketName::/g, bucketName);
  const expected = x2js.xml2js(expectedString);

  assert.deepEqual(actual, expected, "feed in bucket matches expected");
}

describe("s3-podcast", function() {
  it("works as expected end-to-end", function() {
    this.timeout(10*1000); // 10s; the default of 2s isn't always enough
    return test();
  });
});
