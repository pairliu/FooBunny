$(function(){
	
	var Todo = Backbone.Model.extend({
		defaults: function(){
			return {
				title: "empty todo...",
				done: false,
				order: Todos.nextOrder()
			}
		},
		
		toggle: function() {
			this.save({done: !this.get('done')});
		}
	});
	
	var TodoList = Backbone.Collection.extend({
		model: Todo,
		
		localStorage: new Backbone.LocalStorage("item-storage"),
		
		done: function() {
			return this.where({done: true});
		},
		
		remaining: function() {
			return this.where({done: false});
		},
		
		comparator: 'order',
		
		nextOrder: function() {
			if (!this.length) 
				return 1;
			return this.last().get('order') + 1;
		}
	});
	
	var Todos = new TodoList;
	
	var TodoView = Backbone.View.extend({
		tagName: 'li',
		
		template: _.template($("#item-template").html()),
		
		events: {
			"click .toggle": "toggleCompleted",
			"click a.destroy": "clear",
			"dblclick .view": "edit",
			"keypress .edit": "updateOnEnter",
			"blur .edit": "close"
		},
		
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));              //This is the way to create
			this.$el.toggleClass('done', this.model.get('done'));           
			this.input = this.$(".edit");
			return this;
		},
		
		toggleCompleted: function() {
			//this.save({done: !this.get('done')});  
			this.model.toggle();   //Yes, better to use the model method directly
		},
		
		clear: function() {
			//_.invoke(this.model, 'destroy');      // No no, not use here.
			this.model.destroy();
		},
		
		edit: function() {
			this.$el.addClass("editing");
			this.input.focus();
		},
		
		close: function() {
			var text = this.input.val();
			if (!text) {
				this.clear();
			} else {
				this.model.save({title: text});
				this.$el.removeClass("editing");
			}
		},
		
		updateOnEnter: function(e) {
			if (e.keyCode == 13) this.close();
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
			this.main = $('#main');
			this.footer = this.$('footer');
			this.input = $("#new-todo");
			
			//this.toggle = $('#toggle-all');
			this.allCheckbox = this.$("#toggle-all")[0];    //This is the right way to get the checkbox element.
			
			this.listenTo(Todos, 'add', this.addOne);
			//this.listenTo(Todos, 'reset', this.addAll);
			this.listenTo(Todos, 'all', this.render);
			
			Todos.fetch();
		},
		
		toggleAll: function() {
			var done = this.allCheckbox.checked;
			Todos.each(function(todo) {				
				todo.save({done: done});
			});
			
			//This doesn't work! Inside a function cannot access "this"? Oh, yes, now "this" is the function itself!
			//Todos.each(function(todo) {				
			//	todo.save({done: this.allCheckbox.checked});
			//});
		},
		
		clearCompleted: function() {
			_.invoke(Todos.done(), 'destroy');         //(collection, methodName)
			return false;
		},
		
		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.input.val()) return;
			
			Todos.create({title: this.input.val()});
			this.input.val('');
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
			if (!Todos.length) {
				this.main.hide();
				this.footer.hide();
			} else {
				this.main.show();
				this.footer.show();
				this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
			}
			
			this.allCheckbox.checked = !remaining;
		}
	});
	
	var app = new AppView;
	
});




