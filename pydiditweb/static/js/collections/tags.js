define([
	'jquery',
	'underscore-min',
	'backbone-min',
	'models/tag',
	'views/tag-view'
], function (
	$,
	_,
	Backbone,
	Tag,
	TagView
) {
	var Tags = Backbone.Collection.extend({ 
		url: "/api/tags",
		model: Tag

	});

	return Tags;
});
