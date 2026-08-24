/* Convert Markdown to HTML */
loadManual ();

// Load the Markdown file as text and place it into the content div
function loadManual ()
{
  fetch ('/manual/index.md')
    .then (response => response.text ())
    .then (function (text) {
      document.querySelector ('#content').innerHTML = mdToHtml (text);
      followAnchorHash ();
      createToc ();
      createTocToggle ();
      //createEditLink ();
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


// Function to create a floating button that shows/hides the contents on mobile
function createTocToggle ()
{
  const body = document.querySelector ('body');
  const toc = document.querySelector ('.table-of-contents');
  if (!toc) { return; }
  toc.id = 'table-of-contents';

  // Backdrop, so a tap outside the panel closes it
  const backdrop = document.createElement ('div');
  backdrop.classList.add ('toc-backdrop');
  body.appendChild (backdrop);

  // Floating button
  const button = document.createElement ('button');
  button.classList.add ('toc-toggle');
  button.setAttribute ('type', 'button');
  button.setAttribute ('aria-controls', 'table-of-contents');
  body.appendChild (button);

  const setOpen = function (open) {
    body.classList.toggle ('toc-open', open);
    button.setAttribute ('aria-expanded', open ? 'true' : 'false');
    button.setAttribute ('aria-label', open ? 'Hide contents' : 'Show contents');
    button.innerHTML = open ? '<i class="fa fa-xmark"></i>' : '<i class="fa fa-bars"></i>';
  };
  setOpen (false);

  button.addEventListener ('click', function () {
    setOpen (!body.classList.contains ('toc-open'));
  });

  backdrop.addEventListener ('click', function () {
    setOpen (false);
  });

  // Close once a contents link has been followed
  toc.addEventListener ('click', function (event) {
    if (event.target.closest ('a')) {
      setOpen (false);
    }
  });

  document.addEventListener ('keydown', function (event) {
    if (event.key === 'Escape') {
      setOpen (false);
    }
  });
}


// Function to create an editing link
function createEditLink ()
{
  // Determine the page slug (e.g. /manual/ is 'manual')
  const matches = window.location.pathname.match (new RegExp ('^/([^/]+)/'));
  const slug = matches[1];
  
  // Assemble the link
  const link = settings_common.manualEditingUrl.replace ('%id', slug);
  
  // Create new div and attach to body
  document.querySelector('#editlink').href = link;
}

// Function to follow the anchor hash for JS-loaded content (which loads after document ready)
function followAnchorHash ()
{
  // Go to hash if present; see: https://stackoverflow.com/a/13736194/180733
  if (window.location.hash) {
    if (document.getElementById (window.location.hash.substring (1))) {
      const top = document.getElementById (window.location.hash.substring (1)).offsetTop;
      window.scrollTo (0, top);
    }
  }
}

