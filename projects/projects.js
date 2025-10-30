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

//write a code below to display the year of each project based on projects.json assuming each project object has a year property. the font should be Baskerville, italicized and the numeric font should be font-variant-numeric: oldstyle-nums
projects.forEach(project => {
  const projectArticles = projectsContainer.querySelectorAll('article');
    projectArticles.forEach(article => {
        if (article.querySelector('h2').textContent === project.title) {
            const yearElement = document.createElement('div');
            yearElement.textContent = project.year;
            yearElement.style.fontFamily = 'Baskerville, serif';
            yearElement.style.fontStyle = 'italic';
            yearElement.style.fontVariantNumeric = 'oldstyle-nums';
            article.appendChild(yearElement);
        }
    });
});

// 1. Define the Arc Generator (The "Drawer" that knows the shape)
// We rename the variable from 'arc' to 'arcGenerator' for clarity and
// define it as a function that will be called later.
const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50); 

// 2. Data and Slice Calculation (The "Calculator" - Replaces manual loop)
let data = [
  { value: 1, label: 'apples' },
  { value: 2, label: 'oranges' },
  { value: 3, label: 'mangos' },
  { value: 4, label: 'pears' },
  { value: 5, label: 'limes' },
  { value: 5, label: 'cherries' },
];
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data); // Returns objects with startAngle/endAngle calculated

// 3. Generate Path Strings and Render
// Ensure d3.scaleOrdinal is defined correctly.
let colors = d3.scaleOrdinal(d3.schemeTableau10); 

// --- 1. Draw the Paths (Pie Slices) ---
let arcs = arcData.map((d) => arcGenerator(d)); 

arcs.forEach((pathData, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', pathData)
      // CORRECT: Call the ordinal scale like a function: colors(idx)
      .attr('fill', colors(idx)); 
});

// --- 2. Build the Legend ---
let legend = d3.select('.legend');

// Iterate over the arcData, which holds the original data object in d.data
arcData.forEach((d) => {
    // Get the original index to use with the color scale
    const idx = d.index;
    
    // Get the label and value from the original data object (d.data)
    const label = d.data.label || `Slice ${idx + 1}`;
    const value = d.data.value;

    let listItem = legend.append('li')
        // Apply the class for the item's layout (required for flex/grid)
        .attr('class', 'legend-item') 
        
        // Pass the color value as a CSS variable using the correct function call: colors(idx)
        .attr('style', `--color: ${colors(idx)}`); 

    // The most flexible way: append elements separately
    listItem.append('span')
        .attr('class', 'swatch'); // Apply the swatch styling class
        
    listItem.append('text')
        // Use a mix of the label (strong) and value (em)
        .html(`<strong>${label}</strong> <em>(${value})</em>`);
});