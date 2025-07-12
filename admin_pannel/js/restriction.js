// // js/categories.js
// // -------------------------------------------------------------
// //  A L L   I N   O N E   – fully‑updated admin logic
// //  – CRUD + image‑upload for categories
// //  – JWT‑protected calls to Spring‑Boot backend
// // -------------------------------------------------------------

// // --- Configuration ---------------------------------------------------------
// const API_BASE_URL = 'https://ecom-b-e85t.onrender.com/api/categories'; // Spring Boot API

// // --- DOM REFS --------------------------------------------------------------
// const categoriesTableBody = document.querySelector('#categoriesTable tbody');
// const addCategoryModal = document.getElementById('addCategoryModal');
// const editCategoryModal = document.getElementById('editCategoryModal');
// const saveCategoryBtn = document.getElementById('saveCategoryBtn');
// const updateCategoryBtn = document.getElementById('updateCategoryBtn');
// const alertContainer = document.getElementById('alertContainer');

// // *Add* modal inputs
// const categoryNameInput = document.getElementById('categoryName');
// const categorySlugInput = document.getElementById('categorySlug');
// const categoryDescriptionInput = document.getElementById('categoryDescription');
// const categoryStatusSelect = document.getElementById('categoryStatus');
// const categoryImageInput = document.getElementById('categoryImage'); //  <-- NEW

// // *Edit* modal inputs
// const editCategoryIdInput = document.getElementById('editCategoryId');
// const editCategoryNameInput = document.getElementById('editCategoryName');
// const editCategorySlugInput = document.getElementById('editCategorySlug');
// const editCategoryDescriptionInput = document.getElementById('editCategoryDescription');
// const editCategoryStatusSelect = document.getElementById('editCategoryStatus');
// const editCategoryImageInput = document.getElementById('editCategoryImage'); // <-- NEW

// // --- EVENT WIRING ----------------------------------------------------------
// document.addEventListener('DOMContentLoaded', () => {

//     loadCategories(); // load table on page‑open
//     saveCategoryBtn.addEventListener('click', saveCategory);
//     updateCategoryBtn.addEventListener('click', updateCategory);

//     categoryNameInput.addEventListener('input', () => categorySlugInput.value = generateSlug(categoryNameInput.value));
//     editCategoryNameInput.addEventListener('input', () => editCategorySlugInput.value = generateSlug(editCategoryNameInput.value));

//     // open modal for *Add*
//     document.querySelector('[data-target="#addCategoryModal"]').addEventListener('click', () => {
//         addCategoryModal.style.display = 'flex';
//         document.getElementById('addCategoryForm').reset();
//         categoryStatusSelect.value = 'Active';
//     });

//     // close modals
//     document.querySelectorAll('.modal .close').forEach(c => c.addEventListener('click', () => {
//         addCategoryModal.style.display = 'none';
//         editCategoryModal.style.display = 'none';
//     }));
//     window.addEventListener('click', e => {
//         if (e.target === addCategoryModal) addCategoryModal.style.display = 'none';
//         if (e.target === editCategoryModal) editCategoryModal.style.display = 'none';
//     });
// });

// // --- LOAD ALL CATEGORIES ---------------------------------------------------
// async function loadCategories(filter = '') {
//     try {
//         const token = localStorage.getItem('adminToken');
//         if (!token) return showAlert('Please log in.', 'danger');

//         const res = await fetch(`${API_BASE_URL}/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
//         if (!res.ok) throw new Error(await res.text());

//         const cats = await res.json();
//         const visible = cats.filter(c =>
//             !filter ||
//             c.name.toLowerCase().includes(filter.toLowerCase()) ||
//             c.slug.toLowerCase().includes(filter.toLowerCase())
//         );
//         renderCategoriesTable(visible);

//     } catch (err) {
//         console.error(err);
//         showAlert(`Error loading categories: ${err.message}`, 'danger');
//         categoriesTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red">Failed to load.</td></tr>';
//     }
// }

// // --- TABLE RENDERER --------------------------------------------------------
// function renderCategoriesTable(list) {
//     categoriesTableBody.innerHTML = '';

//     if (!list.length) {
//         categoriesTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No categories found.</td></tr>';
//         return;
//     }

//     list.forEach(c => {
//         const tr = document.createElement('tr');
//         tr.innerHTML = `
//          <td>${c.id}</td>
//          <td>${c.name}</td>
//          <td>${c.slug}</td>
//          <td><span class="status ${c.status.toLowerCase()}">${c.status}</span></td>
//          <td>
//            <button class="btn btn-primary btn-sm edit-btn"   data-id="${c.id}"><i class="fas fa-edit"></i> Edit</button>
//            <button class="btn btn-danger  btn-sm delete-btn" data-id="${c.id}"><i class="fas fa-trash"></i> Delete</button>
//          </td>`;
//         categoriesTableBody.appendChild(tr);
//     });

