define([
	'jquery',
	'underscore-min',
	'backbone-min'
], function (
	$,
	_,
	Backbone
) {
	TodoView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#todo-template').html()),

		events: {
			'click .remove': 'remove',
			'click .edit': 'edit',
			'click .save': 'save'
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		remove: function() {
    		this.$el.remove();  
			this.model.destroy();
		},

		edit: function() {
			var editTemplate = _.template($('#edit-template').html());
			this.$el.html(editTemplate(this.model.toJSON()));
		},

		save: function() {
			var description = this.$el.children('#edit-description').val();
			this.model.save({'description': description});
			this.render();
		}
	});

	return TodoView;	
});