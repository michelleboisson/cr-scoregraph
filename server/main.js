import { Meteor } from 'meteor/meteor';
//import '../imports/api/products.js';
import { ProductDatabase } from '../imports/api/products.js';

var API_KEY = "hjp3y9wmb96sumppbsrjhe7r";
    //API_CATEGORY = "compactRefrigerators";

Meteor.startup(function(){
  // code to run on server at startup
  _ = lodash;

   //ProductDatabase.remove({});
    console.log("server is starting");

    //load data from API: toasters
    var apiLink = "http://api.consumerreports.org/v0.1/products.(category.name="+API_CATEGORY+").json?api_key="+API_KEY+"&numResults=5000";
	//myarray = HTTP.get(apiLink).data;

    if (ProductDatabase.find({}).count() <= 0){
        for (var i=0; i<myarray.length; i++){
          var item = myarray[i];
          item.index = i;

          //ProductDatabase.insert(item);
        }
    }

    
    return Meteor.methods({

      removeAllProducts: function() {
        console.log("removing all products");
        return ProductDatabase.remove({});
      }

    });

  });

