
/********************************************************************************
* WEB700 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Taslima Parvin Student ID: 112339171 Date: 03/11/2023______________
*
********************************************************************************/


const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const collegeData = require("./modules/collegeData.js");
const exphbs = require('express-handlebars');

const path = require("path");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//const { error } = require("console");
// Define the route for /students
app.engine('.hbs', exphbs.engine({ 
  extname: '.hbs',
  helpers: {
    navLink: function(url, options) {
      return `<li class="nav-item">
        <a class="nav-link ${url == app.locals.activeRoute ? "active" : "" }" 
        href="${url}">${options.fn(this)}</a>
      </li>`;
    },
    equal: function(lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));

app.set('view engine', '.hbs');
app.get('/students', (req, res) => {
  const course = parseInt(req.query.course);

  // If course is provided in the query parameters, call getStudentsByCourse
  if (course) {
      collegeData.getStudentsByCourse(course)
          .then(students => {
              res.render("students", { students });
          })
          .catch(error => {
              console.error('Error fetching students by course:', error);
              res.render("students", { message: "no results" });
          });
  } else {
      // If no course parameter, call getAllStudents
      collegeData.getAllStudents()
          .then(students => {
              res.render("students", { students });
          })
          .catch(error => {
              console.error('Error fetching all students:', error);
              res.render("students", { message: "no results" });
          });
  }
});



    

// Existing route for courses
app.get('/courses', (req, res) => {
  collegeData.getCourses()
      .then(courses => {
          res.render("courses", { courses });
      })
      .catch(error => {
          console.error('Error fetching courses:', error);
          res.render("courses", { message: "no results" });
      });
});
  

// Define route to get student by number
app.get('/student/:num', (req, res) => {
  const studentNum = parseInt(req.params.num); // Parse num parameter as an integer

  collegeData.getStudentByNum(studentNum)
    .then(student => {
      if (student) {
        // If a student is found, render the "student" view with the student data
        res.render("student", { student });
      } else {
        // If no student is found, render the "student" view with a message and a 404 status code
        res.status(404).render("student", { message: 'Student not found' });
      }
    })
    .catch(error => {
      // If there's an error, render the "student" view with an error message and a 500 status code
      res.status(500).render("student", { message: 'Internal server error' });
    });
});

// app.post("/student/update", (req, res) => {
//   console.log(req.body);
//   res.redirect("/students");
//  });
app.post("/student/update", (req, res) => {
  collegeData.updateStudent(req.body)
      .then((value) => {
          const successMessage = 'The student (studentNum=' + value.studentNum + ') has been updated successfully!';
          res.redirect('/students?respType=success&respMessage=' + encodeURIComponent(successMessage));
      })
      .catch((error) => {
          const errorMessage = encodeURIComponent(error);
          res.redirect('/students?respType=error&respMessage=' + errorMessage);
      });
});


// Define route to get course by ID
app.get('/course/:id', (req, res) => {
  const courseId = req.params.id;

  collegeData.getCourseById(courseId)
      .then(course => {
          res.render("course", { course });
      })
      .catch(error => {
          console.error('Error fetching course by ID:', error);
          res.render("course", { message: "Course not found" });
      });
});


// Initialize the data before starting the server
collegeData.initialize()
  .then(() => {
    // Routes setup

    app.use(function(req,res,next){
      let route = req.path.substring(1);
      app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, "")); 
      next();
     });
    // Route to serve home.html
    app.get('/', (req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.render('home');
  });
  
    // Route to serve about.html
    app.get('/about', (req, res) => {
      res.render('about');
  });
  

    // Route to serve htmlDemo.html
   app.get('/htmlDemo', (req, res) => {
    res.render('htmlDemo');
});

app.get('/students/add', (req, res) => {
  res.render('addStudent');
});
    app.post('/students/add', (req,res)=>{
        collegeData.addStudent(req.body).then(()=>{
            res.redirect('/students');
        });
    
    })
    // Handle non-matching routes (404)
    app.use((req, res) => {
     // res.status(404).send('Page Not Found');
     res.sendFile('404NotFound.html', { root: app.get('views') });
    });
    
   

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening at:${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    // Output the error to the console if initialize() fails
    console.error('Error initializing data:', err.message);
  });
     // Serve static files from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));
  // serve static files from public folder
