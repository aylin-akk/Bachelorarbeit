const mongoose = require("mongoose");


async function connect(){
  try{
    await mongoose.connect();
  }catch(error){
      console.log(error);
  }
}