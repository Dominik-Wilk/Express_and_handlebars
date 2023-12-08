const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Katalog, do którego będą zapisywane pliki
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Oryginalna nazwa pliku
  },
});

const upload = multer({ storage: storage });

app.engine(
  'hbs',
  hbs({ extname: 'hbs', layoutsDir: './views/layouts', defaultLayout: 'main' })
);
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));

app.post(
  '/contact/send-message',
  upload.single('projectDesign'),
  (req, res) => {
    const { author, sender, title, message } = req.body;
    const fileName = req.file ? req.file.originalname : '';

    if (author && sender && title && message && fileName) {
      const imgPath = req.file ? `/uploads/${fileName}` : '';
      res.render('contact', { isSent: true, imgPath });
    } else {
      res.render('contact', { isError: true });
    }
  }
);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'dark' });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
