define([
    'jquery',
    'underscore-min',
    'backbone-min',
    'views/todo-view',
    'bootstrap',
    'jqueryui'
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
            this.listenTo(this.collection, 'add', function(todo) {
                this.renderOne(todo);
                var descriptionInput = this.$('#description');
                descriptionInput.val('');
                descriptionInput.focus();
            });
        },

        render: function() {
            this.$el.html(this.template());
            this.$el.children('ul').sortable({
                change: function(ev, ui) {
                    console.log('CHANGE');
                }
            });
            _.each(this.collection.models, this.renderOne);
        },

        renderOne: function(todo) {
            var todoView = new TodoView({'model': todo});
            this.$el.children('ul').append(todoView.render().el);
        },

        create: function() {
            var description = this.$('#description').val();
            var newModel = this.collection.create({'description': description});
        },

    });

    return TodosView;
});
