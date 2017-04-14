const builder = require("./builder.js"),
  S3Bucket = require("./s3.js"),
  fs = require("fs"),
  ffmpeg = require("fluent-ffmpeg"),
  winston = require("winston"),
  path = require("path");

function getMetadata(path) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, function(err, metadata) {
      if (err) { return reject(err); }
      resolve({
        duration: Math.round(metadata.format.duration),
        format: metadata.format.format_name
      });
    });
  });
}

function encodeTitle(name) {
  return name.replace(/[^A-Za-z0-9_\-]/g, "-").toLowerCase();
}

function getPodcastItem(bucket, item) {
  const TYPE_FOR_FORMAT = {
    mp3: "audio/mpeg",
    ogg: "audio/ogg"
  };

  return getMetadata(item.localPath).then(({duration, format}) => {
    const type = TYPE_FOR_FORMAT[format];
    const extension = path.extname(item.localPath);
    if (!type) {
      throw new Error(`Unknown audio format: ${format}`);
    }
    return {
      title: item.title,
      description: item.description,
      pubDate: item.pubDate,
      enclosure: {
        url: `https://s3.amazonaws.com/${bucket.name}/${encodeTitle(item.title)}${extension}`,
        length: duration,
        type
      }
    };
  });
}

function upsertItem(bucket, item) {
  const data = fs.readFileSync(item.localPath);
  const extension = path.extname(item.localPath);
  const key = `${encodeTitle(item.title)}${extension}`;
  return bucket.upsertObject(key, data);
}

async function sync(bucketName, data) {
  winston.log("info", "starting sync", {bucket: bucketName});
  let bucket = new S3Bucket(bucketName, "public-read");
  const bucketExists = !!(await bucket.head());
  winston.log("info", "bucket exists", {exists: bucketExists});
  if (!bucketExists) {
    winston.log("info", "creating bucket");
    await bucket.create();
    winston.log("info", "bucket created");
  }
  let podcastItems = [];
  for (let item of data.items) {
    winston.log("info", "processing item", {title: item.title});
    await upsertItem(bucket, item);
    winston.log("info", "item uploaded to s3", {title: item.title});
    const podcastItem = await getPodcastItem(bucket, item);
    podcastItems.push(podcastItem);
  }
  const feedData = {
    title: data.title,
    description: data.description,
    items: podcastItems
  };
  const serializedFeedData = builder(feedData);
  winston.log("info", "generated feed");
  await bucket.upsertObject("feed.rss", serializedFeedData);
  winston.log("info", "sync completed");
}

module.exports = sync;
