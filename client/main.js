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
  	return ProductDatabase.find({},{sort : {overallScore:1}})
  }
});

Template.product.events({
	'click a'(event, instance){
		console.log(event.currentTarget.getAttribute('id'))
		ProductDatabase.remove(event.currentTarget.getAttribute('id'))

	}
})