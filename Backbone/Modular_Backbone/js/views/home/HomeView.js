define([
	'jquery',
	'underscore',
	'backbone',
	'views/sidebar/SidebarView',
	'text!templates/home/homeTemplate.html'
], function($, _, Backbone, SidebarView, homeTemplate){
	var HomeView = Backbone.View.extend({
		el: $('#page'),
		
		render: function() {
			//Highlight correct menu 
			$('.menu li').removeClass('active');
			$('.menu li a[href="#"]').parent().addClass('active');
			
			//Display using the template
			this.$el.html(homeTemplate);
			
			//Render sub view
			var sidebarView = new SidebarView();
			sidebarView.render();
		}
	});
	
	return HomeView;
});