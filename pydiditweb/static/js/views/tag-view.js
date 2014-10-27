define([
    'jquery',
    'underscore-min',
    'backbone-min'
], function (
    $,
    _,
    Backbone
) {
    TagView = Backbone.View.extend({
        tagName: 'li',
        className: 'tag',
        template: _.template($('#tag-template').html()),

        events: {
            'click .remove-tag': 'remove',
            'click .edit-tag': 'edit',
            'click .save': 'save',
            'click': 'model_dump' // For debug.
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            var tagJSON = this.model.toJSON();
            // Protect against null values that are assigned by the backend later
            var success = false;
            while (!success) {
                success = true;
                try {
                    this.$el.html(this.template(tagJSON));
                } catch (err) {
                    console.log(err);
                    var errorWords = err.message.split(' ');
                    if (errorWords.slice(1).join(' ') === 'is not defined') {
                        success = false;
                        tagJSON[errorWords[0]] = null;
                    } else {
                        throw err;
                    }
                }
            }
            this.$el.data('tagId', this.model.get('id'));
            return this;
        },

        remove: function() {
            this.$el.addClass('bg-danger');
            this.$el.hide(
                'slow',
                function() {
                    $(this).remove();
                }
            );
            this.model.destroy();
        },

        edit: function() {
            var editTemplate = _.template($('#edit-template').html());
            var modelData = _.clone(this.model.toJSON());
            _.extend(modelData, {
                'primaryDescriptor' : this.model.primaryDescriptor,
                'initialValue' : this.model.get(this.model.primaryDescriptor),
            });
            this.$el.html(editTemplate(modelData));
        },

        save: function() {
            var name = this.$el.children('div').children('#edit-name').val();
            this.model.save({'name': name});
            this.render();
        },

        model_dump: function() {
            // Dumps model to console.
            console.log(this.model);
        }
    });

    return TagView;
});
