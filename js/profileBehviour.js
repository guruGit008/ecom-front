// profile-behaviour.js

// Utility: Wait for an element to appear in DOM
function waitForElement(selector, callback) {
  const checkExist = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      clearInterval(checkExist);
      callback(el);
    }
  }, 100); // check every 100ms
}

// ✅ Step 1: Show login greeting and user name
waitForElement('#userDisplay', (userDisplay) => {
  const username = localStorage.getItem('userUsername');
  const justLoggedIn = localStorage.getItem('justLoggedIn');
  const userWelcome = document.getElementById('userWelcome');

  if (username) {
    if (userWelcome) {
      userWelcome.textContent = 'Welcome';
    }
    userDisplay.textContent = username;

    // Optional greeting pop-up
    if (justLoggedIn === 'true') {
      const greet = document.createElement('div');
      greet.textContent = `Hello, ${username}!`;
      greet.style.position = 'fixed';
      greet.style.top = '20px';
      greet.style.left = '50%';
      greet.style.transform = 'translateX(-50%)';
      greet.style.backgroundColor = '#1989AC';
      greet.style.color = 'white';
      greet.style.padding = '10px 20px';
      greet.style.borderRadius = '10px';
      greet.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      greet.style.zIndex = '9999';
      greet.style.fontSize = '16px';
      document.body.appendChild(greet);

      setTimeout(() => {
        greet.remove();
      }, 3000);

      localStorage.removeItem('justLoggedIn');
    }
  }

  const dropdownMenu = document.getElementById("profileDropdownMenu");

if (dropdownMenu) {
  dropdownMenu.innerHTML = "";

  if (username) {
    dropdownMenu.innerHTML = `
      <li><a href="user-profile.html">Show Profile</a></li>
      <li><a href="editprofile.html">Edit Profile</a></li>
      <li><a href="#" id="logoutBtn">Logout</a></li>
    `;
  } else {
    dropdownMenu.innerHTML = `<li><a href="login.html">Login</a></li>`;
  }

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

});

// ✅ Step 2: Dropdown toggle behavior for profile menu
waitForElement('#profileToggle', (profileToggle) => {
  const profileLi = document.querySelector('.profile-dropdown');
  if (!profileLi) return;

  profileToggle.addEventListener('click', (e) => {
    e.preventDefault();
    profileLi.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!profileLi.contains(event.target) && event.target !== profileToggle) {
      profileLi.classList.remove('active');
    }
  });
});

// ✅ Step 3: Protect pages that require login
document.addEventListener("DOMContentLoaded", function () {
  const userToken = localStorage.getItem('userToken');
  const currentPath = window.location.pathname;

  // Pages that should require login
  const protectedPages = ['user-profile.html', 'editprofile.html'];

  const isProtected = protectedPages.some(page => currentPath.includes(page));

  if (isProtected && !userToken) {
    alert("Please login first to access this page.");
    window.location.href = "login.html";
  }
});

//