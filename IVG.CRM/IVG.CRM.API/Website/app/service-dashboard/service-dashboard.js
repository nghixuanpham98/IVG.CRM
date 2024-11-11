
$(document).ready(function () {
    loadChart1();
    loadChart2();
    loadChart3();
    loadChart4();
});


function loadChart1() {
    const ctx = document.getElementById('myChart1');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['04-19-2024', '05-19-2024', '06-19-2024', '07-19-2024', '08-19-2024', '09-19-2024'],
            datasets: [{
                label: 'Number of cases completed',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function loadChart2() {
    const ctx = document.getElementById('myChart2');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['04-19-2024', '05-19-2024', '06-19-2024', '07-19-2024', '08-19-2024', '09-19-2024'],
            datasets: [{
                label: 'Number of cases in progress',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function loadChart3() {
    const ctx = document.getElementById('myChart3');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['04-19-2024', '05-19-2024', '06-19-2024', '07-19-2024', '08-19-2024', '09-19-2024'],
            datasets: [{
                label: 'Number of cases on hold',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function loadChart4() {
    const ctx = document.getElementById('myChart4');

    const data = [];
    const data2 = [];
    let prev = 100;
    let prev2 = 80;
    for (let i = 0; i < 1000; i++) {
        prev += 5 - Math.random() * 10;
        data.push({ x: i, y: prev });
        prev2 += 5 - Math.random() * 10;
        data2.push({ x: i, y: prev2 });
    }

    const totalDuration = 10000;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                borderColor: "red",
                borderWidth: 1,
                radius: 0,
                data: data,
            },
            {
                borderColor: "red",
                borderWidth: 1,
                radius: 0,
                data: data2,
            }]
        },
        options: {
            animation,
            interaction: {
                intersect: false
            },
            plugins: {
                legend: false
            },
            scales: {
                x: {
                    type: 'linear'
                }
            }
        }
    });
}