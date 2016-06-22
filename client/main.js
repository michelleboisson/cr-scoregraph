import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/api/products.js';
 
import { ProductDatabase } from '../imports/api/products.js';
 
import '../client/main.html';

// Use lodash instead of underscore
_ = lodash;


Session.setDefault('barChartSort','none');
Session.setDefault('barChartSortModifier',undefined);

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.body.helpers({
  products() {
  	if (Session.get("selectedProductCategoryID"))
		var modifier = {"category.id" : Session.get("selectedProductCategoryID")};
	else
		var modifier = {};
  	return ProductDatabase.find(modifier,{sort : {overallScore:1}})
  }
});

Template.product.events({
	'click a'(event, instance){
		console.log(event.currentTarget.getAttribute('id'))
		ProductDatabase.remove(event.currentTarget.getAttribute('id'))

	}
})
Template.filters.helpers({
  	fridgeCat : function(){
  		var myArray = ProductDatabase.find().fetch();
		groupedByObj = _.groupBy(myArray, function(fridge){return fridge['category'].id}); 
		//Session.set("selectedProductCategory", jsonObj);
		//setFilters(jsonObj);
		var groupedcats = [];
		_.mapValues(groupedByObj, function(val, key) {
		//_.mapObject(dataset, function(val, key){
			//key = parseInt(key);
			groupedcats.push({'catid': key, 'catname': val[0].category.pluralName})
		})
		//console.log('groupedcats', groupedcats)
		return groupedcats
		//return getFilters();
  	}
})
Template.filters.events({
	'change select#changeCategory' : function(event, template){
		var thiscat = event.currentTarget.value
		//console.log(thiscat);
		Session.set("selectedProductCategoryID" , thiscat)
	}

})