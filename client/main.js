import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/api/products.js';
 
import { ProductDatabase } from '../imports/api/products.js';
 
import '../client/main.html';

// Use lodash instead of underscore
_ = lodash;


Session.setDefault('barChartSort','none');
Session.setDefault('barChartSortModifier',undefined);


Template.body.helpers({
  products() {
  	var modifier = {};
  	if (Session.get("selectedProductCategoryID"))
			modifier["category.id"] = Session.get("selectedProductCategoryID");
	if (Session.get("selectedProductBrandID"))
		modifier["brand.id"] = Session.get("selectedProductBrandID");
	//modifier = {"category.id" : Session.get("selectedProductCategoryID"),"brand.id" : Session.get("selectedProductBrandID")};
	currentCollection = ProductDatabase.find(modifier,{sort : {overallScore:-1}})
  	return currentCollection
  }
});

Template.product.events({
	'click a'(event, instance){
		console.log(event.currentTarget.getAttribute('id'))
		ProductDatabase.remove(event.currentTarget.getAttribute('id'))

	}
})
Template.product.helpers({
	convertToInt(number){
		return parseInt(number)
	}
})
Template.filters.helpers({
	apicat: function(){
		return API_CATEGORY;
	},
	filteredCount : function(){
		var modifier = {};
		if (Session.get("selectedProductCategoryID"))
			modifier["category.id"] = Session.get("selectedProductCategoryID");
		if (Session.get("selectedProductBrandID"))
			modifier["brand.id"] = Session.get("selectedProductBrandID");

		return ProductDatabase.find(modifier).fetch().length.toString();
	},
	totalCount : function(){
		return ProductDatabase.find().fetch().length.toString();
	},
  	fridgeCat : function(){
  		var modifier = {};
		if (Session.get("selectedProductCategoryID"))
			modifier["category.id"] = Session.get("selectedProductCategoryID");
		if (Session.get("selectedProductBrandID"))
			modifier["brand.id"] = Session.get("selectedProductBrandID");

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
  	},
  	fridgeBrand : function(){
  		var modifier = {};
		if (Session.get("selectedProductCategoryID"))
			modifier["category.id"] = Session.get("selectedProductCategoryID");
		if (Session.get("selectedProductBrandID"))
			modifier["brand.id"] = Session.get("selectedProductBrandID");

  		var myArray = ProductDatabase.find().fetch();
		groupedByObj = _.groupBy(myArray, function(fridge){return fridge['brand'].id}); 
		//Session.set("selectedProductCategory", jsonObj);
		//setFilters(jsonObj);
		var groupedbrands = [];
		_.mapValues(groupedByObj, function(val, key) {
		//_.mapObject(dataset, function(val, key){
			//key = parseInt(key);
			groupedbrands.push({'brandid': key, 'brandname': val[0].brand.displayName})
		})
		//sort by brand name
		groupedbrands.sort(function(a, b){
    		var nameA=a.brandname.toLowerCase(), nameB=b.brandname.toLowerCase()
    		if (nameA < nameB) //sort string ascending
        		return -1 
    		if (nameA > nameB)
     		   return 1
    		return 0 //default return value (no sorting)
		})
		console.log('groupedbrands', groupedbrands)
		return groupedbrands
  	}
})
Template.filters.events({
	'change select#changeCategory' : function(event, template){
		var thiscat = event.currentTarget.value
		//console.log(thiscat);
		Session.set("selectedProductCategoryID" , thiscat)
	},
	'change select#changeBrand' : function(event, template){
		var thisbrand = event.currentTarget.value
		//console.log(thiscat);
		Session.set("selectedProductBrandID" , thisbrand)
	}

})