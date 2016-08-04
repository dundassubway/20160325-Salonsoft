Template.appointment.rendered = function () {
    $('#dateTime').ejDateTimePicker({
        width: '180px',
        value: new Date()
    });
}

Template.appointment.helpers({
    services: function () {
        return Services.find().fetch();
    },
    staffs: function () {
        return Staff.find().fetch();
    }
});

Template.appointment.events({
    'submit .js-find-appointment': function (event) {
        event.preventDefault();
        var servicesTime = 0;
        $('input[name=service]:checked').each(function () {
            console.log('this :', this);
            var srv = { "id": this.id, "value": $(this).val() };

            servicesTime += parseInt($(this).val(), 10);
        });
        var datetimeObj = $("#dateTime").data("ejDateTimePicker");
        var dt = datetimeObj.getValue(); // returns the datetime value
        var staffid = $('input:radio[name=staffname]:checked').val();
        console.log('servicesTime :', servicesTime);
        //        var  rate_value = document.querySelector('input[name="staffname"]:checked').value;
        //        console.log('rate_value :', rate_value);
        console.log('staffid :', staffid);
        console.log('dt :', dt);
        getAppointments(staffid, dt, servicesTime);
        return false;
    }
});

function getAppointments(staffId, appointmentDate, servicesTime) {
    var dt = new Date(Date.parse(appointmentDate));
    console.log('datetime :', dt);
    var staffappointment = Staff.find({ _id: staffId }).fetch()[0].schedule;
    console.log('appointment :', staffappointment);
    var appYear = dt.getFullYear();
    var appMonth = dt.getMonth();
    var appDate = dt.getDate();
    var appDay = dt.getDay();
    console.log('appYear', appYear);
    console.log('appMonth', appMonth);
    console.log('appDate', appDate);
    console.log('appDay', appDay);
    var appTime = [];
    for (var i = 0; i < staffappointment.length; i++) {
        if (staffappointment[i].Recurrence) {
            var recur = {};
            var recurString = staffappointment[i].RecurrenceRule.split(";");
            for (var j = 0; j < recurString.length; j++) {
                var recuritem = recurString[j].split("=");
                //                if (j != 0) recurstring += ",";
                recur[recuritem[0]] = recuritem[1];
            }
            //console.log('recurstring :', recurstring);
            //recurstrng = '{' + recurstring + '}';
            //var recurJson = JSON.parse(recurstringJson);

            console.log('recurJson :', recur);

            //           console.log('recurJson Freq :', recurJson.FREQ);
            if (appYear < staffappointment[i].StartTime.getFullYear()) continue;
            if (appMonth < staffappointment[i].StartTime.getMonth()) continue;
            if (appDate < staffappointment[i].StartTime.getDate()) continue;
            if (recur.UNTIL) {
                var untilTime = new Date(Date.parse(recur.UNTIL));
                if (untilTime.getFullYear() < appYear) continue;
                if (untilTime.getMonth() < appMonth) continue;
                if (untilTime.getDate() < appDate) continue;
            }
            if (recur.EXDATE){
                var exdate=recur.EXDATE.split(",");
                for (var k=0; k<exdate.length; j++){
                    var date=new Date(Date.parse(exdate[k]));
                    if ((date.getFullYear()==appYear)
                        && (date.getMonth()==appMonth)
                        && (date.getDate()==appDate)) continue;
                }
            }
            var oneDay = 24 * 60 * 60 * 1000;
            var diffDays = Math.round(Math.abs((dt - staffappointment[i].StartTime) / (oneDay)));
            if (recur.FREQ === 'DAILY') {
                if (recur.INTERVAL) {
                    if (recur.COUNT) {
                        if (diffDays / recur.INTERVAL >= recur.COUNT) {
                            if (diffDays % recur.INTERVAL == 0)
                                appTime.push({
                                    start: staffappointment[i].StartTime,
                                    end: staffappointment[i].EndTime
                                });
                        }
                    }
 
                    else {
                        if (diffDays % recur.INTERVAL == 0)
                            appTime.push({
                                start: staffappointment[i].StartTime,
                                end: staffappointment[i].EndTime
                            });
                    }
                }
            }
            else if (recur.FREQ === 'WEEKLY') {
                if (recur.INTERVAL) {
                    if (recur.BYDAY) {
                        var firstWkCount = getFirstWkCount(staffappointment[i].StartTime.getDay(), recur.BYDAY);
                        if (recur.COUNT) {
                            var weeklyCount = recur.BYDAY.split(",").length;
                            if (diffDays/(7*recur.INTERVAL)*weeklyCount+firstWkCount>=recur.COUNT)
                            if (diffDays / 7 % recur.INTERVAL == 0) {
                                if (recur.BYDAY.includes(getDayofWeek(appDay))) {
                                    appTime.push({
                                        start: staffappointment[i].StartTime,
                                        end: staffappointment[i].EndTime
                                    });
                                }
                            }
                        }
  
                        else {
                            if (diffDays / 7 % recur.INTERVAL == 0) {
                                if (recur.BYDAY.includes(getDayofWeek(appDay))) {
                                    appTime.push({
                                        start: staffappointment[i].StartTime,
                                        end: staffappointment[i].EndTime
                                    });
                                }
                            }
                        }
                    }
                }
            }
            else if (recur.FREQ === 'MONTHLY') {
                if (recur.INTERVAL) {
                    if (recur.BYMONTHDAY) {
                        if (appDate != recur.BYMONTHDAY) continue;
                        if (recur.COUNT) {
                            if (getNoofMonth(staffappointment[i].StartTime, dt) / recur.INTERVAL + 1 <= recur.COUNT) {
                                appTime.push({
                                    start: staffappointment[i].StartTime,
                                    end: staffappointment[i].EndTime
                                });
                            }
                        }
   
                        else {
                            appTime.push({
                                start: staffappointment[i].StartTime,
                                end: staffappointment[i].EndTime
                            });
                        }
                    }
                    else if (recur.BYDAY) {
                        if (recur.BYDAY != getDayofWeek(appDay)) continue;
                        if (recur.BYSETPOS)
                            if (recur.BYSETPOS != getWeekOfMonth(dt)) continue;
                        if (recur.COUNT) {
                            if (getNoofMonth(staffappointment[i].StartTime, dt) / recur.INTERVAL + 1 <= recur.COUNT) {
                                appTime.push({
                                    start: staffappointment[i].StartTime,
                                    end: staffappointment[i].EndTime
                                });
                            }
                        }
                        else {
                            appTime.push({
                                start: staffappointment[i].StartTime,
                                end: staffappointment[i].EndTime
                            });
                        }
                    }
                }

            }
            else if (recur.FREQ === 'YEALY') {
                if (recur.INTERVAL) {

                }
            }
        }
        else {

            if (appYear < staffappointment[i].StartTime.getFullYear()) continue;
            if (appMonth < staffappointment[i].StartTime.getMonth()) continue;
            if (appDate < staffappointment[i].StartTime.getDate()) continue;
            if (appYear > staffappointment[i].EndTime.getFullYear()) continue;
            if (appMonth > staffappointment[i].EndTime.getMonth()) continue;
            if (appDate > staffappointment[i].EndTime.getDate()) continue;
            appTime.push({
                start: staffappointment[i].StartTime,
                end: staffappointment[i].EndTime
            });
        }

        console.log('appTime :', appTime);

        console.log('start time :', staffappointment[i].StartTime);
        console.log('end time :', staffappointment[i].EndTime);
        console.log('recurrence :', staffappointment[i].Recurrence);
        console.log('RecurrenceRule :', staffappointment[i].RecurrenceRule);
    }
    return;
}

