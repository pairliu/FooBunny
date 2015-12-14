define([
	'jquery',
	'underscore',
	'backbone',
	'models/contributor/ContributorModel'
	
], function($, _, Backbone, ContributorModel){
	
	var ContributorsCollection = Backbone.Collection.extend({
		model: ContributorModel,
		
		initialize: function(models, options) {},
		
		url: function() {
			return 'https://api.github.com/repos/thomasdavis/backbonetutorials/contributors';
		},
		
		parse: function(data) {
			var uniqueArray = this.removeDuplicates(data.data);
			return uniqueArray;
		},
		
		removeDuplicates: function(myArray) {
			var length = myArray.length;
			var ArrayWithUniqueValues = [];
			
			var objectCounter = {};
			
			for (i = 0; i < length; i++) {
				var currentMemberOfArrayKey = JSON.stringify(myArray[i]);
				var currentMemberOfArrayValue = myArray[i];
				
				if (objectCounter[currentMemberOfArrayKey] === undefined) {
					ArrayWithUniqueValues.push(currentMemberOfArrayValue);
					objectCounter[currentMemberOfArrayKey] = 1;
				} else {
					objectCounter[currentMemberOfArrayKey]++;
				}
			}
			
			return ArrayWithUniqueValues;
		}
	});
	
	return ContributorsCollection;
	
});