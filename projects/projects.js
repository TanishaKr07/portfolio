import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

//add a count of projects at the top of the page by using a 
// JavaScript method to select the element with the class projects-title from the DOM
const projectsTitle = document.querySelector('.projects-title');
const projectCount = projects.length;
projectsTitle.textContent = `Projects (${projectCount})`;



// ... existing code ...

// Define arcGenerator, colors, and selectedIndex globally
const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemePastel1); 
let selectedIndex = -1; // INITIALIZE HERE

// Refactor all plotting into one function
function renderPieChart(projectsGiven, isInitialRender = false) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
        return {
            value: count,
            label: year
        };
    });
    
    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    
    //clear up paths and legends
    d3.selectAll('svg path').remove();
    const legend = d3.select('.legend');
    legend.selectAll('li').remove();

    // Store the updated data globally if needed for click handler outside of this function,
    // or pass it to a new function.
    // For simplicity, we'll keep the logic contained.
    
    // Update Paths (Pie Slices) with click listener
    const svg = d3.select('svg');
    newArcs.forEach((pathData, idx) => {
        svg
            .append('path')
            .attr('d', pathData)
            .attr('fill', colors(idx))
            .attr('class', selectedIndex === idx ? 'selected' : null) // Apply initial class
            .on('click', () => {
                const isSelected = selectedIndex === idx;
                selectedIndex = isSelected ? -1 : idx;

                // 1. Update Path Classes
                svg.selectAll('path')
                    .attr('class', (_, i) => (selectedIndex === i ? 'selected' : null));
                
                // 2. Update Legend Classes
                legend.selectAll('li')
                    .attr('class', (_, i) => (selectedIndex === i ? 'selected' : null));
                
                // 3. Filter and Re-render Projects
                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    const selectedYear = newData[selectedIndex].label;
                    const filteredProjects = projects.filter(proj => proj.year == selectedYear);
                    renderProjects(filteredProjects, projectsContainer, 'h2');
                }
            });
    });

    // Update Legends (Keep as is, but now inside the function or a new helper function)
    newData.forEach((d, idx) => {
        const listItem = legend.append('li')
            .attr('style', `--color: ${colors(idx)}`)
            .attr('class', selectedIndex === idx ? 'selected' : null); // Apply initial class
            
        listItem.append('span')
            .attr('class', 'swatch');

        listItem.append('span')
            .text(`${d.label} (${d.value})`);
    });
}

// Ensure the search input only updates the query and calls renderProjects/renderPieChart
searchInput.addEventListener('change', (event) => {
    // update query value
    query = event.target.value;
    // filter projects
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    
    // Reset selection when searching, as the new data set is different
    selectedIndex = -1;
    
    // render filtered projects and re-render the chart/legend
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
}); 

// Call this function on page load (already present)
renderPieChart(projects);