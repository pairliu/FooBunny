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
		
		comparator: 'order',
		
		localStorage: new Backbone.LocalStorage("some-storage"),
		
		nextOrder: function() {
			if (!this.length) return 1;
			return this.length + 1;
		}, 
		
		done: function() {
			return this.where({done: true});
		},
		
		remaining: function() {
			return this.where({done: false});
		}
	});
	
	var Todos = new TodoList;
	
	var TodoView = Backbone.View.extend({
		tagName: 'li',
		
		template: _.template( $('#item-template').html()),
		
		events: {
			"click .destroy": "clear",
			"click .toggle": "toggleComplete",
			"keypress .edit": "updateOnEnter",
			"blur .edit": "close",
			"dblclick .view": "edit"
		},
		
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		}, 
		
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('done', this.model.get('done'));
			this.input = this.$('.edit');
			return this;
		}, 
		
		clear: function() {
			this.model.destroy();
		}, 
		
		toggleComplete: function() {
			this.model.toggle();
		}, 
		
		updateOnEnter: function(e) {
			if (e.keyCode == 13) this.close();
		},
		
		close: function() {
			var value = this.input.val();
			if (value) {
				this.model.save({title: value});
				this.$el.removeClass('editing');
			} else {
				this.clear();
			}
		},
		
		edit: function() {
			this.$el.addClass('editing');
		}
	});
	
	var AppView = Backbone.View.extend({
		el: $("#todoapp"),
		
		statsTemplate: _.template($("#stats-template").html()),
		
		events: {			
			"click #toggle-all": "toggleAll",
			"click #clear-completed": "clearCompleted",
			"keypress #new-todo": "createOnEnter"
		},
		
		initialize: function() {
			this.listenTo(Todos, 'add', this.addOne);
			this.listenTo(Todos, 'all', this.render);
			
			this.main = this.$('#main');
			this.footer = this.$('footer');
			this.allCheckbox = this.$("#toggle-all")[0];
			this.input = this.$('#new-todo');
			
			Todos.fetch();
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
		}, 
		
		toggleAll: function() {
			var checked = this.allCheckbox.checked;
			
			Todos.each(function(todo) {todo.save({done: checked})});
		},
		
		clearCompleted: function() {
			_.invoke(Todos.done(), 'destroy');
		}, 
		
		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.input.val()) return;
			
			Todos.create({title: this.input.val()});
			this.input.val('');
		}, 
		
		addOne: function(todo) {
			var view = new TodoView({model: todo});
			this.$('#todo-list').append(view.render().el);
		}
	});
	
	var app = new AppView;
});