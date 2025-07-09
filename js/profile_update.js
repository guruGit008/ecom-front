document.addEventListener('DOMContentLoaded', function() {
    const userDisplay = document.getElementById('userDisplay');
    const userWelcome = document.getElementById('userWelcome');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const dropdownMenu = profileDropdown.querySelector('.dropdown-menu');

    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');

    if (userToken) {
        // ✅ Show customer details
        const username = localStorage.getItem('userUsername') || 'User';
        userDisplay.textContent = username;
        userWelcome.textContent = 'Welcome';
    } else if (adminToken) {
        // 🛑 Prevent admin accessing customer UI profile
        userDisplay.textContent = 'Login';
        userWelcome.textContent = '';
        dropdownMenu.innerHTML = `
        <li><a href="login.html">Login as Customer</a></li>
      `;
    } else {
        // Not logged in at all
        userDisplay.textContent = 'Login';
        userWelcome.textContent = '';
        dropdownMenu.innerHTML = `
        <li><a href="login.html">Login</a></li>
      `;
    }

    // 🔐 Protect profile.html/editprofile.html
    const profileLinks = dropdownMenu.querySelectorAll('a');
    profileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!userToken) {
                e.preventDefault();
                alert('Please login as a customer to access your profile.');
                window.location.href = 'login.html';
            }
        });
    });
});