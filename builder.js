const X2JS = require("x2js");

/*
const data = {
  title: "Example blog podcast",
  link: "http://www.example.com/blog",
  description: "An example website",
  language: "en",
  copyright: "None",
  lastBuildDate: "Thu, 21 Dec 2000 16:01:07 +0200",
  webMaster: "example@example.com",
  items: [{
    title: "Example news",
    description: "This episode features an example sound file.",
    pubDate: "Thu, 21 Dec 2000 16:01:07 +0200",
    enclosure: {
      url: "http://www.example.com/podcast1.mp3",
      length: "18001",
      type: "audio/mpeg"
    }
  }]
}
*/

// https://gist.github.com/samhernandez/5260558
function rssDateString(date) {

  if (typeof date === 'undefined') {
    date = new Date();
  }

  const pieces = date.toString().split(' '),
    offsetTime = pieces[5].match(/[-+]\d{4}/),
    offset = (offsetTime) ? offsetTime : pieces[5],
    parts = [
      pieces[0] + ',',
      pieces[2],
      pieces[1],
      pieces[3],
      pieces[4],
      offset
    ];

  return parts.join(' ');
}

function generateFeed(userData) {
  const BASE_DATA = {
    title: "Example blog podcast",
    // link: "http://www.example.com/blog",
    description: "An example website",
    language: "en",
    copyright: "None",
    lastBuildDate: new Date(),
    // webMaster: "example@example.com",
    items: []
  };
  const data = Object.assign(BASE_DATA, userData);

  const items = data.items.map((_item) => {
    const item = Object.assign({
      type: "audio/mpeg"
    }, _item);

    return {
      title: item.title,
      description: item.description,
      pubDate: rssDateString(item.pubDate),
      enclosure: {
        _url: item.enclosure.url,
        _length: item.enclosure.length,
        _type: item.enclosure.type
      }
    };
  });

  const jsData = {
    "rss": {
      "_version": "2.0",
      "_xmlns:dc": "http://purl.org/dc/elements/1.1/",
      "channel": [{
        "title": data.title,
        "link": data.link,
        "description": data.description,
        "language": data.language,
        "copyright": data.copyright,
        "lastBuildDate": rssDateString(data.lastBuildDate),
        "webMaster": data.webMaster,
        "item": items
      }]
    }
  };

  const x2js = new X2JS();
  const declaration = '<?xml version="1.0" encoding="utf-8"?>';
  return declaration + x2js.js2xml(jsData);
}

module.exports = generateFeed;
