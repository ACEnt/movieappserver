const mongoose = require('mongoose');
const db = 'mongodb://alex:1q2w3e4r5t@ds011298.mlab.com:11298/webapiassignment';

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log('Mongoose connetion error: ', error);
  });

const schema = mongoose.Schema({
  lyrics: { type: String },
  title: { type: String },
  artist: { type: String },
  link: { type: String },
  tubeimg: { type: String }
});

const Assignment = mongoose.model('Assignment', schema, 'lyrics');

module.exports = Assignment;
