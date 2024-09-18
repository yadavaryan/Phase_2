let currentPage = 1;  
const limit = 5;     
let editingUserId = null;  


fetchUsers(currentPage);


document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    let formData = new FormData(this);

    
    let email = formData.get('email');
    let phone = formData.get('phone');
    let userProfile = formData.get('userProfile.name');

  
    if (!validateEmail(email)) {
        alert('Please enter a valid email.');
        return;
    }

    if (!validatePhone(phone)) {
        alert('Please enter a valid phone number (10 digits).');
        return;
    }
    // console.log('userProfile123', userProfile );
    // console.log(' editingUserId', editingUserId);
    
    
    if (!editingUserId && !userProfile) {
        alert('Please upload a profile image.');
        return;
    }

   
    if (editingUserId) {
        
        fetch(`/${editingUserId}`, {
            method: 'PUT', 
            body: formData,
        })
        .then(response =>  response.json())
        .then(user => {
            updateUserInTable(user);  
            editingUserId = null;  
            this.reset(); 
            alert('User updated successfully!');
        })
        .catch(error => console.error('Error:', error));
    } else {
       
        fetch('/', {
            method: 'POST', 
            body: formData,
        })
        .then(response => response.json())
        .then(user => {
            appendUserToTable(user); 
            this.reset(); 
            alert('User created successfully!');
            fetchUsers(currentPage);

        })
        .catch(error => console.error('Error:', error));
    }
});


function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
}

function validatePhone(phone) {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
}


function appendUserToTable(user) {
    const tableBody = document.getElementById('tableBody');
    let newRow = document.createElement('tr');
    newRow.setAttribute('data-id', user._id);  
    newRow.innerHTML = `
        <td><img src="${user.userProfile}" alt="Profile"></td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>
            <button class="edit-btn" onclick="editUser('${user._id}')">Edit</button>
            <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

function editUser(userId) {
    editingUserId = userId;

    fetch(`/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone;
        })
        .catch(error => console.error('Error fetching user data:', error));
}

function updateUserInTable(user) {
    const rowToUpdate = document.querySelector(`tr[data-id="${user._id}"]`);
    if (rowToUpdate) {
        rowToUpdate.innerHTML = `
            <td><img src="${user.userProfile}" alt="Profile"></td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <button class="edit-btn" onclick="editUser('${user._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
    }
}

function deleteUser(userId) {
    fetch(`/${userId}`, { method: 'DELETE' })
    .then(() => {
        document.querySelector(`tr[data-id="${userId}"]`).remove();
        fetchUsers(page);  
    })
    .catch(error => console.error('Error:', error));
}


function fetchUsers(page = 1, search = '') {
    const limit = 5; 
    const url = `/api/users?page=${page}&limit=${limit}&search=${search}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            populateTable(data.users);  
            updatePagination(data.currentPage, data.totalPages, search);  
        })
        .catch(error => console.error('Error fetching users:', error));
}





function populateTable(users) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; 

    users.forEach(user => {
        let newRow = document.createElement('tr');
        newRow.setAttribute('data-id', user._id);
        newRow.innerHTML = `
            <td><img src="${user.userProfile}" alt="Profile"></td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <button class="edit-btn" onclick="editUser('${user._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}


function updatePagination(currentPage, totalPages, search = '') {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; 

   
    if (currentPage > 1) {
        let prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => fetchUsers(currentPage - 1, search);
        paginationContainer.appendChild(prevButton);
    }

   
    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.disabled = true;  
        }
        pageButton.onclick = () => fetchUsers(i, search);
        paginationContainer.appendChild(pageButton);
    }

    
    if (currentPage < totalPages) {
        let nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => fetchUsers(currentPage + 1, search);
        paginationContainer.appendChild(nextButton);
    }
}



document.getElementById('searchButton').addEventListener('click', function () {
    let searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
    fetchUsers(1, searchQuery);  
});

document.getElementById('searchInput').addEventListener('keyup', function () {
    let searchQuery = this.value.trim().toLowerCase();
    fetchUsers(1, searchQuery);  
});

