define([
    'jquery',
    'underscore-min',
    'backbone-min',
    'views/tag-view',
    'mustache',
    'text!templates/mustache/tab.mustache',
    'bootstrap',
    'jqueryui'
], function (
    $,
    _,
    Backbone,
    TagView,
    Mustache,
    TabTemplate
) {
    TagsView = Backbone.View.extend({
        el: '#tag-tab',

        events: {
            'click #create': 'create'
        },

        initialize: function() {
            this.listenTo(this.collection, 'add', function(tag) {
                this.renderOne(tag);
                var nameInput = this.$('#tag-name');
                nameInput.val('');
                nameInput.focus();
            });
        },

        sortStartDisplayPosition: null,

        createDivId: 'tag-create-div',

        ulClass: 'tags-list',

        render: function() {
            var tagsDiv = $(Mustache.render(TabTemplate, {
                'tabTitle': 'Tags:',
                'ulClass': this.ulClass,
                'createDivId': this.createDivId,
            }));
            var tagCreateNodes = $(_.template($('#tag-create-template').html())());
            tagsDiv.children('#' + this.createDivId).prepend(tagCreateNodes);
            this.$el.append(tagsDiv);

            _.each(this.collection.models, this.renderOne);
        },

        renderOne: function(tag) {
            var tagView = new TagView({'model': tag});
            this.$el.find('div .' + this.ulClass).append(tagView.render().el);
        },

        create: function() {
            var name = this.$('#tag-name').val();
            var newModel = this.collection.create({'name': name});
        },

    });

    return TagsView;
});
