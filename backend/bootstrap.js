const sendEmail = require("../src/Middleware/sendEmail");
const States = require('../src/Models/State.model');
const City = require('../src/Models/City.model');
const { default: mongoose } = require('mongoose');
const User = require('../src/Models/User.model')
const request = require('request');
var cron = require('node-cron');
const moment = require('moment')
const Constants = require('../src/Constants');
const bcrypt = require('bcrypt');
const Roles = require("./Models/Roles.model");
const permissions = require('./permissions.json')

const bootstrap = () => {
  populateStates()
  // async function populateStates() {

  //   const stateObj = require('./StateCityMap.json')

  //   let keys = Object.keys(stateObj);

  //   for (let key of keys) {

  //     let isExisting = await States.findOne({ stateName: key }, { _id: 1 })

  //     if (!isExisting) {
  //       const state = new States({

  //         stateName: key
  //       })

  //       const response = state.save((err, resp) => {

  //         let cities = stateObj[key]


  //         for (let cityObj of cities) {
  //           let city = new City({
  //             cityName: cityObj.name,
  //             stateId: resp._id
  //           })
  //           const cityResponse = city.save()

  //         }
  //         // console.log(err, resp, 'save')
  //       })

  //     }

  //     else {


  //       let cities = stateObj[key]

  //       for (let cityObj of cities) {
  //         const objstr = isExisting._id.toString()
  //         let isCityExisting = await City.findOne({ stateId: objstr, cityName: cityObj.name })

  //         if (!isCityExisting) {

  //           let city = new City({
  //             cityName: cityObj.name,
  //             stateId: objstr
  //           })
  //           const cityResponse = city.save()
  //         }

  //       }
  //     }
  //   }
  // }

  async function createDefaultRoles() {
    // Create the Super Admin role
    const ExistingdefaultRole = await Roles.findOne({ roleName: 'default_role_allusers', is_deleted: false });
    if (ExistingdefaultRole === null) {

      // Create the default role for all users
      const defaultRole = new Roles({
        roleName: 'default_role_allusers',
        role_type: 'default_role',
        rolecode: "default"

      });
      await defaultRole.save()

      console.log('Default Role All Users role created successfully.');
    }
    // else {
    //   // console.log('Default Role All Users role already exists.');
    // }
    else {
        //  const updatedResult = await Roles.updateOne({ roleName: 'default_role_allusers' }, { $set: { permissions: permissions.SuperAdmin } });
    
    }


    //   const ExistingsuperAdminRole = await Roles.findOne({ roleName: 'Super Admin', is_deleted: false });
    //   if (ExistingsuperAdminRole=== null) {

    //     const superAdminRole = new Roles({
    //       roleName: 'Super Admin',
    //       role_type: 'Super Admin',
    //       permissions:permissions.SuperAdmin,
    //       rolecode:"superadmin"
    //     });
    //     await superAdminRole.save();

    //     console.log('Super Admin role created successfully.');
    //   }
    //   else {
    //     // console.log('Super Admin role already exists.');

    //   }
    // }
    const ExistingsuperAdminRole = await Roles.findOne({ roleName: 'Super Admin', is_deleted: false });
    if (ExistingsuperAdminRole === null) {
      // create new role if not exist
      const superAdminRole = new Roles({
        roleName: 'Super Admin',
        role_type: 'Super Admin',
        permissions: permissions.SuperAdmin,
        rolecode: "superadmin"
      });
      await superAdminRole.save();

    } else {
      // update the permissions field for the existing role
        // const updatedResult = await Roles.updateOne({ roleName: 'Super Admin' }, { $set: { permissions: permissions.SuperAdmin } });

    }
  }


  // Create a super admin user
  async function createSuperAdminUser() {

    const superAdminRole = await Roles.findOne({ roleName: 'Super Admin', is_deleted: false });
    if (!superAdminRole) {
      console.error('Super Admin role not found');
      return;
    }
    const defaultRole = await Roles.findOne({ roleName: 'default_role_allusers', is_deleted: false });
    if (!defaultRole) {
      console.error('defaultRole role not found');
      return;
    }

    // const superAdminUser = await User.findOne({ email: 'superadmin@girnarcare.com' });
    // if (superAdminUser) {
    //   // console.log('Super admin user already exists');
    //  let setPanelLoginStatus= await panelLoginStatus(true,superAdminUser)
    //  console.log(setPanelLoginStatus)

    // }
    const superAdminUser = await User.findOne({ email: 'superadmin@girnarcare.com' });

    if (superAdminUser) {
      return;
    }


    // Create the super admin user
    /*const hashedPassword = await bcrypt.hash('123456', 8);
    const newSuperAdminUser = new User({
      username: 'superadmin',
      email: 'superadmin@girnarcare.com',
      roleId: superAdminRole._id,
      empId: "0000001",
      number: 000000001,
      password: hashedPassword
    });
    await newSuperAdminUser.save();
    console.log('Super admin user created successfully');*/

    const hashedPassword = await bcrypt.hash('123456', 8);
    User.insertMany([
      {
        username: 'Super Admin',
        email: 'superadmin@girnarcare.com',
        roleId: superAdminRole._id,
        empId: "0000001",
        number: 1000000001,
        password: hashedPassword,
        userType: "Admin",

      },
      {
        username: 'Sumayya 1',
        email: 'sumayya@girnarsoft.co.in',
        roleId: defaultRole._id,
        empId: "10070495",
        number: 1000000002,
        password: hashedPassword,
        userType: "Executive",

      },
      {
        username: 'Sudip Moitra',
        email: 'sudip.moitra@girnarsoft.co.in',
        roleId: defaultRole._id,
        empId: "10068383",
        number: 9810511796,
        password: hashedPassword,
        userType: "Executive",

      },
      {
        username: 'Namit Jain',
        email: 'namit@rupyy.com',
        roleId: defaultRole._id,
        empId: "10030190",
        number: 9999206867,
        password: hashedPassword,
        userType: "Executive"
      },
      {
        username: 'Nitin Chadda',
        email: 'nitin.chadha@girnarsoft.com',
        roleId: defaultRole._id,
        empId: "10060288",
        number: 9560907580,
        password: hashedPassword,
        userType: "Executive"
      },
      {
        username: 'Mayank Jain',
        email: 'mayank.jain@girnarsoft.com',
        roleId: defaultRole._id,
        empId: "10065416",
        number: 9810147854,
        password: hashedPassword,
        userType: "Executive"
      },
      {
        username: 'Charu',
        email: 'charu@girnarsoft.com',
        roleId: defaultRole._id,
        empId: "10050021",
        number: 9001599555,
        password: hashedPassword,
        userType: "Executive"
      },
      {
        username: 'Rohan',
        email: 'rohan@powerdrift.com',
        roleId: defaultRole._id,
        empId: "10057416",
        number: 9921345555,
        password: hashedPassword,
        userType: "Executive"
      }
    ]).then(function () {
      console.log("multipal user created successfully");
    }).catch(function (error) {
      console.log('error', error);
    });

  }


  createDefaultRoles()
    .then(() => {

      return createSuperAdminUser();
    })
    .then(() => {
      // console.log('Collections inserted Successfully ...');
      // mongoose.disconnect();
    })
    .catch((err) => {
      console.error('Error creating default roles and super admin user:', err);
      console.log('Mongoose connection is disconnected...');
      mongoose.disconnect();
      process.exit(1);
    });


  async function careLineUsersApi() {
    //console.log('call get careline user function');
    let total_user = 0;
    const filterData = { "status": "A" };

    const allusers = await getdata(filterData);
    total_user = allusers.length;
    console.log('total_user', total_user);

    const updateObj = await goUpdate(allusers);
    console.log('updateObj', updateObj);

    console.log('send response', allusers);
    let apiobj = {}
    apiobj["total_user"] = total_user
    apiobj["add_user"] = updateObj.add_user
    apiobj["add_user_validation_error"] = updateObj.add_user_validation_error
    apiobj["update_user"] = updateObj.update_user
    apiobj["update_user_validation_error"] = updateObj.update_user_validation_error

    // await sendEmail(user.email,"cronemailtest",{...apiobj})
    await sendEmail('ramawtar.saini@girnarsoft.com', "cron emailtest", { ...apiobj })
    // res.status(200).send({
    //     "total_user": total_user,
    //     "add_user": updateObj.add_user,
    //     "add_user_validation_error": updateObj.add_user_validation_error,
    //     "update_user": updateObj.update_user,
    //     "update_user_validation_error": updateObj.update_user_validation_error
    // });
  }


}
//get user list from api
const getdata = async (filterData) => {
  let allusers = [];
  await new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: Constants.carelineUserApiUrl,
      headers: Constants.carelineUserHeaders,
      body: JSON.stringify(filterData)
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let res = JSON.parse(body);
        if (res.status == true) {
          console.log('res', res.data.length);
          // allusers = res.data.filter(item => (item.department == 'Admin' || item.department == 'Tech'));
          // allusers = res.data.filter(item => (item.employee_id == Constants.carelineEmployeeDirectory.emp_Monika || item.employee_id == Constants.carelineEmployeeDirectory.emp_Sahil || item.employee_id == Constants.carelineEmployeeDirectory.emp_Ramawtar || item.employee_id == Constants.carelineEmployeeDirectory.emp_Azrah 
          //   || item.employee_id == Constants.carelineEmployeeDirectory.emp_Sumaya|| item.employee_id == Constants.carelineEmployeeDirectory.emp_Lubaid)) 

          allusers = res.data.filter(item => Constants.carelineEmployeeDirectory[item.employee_id])



          allusers = res.data.filter(item => (
            item.employee_id == Constants.carelineEmployeeDirectory.emp_Monika
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Sahil
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Ramawtar
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Mir
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Gaurave
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Lokesh
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Sukhpreet
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Ankit
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Azrah
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Lubaid
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Ashutosh
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Jatin
            || item.employee_id == Constants.carelineEmployeeDirectory.emp_Deepanshu
          ))


          //  { console.log(item.employee_id ==="TYC0722076")}
          // allusers = res.data.filter((item) =>{
          //   item.employee_id == Constants.carelineEmployeeDirectory.emp_Monika || item.employee_id ==  Constants.carelineEmployeeDirectory.emp_Sahil ||  Constants.carelineEmployeeDirectory.emp_Ramawtar || item.employee_id ==   Constants.carelineEmployeeDirectory.emp_Azrah || item.employee_id ==   Constants.carelineEmployeeDirectory.emp_Lubaid

          //    return item
          // }
          //   )

        }

        //console.log('allusers',allusers);
        console.log('get data....');
        resolve(body);
      } else {
        console.log('error===============================', error);
        // reject.catch(=>null)
        reject(error);
      }
    });
  });
  // Promise.catch(()=>null)
  return allusers;
}

