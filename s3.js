const AWS = require("aws-sdk"),
  crypto = require("crypto");

function promisify(invokee) {
  return new Promise((resolve, reject) => {
    invokee((err, result) => {
      if (err) { return reject(err); }
      resolve(result);
    })
  });
}

function getObjectHash(body) {
  const hash = crypto.createHash("sha256");
  hash.update(body);
  return hash.digest("hex");
}

class S3Bucket {
  constructor(name, acl="private") {
    this.name = name;
    this.acl = acl;
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01'
    });
  }
  create() {
    return promisify((cb) => {
      this.s3.createBucket({
        Bucket: this.name,
        ACL: this.acl
      }, cb);
    });
  }
  head() {
    return promisify((cb) => {
      this.s3.headBucket({
        Bucket: this.name
      }, cb);
    }).catch((error) => {
      if (error.code === "NotFound") {
        return null;
      }
      return Promise.reject(error);
    });
  }
  headObject(key) {
    return promisify((cb) => {
      this.s3.headObject({
        Bucket: this.name,
        Key: key
      }, cb)
    }).catch((error) => {
      if (error.code === "NotFound") {
        return null;
      }
      return Promise.reject(error);
    });
  }
  putObject(key, body) {
    const hash = getObjectHash(body);
    return promisify((cb) => {
      this.s3.putObject({
        Bucket: this.name,
        Key: key,
        Body: body,
        ACL: this.acl,
        Metadata: {
          md5chksum: hash
        }
      }, cb);
    });
  }
  upsertObject(key, body) {
    const hash = getObjectHash(body);
    return this.headObject(key).then((response) => {
      if (response && response.Metadata.md5chksum === hash) {
        return;
      }
      return this.putObject(key, body);
    });
  }
}

module.exports = S3Bucket;
