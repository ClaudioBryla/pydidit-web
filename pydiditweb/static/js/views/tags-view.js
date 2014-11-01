define([
    'jquery',
    'underscore-min',
    'backbone-min',
    'views/tag-view',
    'mustache',
    'text!templates/mustache/tab.mustache',
    'text!templates/mustache/create.mustache',
    'bootstrap',
    'jqueryui'
], function (
    $,
    _,
    Backbone,
    TagView,
    Mustache,
    TabTemplate,
    CreateTemplate
) {
    TagsView = Backbone.View.extend({
        el: '#tag-tab',

        events: {
            'click #create': 'create'
        },

        initialize: function() {
            this.listenTo(this.collection, 'add', function(tag) {
                this.renderOne(tag);
                var nameInput = this.$('#' + this.createInputId);
                nameInput.val('');
                nameInput.focus();
            });
        },

        sortStartDisplayPosition: null,

        createDivId: 'tag-create-div',

        createInputId: 'tag-create-input',

        ulClass: 'tags-list',

        render: function() {
            var tagsDiv = $(Mustache.render(TabTemplate, {
                'tabTitle': 'Tags:',
                'ulClass': this.ulClass,
                'createDivId': this.createDivId,
            }));
            var tagCreateNodes = $(Mustache.render(CreateTemplate, {
                input_node_id: this.createInputId,
                label_name: 'Tag',
            }));
            tagsDiv.children('#' + this.createDivId).prepend(tagCreateNodes);
            this.$el.append(tagsDiv);

            _.each(this.collection.models, this.renderOne);
        },

        renderOne: function(tag) {
            var tagView = new TagView({'model': tag});
            this.$el.find('div .' + this.ulClass).append(tagView.render().el);
        },

        create: function() {
            var name = this.$('#' + this.createInputId).val();
            var newModel = this.collection.create({'name': name});
        },

    });

    return TagsView;
});