//pass all user for update user
const goUpdate = async (allusers) => {
  console.log('go udpate fun call');
  let updateObj = {
    add_user: 0,
    update_user: 0,
    add_user_validation_error: 0,
    update_user_validation_error: 0
  }

  for (const item of allusers) {
    let obj = {
      'empId': item.employee_id,
      'username': item.name,
      'userType': "Executive",
      'number': item.phone_number || "Not Given",
      'email': item.email,
      'entity': item.entity,
      'gender': item.gender,
      'date_of_birth': item.date_of_birth,
      'address': item.address,
      'band': item.band,
      'department': item.department,
      'desination': item.desination,
      'updatedAt': moment().format('MMMM Do YYYY, h:mm:ss a')
    }
    // let isExisting = await User.find({ empId:item.employee_id})
    // console.log("issssssssssssssss",isExisting.length)
    // if(!isExisting[0]){
    // let roleAccess = await Roles.findOne({ name: item.department === "Admin" })
    // // u => u.username === username && u.password === password
    // console.log(roleAccess)
    // console.log(roleAccess._id)
    // obj.roleId = roleAccess._id
    // console.log(obj)
    let finalUserObj = await assignRoleId(item.department, obj)
    console.log(finalUserObj)

    // let panelLoginStat = await panelLoginStatus(false,obj)
    // console.log(panelLoginStat)
    // let panelLoginStat = await panelLoginStatus(true, obj)
    // console.log(panelLoginStat)

    res = await updateuser(obj, item.employee_id);
    console.log('call updateuser fun...', res);
    // }
    if (res.update === true) {
      updateObj.update_user = updateObj.update_user + 1;

    }
    else if (res.update === false) {
      if (res.error) {
        updateObj.update_user_validation_error = updateObj.update_user_validation_error + 1;

      }

    }

    else if (res.add === true) {
      updateObj.add_user = updateObj.add_user + 1;

    }
    else if (res.add === false) {
      if (res.error) {
        updateObj.add_user_validation_error = updateObj.add_user_validation_error + 1;
      }

    }
    // if (res == 'add') {
    //   updateObj.add_user = updateObj.add_user + 1;
    // } else if (res == 'update') {
    //   updateObj.update_user = updateObj.update_user + 1;
    // } else if (res == 'add-validation-error') {
    //   updateObj.add_user_validation_error = updateObj.add_user_validation_error + 1;
    // } else if (res == 'update-validation-error') {
    //   updateObj.update_user_validation_error = updateObj.update_user_validation_error + 1;
    // }
  }

  console.log('update all users sucess');
  return updateObj;
}

