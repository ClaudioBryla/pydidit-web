require([
    'jquery',
    'underscore-min',
    'backbone-min',
    'collections/todos',
    'views/todos-view',
    'collections/projects',
    'views/projects-view',
    'bootstrap'
], function(
    $,
    _,
    Backbone,
    Todos,
    TodosView,
    Projects,
    ProjectsView
) {
    $(function() {
        var todos = new Todos();
        todos.fetch();
        var todosView = new TodosView({'collection': todos});
        todosView.render();
        var projects = new Projects();
        projects.fetch();
        var projectsView = new ProjectsView({'collection': projects});
        projectsView.render();
    });
});
