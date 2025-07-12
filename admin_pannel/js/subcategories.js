/* -----------------  js/subcategories.js  ----------------- */

/* ------------ Configuration ------------ */
const API_BASE = 'https://ecom-b-e85t.onrender.com/api';

/* ------------ DOM  ------------ */
const subcategoryTableBody = document.querySelector('#subcategoriesTable tbody');

const addModal = document.getElementById('addSubCategoryModal');
const editModal = document.getElementById('editSubCategoryModal');

const saveBtn = document.getElementById('saveSubCategoryBtn');
const updateBtn = document.getElementById('updateSubCategoryBtn');
const alertBox = document.getElementById('alertContainer');

/* Add form inputs */
const nameInput = document.getElementById('subCategoryName');
const categorySelect = document.getElementById('subCategoryCategory');

/* Edit form inputs */
const editId = document.getElementById('editSubCategoryId');
const editName = document.getElementById('editSubCategoryName');
const editCategorySelect = document.getElementById('editSubCategoryCategory');

/* ------------ Auth guard ------------ */
const token = localStorage.getItem('adminToken');
if (!token) {
    alert('Please login first.');
    window.location.href = '/admin_pannel/admin-login.html';
    throw new Error('No admin token');
}

/* ------------ Helpers ------------ */
const authHeaders = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
});

const showAlert = (msg, type = 'success') => {
    alertBox.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    setTimeout(() => (alertBox.innerHTML = ''), 3500);
};

const safeValue = (v) => (v == null ? '' : v.toString());

/* ------------ Init ------------ */
document.addEventListener('DOMContentLoaded', () => {
    loadSubCategories();
    loadCategoryOptions();

    saveBtn.addEventListener('click', createSubCategory);
    updateBtn.addEventListener('click', updateSubCategory);

    /* open add‑modal */
    document
        .querySelector('[data-target="#addSubCategoryModal"]')
        .addEventListener('click', () => {
            addModal.style.display = 'block';
            document.getElementById('addSubCategoryForm').reset();
            loadCategoryOptions(); // refresh dropdowns
        });

    /* simple modal close logic */
    document.querySelectorAll('.modal .close').forEach(
        (btn) =>
        (btn.onclick = () => {
            addModal.style.display = editModal.style.display = 'none';
        })
    );

    window.onclick = (e) => {
        if (e.target === addModal) addModal.style.display = 'none';
        if (e.target === editModal) editModal.style.display = 'none';
    };
});

/* ------------ Fetch logic ------------ */
async function loadSubCategories() {
    try {
        const res = await fetch(`${API_BASE}/subcategories`, { headers: authHeaders() });
        if (!res.ok) throw new Error(res.statusText);
        renderSubCategoryTable(await res.json());
    } catch (err) {
        console.error(err);
        showAlert('Could not load sub‑categories', 'danger');
    }
}

async function loadCategoryOptions() {
    /* returns the full category list for await‑ing where needed */
    const res = await fetch(`${API_BASE}/categories/admin/all`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Category list failed');

    const categories = await res.json();

    /* clear & repopulate both selects */
    [categorySelect, editCategorySelect].forEach((sel) => (sel.innerHTML = ''));

    categories.forEach((cat) => {
        const opt1 = new Option(cat.name, cat.id);
        const opt2 = new Option(cat.name, cat.id);
        categorySelect.add(opt1);
        editCategorySelect.add(opt2);
    });
    return categories;
}

/* ------------ Table render ------------ */
function renderSubCategoryTable(list) {
    subcategoryTableBody.innerHTML = list.length ?
        '' :
        '<tr><td colspan="4">No sub‑categories found.</td></tr>';

    list.forEach((sc) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${sc.id}</td>
      <td>${sc.name}</td>
      <td>${sc.category?.name ?? '—'}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-btn"   data-id="${sc.id}">Edit</button>
        <button class="btn btn-sm btn-danger  delete-btn" data-id="${sc.id}">Delete</button>
      </td>`;
        subcategoryTableBody.appendChild(tr);
    });

    /* attach row‑buttons */
    document.querySelectorAll('.edit-btn').forEach(
        (btn) => (btn.onclick = () => openEditModal(btn.dataset.id))
    );
    document.querySelectorAll('.delete-btn').forEach(
        (btn) => (btn.onclick = () => deleteSubCategory(btn.dataset.id))
    );
}

/* ------------ CRUD ------------ */
async function createSubCategory() {
    const payload = {
        name: nameInput.value.trim(),
        category: { id: categorySelect.value }
    };
    try {
        const res = await fetch(`${API_BASE}/subcategories`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Create failed');
        showAlert('Sub‑category added');
        addModal.style.display = 'none';
        loadSubCategories();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

async function openEditModal(id) {
    try {
        /* 1️⃣ refresh dropdown options FIRST */
        await loadCategoryOptions();

        /* 2️⃣ grab chosen sub‑category */
        const res = await fetch(`${API_BASE}/subcategories`, { headers: authHeaders() });
        const list = await res.json();
        const sub = list.find((s) => s.id == id);
        if (!sub) return showAlert('Sub‑category not found', 'danger');

        /* 3️⃣ populate fields */
        editId.value = sub.id;
        editName.value = sub.name;

        // ---------- FIX: compute catId without optional‑chaining ----------
        const catId = sub.category && sub.category.id ? String(sub.category.id) : '';
        editCategorySelect.value = [...editCategorySelect.options].some((o) => o.value === catId) ? catId : '';
        // ------------------------------------------------------------------

        editModal.style.display = 'block';
    } catch (err) {
        console.error(err);
        showAlert('Could not open editor', 'danger');
    }
}

async function updateSubCategory() {
    const payload = {
        name: editName.value.trim(),
        category: { id: editCategorySelect.value }
    };
    try {
        const res = await fetch(`${API_BASE}/subcategories/${editId.value}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Update failed');
        showAlert('Sub‑category updated');
        editModal.style.display = 'none';
        loadSubCategories();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

async function deleteSubCategory(id) {
    if (!confirm('Delete this sub‑category?')) return;
    try {
        const res = await fetch(`${API_BASE}/subcategories/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (!res.ok) throw new Error('Delete failed');
        showAlert('Deleted');
        loadSubCategories();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

/* -----------------  end of file  ----------------- */