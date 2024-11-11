

var colorCategory = {
    dark: '#011E64',
    medium: '#02238B',
    yellow: '#FECE09',

    _9:'E6',
    _8:'CC',
    _7:'B3',
    _6:'99',
    _5:'80',
    _4:'66',
    _3:'4D',
    _2:'33',
    _1: '1A',
     
    blue_9:'#011E64E6',
    blue_8:'#011E64CC',
    blue_7:'#011E64B3',
    blue_6:'#011E6499',
    blue_5:'#011E6480',
    blue_4:'#011E6466',
    blue_3:'#011E644D',
    blue_2:'#011E6433',
    blue_1:'#011E641A',
     
    //--main-color-blue-09: rgb(1, 30, 100,0.09);
    //--main-color-blue-08: rgb(1, 30, 100,0.08);
    //--main-color-blue-07: rgb(1, 30, 100,0.07);
    //--main-color-blue-06: rgb(1, 30, 100,0.06);
    //--main-color-blue-05: rgb(1, 30, 100,0.05);
    //--main-color-blue-04: rgb(1, 30, 100,0.04);
    //--main-color-blue-03: rgb(1, 30, 100,0.03);
    //--main-color-blue-02: rgb(1, 30, 100,0.02);
    //--main-color-blue-01: rgb(1, 30, 100,0.01);
    //--color-white-1: rgb(255, 255, 255,0.1);
    //--color-white-2: rgb(255, 255, 255,0.2);
    //--color-white-3: rgb(255, 255, 255,0.3);
    //--color-white-4: rgb(255, 255, 255,0.4);
    //--color-white-5: rgb(255, 255, 255,0.5);
    //--color-white-6: rgb(255, 255, 255,0.6);
    //--color-white-7: rgb(255, 255, 255,0.7);
    //--color-white-8: rgb(255, 255, 255,0.8);
    //--color-white-9: rgb(255, 255, 255,0.9);
    //--color-white-10: rgb(255, 255, 255,1);
    //--main-color-black-01: rgb(0, 0, 0, 0.01);
    //--main-color-black-02: rgb(0, 0, 0, 0.02);
    //--main-color-black-03: rgb(0, 0, 0, 0.03);
    //--main-color-black-04: rgb(0, 0, 0, 0.04);
    //--main-color-black-05: rgb(0, 0, 0, 0.05);
    //--main-color-black-06: rgb(0, 0, 0, 0.06);
    //--main-color-black-07: rgb(0, 0, 0, 0.07);
    //--main-color-black-08: rgb(0, 0, 0, 0.08);
    //--main-color-black-09: rgb(0, 0, 0, 0.09);
    //--main-color-black-1: rgb(0, 0, 0, 0.1);
    //--main-color-black-2: rgb(0, 0, 0, 0.2);
    //--main-color-black-3: rgb(0, 0, 0, 0.3);
    //--main-color-black-4: rgb(0, 0, 0, 0.4);
    //--main-color-black-5: rgb(0, 0, 0, 0.5);
    //--main-color-black-6: rgb(0, 0, 0, 0.6);
    //--main-color-black-7: rgb(0, 0, 0, 0.7);
    //--main-color-black-8: rgb(0, 0, 0, 0.8);
    //--main-color-black-9: rgb(0, 0, 0, 0.9);
    //--main-color-black-10: rgb(0, 0, 0, 1);
    //--text-grey: #f6f6f6;
    //--main-color-grey: #fefefe;

}

/*Select2*/
$(function () {
    $('.select2').select2();
    $('.select2').css('width', '100%');
});



draw_chart_1();
function draw_chart_1() {


    var options = {
        series: [{
            name: 'Leads',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: 'Customers',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        } ],
        chart: {
            type: 'bar',
            height:300
        },
        colors: [
            colorCategory.blue_9,
            colorCategory.blue_7, 
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        },
     
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                //formatter: function (val) {
                //    return "$ " + val + " thousands"
                //}
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart1"), options);
    chart.render();
}


draw_chart_2();
function draw_chart_2() {

    var options = {
        series: [76],
        chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#e7e7e7",
                    strokeWidth: '97%',
                    margin: 5, // margin is in pixels
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        color: '#999',
                        opacity: 1,
                        blur: 2
                    }
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: -2,
                        fontSize: '22px'
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -10
            }
        },
        colors: [
            colorCategory.dark, 
        ],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                shadeIntensity: 0.4,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 53, 91]
            },
        },
        labels: ['Average Results'],
    };

    var chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();

}


