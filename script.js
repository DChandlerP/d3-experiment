// Generate fake data
function generateData() {
    const data = [];
    const startDate = new Date(2024, 6, 3); // July 3, 2024
    const products = ['Product A', 'Product B', 'Product C'];
    const vulnerabilityLevels = ['Critical', 'High', 'Medium', 'Low'];

    for (let i = 0; i < 10; i++) {
        const date = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        for (const product of products) {
            for (const level of vulnerabilityLevels) {
                data.push({
                    Date: date,
                    Product: product,
                    "Vulnerability Type": level,
                    Count: Math.floor(Math.random() * 11)
                });
            }
        }
    }
    return data;
}

// Create the visualization
function createVisualization(data) {
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

    // Group data by Product and Vulnerability Type
    const nestedData = d3.group(data, d => d.Product, d => d["Vulnerability Type"]);

    // Draw lines for each product and vulnerability type
    nestedData.forEach((productData, product) => {
        productData.forEach((typeData, type) => {
            svg.append("path")
                .datum(typeData)
                .attr("class", "line")
                .attr("d", line)
                .style("stroke", color(product + "-" + type))
                .style("fill", "none")
                .style("stroke-width", 2);
        });
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
        .data(Array.from(nestedData.keys()).flatMap(product => 
            ["Critical", "High", "Medium", "Low"].map(type => ({product, type}))
        ))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d.product + "-" + d.type));

    legend.append("text")
        .attr("x", width + 25)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => `${d.product} - ${d.type}`);
}

// Generate data and create visualization
const data = generateData();
createVisualization(data);