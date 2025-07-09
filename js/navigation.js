$(document).ready(function() {

    function highlightActiveNavLink() {
        // Remove 'active' class from all navigation items first
        $('.main-nav li').removeClass('active');

        var currentPathname = window.location.pathname.split('/').pop();
        var urlParams = new URLSearchParams(window.location.search);
        var category = urlParams.get('category');

        // Logic for highlighting:
        if (currentPathname === 'store.html' && category) {
            // If on store.html and a category parameter is present
            var navItemId = category + '-nav';
            $('#' + navItemId).addClass('active');

        } else if (currentPathname === 'index.html' || currentPathname === '') {
            // If on index.html (or root path without a specific file)
            // Default to 'Home' active if on index.html with no specific hash
            $('#home-nav').addClass('active');
        }
        // You might need more specific logic here if other pages exist
        // or if index.html has internal anchor links that need highlighting.
    } // <--- THIS IS THE MISSING CLOSING BRACE '}' THAT WAS CAUSING THE ERROR!

    // Call the function on page load
    highlightActiveNavLink(); //

    // If your index.html uses #hashes for same-page scrolling, keep this:
    // $(window).on('hashchange', function() {
    //     highlightActiveNavLink();
    // });

}); // Closing brace for $(document).ready()