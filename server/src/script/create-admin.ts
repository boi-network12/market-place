// scripts/create-admin.ts
import mongoose from 'mongoose';
import { User } from '../models/User.model';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    
    for (const email of adminEmails) {
      const existingAdmin = await User.findOne({ email });
      
      if (!existingAdmin) {
        const admin = new User({
          username: email.split('@')[0],
          email,
          password: 'Admin@123456', // Change this!
          fullName: 'System Administrator',
          role: 'super_admin',
          emailVerified: true,
          status: 'active',
        });
        
        await admin.save();
        console.log(`✅ Admin created: ${email}`);
      } else {
        console.log(`⚠️ Admin already exists: ${email}`);
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

createAdmin();