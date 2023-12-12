import mongoose from "mongoose";

let connection: typeof mongoose;

const url = "mongodb://127.0.0.1:27017/banger-ecom";

const startDB = async () => {
    try {
        if(!connection) {
            connection = await mongoose.connect(url);
        }
        return connection;
    } catch (error : any) {
        console.log(error);
        throw new Error(error.message);
    }
}

export default startDB;