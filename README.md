# S3 Podcast

Package for deploying podcasts to S3 buckets.

Example usage:

```javascript
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

const bucketName = "podcast-test";
sync(bucketName, data)
```

The URL of the podcast will be (since the bucket name in this case is `podcast-test`) <https://s3.amazonaws.com/podcast-test/feed.rss>.

Note that S3 bucket names must be universally unique, so you'll need to choose a different name.

## Installation and Setup

You can install the package using `npm`:

```
npm install
```

This package wraps the [AWS SDK for Node.js](https://aws.amazon.com/sdk-for-node-js/). Before using this package, you'll need to provide the SDK with a valid set of credentials. [Amazon's documentation](https://aws.amazon.com/sdk-for-node-js/) provides instructions for doing this.

## Development

To develop against this repository, run `npm install` from the repository root to install development dependencies.

Tests cover generating a podcast and staging that podcast to an S3 bucket, so you'll need to follow the [Setup](#setup) instructions first.

To run tests:

```
S3_PODCAST_TEST_BUCKET_NAME=some-bucket npm test
```
