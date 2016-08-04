Template.website.helpers({
    'ssMapOptions': function() {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            return {
                center: new google.maps.LatLng(43.593848, -79.618536),
                zoom: 15
            };
        }
    },
    'specificFormData': function () {
        return {
            id: this._id,
            other: this.other,
            hard: 'Lolcats'
        }
    },
    'name': function () {
        var name = Website && Website.findOne() && Website.findOne().name;
        return name;
    },
    'logosrc': function () {
        var logosrc = Website && Website.findOne() && Website.findOne().logosrc;
        return logosrc;
    },
    'description': function () {
        var descrip = Website && Website.findOne() && Website.findOne().descrip;
        return descrip;
    },
    'address': function () {
        var address = Website && Website.findOne() && Website.findOne().address;
        return address;
    },
    'tel': function () {
        var tel = Website && Website.findOne() && Website.findOne().tel;
        return tel;
    },
    'Monday': function () {
        var day = Website && Website.findOne() && Website.findOne().Monday;
        return day;
    },
    'Tuesday': function () {
        var day = Website && Website.findOne() && Website.findOne().Tuesday;
        return day;
    },
    'Wednesday': function () {
        var day = Website && Website.findOne() && Website.findOne().Wednesday;
        return day;
    },
    'Thursday': function () {
        var day = Website && Website.findOne() && Website.findOne().Thursday;
        return day;
    },
    'Friday': function () {
        var day = Website && Website.findOne() && Website.findOne().Friday;
        return day;
    },
    'Saturday': function () {
        var day = Website && Website.findOne() && Website.findOne().Saturday;
        return day;
    },
    'Sunday': function () {
        var day = Website && Website.findOne() && Website.findOne().Sunday;
        return day;
    },
    'services': function () {
        var services = Services && Services.find({}).fetch();
        return services;
    }
});

Template.staffsection.helpers({
    'staffs': function () {
        var staffs = Staff && Staff.find({}).fetch();
        return staffs;
    }  
});

Template.carousel.helpers({
    'image': function () {
        var image = Website && Website.findOne() && Website.findOne().image;
        return image;
    }
});

Template.carousel.rendered = function () {
    this.$('li').first().addClass('active');
    this.$('.item').first().addClass('active');
    $("#mycarousel").carousel({ interval: 5000 });
    $("#carousel-pause").click(function () {
        $("#mycarousel").carousel('pause');
    });
    $("#carousel-play").click(function () {
        $("#mycarousel").carousel('cycle');
    });

};

Template.carousel.events({
    'click .js-photoswipe': function (event) {


        var pswpElement = document.querySelectorAll('.pswp')[0];

        // build items array
        var items = Website.findOne().image;

        // define options (if needed)
        var options = {
            // optionName: 'option value'
            // for example:
            index: parseInt(event.target.alt), // start at first slide
            modal: true
        };

        // Initializes and opens PhotoSwipe
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    }
});

Template.website.onCreated(function () {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('SalonSoftMap', function (map) {
        // Add a marker to the map once it's ready
        var marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance,
            title: 'Salon Soft',
            label:'Salon Soft'
        });
    });
});

Template.website.events({
    'click .js-click-admin': function (event) {
        Meteor.call('addRole');
    }
});