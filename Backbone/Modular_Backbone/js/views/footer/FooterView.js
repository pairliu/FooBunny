define([
	'jquery',
	'underscore',
	'backbone',
	'models/owner/OwnerModel',
	'text!templates/footer/footerTemplate.html'
], function($, _, Backbone, OwnerModel, footerTemplate){
	
	var FooterView = Backbone.View.extend({
		el: $("#footer"),
		
		
	});
	
	return FooterView;
});