draw_chart_3();
function draw_chart_3() {

    var options = {
        series: [35],
        chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#e7e7e7",
                    strokeWidth: '97%',
                    margin: 5, // margin is in pixels
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        color: '#999',
                        opacity: 1,
                        blur: 2
                    }
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: -2,
                        fontSize: '22px'
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -10
            }
        }, colors: [
            colorCategory.medium,
        ],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                shadeIntensity: 0.4,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 53, 91]
            },
        },
        labels: ['Average Results'],
    };

    var chart = new ApexCharts(document.querySelector("#chart3"), options);
    chart.render();

}


draw_chart_4();
function draw_chart_4() {

    var options = {
        series: [{
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }],
        chart: {
            height: 150,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        colors: ['#02238B'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth'
        },

        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        markers: {
            size: 2
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart4"), options);
    chart.render();


}

draw_chart_5();
function draw_chart_5() {

    var options = {
        series: [{
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }],
        chart: {
            height: 150,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        colors: ['#02238B'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth'
        },

        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        markers: {
            size: 2
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart5"), options);
    chart.render();


}

draw_chart_6();
function draw_chart_6() {
     
    var options = {
        series: [{
            data: [  650, 720, 860, 900, 1100 ]
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                barHeight: '100%',
                distributed: true,
                horizontal: true,
                dataLabels: {
                    position: 'bottom'
                },
            }
        },
        colors: [
            colorCategory.blue_5,
            colorCategory.blue_6,
            colorCategory.blue_7,
            colorCategory.blue_8,
            colorCategory.blue_9,
        ],
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
                colors: ['#fff']
            },
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            },
            offsetX: 0,
            dropShadow: {
                enabled: true
            }
        },
        legend: {
            show: false,
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: [ 'Màn hình giám sát','Giải pháp tổng đài', 'Phần mềm ghi âm', 'Smart Center', 'Customer Relationship Management'],
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function () {
                        return ''
                    }
                }
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart6"), options);
    chart.render();

}


function ApexArea(series, categories) {

    var options = {

        chart: {
            height: 300,
            type: "area",
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.2
            },
            parentHeightOffset: 0, toolbar: { show: !1 }
        },

        colors: [colorCategory.medium1, colorCategory.light1],

        dataLabels: {
            enabled: true,
            style: {
                fontSize: '13px',
                colors: ['#FFF']
            },
            background: {
                enabled: true,
                foreColor: '#fff',
                padding: 4,
                borderRadius: 0.5,
                borderWidth: 0,
                /* borderColor: '#fff',*/
                borderColor: undefined,
                opacity: 0.9,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#fff',
                    opacity: 0.45
                }
            },
        },
        grid: { xaxis: { lines: { show: !0 } } },
        series: series,
        xaxis: { categories: categories },
        fill: { opacity: 1, type: "solid" },
        //legend: { show: !0, position: "bottom", horizontalAlign: "start" },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function (y) {
                    if (typeof y !== "undefined") {
                        return y.toFixed(0);
                    }
                    return y;
                }
            }
        }
    };
    return options;
}


function ApexColumnBasic(series, categories) {
    var options = {

        series: [{
            name: 'Total',
            data: series
        }],

        chart: {
            height: 350,
            type: 'bar',
        },

        colors: colorCategory.medium5,

        legend: { show: true, position: "bottom" },

        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },

        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val;
            },
            offsetY: -20,
            style: {
                fontSize: '15px',
                colors: [colorCategory.medium4]
            }
        },

        xaxis: {
            categories: categories,
            position: 'bottom',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },

        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return val;
                }
            }
        },
    };
    return options;
}

function ApexBarBasic(series, categories) {

    var options = {

        chart: {
            height: 350,
            type: "bar",
            parentHeightOffset: 0,
            toolbar: { show: true },
        },

        colors: colorCategory.medium1,

        plotOptions: {
            bar: {
                horizontal: !0, barHeight: "25%", endingShape: "flat" /* flat|rounded */
            }
        },

        dataLabels: {
            enabled: true,
            style: {
                fontSize: '13px',
                colors: ['#FFF']
            },
            background: {
                enabled: true,
                foreColor: '#fff',
                padding: 4,
                borderRadius: 0.5,
                borderWidth: 0,
                borderColor: undefined,
                opacity: 0.9,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#fff',
                    opacity: 0.45
                }
            },
        },

        grid: {
            xaxis: { lines: { show: !1 } },
            padding: { top: -15, bottom: -10 }
        },

        legend: { show: true, position: "bottom" },

        series: [{ data: series }],

        xaxis: {
            categories: categories,
        },

        yaxis: {
            axisBorder: {
                show: true,
                color: '#78909C',
                offsetX: 100,
                offsetY: 100
            },

            labels: {
                show: true,

                style: {
                    colors: [],
                    fontSize: '15px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    cssClass: 'apexcharts-yaxis-label',
                },
            },
        }
    };
    return options;
}

