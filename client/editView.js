import {RESTCollection} from 'meteor/dasdeck:restcollection';


Router.route('/edit/:collection/:id/:type?', function () {
    if (this.params.type === 'oid') {
        this.params.id = new Mongo.ObjectID(params.id);
    }
    this.render("editView", {data: {params: this.params}});

});


// FlowRouter.route('/edit/:collection/:id/:type?', {
//     action: function (params) {
//         if (params.type === 'oid') {
//             params.id = new Mongo.ObjectID(params.id);
//         }
//         BlazeLayout.render("layout", {content: "editView", params: params});
//     }
// });

Template.editView.helpers({
    data: function () {
        var entity = this.collection.findOne({_id: this.id});
        return entity
    },
    schema: function () {
        return this.collection.getSchema('edit');
    },
    class: function () {

    }
});


Template.editView.events({

    'keyup, change': function (e) {
        e.preventDefault();
        let data = Template.instance().data;
        let collection = data.collection;
        let formName = collection._name;
        if (AutoForm.validateForm(formName)) {
            let entity = collection.findOne({_id: data.id});
            if (e.target.type === 'number') {
                entity[e.target.name] = e.target.valueAsNumber;
            }
            else if (e.target.type === 'date') {
                entity[e.target.name] = e.target.valueAsDate;
            }
            else {
                entity[e.target.name] = e.target.value;

            }
            entity.saveDebounced();
        }
    }

});


Template.editView.onCreated(function () {

    var params = this.data.params;
    var collection = window[params.collection];
    this.data.id = params.id;
    this.data.collection = collection;

    if (!(collection instanceof RESTCollection)) {
        Meteor.subscribe(collection._name, {filter: {_id: params.id}});
    }
});
