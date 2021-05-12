const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const Course = require('./models/Course');
const { result } = require('lodash');

//express app
const app = express();

// middleware
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


//register view engine
app.set('view engine', 'ejs');
app.set('views');

// database connection
// const dbURI = 'mongodb+srv://shaun:test1234@cluster0.del96.mongodb.net/node-auth';
mongoose.connect('mongodb://localhost:27017/coursetip', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(3000)
  console.log('Database connected.');
});
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
//   .then((result) => app.listen(3000))
//   .catch((err) => console.log(err));

app.get('*', checkUser);

app.get('/', (req, res) => {
  // const courses = [
  //   {title: 'FreeCodeCamp', description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'},
  //   {title: 'Hackerrank', description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'},
  //   {title: 'GeekforGeeks', description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'},
  //   {title: 'W3Schools', description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'}
  // ]
  // res.render('home', { courses });

  Course.find().sort({ createdAt: -1})
      .then((result) => {
        res.render('home', { courses: result});
      })
      .catch((err) => {
        console.log(err);
      })
});

app.post('/addcourse', requireAuth, (req, res) => {
  const course = new Course(req.body);

  course.save()
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    })
});

app.post('/addreview', requireAuth, (req, res) => {
  const { courseName, courseReview } = req.body;
  console.log(courseName+"1");
  console.log(courseReview+"2");

  // Course.findOne({name: courseName}, function(err, docs) {
    
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     docs.reviews.push(courseReview);
  //     console.log('saved in db');
  //     console.log(docs);
  //   }
  // });

  Course.findOne({name: courseName}).then(function(record){
    record.reviews.push({review: courseReview});
    record.save()
      .then(() => {
      console.log('document saved');
      // console.log(record.reviews);
      // console.log(record.reviews[0].review);
      // record.reviews.forEach(review => {
      //   console.log(review.review);
      // });
      })
      .catch((err) => {
        console.log(err);
      })
  });

  res.redirect('/');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/profile', requireAuth, (req, res) => {
  const courses = [
    {title: 'FreeCodeCamp', description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'},
    {title: 'Hackerrank', description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'},
    {title: 'GeekforGeeks', description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'},
    {title: 'W3Schools', description: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'}
  ]
  
  res.render('profile', { courses });
});

app.get('/askforreview', requireAuth, (req, res) => {
  res.render('askforreview');
});

// app.get('/reviews', (req, res) => {
//   const courseReviews = [
    
      
//       {
//         user: 'Dhrumil',
//         review: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'
//       },
//       {
//         user: 'Jayvir',
//         review: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'
//       },
//       {
//         user: 'keval',
//         review: 'Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.'
//       }
    
//   ]

//   res.render('reviews', { courseReviews });
// });

// app.get('/login', (req, res) => {
//   res.render('login');
// });

// app.get('/signup', (req, res) => {
//   res.render('signup');
// });
app.use(authRoutes);