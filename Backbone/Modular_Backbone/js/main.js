// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jquery: '../../jquery-1.11.3',
    underscore: '../../underscore',
    backbone: '../../backbone',
    templates: '../templates'
  }

});

require(['app'], function(App){
	App.initialize();
});