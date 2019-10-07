var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var axios = require('axios');
var fs = require('fs');
var FormData = require('form-data');
const sharp = require('sharp');

const app = express();

let modes = {
  horizontal: { height: 755, width: 450 },
  vertical: { height: 365, width: 450 },
  horizontalSmall: { height: 365, width: 212 },
  gallery: { height: 380, width: 380 }
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.post('/imageData', upload.single('image'), async (req, res, next) => {
  let cropImgPromises = [];
  req.body.dims = JSON.parse(req.body.dims);

  Object.keys(modes).forEach(e => {
    let cropPromise = sharp(req.file.path).extract({
      width: modes[e].width,
      height: modes[e].height,
      left: req.body.dims[e].x,
      top: req.body.dims[e].y,
    }).toFile('uploads/' + e + '.jpg');
    cropImgPromises.push(cropPromise);
  });
  let fileInfos = await Promise.all(cropImgPromises);

  let uploadRequests = [];

  Object.keys(modes).forEach(e => {
    let fileData = fs.readFileSync('uploads/' + e + '.jpg').toString('base64');
    let config = {
      headers: {
        authorization: 'Client-ID fcaa7d97d99fe0d',
        'content-type': 'application/json'
      }
    };
    uploadRequests.push(axios.post('https://api.imgur.com/3/image', {image : fileData}, config));
  });

  let uploadedUrls = await Promise.all(uploadRequests);
  uploadedUrls = uploadedUrls.map((v)=>{return v.data.data.link});
  res.send({links: uploadedUrls});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
