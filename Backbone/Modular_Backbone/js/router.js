define([
	'jquery',
	'underscore',
	'backbone',
	'views/home/HomeView',
	'views/projects/ProjectsView',
	'views/contributors/ContributorsView',
	'views/footer/FooterView'
], function($, _, Backbone, HomeView, ProjectsView, ContributorsView, FooterView){
	
	var AppRouter = Backbone.Router.extend({
		routes: {
			'projects': 'showProjects',
			'users': 'showContributors',
			
			//default
			'*action': 'defaultAction'
		}
	});
	
	var initialize = function() {
		var app_router = new AppRouter;
		
		app_router.on('route:showProjects', function() {
			// Generally in a router's handler, new a view and render.
			var projectsView = new ProjectsView();
			projectsView.render();
		});
		
		app_router.on('route:showContributors', function() {
			var contributorsView = new ContributorsView();
			//contributorsView.render();           //A little different. No need to render now.
		});
		
		app_router.on('route:defaultAction', function() {
			var homeView = new HomeView();
			homeView.render();
		});
		
		Backbone.history.start();
	};
	
	return {
		initialize: initialize
	};
});