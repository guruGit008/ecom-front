// document.addEventListener('DOMContentLoaded', async() => {
//     const token = localStorage.getItem('adminToken');
//     if (!token) {
//         alert("Login first to access this page.");
//         window.location.href = '/admin_pannel/admin-login.html';
//         return;
//     }

//     try {
//         const response = await fetch('/api/admin/all', {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error("Failed to fetch admins");
//         }

//         const admins = await response.json();
//         const tableBody = document.querySelector('#adminsTable tbody');
//         tableBody.innerHTML = ''; // Clear existing rows

//         admins.forEach((admin, index) => {
//             const row = `
//         <tr>
//           <td>${index + 1}</td>
//           <td>${admin.username || '-'}</td>
//           <td>${admin.email || '-'}</td>
//           <td>${admin.company || '-'}</td>
//         </tr>`;
//             tableBody.insertAdjacentHTML('beforeend', row);
//         });

//     } catch (error) {
//         console.error("Error loading admins:", error);
//         alert("Error loading admins. Please try again later.");
//     }
// });