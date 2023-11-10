// //SERVER API URL
// export const BASE_URL = "https://api-mangoit-lms.mangoitsol.com";

// //FRONTEND SERVER URL
// export const FRONTEND_BASE_URL = "https://mangoit-lms.mangoitsol.com";

//FRONTEND LOCAL URL
export const FRONTEND_BASE_URL = "http://localhost:3000";

// LOCAL API URL
export const BASE_URL = "http://localhost:6030";

export const API = {
  authToken: `${BASE_URL}/generatetoken`,
  register: `${BASE_URL}/registration`,
  login: `${BASE_URL}/loginuser`,
  forgotPassword: `${BASE_URL}/forgotPassword`,
  resetPassword: `${BASE_URL}/resetpassword`,

  // User
  userAllUsers: `${BASE_URL}/getusers`,
  userInfoById: `${BASE_URL}/getuser`,
  userUpdateById: `${BASE_URL}/updateuser`,
  deleteUser: `${BASE_URL}/deleteuser`,

  //Courses
  getCourses: `${BASE_URL}/getcourse`,
  getCoursesByCouseId: `${BASE_URL}/get_course_by_id`,
  createCourse: `${BASE_URL}/createcourse`,
  updateCourse: `${BASE_URL}/updatecourse`,
  deleteCourse: `${BASE_URL}/deletecourse`,
  getCoursesByUserId: `${BASE_URL}/get_course_by_user_id`,
  getCoursesByUserIdForNotification: `${BASE_URL}/get_course_by_user_id_for_notification`,


  //Modules
  getAllModules: `${BASE_URL}/getmodules`,
  createModule: `${BASE_URL}/createmodule`,
  updateModule: `${BASE_URL}/updatemodule`,
  deleteModule: `${BASE_URL}/deletemodule`,

  //Sessions
  getSessions: `${BASE_URL}/getsession`,
  getLiveSessions : `${BASE_URL}/getlivesession`,
  createSession: `${BASE_URL}/createsession`,
  updateSession: `${BASE_URL}/updatesession`,
  deleteSession: `${BASE_URL}/deletesession`,

  //Site Options
  getAllSiteConfiguration: `${BASE_URL}/getsiteconfigs`,
  getSite: `${BASE_URL}/getsiteconfigs`,
  createSite: `${BASE_URL}/createsiteconfig`,
  updateSite: `${BASE_URL}/updatesiteconfigs`,
  deleteSite: `${BASE_URL}/deletesiteconfigs`,
  updateContentSecret: `${BASE_URL}/updateContentSecretKey`,

  //subscription
  getAllSubscription: `${BASE_URL}/getsubscription`, //admin only
  deleteSubscription: `${BASE_URL}/deletesubscription`, //admin only
  getSubscription: `${BASE_URL}/getsubscriptionbyuserid`, // user only
  getSubsById: `${BASE_URL}/getsubscriptionbyid`, // subs id

  //create user subscription
  createsubscription: `${BASE_URL}/createsubscription`,
  updateSubscription: `${BASE_URL}/updatesubscription`,

  // email content manage
  getEmailContent: `${BASE_URL}/getemailmanage`,
  createEmailContent: `${BASE_URL}/createemailmanage`,
  updateEmailContent: `${BASE_URL}/updateemailmanage`,

  // email type manage
  getEmailType: `${BASE_URL}/getemailtype`,
  createEmailType: `${BASE_URL}/createemailtype`,
  updateEmailType: `${BASE_URL}/updateemailtype`,

  // invoices and orders
  getInvoices: `${BASE_URL}/getorders`,
  downloadPDF: `${BASE_URL}/downloadreceipt`,
  getOrder: `${BASE_URL}/getOrderSubscriptionId`,

  //accept payment
  acceptpayment: `${BASE_URL}/acceptpayment`,
  getpaymentdetails: `${BASE_URL}/getpaymentdetails`,

  //subscriptions Plan manage
  allsubscriptions: `${BASE_URL}/subscriptionplans`,
  getsubscriptionplandet: `${BASE_URL}/subscriptionplandetbyid`,
  addSubscriptionPlans: `${BASE_URL}/addsubscriptionplans`,
  updateSubscriptionPlans: `${BASE_URL}/updatesubscriptionplans`,
  deleteSubscriptionPlans: `${BASE_URL}/deletesubscriptionplans`,

  //get user by email
  getuserdetbyemail: `${BASE_URL}/getuserbyemail`,

  //create order
  createsubscriptionorder: `${BASE_URL}/createorder`,
  updateorder: `${BASE_URL}/updateorder`,

  //create order for subscription
  createorderforsubscription: `${BASE_URL}/createorderforrenewsubscriptio`,

  //create transaction
  createtransaction: `${BASE_URL}/createtransaction`,
  getTransaction: `${BASE_URL}/transactiondet`,

  //create enrolled courses
  createenrollcourse: `${BASE_URL}/createenrollcourse`,
  markascomplete: `${BASE_URL}/markascompletecourse`,
  updatemarkascomplete: `${BASE_URL}/updatemarkascompletecourse`,

  //check enrolled courses
  checenrollcourses: `${BASE_URL}/checenrollcourses`,
  topenrolledcourses: `${BASE_URL}/topenrolledcourses`,
  getEnrollCoursesByUserId: `${BASE_URL}/get_enrollcourse_by_user_id`,

  //doenload payment receiprt
  downloadpaymentreceipt: `${BASE_URL}/downloadpaymentreceipt`,

  //doenload payment receiprt
  downloadorderinvoice: `${BASE_URL}/downloadorderinvoice`,
  // admin dashbaord
  dashboarddata: `${BASE_URL}/getdashboard`,
  getTotalLearner: `${BASE_URL}/gettotallearner`,

  // create zoom API Calls
  createzoommeeting: `${BASE_URL}/createmeeting`,
  getzoommeetingbyid: `${BASE_URL}/getmeetingbyid`,

};
