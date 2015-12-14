$(function(){
	
	var Todo = Backbone.Model.extend({
		defaults: function(){
			return {
				title: "empty todo ...",
				done: false,
				order: Todos.nextOrder()
			};
		},
		
		//defaults: {
		//	title: "empty todo ...",
		//	done: false,
		//	order: Todos.nextOrder()                 //Will have error on this line: Uncaught TypeError: Cannot read property 'nextOrder' of undefined
		//},											 //Probably because the initialization sequence
		
		initialize: function() {
			this.on("error", function(model, error) {
				// 
			});
		},
		
		validate: function() {
			// If return an string, Backbone will trigger an error event.
		},
		
		toggle: function() {
			this.save({done: !this.get('done')});
		}
	});
	
	var TodoList = Backbone.Collection.extend({
		model: Todo,
		
		nextOrder: function() {
			if (!this.length) return 1;
			else return this.last().get('order') + 1;
		},
		
		comparator: 'order',
		
		localStorage: new Backbone.LocalStorage("item-storage"),
		
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
		
		template: _.template($('#item-template').html()),
		
		events: {
			"click .toggle": "toggleDone",
			"dblclick .view": "edit",
			"click .destroy": "clear",
			"keypress .edit": "updateOnEnter",
			"blur .edit": "close"
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
		
		close: function() {
			var value = this.input.val();
			if (!value) {
				this.clear();
			} else {
				this.$el.removeClass('editing');
				this.model.save({title: value});
			}
		},
		
		updateOnEnter: function(e) {
			if (e.keyCode == 13) this.close();
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
		}
	});
	
	var AppView = Backbone.View.extend({
		el: $('#todoapp'),
		
		statsTemplate: _.template($('#stats-template').html()),
		
		events: {
			"click #toggle-all": "toggleAll",
			"click #clear-completed": "clearCompleted",
			"keypress #new-todo": "createOnEnter"
		},
		
		toggleAll: function() {
			var done = this.allCheckbox.checked;
			Todos.each(function(todo){
				todo.save({done: done});
			});
		},
		
		clearCompleted: function() {
			_.invoke(Todos.done(), 'destroy');
			return false;
		},
		
		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.input.val()) return;
			
			Todos.create({title: this.input.val()});
			this.input.val('');
		},
		
		initialize: function() {
			this.main = this.$('#main');
			this.footer = this.$('footer');
			this.input = this.$('#new-todo');
			
			this.allCheckbox = this.$('#toggle-all')[0];
			
			this.listenTo(Todos, 'add', this.addOne);
			this.listenTo(Todos, 'reset', this.addAll);
			this.listenTo(Todos, 'all', this.render);
			
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
		
		addOne: function(todo) {
			var item = new TodoView({model: todo});
			this.$('#todo-list').append(item.render().el);
		},
		
		addAll: function() {
			Todos.each(addOne);
		}
		
	});
	
	var app = new AppView;
	
});










