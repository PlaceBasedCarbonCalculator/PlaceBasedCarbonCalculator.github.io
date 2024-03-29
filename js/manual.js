/* Convert Markdown to HTML */
loadManual ();

// Top nav
topnav ();


// Load the Markdown file as text and place it into the content div
function loadManual ()
{
  fetch ('/manual/index.md')
    .then (response => response.text ())
    .then (function (text) {
      document.querySelector ('#content').innerHTML = mdToHtml (text);
      createToc ();
      createEditLink ();
    })
    .catch (function (error) {
      console.log(error);
      alert('Failed to load manual text.');
    });
}


// Function to convert the loaded Markdown file text to HTML
function mdToHtml (mdText)
{
  const converter = new showdown.Converter ();
  const html = converter.makeHtml (mdText);
  return html;
}



// Function to create table of contents
function createToc ()
{
  // Create new div and attach to body
  const tocDiv = document.createElement('div');
  tocDiv.classList.add ('table-of-contents');
  document.querySelector('body').appendChild (tocDiv);
  
  // Add UL to TOC
  const ul = document.createElement('ul');
  tocDiv.appendChild (ul);
  
  const toc = document.querySelector('.table-of-contents');
  const headings = document.querySelectorAll('h2, h3');

  let lastH2Item = null;

  headings.forEach((heading) => {
    const level = heading.tagName.toLowerCase();
    const title = heading.textContent;
    const anchor = heading.id;

    const link = document.createElement('a');
    link.textContent = title;
    link.setAttribute('href', `#${anchor}`);

    const item = document.createElement('li');
    item.appendChild(link);

    if (level === 'h2') {
      const sublist = document.createElement('ul');
      item.appendChild(sublist);
      toc.querySelector('ul').appendChild(item);
      lastH2Item = item;
    } else if (level === 'h3' && lastH2Item) {
      const sublist = document.createElement('ul');
      item.appendChild(sublist);
      lastH2Item.querySelector('ul').appendChild(item);
    }

    heading.addEventListener('click', () => {
      location.hash = anchor;
    });
  });
}


// Function to create an editing link
function createEditLink ()
{
  // Determine the page slug (e.g. /manual/ is 'manual')
  const matches = window.location.pathname.match (new RegExp ('^/([^/]+)/'));
  const slug = matches[1];
  
  // Assemble the link
  const link = settings.manualEditingUrl.replace ('%id', slug);
  
  // Create new div and attach to body
  document.querySelector('#editlink').href = link;
}


// Main menu responsive display
function topnav ()
{
  document.getElementById ('expandtopnav').addEventListener ('click', function (e) {
    var x = document.getElementById('myTopnav');
    if (x.className == 'topnav') {
      x.classList.add ('responsive');
    } else {
      x.classList.remove ('responsive');
    }
    e.preventDefault ();
  });
}