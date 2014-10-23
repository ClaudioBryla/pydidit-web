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

        sortStartDisplayPosition: null,

        render: function() {
            this.$el.html(this.template());
            this.$el.children('ul').sortable({
                start: $.proxy(function(ev, ui) {
                    this.sortStartDisplayPosition = ui.item.data('todoDisplayPosition');
                }, this),
                update: $.proxy(function(ev, ui) {
                    // Lock it while we wait for the server
                    this.$el.children('ul').sortable('option', 'disabled', true);
                    var next = ui.item.next();
                    var todoToMove = this.collection.get(ui.item.data('todoId'))
                    if (_.size(next) === 0) { // Move to end
                        todoToMove.set('pydiditweb_control', {'sink_all_the_way': true});
                    } else if (_.size(next) === 1) { // Move with anchor
                        todoToMove.set('pydiditweb_control', {'move_to_anchor': parseInt(next.data('todoId'))});
                    }
                    todoToMove.save({}, {
                        success: function(todo, resp, options) {
                            // Loop through and fetch models that may have changed
                            var promises = _.map(todo.collection.filter(function(another_todo) { // Bad name, might actually be the same one
                                // I'm aware that this is doing a double fetch - one end of each of these cases should not have the equals
                                // part because the todo just moved is already fetched.  But it's too late right now for me to determine this.
                                if (options.this.sortStartDisplayPosition < resp.display_position) { // Moving down
                                    return options.this.sortStartDisplayPosition <= another_todo.get('display_position') &&
                                           another_todo.get('display_position') <= resp.display_position;
                                } else { // Moving up
                                    return options.this.sortStartDisplayPosition >= another_todo.get('display_position') &&
                                           another_todo.get('display_position') >= resp.display_position;
                                }
                            }), function(another_todo) {
                                return another_todo.fetch();
                            });
                            $.when.apply($, promises).done(function() {
                                // Unlock it
                                options.this.$el.children('ul').sortable('option', 'disabled', false);
                            });
                        },
                        this: this
                    });
                }, this),
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
