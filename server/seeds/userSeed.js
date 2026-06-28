import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import connectDB from '../config/db.js'
import User from '../models/User.js'

dotenv.config()

await connectDB()

const exists = await User.findOne({ email: process.env.SUPER_ADMIN_EMAIL })
if (exists) {
  console.log('SuperAdmin already exists')
  process.exit()
}

await User.create({
  name: process.env.SUPER_ADMIN_NAME,
  fatherName: 'Mr. Aggarwal Sr.',
  gender: 'male',
  mobile: '9999999999',
  email: process.env.SUPER_ADMIN_EMAIL,
  password: await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10),
  address: '123 Main Street, New Delhi, India',
  role: 'superadmin',
})

console.log('SuperAdmin seeded')
process.exit()