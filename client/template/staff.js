Template.addStaffForm.rendered = function () {
    var staff = Staff.findOne();
    if (staff) {
        var color = staff.color;
        if (color === null || color === undefined) color = "#278787";
        StaffColor = $("#StaffColor").ejColorPicker({ value: color }).data('ejColorPicker');
        Session.set('addstaff', staff);
        Session.set('staffPicture', staff.picSrc);
        for (var i = 0; i < staff.services.length; i++) {
            console.log('services :', i);
            document.getElementById(staff.services[i].id).checked = true;
        }

    }
    else {
        StaffColor = $("#StaffColor").ejColorPicker({ value: "#278787" }).data('ejColorPicker');
        document.getElementById("staffForm").reset();
        Session.set('addstaff', '');
        Session.set('staffPicture', '');
    }
    setStaffSchedule(Session.get('addstaff').schedule);
};

function getAppointmentByGUID(data, guid) {
    return data.filter(
        function (data) { return data.Guid == guid }
    );
}


Template.addStaffForm.helpers({
    services: function () {
        return Services.find({}).fetch();
    },
    myStaffData: function () {
        return { directoryName: 'staff', prefix: this._id, _id: this._id }
    },
    picsrc: function () {
        return Session.get('staffPicture');
    },
    isNew: function () {
        if ((Session.get('addstaff') === undefined) || (Session.get('addstaff').name===undefined))
            return true;
        else return false;
    },
    name: function () {
        var staff = Session.get('addstaff');
        if (staff !== undefined) {
            if (staff.name !== '')
                return Session.get('addstaff').name;
        }
        else return '';
    },
    profile: function () {
        var staff = Session.get('addstaff');
        if (staff !== undefined) {
            if (staff.profile !== '')
                return Session.get('addstaff').profile;
        }
        else return '';
    }
});

Template.addStaffForm.events({
    'submit .js-upload-staff': function (event) {
        event.preventDefault();

        var picsrc = Session.get('staffPicture');
        console.log('PicSrc :', picsrc);
        console.log('event.target.staffname :', event.target.StaffName.value);
        console.log('event.target.StaffProf :', event.target.StaffProf.value);
        console.log('event.target :', event.target);
        var appointment = $("#ScheduleAddStaff").data("ejSchedule")._currentAppointmentData;
        var services = [];
        $('input[name=service]:checked').each(function () {
            console.log('this :', this);
            var srv = { "id": this.id, "value": $(this).val() };
            services.push(srv);
        });
        var id = Session.get('addstaff') && Session.get('addstaff')._id;
        console.log('id :', id);
        if ((id === undefined) || (id=== ''))
        {
            var color = StaffColor.getValue();
            Meteor.call('insertStaff', event.target.StaffName.value, picsrc, event.target.StaffProf.value, services, appointment, color);
            resetStaffForm();
        }
        else {
            var color = StaffColor.getValue();
            Meteor.call('updateStaff', id, event.target.StaffName.value, picsrc, event.target.StaffProf.value, services, appointment, color);
        }

        //test
        var schObj = $("#ScheduleAddStaff").data("ejSchedule");
        var appointments = schObj.getAppointments(); // Gets the appointments list of Schedule control
        console.log('appointments :', appointments);
        //
        return false;
    },
    'click .js-staff-cancel': function () {
        event.preventDefault();
        Session.set('staffPicture', '');
        document.getElementById("staffForm").reset();
        console.log('cancel');
        return false;
    },
    'click .js-staff-remove': function () {
        event.preventDefault();
        var id = Session.get('addstaff') && Session.get('addstaff')._id;
        if (id !== undefined) {
            Meteor.call('removeStaff', id);
        }
        var staff = Staff.findOne();
        if (staff) {
            Session.set('addstaff', staff);
            Session.set('staffPicture', staff.picSrc);
            for (var i = 0; i < staff.services.length; i++) {
                console.log('services :', i);
                document.getElementById(staff.services[i].id).checked = true;
            }

        }
        else {
            Session.set('addstaff', '');
            Session.set('staffPicture', '');
        }
        setStaffSchedule(Session.get('addstaff').schedule);
        console.log('js-staff-remove');
        $(".js-staff-tab li:first").addClass("active");
        return false;
    }
});

