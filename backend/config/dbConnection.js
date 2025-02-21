const mongoose=require("mongoose")

const connectDb=async()=>{
    try {
        const connect=mongoose
        .connect('mongodb://127.0.0.1:27017/beeproject', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.log(err));
      
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb;





