const express = require('express');
const app = express();
const axios = require('axios');
const Lyricsdata = require('./lyricsdata');
//const path = require('path'); //---heroku---
const cors = require('cors');
const apikey = '1435c2f8';
const googlesearchkey = 'AIzaSyDP6H0pxT1_s6NJ9mXuGQB6ffL3cSWOViM';
const cs = '011366554791527084890:4kptwuxhhja';

const youtubeapikey = 'AIzaSyDiz0Ihpf002Yb5MzX4K6LeD_xYk0h38n8';

const port = process.env.PORT || 2000;

app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//localhost:2000/getlyrics?artist=ArtistName&title=Title
app.get('/getlyrics', (req, res) => {
  const title = req.query.title;
  const artist = req.query.artist;

  axios
    .all([
      axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`),
      axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${title} ${artist}&maxResults=25&key=${youtubeapikey}`
      )
    ])
    .then(
      axios.spread((lyricsres, youtuberes) => {
        const videoid = youtuberes.data.items[0].id.videoId;
        const imgurl = youtuberes.data.items[0].snippet.thumbnails.high.url;
        const youtubeurl = `www.youtube.com/watch?v=${videoid}`;
        const lyrics = new Lyricsdata({
          title: title,
          artist: artist,
          lyrics: lyricsres.data.lyrics,
          tubeimg: imgurl,
          link: youtubeurl
        });
        return lyrics.save();
      })
    )
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

//localhost:2000/getalllyrics
app.get('/getalllyrics', (req, res) => {
  Lyricsdata.find({})
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//localhost:2000/deletelyrics?title=LyricsTitle
app.get('/deletelyrics', (req, res) => {
  Lyricsdata.deleteMany({ title: req.query.title })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
