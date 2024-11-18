// const Admin =require('../models/seedAdmin');
// const bcrypt = require("bcrypt");


// const seedAdminUser = async () => {
//     try {
//       const adminExists = await Admin.findOne({ email: 'admin@gmail.com' })
      
//       if (!adminExists) {
//         const hashedPassword = await bcrypt.hash('Admin@123', 10)
        
//         await Admin.create({
//           email: 'admin@example.com',
//           password: hashedPassword,
//           role: 'admin',
//           name: 'Admin User',
//         })
        
//         console.log('Default admin user created successfully')
//       } else {
//         console.log('Admin user already exists')
//       }
//     } catch (error) {
//       console.error('Error seeding admin user:', error)
//     }
//   }
  
//   module.exports = {
//     seedAdminUser
//   };

const User = require('../models/User');
const bcrypt = require("bcrypt");

const seedAdminUser = async () => {
  try {
    const userExists = await User.findOne({ email: 'admin@gmail.com' });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      await User.create({
        name: 'Default User',
        email: 'admin@gmail.com',
        phone: '1234567890',
        password: hashedPassword,
        type: 'ADMIN', 
        isVerified: true,
        isAdmin: true,
        status: "approved",
      });

      console.log('Default user created successfully');
    } else {
      console.log('User already exists');
    }
  } catch (error) {
    console.error('Error seeding user:', error);
  }
};

module.exports = {seedAdminUser};


