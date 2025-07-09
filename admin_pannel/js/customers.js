document.addEventListener('DOMContentLoaded', () => {
    const customersTableBody = document.querySelector('#customersTable tbody');
    const customerSearchInput = document.getElementById('customerSearch');
    const addCustomerModal = document.getElementById('addCustomerModal');
    const addCustomerForm = document.getElementById('addCustomerForm');
    const saveCustomerBtn = document.getElementById('saveCustomerBtn');
    const editCustomerModal = document.getElementById('editCustomerModal');
    const editCustomerForm = document.getElementById('editCustomerForm');
    const updateCustomerBtn = document.getElementById('updateCustomerBtn');
    const alertContainer = document.getElementById('alertContainer');
    const token = localStorage.getItem('adminToken');

    // if (!token) {
    //     alert("You are not logged in. Redirecting to login.");
    //     window.location.href = "/admin_pannel/admin-login.html";
    //     return;
    // }

    // Modal logic
    document.querySelectorAll('[data-toggle="modal"]').forEach(button => {
        button.addEventListener('click', (event) => {
            const targetId = event.target.getAttribute('data-target');
            document.querySelector(targetId).style.display = 'block';
        });
    });

    document.querySelectorAll('.modal .close').forEach(span => {
        span.addEventListener('click', (event) => {
            event.target.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    });

    let customersData = [];

    async function fetchCustomers(searchTerm = '') {
        try {
            const response = await fetch(`https://ecom-b-e85t.onrender.com/api/users/by-role?role=CUSTOMER`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 204) {
                    customersData = [];
                    renderCustomers([]);
                    showAlert('No customers found.', 'info');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            customersData = await response.json();
            renderCustomers(customersData, searchTerm);
        } catch (error) {
            console.error('Error fetching customers:', error);
            showAlert('Error loading customers. Please try again later.', 'danger');
            customersData = [];
            renderCustomers([]);
        }
    }

    function renderCustomers(customers, searchTerm = '') {
        customersTableBody.innerHTML = '';

        const filteredCustomers = customers.filter(customer => {
            const username = customer.username ? customer.username.toLowerCase() : '';
            const email = customer.email ? customer.email.toLowerCase() : '';
            return searchTerm === '' ||
                username.includes(searchTerm.toLowerCase()) ||
                email.includes(searchTerm.toLowerCase());
        });

        if (filteredCustomers.length === 0) {
            customersTableBody.innerHTML = '<tr><td colspan="5">No customers found.</td></tr>';
            return;
        }

        filteredCustomers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.username}</td>
                <td>${customer.email}</td>
                <td>${customer.company || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editCustomer(${customer.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${customer.id})">Delete</button>
                </td>
            `;
            customersTableBody.appendChild(row);
        });
    }

    window.editCustomer = (id) => {
        const customer = customersData.find(c => c.id === id);
        if (customer) {
            document.getElementById('editCustomerId').value = customer.id;
            document.getElementById('editCustomerName').value = customer.username;
            document.getElementById('editCustomerEmail').value = customer.email;
            editCustomerModal.style.display = 'block';
        } else {
            showAlert('Customer not found for editing.', 'danger');
        }
    };

    updateCustomerBtn.addEventListener('click', async() => {
        const id = document.getElementById('editCustomerId').value;
        const username = document.getElementById('editCustomerName').value.trim();
        const email = document.getElementById('editCustomerEmail').value.trim();

        if (!username || !email) {
            showAlert('Full Name and Email are required!', 'danger');
            return;
        }

        const updatedData = { username, email };

        try {
            const response = await fetch(`https://ecom-b-e85t.onrender.com/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update customer: ${response.status} ${errorText}`);
            }

            showAlert('Customer updated successfully!', 'success');
            editCustomerModal.style.display = 'none';
            fetchCustomers();
        } catch (error) {
            console.error('Error updating customer:', error);
            showAlert('Error updating customer. Please try again.', 'danger');
        }
    });

    window.deleteCustomer = async(id) => {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            const response = await fetch(`https://ecom-b-e85t.onrender.com/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete customer: ${response.status} ${errorText}`);
            }

            showAlert('Customer deleted successfully!', 'success');
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            showAlert('Error deleting customer. Please try again.', 'danger');
        }
    };

    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alertContainer.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    fetchCustomers();

    customerSearchInput.addEventListener('input', function() {
        renderCustomers(customersData, this.value);
    });



    saveCustomerBtn.addEventListener('click', async() => {
        const username = document.getElementById('customerName').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const company = document.getElementById('customerCompany').value.trim();
        const password = document.getElementById('customerPassword').value.trim();

        if (!username || !email || !password) {
            showAlert('Full Name, Email, and Password are required!', 'danger');
            return;
        }

        const newCustomerData = {
            username,
            email,
            password,
            company,
            role: ["customer"]
        };

        try {
            const response = await fetch('https://ecom-b-e85t.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCustomerData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add new customer: ${response.status} ${errorText}`);
            }

            showAlert('New customer added successfully!', 'success');
            addCustomerModal.style.display = 'none';
            addCustomerForm.reset();
            fetchCustomers();
        } catch (error) {
            console.error('Error adding new customer:', error);
            showAlert(`Error adding new customer: ${error.message}`, 'danger');
        }
    });
});

// // for admin logout 
// document.addEventListener('DOMContentLoaded', () => {
//     const logoutBtn = document.getElementById('adminLogoutBtn');
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', () => {
//             localStorage.removeItem('adminToken'); // remove token
//             window.location.href = '/admin_pannel/admin-login.html'; // redirect to login
//         });
//     }
// });

// // auto redirect if not login 
const token = localStorage.getItem('adminToken');
if (!token) {
    alert('Please login first to access the page.');
    window.location.href = '/admin_pannel/admin-login.html';
}