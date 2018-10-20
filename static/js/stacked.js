// 1990 - 2016
'use strict';

let svgWidth, svgHeight, chartMargin,
    chartWidth, chartHeight, fontSize,
    xScale, yScale, xAxis, yAxis,
    xLabel, yLabel, circles, stackData,
    svg = d3.select('#stacked').append('svg'),
    chartGroup = svg.append('g'),
    transTime = 1000;


let yearFormat = d3.timeFormat('%Y');

function setXAxis() {
    xScale = d3.scaleTime()
        .domain([new Date(1990, 1, 1), new Date(2016, 1, 1)])
        .range([0, chartWidth]);
    xAxis = d3.axisBottom(xScale);
}

function setYAxis() {
    yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d['Malaria cases/100,000 pop. - wef_cm']))
        .range([chartHeight, 0]);
    yAxis = d3.axisLeft(yScale);
}

let area = d3.area()
    .curve(d3.curveStep)
    .x(d => x(d.Year))
    .y0(d => y(d['Malaria cases/100,000 pop. - wef_cm'][0]))
    .y1(d => y(d['Malaria cases/100,000 pop. - wef_cm'][1]));

function buildChart() {
    svgWidth = window.innerWidth * 0.8;
    svgHeight = svgWidth * 0.6;
    chartMargin = svgWidth * 0.1;
    chartWidth = svgWidth - (chartMargin * 1.5);
    chartHeight = svgHeight - (chartMargin * 2);
    fontSize = svgWidth * 0.016;

    setXAxis();
    setYAxis();

    chartGroup.selectAll('g, text').remove();
    chartGroup.attr('transform', `translate(${chartMargin}, ${chartMargin})`);
    svg.attr('width', svgWidth).attr('height', svgHeight);


    chartGroup.append("g")
        .selectAll("path")
        .data(stackData)
        .enter().append("path")
        .attr("fill", '#00F')
        .attr("d", ([, values]) => area(values))
        .append("title")
        .text(([name]) => name);

    chartGroup.append("g")
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);









}

d3.csv('static/data/xxxmalaria-prevalence-vs-gdp-per-capita.csv').then(data => {
    let years = _.range(1990, 2017);
    console.log(Object.keys(data[0]));
    stackData = years.map(y => {
        let currentYear = data.filter(d => d.Year == y);
        currentYear.sort((a, b) => b['Malaria cases/100,000 pop. - wef_cm'] - a['Malaria cases/100,000 pop. - wef_cm']);
        currentYear = currentYear.slice(0, 10);
        return currentYear;
    });
    buildChart();
});

window.addEventListener('resize', buildChart);