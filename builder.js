const X2JS = require("x2js");

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
  const now = new Date();
  const BASE_DATA = {
    title: "Example blog podcast",
    description: "An example website",
    language: "en",
    copyright: "None",
    pubDate: now,
    lastBuildDate: now,
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
      guid: item.enclosure.url,
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
      "_xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
      "channel": [{
        "title": data.title,
        "link": data.link,
        "description": data.description,
        "language": data.language,
        "copyright": data.copyright,
        "lastBuildDate": rssDateString(data.lastBuildDate),
        "pubDate": rssDateString(data.pubDate),
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
