document.addEventListener('DOMContentLoaded', function() {
    // Function to load HTML partials
    function loadHTML(url, elementId) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                document.getElementById(elementId).innerHTML = html;
            })
            .catch(error => {
                console.error(`Could not load ${url}:`, error);
            });
    }

    // Load Header
    loadHTML('header.html', 'header-placeholder');

    // Load Footer
    loadHTML('footer.html', 'footer-placeholder');
});