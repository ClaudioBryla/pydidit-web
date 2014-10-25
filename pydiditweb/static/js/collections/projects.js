define([
	'jquery',
	'underscore-min',
	'backbone-min',
	'models/project',
	'views/project-view'
], function (
	$,
	_,
	Backbone,
	Project,
	ProjectView
) {
	var Projects = Backbone.Collection.extend({ 
		url: "/api/projects",
		model: Project

	});

	return Projects;
});
