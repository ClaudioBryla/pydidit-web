define([
    'jquery',
    'underscore-min',
    'backbone-min',
    'models/config'
], function(
    $,
    _,
    Backbone,
    Config
) {
    Todo = Backbone.Model.extend({
        primaryDescriptor: 'description',

        initialize: function() {
            this.set('type', 'Todo');
        },

        parse: function(response, options) {
            if (_.isArray(response)) {
                return response[0]; // Server returns an array from put(), so take out the new attrs
            } else {
                return response;
            }
        },

        get: function (attr) {
            if (typeof this[attr] == 'function') {
                return this[attr]();
            }
            return Backbone.Model.prototype.get.call(this, attr);
        },

        toJSON: function() {
            var attr = Backbone.Model.prototype.toJSON.call(this);
            attr.created_at_formatted = this.created_at_formatted();
            return attr;
        },

        created_at_formatted: function() {
            var createdAt = new Date(Date.parse(this.get('created_at')));
            var config = new Config();
            if (config.get('dateFormat') === 'MM/DD/YYYY') {
                return createdAt.getMonth() + '/' + createdAt.getDate() + '/' + createdAt.getFullYear();
            }
            return '';
        },
    });

    return Todo;
});