//add and update user in database
const updateuser = async (userdetails, employee_id) => {
  //console.log('call update user fun');
  const filter = { empId: employee_id };
  let checkuser = await User.findOne(filter);

  // if(checkuser.length>0 && checkuser[0]._doc.empId !==employee_id){
  // console.log(checkuser[0]._doc.empId, "docccccccccccccccccccccc")
  if (checkuser) {
    let updateNeeded = false;
    let userfromdb = checkuser._doc;
    Object.keys(userdetails).forEach(key => {
      if (key === '_id' || key === 'password' || key === 'updatedAt' || key === 'createdAt') return
      if (key === 'email') {
        if (userfromdb[key].toString().toLowerCase() != userdetails[key].toString().toLowerCase()) {

          updateNeeded = true;

        }
      }
      else if (userfromdb[key] != userdetails[key]) {

        updateNeeded = true;

      }

    })
    if (updateNeeded) {
      const upFilter = { _id: mongoose.Types.ObjectId(userfromdb._id) };
      console.log('exists user', upFilter);

      let obj = {
        empId: userdetails.empId,
        username: userdetails.username,
        email: userdetails.email,
        number: userdetails.number,
        password: userdetails.password,
        entity: userdetails.entity,
        gender: userdetails.gender,
        date_of_birth: userdetails.date_of_birth,
        band: userdetails.band,
        address: userdetails.address,
        department: userdetails.department,
        desination: userdetails.desination,
        // panelLoginstatus: userdetails.panelLoginstatus,
        // roleTypestatus:userdetails.roleTypestatus

      }


      return await User.findByIdAndUpdate({ ...upFilter }, obj, { new: true })
        .then((res) => {
          console.log('user update sucess', res);
          // return 'update';
          return { update: true };
        }).catch((err) => {
          console.log('err', err);
          if (err.name === 'ValidationError') {
            // return 'update-validation-error';
            return { update: false, error: true };
          }
        });

    }
    else {
      return { update: false };
    }

  } else {
    console.log('not exists user: ', filter);
    userdetails.password = '123456';
    userdetails.password = bcrypt.hashSync(userdetails.password, 8);

    userdetails.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    userdetails.empId = employee_id;
    const user = new User(userdetails);
    return await user.save().then((res) => {
      console.log('user save sucess', res);
      // return 'add';
      return { add: true };
    }).catch((err) => {
      console.log('err', err);
      if (err.name === 'ValidationError') {
        // return 'add-validation-error';
        return { add: false, error: true };
      }
    });
  }
}

