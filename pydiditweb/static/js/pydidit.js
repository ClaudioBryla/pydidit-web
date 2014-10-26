require([
    'jquery',
    'underscore-min',
    'backbone-min',
    'collections/todos',
    'views/todos-view',
    'collections/projects',
    'views/projects-view',
    'collections/tags',
    'views/tags-view',
    'bootstrap'
], function(
    $,
    _,
    Backbone,
    Todos,
    TodosView,
    Projects,
    ProjectsView,
    Tags,
    TagsView
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

        var tags = new Tags();
        tags.fetch();
        var tagsView = new TagsView({'collection': tags});
        tagsView.render();
    });
});
