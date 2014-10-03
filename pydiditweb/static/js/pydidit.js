require([
	'jquery',
	'underscore-min',
	'backbone-min',
	'collections/todos',
	'views/todos-view'
], function(
	$,
	_,
	Backbone,
	Todos,
	TodosView
) {
	$(function() {
		todos = new Todos();
		todos.fetch();
		var todosView = new TodosView({'collection': todos});
		todosView.render();
	});
});