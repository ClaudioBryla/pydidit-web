define([
    'jquery',
    'underscore-min',
    'backbone-min'
], function (
    $,
    _,
    Backbone
) {
    ProjectView = Backbone.View.extend({
        tagName: 'li',
        className: 'project',
        template: _.template($('#project-template').html()),

        events: {
            'click .remove-project': 'remove',
            'click .edit-project': 'edit',
            'click .save': 'save',
            'click .complete-project': 'complete',
            'click': 'model_dump' // For debug.
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            var projectJSON = this.model.toJSON();
            // Protect against null values that are assigned by the backend later
            var success = false;
            while (!success) {
                success = true;
                try {
                    this.$el.html(this.template(projectJSON));
                } catch (err) {
                    console.log(err);
                    var errorWords = err.message.split(' ');
                    if (errorWords.slice(1).join(' ') === 'is not defined') {
                        success = false;
                        projectJSON[errorWords[0]] = null;
                    } else {
                        throw err;
                    }
                }
            }
            this.$el.data('projectId', this.model.get('id'));
            this.$el.data('projectDisplayPosition', this.model.get('display_position'));
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
            this.$el.html(editTemplate(this.model.toJSON()));
        },

        save: function() {
            var description = this.$el.children('div').children('#edit-description').val();
            this.model.save({'description': description});
            this.render();
        },

        complete: function() {
            this.$el.addClass('bg-success');
            this.$el.hide(
                'slow',
                function() {
                    $(this).remove();
                }
            );
            this.model.save({'state': 'completed'});
        },

        model_dump: function() {
            // Dumps model to console.
            console.log(this.model);
        }
    });

    return ProjectView;
});
