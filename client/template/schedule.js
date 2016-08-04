Template.schedule.rendered = function () {
    console.log('render');
    var schedule = [];
    if (ScheduleStaff.find().count() > 0)
        schedule = ScheduleStaff.find({}).fetch();
    var resources = [];
    console.log('staff count:', Staff.find().count());
    var staff = Staff.find({}).fetch();
    for (var i = 0; i < staff.length ; i++)
    {      
        var resource = {
            text: staff[i].name,
            id: staff[i]._id,
            color:staff[i].color
        }
    resources.push(resource);
    }
    if (resources.length == 0) resources = [
                          { text: "Staff", id: 1, color: "#f8a398" },
    ];
    console.log('resource :', resources);
    $("#ScheduleStaff").ejSchedule({
        width: "100%",
        height: "725px",
        currentDate: new Date(),
        showCurrentTimeIndicator: true,
        enableRecurrenceValidation: true,
        orientation: 'horizontal',
        tooltipSettings: { enable: true },
        group: {
            resources:['Staffs']
        },
        resources: [
                  {
                      field: "staffId",
                      title: "Staff",
                      name: "Staffs",
                      allowMultiple: false,
                      resourceSettings: {
                          dataSource: resources,
                          text: "text", id: "id", color: "color"
                      }
                  }],
        startHour: 6,
        endHour: 21,
        workHours: {
            start: 10,
            end: 18
        },
        appointmentSettings: {
            resourceFields:"staffId",
            dataSource: ej.DataManager(schedule),
            id: "Id",
            subject: "Subject",
            startTime: "StartTime",
            endTime: "EndTime",
            description: "Description",
            allDay: "AllDay",
        },
        cellClick: function (event) {
            console.log('cell click event:', event);
            //            console.log('cell click template:', template);
        },
        appointmentClick: function (event) {
            console.log('appointmentClick event:', event);
            //            console.log('cell click template:', template);
        },
        DateValueChanged: function (event) {
            console.log('DateValueChanged event:', event);
            //            console.log('cell click template:', template);
        },
        cellDoubleClick: function (event) {
            console.log('cellDoubleClick event:', event);
            //            console.log('cell click template:', template);
        },
        appointmentWindowOpen: function (event) {
            console.log('appointmentWindowOpen event:', event);
            //            console.log('cell click template:', template);
        },
        create: function (event) {
            var appointment = [];
            Session.set("NewAppointment", appointment);
            console.log('create event :', event);
        },
        appointmentCreated: function (event) {
            console.log('appointment Created event (DONE) :', event.appointment);
            Meteor.call('addAppointment', event.appointment);
//            console.log('current appointment data :', $("#ScheduleStaff").data("ejSchedule")._currentAppointmentData);
        },
        appointmentChanged: function (event) {
            console.log('appointmentChanged');
            console.log('appointmentChanged event :', event);
            Meteor.call('updateAppointment', event.appointment);
        },
        beforeAppointmentRemove: function (args) {
            console.log('beforeAppointmentRemove started.');
            var rgb = $("#ScheduleStaffRecurrenceEdit").find(".e-editonly").css("background-color"); // here bgcolor of the "only this appointment" button will be stored in rbg format
            console.log('rgb :', rgb);
            var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            delete (parts[0]);
            for (var i = 1; i <= 3; ++i) {
                parts[i] = parseInt(parts[i]).toString(16);
                if (parts[i].length == 1) parts[i] = '0' + parts[i];
            }
            bgcolor = '#' + parts.join(''); // here we will get the rgb value in hexadecimal value
            if (bgcolor == "#86cbea") // #86cbea is the default color used for "only this appointment" button in Delete Repeat Appointment dialog
            {
                console.log('only this delete');
                var id = args.appointment._id;
                var appointments = $("#ScheduleStaff").data("ejSchedule")._currentAppointmentData;
                var appointment;
                for (var i = 0; i < appointments.length; i++)
                {
                    if (appointments[i]._id===id)
                    {
                        appointment = appointments[i];
                        break;
                    }
                }

                console.log('args appointment', args.appointment);
                console.log('current appointment data :', appointment);
                Meteor.call('updateAppointment', appointment);
//                args.cancel = true;
            }
        },
        appointmentRemoved: function (event) {
            console.log('appointmentRemoved');
            console.log('appointmentRemoved event :', event);
            Meteor.call('removeAppointment', event.appointment._id);
        },
        resizeStop: function (event) {
            console.log('resizeStop event(DONE) :', event);
            Meteor.call('updateAppointment', event.appointment);
        },
        dragStop: function (event) {
            console.log('dragStop');
            console.log('dragStop event(DONE) :', event);
            Meteor.call('updateAppointment', event.appointment);
        }
    });
};