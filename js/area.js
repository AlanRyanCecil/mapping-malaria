let hunderd = _.range(1, 11);
let two = _.range(1, 20);

var trace1 = {
    x: hunderd,
    y: _.sampleSize(two, 10),
    fill: 'tozeroy',
    type: 'scatter'
};

var trace2 = {
    x: hunderd,
    y: _.sampleSize(two, 10),
    fill: 'tonexty',
    type: 'scatter'
};

// 1990 - 2016
let years = _.range(1990, 2017);
let xData = [];

let xtrace1 = {
    x: ['year'],
    y: ['cases']
}

var data = [trace1, trace2];

d3.csv('data/xxxmalaria-prevalence-vs-gdp-per-capita.csv').then(data => {
    console.log(Object.keys(data[0]));
    let topTen = years.map(y => {
        let currentYear = data.filter(d => d.Year == y);
        currentYear.sort((a, b) => b['Malaria cases/100,000 pop. - wef_cm'] - a['Malaria cases/100,000 pop. - wef_cm']);
            currentYear = currentYear.slice(0, 10);
            return currentYear;
    });
    topTen.map(x => {
        console.log(x.Entity);
    });
    console.log(topTen);
    

    // data.sort((a, b) => b['Malaria cases/100,000 pop. - wef_cm'] - a['Malaria cases/100,000 pop. - wef_cm']
    // );
});

console.log(years);


Plotly.newPlot('area', data);