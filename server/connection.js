const mongoose = require('mongoose');
const connectDb = async ( req ,res ) =>{
    try {
        
       const connection = await mongoose.connect(process.env.MONGODB_URI  );
        if(connection.STATES.connected) return    console.log("MongoDB Connected");
        if(connection.STATES.disconnected) return console.log("MongoDB Disconnected");
    } catch (error) {
        console.error("error in connectDb" ,error);
        process.exit(1);
    }
}

module.exports = {connectDb};