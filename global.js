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
  { url: 'resume/', title: 'Resume/CV' },
];
let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // next step: create link and add it to nav
    link = document.createElement('a');
    link.href = url;
    link.textContent = title;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
    );
    if (a.host !== location.host) {
        a.target = "_blank";
    }
}

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/website/";         // GitHub Pages repo name
url = !url.startsWith('http') ? BASE_PATH + url : url;