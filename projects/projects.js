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

let arc = d3.arc().innerRadius(0).outerRadius(50)({
  startAngle: 0,
  endAngle: 2 * Math.PI,
});