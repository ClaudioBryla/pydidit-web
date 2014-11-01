define([
    'jquery',
    'underscore-min',
    'backbone-min',
    'views/project-view',
    'mustache',
    'text!templates/mustache/tab.mustache',
    'bootstrap',
    'jqueryui'
], function (
    $,
    _,
    Backbone,
    ProjectView,
    Mustache,
    TabTemplate
) {
    ProjectsView = Backbone.View.extend({
        el: '#project-tab',

        events: {
            'click #create': 'create'
        },

        initialize: function() {
            this.listenTo(this.collection, 'add', function(project) {
                this.renderOne(project);
                var descriptionInput = this.$('#description');
                descriptionInput.val('');
                descriptionInput.focus();
            });
        },

        sortStartDisplayPosition: null,

        createDivId: 'project-create-div',

        ulClass: 'projects-list',

        render: function() {
            var projectsDiv = $(Mustache.render(TabTemplate, {
                'tabTitle': 'Projects:',
                'ulClass': this.ulClass,
                'createDivId': this.createDivId,
            }));
            var projectCreateNodes = $(_.template($('#project-create-template').html())());
            projectsDiv.children('#' + this.createDivId).prepend(projectCreateNodes);
            this.$el.append(projectsDiv);

            projectsDiv.children('.' + this.ulClass).sortable({
                start: $.proxy(function(ev, ui) {
                    this.sortStartDisplayPosition = ui.item.data('projectDisplayPosition');
                }, this),
                update: $.proxy(function(ev, ui) {
                    // Lock it while we wait for the server
                    projectsDiv.children('.' + this.ulClass).sortable('option', 'disabled', true);
                    var next = ui.item.next();
                    var projectToMove = this.collection.get(ui.item.data('projectId'))
                    if (_.size(next) === 0) { // Move to end
                        projectToMove.set('pydiditweb_control', {'sink_all_the_way': true});
                    } else if (_.size(next) === 1) { // Move with anchor
                        projectToMove.set('pydiditweb_control', {'move_to_anchor': parseInt(next.data('projectId'))});
                    }
                    projectToMove.save({}, {
                        success: function(project, resp, options) {
                            // Loop through and fetch models that may have changed
                            var promises = _.map(project.collection.filter(function(another_project) { // Bad name, might actually be the same project
                                // I'm aware that this is doing a double fetch - one end of each of these cases should not have the equals
                                // part because the project just moved is already fetched.  But it's too late in the day right now for me to determine this.
                                if (options.this.sortStartDisplayPosition < resp.display_position) { // Moving down
                                    return options.this.sortStartDisplayPosition <= another_project.get('display_position') &&
                                           another_project.get('display_position') <= resp.display_position;
                                } else { // Moving up
                                    return options.this.sortStartDisplayPosition >= another_project.get('display_position') &&
                                           another_project.get('display_position') >= resp.display_position;
                                }
                            }), function(another_project) {
                                return another_project.fetch();
                            });

                            $.when.apply($, promises).done(function() {
                                // Unlock it
                                projectsDiv.children('.' + options.this.ulClass).sortable('option', 'disabled', false);
                            });
                        },
                        this: this
                    });
                }, this),
            });

            _.each(this.collection.models, this.renderOne);
        },

        renderOne: function(project) {
            var projectView = new ProjectView({'model': project});
            this.$el.find('div .' + this.ulClass).append(projectView.render().el);
        },

        create: function() {
            var description = this.$('#description').val();
            var newModel = this.collection.create({'description': description});
        },

    });

    return ProjectsView;
});
