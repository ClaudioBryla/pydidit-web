require([
    'jquery',
    'underscore-min',
    'backbone-min',
    'collections/todos',
    'views/todos-view',
    'bootstrap'
], function(
    $,
    _,
    Backbone,
    Todos,
    TodosView
) {
    $(function() {
        var todos = new Todos();
        todos.fetch();
        var todosView = new TodosView({'collection': todos});
        todosView.render();
    });
});