//     // attach dynamic buttons
//     document.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', () => editCategory(b.dataset.id)));
//     document.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', () => deleteCategory(b.dataset.id)));
// }

// // --- SAVE (CREATE) ---------------------------------------------------------
// async function saveCategory() {
//     const name = categoryNameInput.value.trim();
//     if (!name) return showAlert('Name is required.', 'danger');

//     const data = {
//         name,
//         slug: categorySlugInput.value.trim() || null,
//         description: categoryDescriptionInput.value.trim(),
//         status: categoryStatusSelect.value
//     };

//     try {
//         const token = localStorage.getItem('adminToken');
//         const res = await fetch(`${API_BASE_URL}/admin`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         if (!res.ok) throw new Error(await res.text());
//         const created = await res.json();

//         // ---- Image upload (optional) ----
//         const imgFile = categoryImageInput.files[0];
//         if (imgFile) await uploadImage(created.id, imgFile, token);

//         showAlert(`Category "${created.name}" added.`, 'success');
//         addCategoryModal.style.display = 'none';
//         document.getElementById('addCategoryForm').reset();
//         loadCategories();
//     } catch (err) {
//         console.error(err);
//         showAlert(err.message, 'danger');
//     }
// }

// // --- EDIT (open modal) -----------------------------------------------------
// async function editCategory(id) {
//     try {
//         const token = localStorage.getItem('adminToken');
//         const res = await fetch(`${API_BASE_URL}/admin/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//         if (!res.ok) throw new Error(await res.text());
//         const c = await res.json();

//         editCategoryIdInput.value = c.id;
//         editCategoryNameInput.value = c.name;
//         editCategorySlugInput.value = c.slug;
//         editCategoryDescriptionInput.value = c.description || '';
//         editCategoryStatusSelect.value = c.status;

//         editCategoryModal.style.display = 'flex';
//     } catch (err) {
//         console.error(err);
//         showAlert(err.message, 'danger');
//     }
// }

// // --- UPDATE ---------------------------------------------------------------
// async function updateCategory() {
//     const id = editCategoryIdInput.value;
//     const name = editCategoryNameInput.value.trim();
//     if (!name) return showAlert('Name is required.', 'danger');

//     const data = {
//         name,
//         slug: editCategorySlugInput.value.trim() || null,
//         description: editCategoryDescriptionInput.value.trim(),
//         status: editCategoryStatusSelect.value
//     };

//     try {
//         const token = localStorage.getItem('adminToken');
//         const res = await fetch(`${API_BASE_URL}/admin/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         if (!res.ok) throw new Error(await res.text());
//         const updated = await res.json();

//         const imgFile = editCategoryImageInput.files[0];
//         if (imgFile) await uploadImage(id, imgFile, token);

//         showAlert(`Category "${updated.name}" updated.`, 'success');
//         editCategoryModal.style.display = 'flex';
//         loadCategories();
//     } catch (err) {
//         console.error(err);
//         showAlert(err.message, 'danger');
//     }
// }

// // --- DELETE ---------------------------------------------------------------
// async function deleteCategory(id) {
//     if (!confirm('Delete this category?')) return;
//     try {
//         const token = localStorage.getItem('adminToken');
//         const res = await fetch(`${API_BASE_URL}/admin/${id}`, {
//             method: 'DELETE',
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         if (!res.ok) throw new Error(await res.text());
//         showAlert('Deleted.', 'success');
//         loadCategories();
//     } catch (err) {
//         console.error(err);
//         showAlert(err.message, 'danger');
//     }
// }

// // --- IMAGE UPLOAD helper ---------------------------------------------------
// async function uploadImage(id, file, token) {
//     const fd = new FormData();
//     fd.append('image', file);
//     const res = await fetch(`${API_BASE_URL}/admin/${id}/image`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: fd
//     });
//     if (!res.ok) throw new Error('Image upload failed.');
// }

// // --- UTILITIES -------------------------------------------------------------
// function showAlert(msg, type) {
//     alertContainer.innerHTML =
//         `<div class="alert alert-${type}">${msg}</div>`;
//     setTimeout(() => { alertContainer.innerHTML = ''; }, 5000);
// }

// function generateSlug(str) {
//     return str.toLowerCase()
//         .replace(/[^a-z0-9\s-]/g, '')
//         .replace(/\s+/g, '-')
//         .replace(/^-+|-+$/g, '');
// }

// // --- BASIC AUTH CHECK ------------------------------------------------------
// const __token = localStorage.getItem('adminToken');
// if (!__token) {
//     alert('Please login first.');
//     window.location.href = '/admin_panel/admin-login.html';
//     throw new Error('Unauthorized – redirecting');
// }