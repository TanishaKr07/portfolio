console.log('IT’S ALIVE!');



// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }
// navLinks = $$("nav a");
// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );
// currentLink?.classList.add('current');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

for (let p of pages) {
  let url = p.url.startsWith('http') ? p.url : BASE_PATH + p.url;
  let a = document.createElement('a');
  a.href = url;
  a.textContent = p.title;
  if (a.host !== location.host) {
    a.target = "_blank";
  }

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }
  nav.append(a);
}


document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme"
  style="position:absolute; top:1em; right:1em; font-size:0.8em; 
  font-family:inherit;">
    Theme:
    <select id="theme-switch">
      <option value="light dark">Default</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

const select = document.querySelector('#theme-switch');
select.addEventListener('input', function (event) {
  const scheme = event.target.value;
  console.log('color scheme changed to', scheme);
  document.documentElement.style.setProperty('color-scheme', scheme);
  localStorage.colorScheme = scheme;
});

if ('colorScheme' in localStorage) {
  const savedScheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', savedScheme);
  select.value = savedScheme;
}

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    // inspect the response
    console.log('Response received:', response);

    // Parse the JSON data
    const data = await response.json();
    return data;


  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
} 

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  // write javascript that will allow dynamic heading levels based on previous function
  containerElement.innerHTML = '';
  project.forEach(proj => {
    const article = document.createElement('article');
    article.innerHTML = `
    <${headingLevel}>${proj.title}</${headingLevel}>
    <img src="${proj.image}" alt="${proj.title}">
    <p style="font-family: Baskerville; font-style: italic; font-variant-numeric: 
    oldstyle-nums;">Year: ${proj.year}</p>
    <p>${proj.description}</p>
`;
    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);
}