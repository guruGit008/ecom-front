document.addEventListener('DOMContentLoaded', function() {
    // Function to load HTML partials
    function loadHTML(url, elementId, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                const targetElement = document.getElementById(elementId);
                if (targetElement) {
                    targetElement.innerHTML = html;
                    if (callback && typeof callback === 'function') {
                        callback(); // Execute callback after content is loaded
                    }
                } else {
                    console.error(`Element with ID '${elementId}' not found.`);
                }
            })
            .catch(error => {
                console.error(`Could not load ${url}:`, error);
            });
    }

    // Function to set active class on sidebar links - UPDATED
    function setActiveSidebarLink() {
        const currentPath = window.location.pathname;
        const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

        sidebarLinks.forEach(link => {
            // Remove any existing 'active' class first
            link.classList.remove('active');

            // --- NEW: Skip links with href="#" ---
            if (link.getAttribute('href') === '#') {
                return; // Skip to the next link in the loop
            }
            // --- END NEW ---

            const linkPath = new URL(link.href).pathname;

            // Check if the link's path matches the current page's path
            // Handle root path / and /index.html
            if (linkPath === currentPath || (linkPath === '/index.html' && currentPath === '/')) {
                link.classList.add('active');
            }
        });
    }



    // Load Sidebar
    // Call setActiveSidebarLink as a callback AFTER the sidebar is loaded
    loadHTML('sidebar.html', 'sidebar-placeholder', setActiveSidebarLink);

    // If you also have a header or footer for your admin panel, you can add them here
    // loadHTML('admin-header.html', 'admin-header-placeholder');
    // loadHTML('admin-footer.html', 'admin-footer-placeholder');
});