function getDayofWeek(iDay) {
    if (iDay == 0) return 'SU';
    else if (iDay == 1) return 'MO';
    else if (iDay == 2) return 'TU';
    else if (iDay == 3) return 'WE';
    else if (iDay == 4) return 'TH';
    else if (iDay == 5) return 'FR';
    else return 'SA';
}

function getFirstWkCount(startDay, days){
    var count = 0;
    var Days=days.split(",");
    for (var i = Days.length - 1; i > 0; i--) {
        count++;
        if (Days[i] == getDayofWeek(startDay)) {
            break;
        }
    }
    return count;
}

function getNoofMonth(start, app) {
    var yearStart = start.getFullYear();
    var year = app.getFullYear();
    var monthStart = start.getMonth();
    var month = app.getMonth();
    return (year - yearStart) * 12 + month - monthStart;
}

function getWeekOfMonth(date) {
    var month = date.getMonth()
        , year = date.getFullYear()
        , firstWeekday = new Date(year, month, 1).getDay()
        , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
        , offsetDate = this.getDate() + firstWeekday - 1
        , index = 1 // start index at 0 or 1, your choice
        , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
        , week = index + Math.floor(offsetDate / 7)
    ;
    if (date || week < 2 + index) return week;
    return week === weeksInMonth ? index + 5 : week;
};