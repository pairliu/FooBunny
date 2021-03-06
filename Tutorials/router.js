var AppRouter = Backbone.Router.extend({
    routes: {
        "*actions": "defaultRoute"
        // matches http://example.com/#anything-here
    }
});
// Initiate the router
var app_router = new AppRouter;

app_router.on('route:defaultRoute', function(actions) {
    alert(actions);
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();