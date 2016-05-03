Template.navigation.events({
    'click #btnAddCollection': function (e) {
        e.preventDefault();
        $('#collectionAddModal').modal('show');
    },

    'click #btnRefreshCollections2': function (e) {
        e.preventDefault();
        Template.topNavbar.connect(true);
    },

    'click .aNavigations': function () {
        Template.navigation.handleNavigationAndSessions();
    },

    'click .navCollection': function (e) {

        var name = this.name;

        $('#listCollectionNames').find('li').each(function (index, li) {
            var liObject = $(li);
            if (liObject[0].textContent.substr(1).replace('Drop', '').trim() == name) {
                liObject.addClass('active');
            }
            else {
                liObject.removeClass('active');
            }
        });

        $('#listSystemCollections').find('li').each(function (index, li) {
            var liObject = $(li);
            if (liObject[0].textContent.substr(1).replace('Drop', '').trim() == name) {
                liObject.addClass('active');
            } else {
                liObject.removeClass('active');
            }
        });


        Session.set(Template.strSessionSelectedCollection, name);
    }
});

Template.navigation.helpers({
    'initializeMetisMenu': function () {
        Meteor.setTimeout(function () {
            var sideMenu = $('#side-menu');
            sideMenu.removeData("mm");
            sideMenu.metisMenu();
        });
    },

    'getCollectionNames': function () {
        var collectionNames = Session.get(Template.strSessionCollectionNames);
        if (collectionNames != undefined) {
            var result = [];
            collectionNames.forEach(function (collectionName) {
                if (!collectionName.name.startsWith('system')) {
                    result.push(collectionName);
                }
            });

            return result;
        }

        return collectionNames;
    },

    'getSystemCollectionNames': function () {
        var collectionNames = Session.get(Template.strSessionCollectionNames);
        if (collectionNames != undefined) {
            var result = [];
            collectionNames.forEach(function (collectionName) {
                if (collectionName.name.startsWith('system')) {
                    result.push(collectionName);
                }
            });

            return result;
        }

        return collectionNames;
    }
});

Template.navigation.handleNavigationAndSessions = function () {
    $('#listCollectionNames').find('li').each(function (index, li) {
        $(li).removeClass('active');
    });

    $('#listSystemCollections').find('li').each(function (index, li) {
        $(li).removeClass('active');
    });

    Session.set(Template.strSessionSelectedCollection, undefined);
    Session.set(Template.strSessionSelectedQuery, undefined);
    Session.set(Template.strSessionSelectedOptions, undefined);

    $('#cmbQueries').val('').trigger('chosen:updated');
    $('#cmbAdminQueries').val('').trigger('chosen:updated');
};

Template.navigation.renderCollectionNames = function () {
    Meteor.call('connect', Session.get(Template.strSessionConnection), function (err, result) {
        if (err || result.error) {
            Template.showMeteorFuncError(err, result, "Couldn't connect");
        }
        else {
            // re-set collection names
            Session.set(Template.strSessionCollectionNames, result.result);
            // set all session values undefined except connection
            Session.set(Template.strSessionSelectedQuery, undefined);
            Session.set(Template.strSessionSelectedOptions, undefined);
            Session.set(Template.strSessionSelectedCollection, undefined);
            Router.go('databaseStats');
        }
    });
};