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



// 1. Define the Arc Generator (The "Drawer" that knows the shape)
// We rename the variable from 'arc' to 'arcGenerator' for clarity and
// define it as a function that will be called later.
const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50); 


//
// fetch your project data and replace the ...
//let projects = await fetchJSON('../lib/projects.json'); 
let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);


// 2. Data and Slice Calculation (The "Calculator" - Replaces manual loop)
// let data = [
//   { value: 1, label: 'apples' },
//   { value: 2, label: 'oranges' },
//   { value: 3, label: 'mangos' },
//   { value: 4, label: 'pears' },
//   { value: 5, label: 'limes' },
//   { value: 5, label: 'cherries' },
// ];

let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data); // Returns objects with startAngle/endAngle calculated

// 3. Generate Path Strings and Render
// Ensure d3.scaleOrdinal is defined correctly.
let colors = d3.scaleOrdinal(d3.schemePastel1); 

// --- 1. Draw the Paths (Pie Slices) ---
let arcs = arcData.map((d) => arcGenerator(d)); 

arcs.forEach((pathData, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', pathData)
      // CORRECT: Call the ordinal scale like a function: colors(idx)
      .attr('fill', colors(idx)); 
});

// how you add class name as attributes using D3
// ... after d3 is defined and data/colors are set ...

let legend = d3.select('.legend');
data.forEach((d, idx) => {
    // 1. Append the <li> element, setting the CSS variable
    const listItem = legend.append('li')
        .attr('style', `--color: ${colors(idx)}`);
        
    // 2. Append the Swatch (using <span> for simplicity, applying the .swatch class)
    listItem.append('span')
        .attr('class', 'swatch');

    // 3. Append the Label Text
    listItem.append('span')
        .text(`${d.label} (${d.value})`);
});


//write a code below to display the year of each project based on projects.json assuming each project object has a year property. the font should be Baskerville, italicized and the numeric font should be font-variant-numeric: oldstyle-nums
// Get all the rendered article elements once
const projectArticles = projectsContainer.querySelectorAll('article');

// Loop over the articles and the project data simultaneously
projectArticles.forEach((article, i) => {
    const project = projects[i]; // Get the corresponding project object by index

    if (project && project.year) { // Check if the project and year exist
        const yearElement = document.createElement('div');
        yearElement.textContent = project.year;
        
        // Apply the styles (Consider moving these to style.css for cleaner code)
        yearElement.style.fontFamily = 'Baskerville, serif';
        yearElement.style.fontStyle = 'italic';
        yearElement.style.fontVariantNumeric = 'oldstyle-nums';
        
        // Find where to append the year, typically inside the article itself
        article.appendChild(yearElement);
    }
});

// Implement search functionality to filter projects based on user input
let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
});

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
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
    }; // TODO
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));
  
  //clear up paths and legends
    d3.selectAll('svg path').remove();
    d3.selectAll('.legend li').remove();

  // update paths and legends, refer to steps 1.4 and 2.2
    newArcs.forEach((pathData, idx) => {
        d3.select('svg')
          .append('path')
          .attr('d', pathData)
          .attr('fill', colors(idx)); 
    });
}

// Call this function on page load
renderPieChart(projects);

searchInput.addEventListener('change', (event) => {
  let filteredProjects = setQuery(event.target.value);
  // re-render legends and pie chart when event triggers
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
}); 

let svg = d3.select('svg');
svg.selectAll('path').remove();
arcs.forEach((arc, i) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
    selectedIndex = selectedIndex === i ? -1 : i;

    svg
        .selectAll('path')
        .attr('class', (_, idx) => (
      // TODO: filter idx to find correct pie slice and apply CSS from above
        selectedIndex === idx ? 'selected' : null
        ));
    });
});
legend
    .selectAll('li')
    .attr('class', (_, idx) => (
      // TODO: filter idx to find correct legend and apply CSS from above
        selectedIndex === idx ? 'selected' : null
    ));
if (selectedIndex === -1) {
  renderProjects(projects, projectsContainer, 'h2');
} else {
  // TODO: filter projects and project them onto webpage
    const selectedYear = data[selectedIndex].label;
    const filteredProjects = projects.filter(proj => proj.year == selectedYear);
    renderProjects(filteredProjects, projectsContainer, 'h2');
}
  // Hint: `.label` might be useful