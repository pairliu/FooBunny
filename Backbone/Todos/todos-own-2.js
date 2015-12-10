$(function(){
	
	var Todo = Backbone.Model.extend({
		defaults: function() {
			return {
				title: 'empty todo...',
				done: false,
				order: Todos.nextOrder()
			};
		},
		
		toggle: function() {
			this.save({done: !this.get('done')});
		}
	});
	
	var TodoList = Backbone.Collection.extend({
		model: Todo,
		
		localStorage: new Backbone.LocalStorage("todos-backbone"),
		
		done: function() {
			return this.where({done: true});
		}, 
		
		remaining: function() {
			return this.where({done: false});
		}, 
		
		comparator: 'order',
		
		nextOrder: function() {
			if (!this.length) return 1;
			//return this.last().get('order') + 1;
			return this.length + 1;
		}
	});
	
	var Todos = new TodoList;
	
	var TodoView = Backbone.View.extend({
		tagName: 'li',
		
		template: _.template($('#item-template').html()),
		
		events: {
			"click .toggle": "toggleDone",
			"dblclick .view": "edit",
			"click a.destroy": "clear",
			"keypress .edit": "updateOnEnter",
			"blur .edit": "close"
		},
		
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		
		render: function() {
			// This function contains a lot of information.
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('done', this.model.get('done'));      // toggleClass() is a jQuery method. If the second parameter is true, then add the class of the first parameter. Otherwise remove the class.
			this.input = this.$('.edit');                 //Oh, it declares a "input" attribute in current object. And find the the DOM element and assign to it. So the below code can use it.
			return this;             // Dom is created, but it hasn't been appended to parent yet. So need to return itself, and be appended in parent's functions.
		},
		
		toggleDone: function() {
			this.model.toggle();
		},
		
		edit: function() {
			this.$el.addClass('editing');
			this.input.focus();
		},
		
		clear: function() {
			this.model.destroy();
		},
		
		updateOnEnter: function(e) {    // Need to check the "Enter" key, so need to pass in the event object.
			if (e.keyCode == 13) this.close();
		},
		
		close: function() {
			if (this.input.val() == '') 
				this.model.destroy();			
			else {
				this.model.save({title: this.input.val()});
				this.$el.removeClass("editing");
			}
		}
	});
	
	var AppView = Backbone.View.extend({
		el: $("#todoapp"),
		
		statsTemplate: _.template($('#stats-template').html()),		
		
		events: {
			"click #toggle-all": "toggleCompleteAll",
			"keypress #new-todo": "createOnEnter",
			"click #clear-completed": "clearCompleted"
		},
		
		initialize: function() {
			this.input = this.$("#new-todo");
			this.allCheckbox = this.$("#toggle-all")[0];
			
			this.listenTo(Todos, "add", this.addOne);
			this.listenTo(Todos, "reset", this.addAll);
			this.listenTo(Todos, "all", this.render);
			
			this.footer = this.$('footer');
			this.main = $('#main');
			
			Todos.fetch();
		},
		
		toggleCompleteAll: function() {
			var done = this.allCheckbox.checked;
			
			Todos.each(function(todo){todo.save({done: done}); });
		},
		
		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.input.val()) return;
			
			Todos.create({title: this.input.val()});
			this.input.val('');
		},
		
		clearCompleted: function() {
			_.invoke(Todos.done(), 'destroy');
			return false;
		},
		
		addOne: function(todo) {
			var item = new TodoView({model: todo});
			this.$("#todo-list").append(item.render().el);
		},
		
		addAll: function() {
			Todos.each(this.addOne, this);
		},
		
		render: function() {
			var done = Todos.done().length;
			var remaining = Todos.remaining().length;

			if (Todos.length) {
				this.main.show();
				this.footer.show();
				this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
			} else {
				this.main.hide();
				this.footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		}
		
	});
	
	var app = new AppView;
});