function ApexRadial(series, categories) {

    var options = {
        series: series,
        chart: {
            height: 300,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    }
                }
            }
        },
        colors: [
            colorCategory.light2,
            colorCategory.medium5,
            colorCategory.medium6,
            colorCategory.medium10,
            colorCategory.medium4,
        ],
        labels: categories,
        legend: {
            show: true,
            floating: true,
            fontSize: '16px',
            position: 'left',
            //offsetX: 160,
            offsetX: 0,
            //offsetY: 15,
            offsetY: 0,
            labels: {
                useSeriesColors: true,
            },
            markers: {
                size: 0
            },
            formatter: function (seriesName, opts) {
                return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
            },
            itemMargin: {
                vertical: 3
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    show: false
                }
            }
        }]
    };
    return options;
}

function ApexRadialBar(series, categories) {

    var options = {
        series: series,
        chart: {
            height: 350,
            type: 'radialBar',
        },
        colors: [
            colorCategory.light2,
            colorCategory.medium5,
            colorCategory.medium6,
            colorCategory.medium10,
            colorCategory.medium4,
        ],
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function (w) {
                            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                            return 249
                        }
                    }
                }
            }
        },
        labels: categories,
    };

    return options;
}

function ApexPie(series, categories) {
    var options = {
        series: series,
        chart: {
            width: 420,
            type: 'pie',
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.2
            },
            parentHeightOffset: 0, toolbar: { show: !1 }
        },

        colors: [
            colorCategory.light2,
            colorCategory.medium5,
            colorCategory.medium6,
            colorCategory.medium10,
            colorCategory.medium4,
        ],
        legend: { show: !0, position: "bottom" },

        labels: categories,
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]

    };

    return options;
}

function ApexPolar(series, categories) {
    var options = {
        series: series,
        chart: {
            type: 'polarArea',
        },
        stroke: {
            colors: ['#fff']
        },
        fill: {
            opacity: 0.8
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };
    return options;

}

function ApexDonut(series, categories) {

    var options = {

        chart: {
            height: 300,
            type: "donut",
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.35
            }
        },

        legend: { show: !0, position: "bottom" },

        //labels: ["Customer Service", "Client Service", "Local Partner", "Internal ZPV", "Other"],

        labels: categories,

        series: series,

        //series: [85, 16, 50, 50, 70],

        colors: [colorCategory.dark6, '#117577', colorCategory.normal, colorCategory.light11, colorCategory.light3,],
        dataLabels: {
            enabled: true,
            //enabledOnSeries: true,
            formatter: function (e, t) {
                return parseInt(e) + "%"
            }
        },

        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: !0, name: { fontSize: "2rem", fontFamily: "Montserrat" },
                        value: {
                            fontSize: "1rem",
                            fontFamily: "Montserrat",
                            formatter: function (e) {
                                return parseInt(e)
                            }
                        },
                        //total: {
                        //    show: !0, fontSize: "1rem",
                        //    label: "Customer Service",
                        //    formatter: function (e) { return "85%" }
                        //}
                    }
                }
            }
        },

        responsive: [{ breakpoint: 992, options: { chart: { height: 380 } } }, {
            breakpoint: 576, options: {
                chart: { height: 320 }, plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: !0, name: { fontSize: "1.5rem" }, value: { fontSize: "1rem" },
                                total: { fontSize: "1.5rem" }
                            }
                        }
                    }
                }
            }
        }]
    };

    return options;
}

function ApexColumnAndLine(series, categories) {

    var options = {

        series: series,

        chart: {
            height: 350,
            type: 'line',
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.2
            },

            parentHeightOffset: 0, toolbar: { show: !1 }
        },

        colors: [colorCategory.medium1, colorCategory.light1],

        stroke: {
            width: [0, 4]
        },

        dataLabels: {
            enabled: true,
            //enabledOnSeries: [1],
            style: {
                fontSize: '13px',
                colors: ['#FFF']
            },
            background: {
                enabled: true,
                foreColor: '#fff',
                padding: 4,
                borderRadius: 0.5,
                borderWidth: 0,
                /* borderColor: '#fff',*/
                borderColor: undefined,
                opacity: 0.9,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#fff',
                    opacity: 0.45
                }
            },
        },

        labels: categories,

    };
    return options;

}

