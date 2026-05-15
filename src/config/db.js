const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Corrected protocol from http:// to mongodb+srv://
        const mongoURI = 'mongodb+srv://mahnnooranwar_db_user:XXAuljY7v22ZMGxa@cluster0.a88a8iv.mongodb.net/lmsWholcure?retryWrites=true&w=majority';
        
        await mongoose.connect(mongoURI);
        
        console.log("✅ MongoDB Connected: lmsWholcure (Cloud)");
    } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
        // This will tell you if your IP address isn't whitelisted or password is wrong
        process.exit(1);
    }
};

module.exports = connectDB;