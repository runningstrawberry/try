var ObjectID = require('mongodb').ObjectID; 


CollectionDriver = function(db) {  
  this.db = db; 
}; 

CollectionDriver.prototype.getCollection = function(collectionName, callback) { 
 
  this.db.collection(collectionName, function(error, the_collection) { 
 
    if( error ) callback(error); 
 
    else callback(null, the_collection); 
 
  }); 
 
};


CollectionDriver.prototype.findAll = function(collectionName, callback) { 
 
    this.getCollection(collectionName, function(error, the_collection) { //A 
 
      if(error) callback(error); 
 
      else { 
 
        the_collection.find().toArray(function(error, results) { //B 
 
          if(error) callback(error); 
 
          else callback(null, results); 
 
        }); 
 
      } 
 
    }); 
 
}; 

CollectionDriver.prototype.getCategory = function(collectionName, categoryName, callback) {
  
  this.getCollection(collectionName, function(error, the_collection){
    if(error) callback(error);
    else{
      the_collection.find({'category':categoryName}).toArray(function(error,doc){

          if (error) callback(error); 

          else callback(null, doc); 
      
      });
    }

  });
};



CollectionDriver.prototype.getFilename = function(collectionName, filename, callback) {
  
  this.getCollection(collectionName, function(error, the_collection){
    if(error) callback(error);
    else{
      the_collection.find({'title':filename}).toArray(function(error,doc){

          if (error) callback(error); 

          else callback(null, doc); 
      
      });
    }

  });
};

// CollectionDriver.prototype.getStar = function(collectionName, appTitle, callback) {
  
//   this.getCollection(collectionName, function(error, the_collection){
//     if(error) callback(error);
//     else{
//       the_collection.findOne({'_id':ObjectID("57cb77432f1c6721172c267b"), 'star._id':appTitle}, function(error,doc){

//           if (error) callback(error); 

//           else callback(null, doc); 
      
//       });
//     }

//   });
// };

CollectionDriver.prototype.getappTitle = function(collectionName, appTitle, callback) {
  
  this.getCollection(collectionName, function(error, the_collection){
    if(error) callback(error);
    else{
      the_collection.find({'appTitle': appTitle}).toArray(function(error,doc){

          if (error) callback(error); 

          else callback(null, doc); 
      
      });
    }

  });
};

CollectionDriver.prototype.getAveStar = function(collectionName, callback) {
  
  this.getCollection(collectionName, function(error, the_collection){
    if(error) callback(error);
    else{
      the_collection.aggregate(
        [
          { $group:{"_id":"$appTitle","avgStar":{$avg:"$star"}}}
          ]).toArray(function(error,doc){
    
                if (error) callback(error); 
 
                else callback(null, doc);   
      });


 
    }

  });
};
CollectionDriver.prototype.get = function(collectionName, id, callback) { //A 
 
    this.getCollection(collectionName, function(error, the_collection) { 
 
        if (error) callback(error); 
 
        else { 
 
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B 
 
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"}); 
 
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { //C 
 
                if (error) callback(error); 
 
                else callback(null, doc); 
 
            }); 
 
        } 
 
    }); 
 
}; 

CollectionDriver.prototype.save = function(collectionName, obj, callback) { 
 
    this.getCollection(collectionName, function(error, the_collection) { //A 
 
      if(error) callback(error) 
 
      else { 
 
        obj.created_at = new Date(); //B 
 
        the_collection.insert(obj, function() { //C 
 
          callback(null, obj); 
 
        }); 
 
      } 
 
    }); 
 
}; 

CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) { 
 
    this.getCollection(collectionName, function(error, the_collection) { 
 
        if (error) callback(error); 
 
        else { 
 
            obj._id = ObjectID(entityId); //A convert to a real obj id 
 
            obj.updated_at = new Date(); //B 
 
            the_collection.save(obj, function(error,doc) { //C 
 
                if (error) callback(error); 
 
                else callback(null, obj); 
 
            }); 
 
        } 
 
    }); 
 
};

CollectionDriver.prototype.delete = function(collectionName, entityId, callback) { 
 
    this.getCollection(collectionName, function(error, the_collection) { //A 
 
        if (error) callback(error); 
 
        else { 
 
            the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B 
 
                if (error) callback(error); 
 
                else callback(null, doc); 
 
            }); 
 
        } 
 
    }); 
 
};
exports.CollectionDriver = CollectionDriver; 