const assignRoleId = async (rolename, userobj) => {
  // if( rolename==='Tech' ){
  let roleAccess = await Roles.findOne({ roleName: 'default_role_allusers', is_deleted: false })
  userobj.roleId = roleAccess._id
  console.log(userobj)

  // }

  // if(rolename==='Admin' || rolename==='Tech' ){
  //   let roleAccess = await Roles.findOne({ roleName: rolename})
  //   userobj.roleId = roleAccess._id
  //   console.log(userobj)

  // }

  return userobj;
}

async function carelineUsersApi() {
  //console.log('call get careline user function');
  let total_user = 0;
  const filterData = { "status": "A" };

  const allusers = await getdata(filterData);
  total_user = allusers.length;
  console.log('total_user', total_user);

  const updateObj = await goUpdate(allusers);
  console.log('updateObj', updateObj);

  console.log('send response', allusers);
  let apiobj = {}
  apiobj["total_user"] = total_user
  apiobj["add_user"] = updateObj.add_user
  apiobj["add_user_validation_error"] = updateObj.add_user_validation_error
  apiobj["update_user"] = updateObj.update_user
  apiobj["update_user_validation_error"] = updateObj.update_user_validation_error

  // await sendEmail(user.email,"cronemailtest",{...apiobj})
  await sendEmail('lubaidkhan111@gmail.com', "cronemailtest", { ...apiobj })
  // res.status(200).send({
  //     "total_user": total_user,
  //     "add_user": updateObj.add_user,
  //     "add_user_validation_error": updateObj.add_user_validation_error,
  //     "update_user": updateObj.update_user,
  //     "update_user_validation_error": updateObj.update_user_validation_error
  // });
  return apiobj;
}






module.exports = {
  bootstrap,
  carelineUsersApi,

} 