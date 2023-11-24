/*The promise driven collegeData.js module will be responsible obtaining the students.json and courses.json files from
within the "data" directory and returning elements (ie: "student" objects) from those arrays to match queries on the
data.
Essentially the collegeData.js module will encapsulate all the logic to work with the data and only expose accessor
methods to fetch data/subsets of the data. */
const courses = require("../data/courses.json"); //required data
const students = require("../data/students.json");//required data
const fs = require('fs').promises;
const path = require('path');

class Data{

    students;
    courses;
   
  
    constructor(students= "",  courses= ""){ //   constructor to handle missing parameters
        this.students= students;
        this.courses = courses;
    }
}
 let dataCollection =null;

/* this function creats an object dortaCollection from Data class using students and courses array.To access the full array of students and courses in your other functions using the
 dataCollection object, ie: dataCollection.students or dataCollection.courses*/
 

 module.exports.initialize=function(){ //module.exports to expose the initialize function to a2.js
  return new Promise(function(resolve, reject){
      dataCollection=new Data(students,courses);//creating a new abjoct of the Data class with students and courses
      if(dataCollection){//dataCollection is not null
          resolve('Data collection initialized successfully');
      }else{
          reject('Data collection initialization failed');
      }

  });

 }

 
 module.exports.addStudent = function(studentData){
  return new Promise((resolve, reject) => {
      if(studentData.TA == undefined){
          studentData.TA = false;
      }
      else{
          studentData.TA = true;
      }
      studentData.studentNum = dataCollection.students.length + 1;
      dataCollection.students.push(studentData);
      resolve();
  })
  
}
/* This function  provides the full array of "student" objects using the resolve method  if the length of array is not zero but if zero, then invokes reject of the returned promise.  */
 module.exports.getAllStudents=function(){
    return new Promise(function(resolve,reject){
        if (dataCollection && dataCollection.students.length>0){
            resolve(dataCollection.students)
        }else{
            reject("no results returned");
        }
    } );
}

/* This function  provides  array of "student" objects whoes "TA" is true using the resolve method , if the length of array is zero then invokes reject of the returned promise.  */

/* This function  provides the full array of "courses" objects using the resolve method , if the length of the array is not zero but if zero ,then invokes reject of the returned promise.  */
module.exports.getCourses=function(){
    return new Promise(function(resolve,reject){
        if(dataCollection && dataCollection.courses.length>0){
            resolve(dataCollection.courses);
        }else{
            reject('No result returned');
        }
    });
}
 /*This function will provide an array of "student" objects whose course property matches the course parameter using the resolve method
of the returned promise. it rejects if the length of array is 0*/
module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
      // Assuming dataCollection has a "students" array
      if (dataCollection && dataCollection.students) {
        const studentsInCourse = dataCollection.students.filter((student) => {
          return student.course === course;
        });
  
        if (studentsInCourse.length > 0) {
          resolve(studentsInCourse);
        } else {
          reject("No results returned");
        }
      } else {
        reject("Data not available");
      }
    });
  };

 

/* This function will provide a single "student" object whose studentNum property matches the num parameter using the resolve method of the
returned promise and rejects if no num is found */
  module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/students.json', 'utf-8')
        .then(data => {
          const students = JSON.parse(data);
          const foundStudent = students.find(student => student.studentNum === num);
  
          if (foundStudent) {
            resolve(foundStudent);
          } else {
            reject('No results returned');
          }
        })
        .catch(err => {
          reject('Error reading students data');
        });
    });
  };
//get course by id
  module.exports.getCourseById = function (courseId) {
    return new Promise((resolve, reject) => {
        // Assuming dataCollection has a "courses" array
        if (dataCollection && dataCollection.courses) {
            const course = dataCollection.courses.find(course => course.courseId === courseId);

            if (course) {
                resolve(course);
            } else {
                reject("Query returned 0 results");
            }
        } else {
            reject("Data not available");
        }
    });
};



// Function to update a student
// module.exports.updateStudent = function (studentData) {
//   return new Promise((resolve, reject) => {
//     if (!dataCollection) {
//       reject("Data collection is not initialized");
//     }

//     const studentIndex = dataCollection.students.findIndex(
//       (student) => student.studentNum === studentData.num
//     );

//     if (studentIndex !== -1) {
//       // Update the student in the array
//       dataCollection.students[studentIndex] = {
//         ...dataCollection.students[studentIndex], // Copy existing student properties
//         ...studentData, // Overwrite with new student data
//         TA: studentData.TA === "on", // Convert checkbox value to boolean
//       };
//       resolve();
//     } else {
//       reject("Student not found");
//     }
//   });
// };


module.exports.updateStudent = function updateStudent(studentData) {
  return new Promise(function (resolve, reject) {
      if (typeof studentData.TA === 'undefined') {
          studentData.TA = false;
      } else {
          studentData.TA = true;
      }
      let result = dataCollection.students.filter(function (x) { return x.studentNum == studentData.studentNum });
      if (result.length == 1) {
          result[0].firstName = studentData.firstName;
          result[0].lastName = studentData.lastName;
          result[0].email = studentData.email;
          result[0].addressStreet = studentData.addressStreet;
          result[0].addressCity = studentData.addressCity;
          result[0].addressProvince = studentData.addressProvince;
          result[0].TA = studentData.TA;
          result[0].status = studentData.status;
          result[0].course = studentData.course;
          resolve(studentData);
      } else {
          console.log('student ' + studentData.studentNum + ' not found');
          reject('student ' + studentData.studentNum + ' not found');
      }
  });
}