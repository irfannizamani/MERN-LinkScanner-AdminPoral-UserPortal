const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true }
});

adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const Admin = mongoose.model('Admin', adminSchema);

const createDefaultAdminUser = async () => {
    try {
        const count = await Admin.countDocuments();
        if (count === 0) {
            const newAdmin = new Admin({
                userName: 'admin',
                password: 'admin'
            });
            await newAdmin.save();
            console.log('Default admin user created.');
        } else {
            console.log('An admin user already exists.');
        }
    } catch (error) {
        console.error('Error checking or creating default admin user:', error);
    }
};

createDefaultAdminUser();

module.exports = { Admin };
