// This is the code you should have in your coming-soon.js file
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ coming-soon.js loaded"); // THIS IS THE FIRST MESSAGE TO LOOK FOR

    const comingSoonSlugs = ['medical-instruments', 'automobile-sector'];

    const processLinks = () => {
        const links = document.querySelectorAll('#main-nav-category-list a');

        links.forEach(link => {
            if (link.classList.contains('coming-soon-processed')) {
                return; // Already processed, skip
            }

            const href = link.getAttribute('href');
            if (!href || href === '#') {
                return; // No href, or already a hash link, skip
            }

            const match = href.match(/category=([a-z0-9\-]+)/i);
            if (!match) {
                return; // No category parameter, skip
            }

            const slug = match[1].toLowerCase();

            if (comingSoonSlugs.includes(slug)) {
                console.log(`🚫 Disabling "${slug}" and marking as 'Coming Soon'`); // SECOND MESSAGE TO LOOK FOR

                link.setAttribute('href', '#'); // Change the link destination
                link.classList.add('coming-soon-tooltip'); // Add class for CSS
                link.addEventListener('click', e => {
                    e.preventDefault(); // Stop the click from navigating
                });
                link.classList.add('coming-soon-processed'); // Mark as processed
            }
        });
    };

    processLinks(); // Run once on initial load

    const nav = document.getElementById('main-nav-category-list');
    if (nav) {
        const observer = new MutationObserver(processLinks);
        observer.observe(nav, { childList: true, subtree: true });
    }
});