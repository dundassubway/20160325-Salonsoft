Template.webmanage.helpers({
    name: function () {
        return Website.findOne().name;
    },
    myFormData: function () {
        return { directoryName: 'logo', prefix: this._id, _id: this._id }
    },
    myFormDataPhoto: function () {
        return { directoryName: 'images', prefix: this._id, _id: this._id }
    },
    descrip: function () {
        return Website.findOne().descrip;
    },
    address: function () {
        return Website.findOne().address;
    },
    tel: function () {
        return Website.findOne().tel;
    },
    Monday: function () {
        return Website.findOne().Monday;
    },
    Tuesday: function () {
        return Website.findOne().Tuesday;
    },
    Wednesday: function () {
        return Website.findOne().Wednesday;
    },
    Thursday: function () {
        return Website.findOne().Thursday;
    },
    Friday: function () {
        return Website.findOne().Friday;
    },
    Saturday: function () {
        return Website.findOne().Saturday;
    },
    Sunday: function () {
        return Website.findOne().Sunday;
    },
});

Template.webmanage.events({
    'submit .js-uploadWebsite': function (event) {
        event.preventDefault();
        console.log('submit --- event :', event.target.description.value);
        //Meteor.call('WebManageUpdate1', event.target.description.value, event.target.address.value, event.target.tel.value);
        //Meteor.call('WebManageUpdate2', event.target.Monday.value, event.target.Tuesday.value, event.target.Wednesday.value, event.target.Thursday.value);
        //Meteor.call('WebManageUpdate3', event.target.Friday.value, event.target.Saturday.value, event.target.Sunday.value);
        Meteor.call('WebManageUpdate', event.target.description.value, event.target.address.value, event.target.tel.value,
         event.target.Monday.value, event.target.Tuesday.value, event.target.Wednesday.value, event.target.Thursday.value,
         event.target.Friday.value, event.target.Saturday.value, event.target.Sunday.value);
        return false;
    },
    'click .js-add-service': function (event) {
        event.preventDefault();

    }
});

Template.uploadedInfo.helpers({
    src: function () {
        console.log('this :', this);
        if (this.type.indexOf('image') >= 0) {
            if (this.subDirectory.indexOf('images')>=0)
                return this.baseUrl + this.path;
        } else return 'file_icon.png';
    }
});

Template.uploadedInfo.events({
    'click .deleteUpload': function () {
        if (confirm('Are you sure?')) {
            Meteor.call('deleteFile', this._id);
        }
    }
});

function addServiceFields() {
    // Number of inputs to create
    var number = document.getElementById("member").value;
    // Container <div> where dynamic content will be placed
    var container = document.getElementById("container");
    // Clear previous contents of the container
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    for (i = 0; i < number; i++) {
        // Append a node with a random text
        container.appendChild(document.createTextNode("Member " + (i + 1)));
        // Create an <input> element, set its type and name attributes
        var input = document.createElement("input");
        input.type = "text";
        input.name = "member" + i;
        container.appendChild(input);
        // Append a line break 
        container.appendChild(document.createElement("br"));
    }
}