Template.staff.helpers({
    staffs: function () {
        console.log('staffs refreshed');
        return Staff.find().fetch();
    },
    noStaff: function () {
        console.log('noStaff refreshed');
        if (Staff.find().count() < 1) return true;
        else return false;
    }

});

function resetStaffForm() {
    Session.set('addstaff', '');
    Session.set('staffPicture', '');
    $("#ScheduleAddStaff").ejSchedule({ appointmentSettings: { dataSource: [] } });
    document.getElementById("staffForm").reset();
}

function setStaffSchedule(data) {

//    dManager = ej.DataManager(data).executeLocal(ej.Query().take(10));
    $("#ScheduleAddStaff").ejSchedule({
        width: "100%",
        height: "525px",
        currentDate: new Date(),
        showCurrentTimeIndicator: true,
        enableRecurrenceValidation:true,
        startHour: 6,
        endHour: 21,
        workHours: {
            start: 10,
            end: 18
        },
        appointmentSettings: {
            dataSource: data,
            id: "Id",
            subject: "Subject",
            startTime: "StartTime",
            endTime: "EndTime",
            description: "Description",
            allDay: "AllDay",
            recurrence: "Recurrence",
            recurrenceRule: "RecurrenceRule"
        }
    });
}

Template.staff.events({
    'click .js-click-addstaff-new': function () {
        console.log('js-click-addstaff-new', this);
        resetStaffForm();
        StaffColor.setValue("#278787");
    },
    'click .js-click-addstaff': function () {
        document.getElementById("staffForm").reset();
        console.log('js-click-addstaff', this);
        Session.set('addstaff', this);
        Session.set('staffPicture', this.picSrc);
        console.log('schedule :', this.schedule);
        var color = this.color;
        if (color === null || color === undefined) color = "#278787";
        StaffColor.setValue(color);
        $("#ScheduleAddStaff").ejSchedule({ appointmentSettings: { dataSource: new ej.DataManager(this.schedule) } });
//        setStaffSchedule(this.schedule);
//        console.log('schedule data source :', $("#ScheduleAddStaff").data("ejSchedule").appointment);
  //      console.log('schedule data :', $("#ScheduleAddStaff").data("ejSchedule"));
        for (var i = 0; i < this.services.length; i++)
        {
            document.getElementById(this.services[i].id).checked = true;
        }
    },
    'submit .js-upload-service': function (event) {
        event.preventDefault();
        var id = Session.get('ServiceEdit');
        Meteor.call('ServiceAdd', id, event.target.ServiceName.value, event.target.ServicePrice.value, event.target.serviceTime.value,
 event.target.ServiceDesc.value);
        $(".js-cancel").click();
        return false;
    },
    'click .js-show-add-service': function (event) {
        Session.set('ServiceEdit', '');
        console.log('add service');
    },
    'click .js-cancel': function () {
        Session.set('ServiceEdit', '');
        document.getElementById("serviceForm").reset();
        console.log('cancel');
    }

});

Template.displayServices.events({
    'click .js-remove-service': function () {
        console.log('delete :', this);
        Meteor.call('ServiceRemove', this._id);
    },
    'click .js-edit-service': function () {
        console.log('edit :', this);
        $(".js-show-add-service").click();
        document.getElementById("ServiceName").value = this.sname;
        document.getElementById("ServicePrice").value = this.price;
        document.getElementById("serviceTime").value = this.time;
        document.getElementById("ServiceDesc").value = this.desc;
        Session.set('ServiceEdit', this._id);
    }
});

Template.displayServices.helpers({
    services: function () {
        return Services.find({}).fetch();
    }
});

