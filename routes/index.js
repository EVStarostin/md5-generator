const express = require('express');
const router = express.Router();
const multer  = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const dir = './hashes';

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MD5 Generator' });
});

router.post('/', upload.single('file'), function(req, res, next) {  
  const hash = crypto.createHash('md5').update(req.file.buffer).digest('hex')
  console.log('--- хэш посчитан ---');

  const fileName = path.join(dir, req.file.originalname + '.md5');
  fs.writeFile(fileName, hash, (err) => {
    if (err) throw err;
    console.log('--- файл с md5 суммой сохранен ---');

    res.download(fileName, (err) => {
      if (err) throw err;
      console.log('--- файл с md5 суммой отправлен клиенту ---');

      fs.unlink(fileName, (err) => {
        if (err) throw err;
        else console.log('--- файл с md5 суммой удален ---');
      });
    });
  });
});

module.exports = router;
