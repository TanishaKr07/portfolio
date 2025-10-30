import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

//add a count of projects at the top of the page by using a 
// JavaScript method to select the element with the class projects-title from the DOM
const projectsTitle = document.querySelector('.projects-title');
const projectCount = projects.length;
projectsTitle.textContent = `Projects (${projectCount})`;

//Edit the projects’ display using JS (the renderProject() method in global.js) to show 
// the year of the project. You can use any HTML you deem suitable and style it however 
// you want. Place it under the project description (you’ll need to wrap both in the 
// same <div> otherwise they will occupy the same grid cell and overlap)

//use the font-family Baskerville (a system font) and use font-variant-numeric: oldstyle-nums 
// to make the numbers look a bit more like they belong in the text

if (proj.year) {
    article.innerHTML += `<div class="project-year">Year: ${proj.year}</div>`;
    const style = document.createElement('style');
    style.textContent = `
    .project-year {
        font-family: Baskerville, serif;
        font-variant-numeric: oldstyle-nums;
        margin-top: 0.5em;
    }
    `;
    document.head.appendChild(style);
}