const mongoose = require('mongoose');
const db = 'mongodb+srv://Manish:Manish%40123@cluster0.l41fyds.mongodb.net/MernStack?retryWrites=true&w=majority';

const connectDatabase = () => {

    mongoose.set('strictQuery', false);
    mongoose.connect(db, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true
    }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    });

}
module.exports = connectDatabase;

