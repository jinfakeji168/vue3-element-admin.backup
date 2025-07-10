function getConfig(data: any[] | any) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: "vertical",
            left: "left",
            data: data.map((item: any) => item.name)
        },
        series: [{
            type: "pie",
            data: data,
            label: {
                show: true,
                formatter: '{b}: {d}%'
            }
        }]
    }
}

export { getConfig }
