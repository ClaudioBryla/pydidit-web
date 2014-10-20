define([
	'jquery',
	'underscore-min',
	'backbone-min'
], function(
	$,
	_,
	Backbone
) {
	Config = Backbone.Model.extend({
        get: function (attr) {
            if (typeof this[attr] == 'function') {
                return this[attr]();
            }
            return Backbone.Model.prototype.get.call(this, attr);
        },

        toJSON: function() {
            var attr = Backbone.Model.prototype.toJSON.call(this);
            attr.dateFormat = this.dateFormat();
            return attr;
        },

        dateFormat: function() {
            return 'MM/DD/YYYY';
        }
    });

	return Config;
});
