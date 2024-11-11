
$(document).ready(function () {
    loadDaypilot();
});


function loadDaypilot() {
    var nav = new DayPilot.Navigator("nav", {
        showMonths: 1,
        selectMode: "Week",
        freeHandSelectionEnabled: true,
        onTimeRangeSelected: function (args) {
            dp.startDate = args.start;
            dp.update();
        }
    });

    nav.init();

    var dp = new DayPilot.Calendar("dp");

    // view
    dp.viewType = "Week";

    // event creating
    dp.onTimeRangeSelected = function (args) {
        var name = prompt("New event name:", "Event");

        if (!name) return;

        var e = new DayPilot.Event({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: name
        });

        dp.events.add(e);

        dp.clearSelection();
    };

    dp.onEventClick = function (args) {
        if (args.e.id() == 1) {
            viewDetails('1');
        } else if (args.e.id() == 2) {
            viewDetails('2');
        }
    };

    dp.init();

    var event1 = new DayPilot.Event({
        start: DayPilot.Date.today().addHours(12),
        end: DayPilot.Date.today().addHours(15),
        id: 1,
        text: "Hẹn lịch bảo hành"
    });

    dp.events.add(event1);


    var event2 = new DayPilot.Event({
        start: DayPilot.Date.fromYearMonthDay(2024, 5, 8).addHours(7),
        end: DayPilot.Date.fromYearMonthDay(2024, 5, 8).addHours(11),
        id: 2,
        text: "Hoa sơn luận kiếm"
    });

    dp.events.add(event2);
}


/*Create*/
function viewCreate(key) {
    if (key) {
        if (key == 1) {
            $("#contentList").hide();
            $("#contentDetail").hide();
            $("#contentCreate").show();
            $("#contentCreateTask").show();
        } else if (key == 2) {
            $("#contentList").hide();
            $("#contentDetail").hide();
            $("#contentCreate").show();
            $("#contentCreateEmail").show();
        } else if (key == 3) {
            $("#contentList").hide();
            $("#contentDetail").hide();
            $("#contentCreate").show();
            $("#contentCreatePhoneCall").show();
        } else if (key == 4) {
            $("#contentList").hide();
            $("#contentDetail").hide();
            $("#contentCreate").show();
            $("#contentCreateAppointment").show();
        }
    } else {
        $("#contentDetail").hide();
        $("#contentCreate").hide();
        $("#contentCreateTask").hide();
        $("#contentCreateEmail").hide();
        $("#contentCreatePhoneCall").hide();
        $("#contentCreateAppointment").hide();
        $("#contentList").show();
    }
}


/*Detail*/
function viewDetails(id) {
    if (id) {
        if (id == 1) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailTask").show();
        } else if (id == 2) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailEmail").show();
        } else if (id == 3) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailPhoneCall").show();
        } else if (id == 3) {
            $("#contentList").hide();
            $("#contentDetail").show();
            $("#contentDetailAppointment").show();
        }
    } else {
        $("#contentDetail").hide();
        $("#contentDetailTask").hide();
        $("#contentDetailEmail").hide();
        $("#contentDetailPhoneCall").hide();
        $("#contentDetailAppointment").hide();
        $("#contentList").show();
    }
}


/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');
});

