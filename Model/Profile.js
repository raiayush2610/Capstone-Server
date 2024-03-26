const mongoose =require('mongoose');

const Profile = new mongoose.Schema({
        Gender:{
            type: String,
        },
        DestinationPlace: {
            type:String,
            
        },
          typeOfTrip:{
            type:String,
            
        },
        dateOfTrip:{
            type:String,
  
        },
        
        timeOfTrip: {type: String,
        }
        

})
module.exports =mongoose.model("Profiles",Profile);