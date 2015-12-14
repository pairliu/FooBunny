define([
	'underscore',
	'backbone'
], function(_, Backbone){
	
	var OwnerModel = Backbone.Model.extend({
		defaults: {
			query: 'unknown'
		},
		
		initialize: function(options) {         // can have an argument 'options'
			this.query = options.query;
		},
		
		url: function() {
			return 'https://api.github.com/users/' + this.query;
		},
		
		parse: function(res) {
			return res.data;
		}
	});
	
	return OwnerModel;
});