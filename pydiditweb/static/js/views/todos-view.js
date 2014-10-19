define([
	'jquery',
	'underscore-min',
	'backbone-min',
	'views/todo-view'
], function (
	$,
	_,
	Backbone,
	TodoView
) {
	TodosView = Backbone.View.extend({
		el: '#pydidit',
		template: _.template($('#todos-template').html()),

		events: {
			'click #create': 'create'
		},

		initialize: function() {
			this.listenTo(this.collection, 'add', this.renderOne);
		},

		render: function() {
			this.$el.html(this.template());

			_.each(this.collection.models, function(todo) {
				var todoView = new TodoView({'model': todo});
				this.$el.children('ol').append(todoView.render().el);	
			}, this);
		},

		renderOne: function(todo) {
			var todoView = new TodoView({'model': todo});
			this.$el.children('ol').append(todoView.render().el);
		},

		create: function() {
			var description = $("#description").val();
			this.collection.create({'description': description});
		}

	});

	return TodosView;	
});