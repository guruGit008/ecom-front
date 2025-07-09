(function () {
    console.log("✅ frontend-header.js loaded");

    const searchCategorySelect = document.getElementById('search-category-select');
    const mainNavCategoryList = document.getElementById('main-nav-category-list');

    if (!searchCategorySelect && !mainNavCategoryList) {
        console.warn("❌ Category target elements not found in the DOM");
        return;
    }

    async function loadFrontendCategories() {
        try {
            const response = await fetch('https://ecom-b-e85t.onrender.com/api/categories');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const categories = await response.json();

            // Clear existing items
            if (searchCategorySelect) {
                while (searchCategorySelect.options.length > 1) {
                    searchCategorySelect.remove(1);
                }
            }

            if (mainNavCategoryList) {
                while (mainNavCategoryList.children.length > 1) {
                    mainNavCategoryList.removeChild(mainNavCategoryList.lastChild);
                }
            }

            if (categories.length === 0) {
                console.warn("No categories found from the backend.");
                return;
            }

            // Insert categories
            categories.forEach(category => {
                // Determine the correct page based on the category name or slug
                let targetPage = 'store.html'; // default

                const lowerName = category.name.toLowerCase();
                const lowerSlug = category.slug.toLowerCase();

                if (lowerName.includes('satcom') || lowerSlug === 'satcom-products') {
                    targetPage = 'satcomProducts.html';
                } else if (lowerName.includes('ceramic') || lowerSlug === 'ceramics') {
                    targetPage = 'ceramics.html';
                } else if (lowerName.includes('magnet') || lowerSlug === 'magnets') {
                    targetPage = 'magnets.html';
                } else if (lowerName.includes('medical') || lowerSlug === 'medical-instruments') {
                    targetPage = 'commingSoonPage.html';
                } else if (lowerName.includes('automobile') || lowerSlug === 'automobile-sector') {
                    targetPage = 'commingSoonPage.html';
                }
                // Add to dropdown
                if (searchCategorySelect) {
                    const option = document.createElement('option');
                    option.value = category.slug;
                    option.textContent = category.name;
                    searchCategorySelect.appendChild(option);
                }

                // Add to navigation list
                if (mainNavCategoryList) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="${targetPage}?category=${category.slug}">${category.name}</a>`;
                    mainNavCategoryList.appendChild(listItem);
                }
            });

            console.log("✅ Categories successfully loaded");

        } catch (error) {
            console.error('❌ Failed to load categories:', error);

            if (searchCategorySelect && searchCategorySelect.options.length <= 1) {
                const errorOption = document.createElement('option');
                errorOption.textContent = 'Error loading categories';
                errorOption.disabled = true;
                searchCategorySelect.appendChild(errorOption);
            }

            if (mainNavCategoryList && mainNavCategoryList.children.length <= 1) {
                const errorItem = document.createElement('li');
                errorItem.innerHTML = '<a>Error loading categories</a>';
                mainNavCategoryList.appendChild(errorItem);
            }
        }
    }

    loadFrontendCategories();
})();
