// Create admin user script
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create admin user
        const admin = new User({
            username: 'admin',
            email: 'admin@municipal.gov',
            password: 'admin123'
        });

        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@municipal.gov');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        if (error.code === 11000) {
            console.log('Admin user already exists!');
        } else {
            console.error('Error creating admin:', error);
        }
        process.exit(1);
    }
}

createAdmin();