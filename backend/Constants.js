
module.exports = Object.freeze({
  
  //basePath: 'http://192.168.32.17:3006/',
  basePath: 'http://localhost:5000/',
  //basePath: 'https://apifacility.girnarcare.com/',
  // rootUploads: '/var/www/html/girnar-property-management/backend/uploads/',
  rootUploads: 'backend/uploads/',


  //Email Setting
  // USER_EMAIL : 'admin@girnarcare.com',
  // USER_PASSWORD : 'demo123',
  MAIL_PORT: 465,
  USER_EMAIL_FROM: 'support@girnarcare.com',
  SECURE_CONNECTION: false,
  EMAIL_AUTH: {
    user: "no-reply@girnarcare.com",
    pass: 'S>2Dn%hb#123',
  },

  carelineUserApiUrl: 'http://api.careline.girnarcare.com/v1/employee/employee/get-all-employees-property-management',
  carelineUserHeaders: {
    'Content-Type': 'application/json',
    'app-token': 'QF6GGc5q9PxYE7HtmsDDyMbeBCmnoE8z',
  },

  carelineEmployeeDirectory:{
    emp_Monika:"10053162",
    emp_Sahil:"10062367",
    emp_Ramawtar:"10059682",
    emp_Azrah:"20053505",
    emp_Lubaid:"20053510",
    emp_Mir:"10051658",
    emp_Gaurave:"10051942",
    emp_Lokesh:"10058614",
    emp_Sukhpreet:"10050866",
    emp_Ankit:"10052976",
    emp_Ashutosh: "20052696",
    emp_Deepanshu: "20054944",
    emp_Jatin: "20054945"
  },
    vendorBusinessDocUpload: 'uploads/BusinessDocs/',
    vendorGstDocUpload: 'uploads/GstDocuments/',
    vendorGstPanUpload: 'uploads/PanImages/',
    vendorGstEinvoiceUpload: 'uploads/EinvoiceImages/',
    vendorGstChequeUpload: 'uploads/ChequeImages/',


});

