define([
	'jquery',
	'underscore-min',
	'backbone-min',
	'models/todo',
	'views/todo-view'
], function (
	$,
	_,
	Backbone,
	Todo,
	TodoView
) {
	var Todos = Backbone.Collection.extend({ 
		url: "/api/todos",
		model: Todo

	});

	return Todos;
});