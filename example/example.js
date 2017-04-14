const sync = require("../index.js");

const data = {
  title: "Literature Podcast",
  description: "The first paragraph from popular books.",
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

const bucketName = "rc-podcast-test";
sync(bucketName, data)
