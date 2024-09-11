// Generate fake data for one product
function generateData() {
    const data = [];
    const startDate = new Date(2024, 6, 3); // July 3, 2024
    const vulnerabilityLevels = ['Critical', 'High', 'Medium', 'Low'];

    for (let i = 0; i < 10; i++) {
        const date = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        for (const level of vulnerabilityLevels) {
            data.push({
                Date: date,
                Product: 'Product A',
                "Vulnerability Type": level,
                Count: Math.floor(Math.random() * 11)
            });
        }
    }
    return data;
}

// Create the line chart visualization
function createLineChart(data) {
    // Set up the chart dimensions
    const margin = {top: 20, right: 150, bottom: 50, left: 50};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG element
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Set domains for scales
    x.domain(d3.extent(data, d => d.Date));
    y.domain([0, d3.max(data, d => d.Count)]);

    // Create line generator
    const line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Count));

    // Group data by Vulnerability Type
    const nestedData = d3.group(data, d => d["Vulnerability Type"]);

    // Draw lines for each vulnerability type
    nestedData.forEach((typeData, type) => {
        svg.append("path")
            .datum(typeData)
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", color(type))
            .style("fill", "none")
            .style("stroke-width", 2);
    });

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(Array.from(nestedData.keys()))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d));

    legend.append("text")
        .attr("x", width + 25)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d);
}

// Create the pie chart visualization
function createPieChart(data) {
    const width = 450;
    const height = 450;
    const margin = 40;

    // The radius of the pieplot is half the width or height (smallest one)
    const radius = Math.min(width, height) / 2 - margin;

    // Append the svg object to the div called 'pie'
    const svg = d3.select("#pie")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Aggregate data for pie chart
    const aggregatedData = d3.rollup(data, v => d3.sum(v, d => d.Count), d => d["Vulnerability Type"]);
    const pieData = Array.from(aggregatedData, ([type, count]) => ({type, count}));

    // Set the color scale
    const color = d3.scaleOrdinal()
        .domain(pieData.map(d => d.type))
        .range(d3.schemeCategory10);

    // Compute the position of each group on the pie
    const pie = d3.pie()
        .value(d => d.count);

    const data_ready = pie(pieData);

    // Build the pie chart
    svg.selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius))
        .attr('fill', d => color(d.data.type))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

    // Add labels
    svg.selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => `${d.data.type}: ${d.data.count}`)
        .attr("transform", d => `translate(${d3.arc().innerRadius(0).outerRadius(radius).centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", 12);
}

// Generate data and create visualizations
const data = generateData();
createLineChart(data);
createPieChart(data);