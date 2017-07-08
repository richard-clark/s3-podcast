# S3 Podcast

A package for easily publishing podcasts using [Amazon S3](https://aws.amazon.com/s3/).

Example usage:

```javascript
const s3Podcast = require("s3-podcast");

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
s3Podcast(bucketName, data);
```

The URL of the podcast will be <https://s3.amazonaws.com/podcast-test/feed.rss> (since the bucket name in this case is `podcast-test`).

## Installation and Setup

You can install the package using `npm`:

```
npm install
```

This package wraps the [AWS SDK for Node.js](https://aws.amazon.com/sdk-for-node-js/). Before using this package, you'll need to provide the SDK with a valid set of credentials. This is typically done by creating a file at `~/.aws/credentials` (on Mac/Linux) with a format like this:

```
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

[Amazon's documentation](https://aws.amazon.com/sdk-for-node-js/) provides more comprehensive instructions for configuring the SDK.

## Usage

### `s3Podcast(bucketName, config, [logger])`

#### `bucketName`

If `bucketName` doesn't exist, the function will attempt to create it.

Note that S3 bucket names must be universally unique, so you'll need to choose a name that isn't already being used.

#### `config`

The `config` object has the following schema:

- `title`
- `description`
- `items`: an array of _item_ objects (see below)

Each _item_ has the following schema:

- `title`
- `description`
- `localPath`: the path to the audio file, relative to the current directory.
- `pubDate` (a `Date` instance)

#### `[logger]`

The optional `logger` argument, if specified, should be an instance of a [winston](https://github.com/winstonjs/winston) logger. (Or something that implements a compatible interface.)

## Development

To develop against this repository, run `npm install` from the repository root to install development dependencies.

Tests cover generating a podcast and staging that podcast to an S3 bucket, so you'll need to follow the [Setup](#setup) instructions first.

To run tests:

```
S3_PODCAST_TEST_BUCKET_NAME=some-bucket npm test
```
