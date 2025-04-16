// State aplikasi
let data = {};
let isAdmin = false;
let currentProducts = [];

// Muat data JSON
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        data = json;
        console.log('Data dari data.json:', data); // Debugging: Lihat isi data
        currentProducts = [...data.products];
        init();
    })
    .catch(error => {
        console.error('Gagal memuat data:', error);
        // Tampilkan pesan error di UI
        document.getElementById('content').innerHTML = `
            <div class="container">
                <h2>Error</h2>
                <p>Gagal memuat data: ${error.message}</p>
            </div>
        `;
    });

// Inisialisasi
function init() {
    // Tangani navigasi
    window.addEventListener('hashchange', navigate);
    navigate();

    // Validasi form login
    document.addEventListener('submit', e => {
        if (e.target.id === 'login_form') {
            e.preventDefault();
            handleLogin();
        } else if (e.target.id === 'add_form') {
            e.preventDefault();
            handleAddProduct();
        } else if (e.target.id === 'edit_form') {
            e.preventDefault();
            handleEditProduct();
        }
    });

    // Toggle hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Navigasi
function navigate() {
    const page = window.location.hash.slice(1) || 'home';
    const content = document.getElementById('content');
    document.title = page === 'home' ? 'JD Toys - Belanja Papan Tulis & Meja Belajar' :
                    page === 'about' ? 'Tentang Kami - JD Toys' :
                    page === 'admin' ? 'Admin - JD Toys' :
                    page === 'login' ? 'Login - JD Toys' : 'JD Toys';

    if (page === 'home') {
        renderHome();
    } else if (page === 'about') {
        renderAbout();
    } else if (page === 'admin') {
        if (isAdmin) {
            renderAdmin();
        } else {
            window.location.hash = '#login';
            renderLogin();
        }
    } else if (page === 'login') {
        renderLogin();
    } else {
        content.innerHTML = `
            <div class="container">
                <h2>Halaman Tidak Ditemukan</h2>
                <p>Silakan pilih halaman dari menu navigasi.</p>
            </div>
        `;
    }
}

// Render Halaman Utama
function renderHome() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <header>
            <i class="fas fa-pen silhouette pen"></i>
            <i class="fas fa-pencil-alt silhouette pencil"></i>
            <i class="fas fa-book silhouette book"></i>
            <i class="fas fa-ruler silhouette ruler"></i>
            <h1>JD TOYS</h1>
            <p>Papan Tulis dan Meja Belajar Berkualitas untuk Anda</p>
        </header>
        <div class="container">
            <h2 style="text-align: center; color: #0073e6; font-size: 2em; margin-bottom: 30px;">Produk Kami</h2>
            <div class="products">
                ${currentProducts.length > 0 ? currentProducts.map(product => `
                    <div class="product-card">
                        <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}" class="zoomable" onclick="showZoomModal('${product.image || 'https://via.placeholder.com/150'}')">
                        <h3>${product.name}</h3>
                        <p>Rp ${product.price.toLocaleString('id-ID')}</p>
                        <div class="button-group">
                            <button class="detail-btn" onclick="showDetailModal('${product.name}', '${product.image || 'https://via.placeholder.com/150'}', '${product.description}', '${product.price.toLocaleString('id-ID')}')">Detail</button>
                        </div>
                    </div>
                `).join('') : '<p style="text-align: center; color: #777;">Belum ada produk yang tersedia.</p>'}
            </div>
        </div>
    `;
}

// Render Halaman Tentang Kami
function renderAbout() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="hero">
            <div>
                <h1>Tentang JD Toys</h1>
                <p>Mendukung Pendidikan dengan Produk Inovatif dan Berkualitas</p>
            </div>
        </div>
        <div class="about-container">
            <div class="about-content">
                <h2>Kami Adalah JD Toys</h2>
                <p>JD Toys adalah UMKM yang berdedikasi untuk menyediakan peralatan belajar terbaik seperti papan tulis, meja belajar, dan produk pendukung lainnya. Didirikan pada tahun 2021, kami berkomitmen untuk menciptakan lingkungan belajar yang nyaman dan inspiratif bagi anak-anak dan pelajar di seluruh Indonesia.</p>
            </div>
            <div class="features">
                <div class="feature-card">
                    <i class="fas fa-chalkboard"></i>
                    <h3>Papan Tulis Berkualitas</h3>
                    <p>Kami menawarkan papan tulis dalam berbagai ukuran, dirancang untuk mendukung kreativitas dan pembelajaran.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-chair"></i>
                    <h3>Meja Belajar Ergonomis</h3>
                    <p>Meja belajar kami dirancang untuk kenyamanan dan produktivitas, cocok untuk segala usia.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-lightbulb"></i>
                    <h3>Inovasi Pendidikan</h3>
                    <p>Kami terus berinovasi untuk menghadirkan produk yang mendukung pendidikan modern.</p>
                </div>
            </div>
        </div>
    `;
}

// Render Halaman Login
function renderLogin() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="container narrow">
            <h2>Login Admin</h2>
            <p id="login_error" class="error" style="display: none;"></p>
            <form id="login_form">
                <label for="username">Username</label>
                <input type="text" id="username" placeholder="Masukkan username" required>
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Masukkan password" required>
                <button type="submit" id="login_button" disabled>Login</button>
            </form>
        </div>
    `;
    // Validasi form login
    const form = document.getElementById('login_form');
    const button = document.getElementById('login_button');
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            button.disabled = ![...inputs].every(i => i.value.trim());
        });
    });
}

// Render Halaman Admin
function renderAdmin() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <main>
            <div class="container">
                <div class="header-admin">
                    <h2>Admin Panel - JD Toys</h2>
                    <a href="#home" class="logout-btn" onclick="logout()">Logout</a>
                </div>
                <form id="add_form">
                    <label for="name">Nama Produk</label>
                    <input type="text" id="name" placeholder="Masukkan nama produk" required>
                    <label for="price">Harga (Rp)</label>
                    <input type="number" id="price" placeholder="Masukkan harga" required>
                    <label for="description">Deskripsi</label>
                    <textarea id="description" placeholder="Masukkan deskripsi produk" required></textarea>
                    <label for="image">Gambar (Opsional)</label>
                    <input type="file" id="image" accept="image/*">
                    <button type="submit" id="add_button" disabled>Tambah Produk</button>
                </form>
                <table>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Deskripsi</th>
                        <th>Gambar</th>
                        <th>Aksi</th>
                    </tr>
                    ${currentProducts.map((product, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${product.name}</td>
                            <td>Rp ${product.price.toLocaleString('id-ID')}</td>
                            <td>${product.description}</td>
                            <td><img src="${product.image || 'https://via.placeholder.com/50'}" width="50" alt="Product Image"></td>
                            <td>
                                <button class="edit-btn" onclick="showEditForm(${product.id}, '${product.name}', ${product.price}, '${product.description}', '${product.image || ''}')">Edit</button>
                                <button class="delete-btn" onclick="deleteProduct(${product.id})">Hapus</button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        </main>
    `;
    // Validasi form tambah produk
    const addForm = document.getElementById('add_form');
    const addButton = document.getElementById('add_button');
    const addInputs = addForm.querySelectorAll('input:not([type="file"]), textarea');
    addInputs.forEach(input => {
        input.addEventListener('input', () => {
            addButton.disabled = ![...addInputs].every(i => i.value.trim());
        });
    });
}

// Login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('login_error');
    const hashedPassword = sha1(password);
    console.log('Username:', username); // Debugging
    console.log('Password:', password); // Debugging
    console.log('Hashed Password:', hashedPassword); // Debugging
    console.log('Admins:', data.admins); // Debugging
    const admin = data.admins.find(a => a.username === username && a.password === hashedPassword);
    if (admin) {
        isAdmin = true;
        window.location.hash = '#admin';
    } else {
        error.textContent = 'Username atau password salah.';
        error.style.display = 'block';
    }
}

// Logout
function logout() {
    isAdmin = false;
    window.location.hash = '#home';
}

// Tambah Produk
function handleAddProduct() {
    const name = document.getElementById('name').value;
    const price = parseInt(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    const fileInput = document.getElementById('image');
    const newId = Math.max(...currentProducts.map(p => p.id), 0) + 1;
    const newProduct = { id: newId, name, price, description, image: '' };

    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = e => {
            newProduct.image = e.target.result; // Base64 untuk preview
            currentProducts.push(newProduct);
            renderAdmin();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        currentProducts.push(newProduct);
        renderAdmin();
    }
    document.getElementById('add_form').reset();
}

// Edit Produk
function showEditForm(id, name, price, description, image) {
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_name').value = name;
    document.getElementById('edit_price').value = price;
    document.getElementById('edit_description').value = description;
    document.getElementById('edit_current_image').value = image;
    document.getElementById('current_image').innerHTML = image ? `<img src="${image}" width="100" alt="Current Image" style="max-width: 100px; max-height: 100px;">` : 'Tidak ada gambar';
    document.getElementById('current_file_name').textContent = image ? `File sebelumnya: ${image.split('/').pop()}` : 'Tidak ada file sebelumnya';
    document.getElementById('edit_modal').style.display = 'flex';

    // Validasi form edit
    const editForm = document.getElementById('edit_form');
    const editButton = editForm.querySelector('button[type="submit"]');
    const editInputs = editForm.querySelectorAll('input:not([type="file"]), textarea');
    editInputs.forEach(input => {
        input.addEventListener('input', () => {
            editButton.disabled = ![...editInputs].every(i => i.value.trim());
        });
    });
}

function closeEditForm() {
    document.getElementById('edit_modal').style.display = 'none';
    document.getElementById('current_image').innerHTML = '';
    document.getElementById('current_file_name').textContent = '';
}

function handleEditProduct() {
    const id = parseInt(document.getElementById('edit_id').value);
    const name = document.getElementById('edit_name').value;
    const price = parseInt(document.getElementById('edit_price').value);
    const description = document.getElementById('edit_description').value;
    const fileInput = document.getElementById('edit_image');
    let image = document.getElementById('edit_current_image').value;

    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = e => {
            image = e.target.result;
            updateProduct(id, name, price, description, image);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        updateProduct(id, name, price, description, image);
    }
}

function updateProduct(id, name, price, description, image) {
    const index = currentProducts.findIndex(p => p.id === id);
    if (index !== -1) {
        currentProducts[index] = { id, name, price, description, image };
        closeEditForm();
        renderAdmin();
    }
}

// Hapus Produk
function deleteProduct(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        currentProducts = currentProducts.filter(p => p.id !== id);
        renderAdmin();
    }
}

// Modal Detail dan Zoom (dari script-index.js)
function showDetailModal(name, image, description, price) {
    document.getElementById('modal_name').innerText = name;
    document.getElementById('modal_image').src = image;
    document.getElementById('modal_description').innerText = description;
    document.getElementById('modal_price').innerText = `Rp ${price}`;
    document.getElementById('detail_modal').style.display = 'flex';
}

function closeDetailModal() {
    document.getElementById('detail_modal').style.display = 'none';
}

function showZoomModal(image) {
    document.getElementById('zoom_image').src = image;
    document.getElementById('zoom_modal').style.display = 'flex';
}

function closeZoomModal() {
    document.getElementById('zoom_modal').style.display = 'none';
}

// Fungsi SHA-1 sederhana (untuk demo, tidak aman untuk produksi)
function sha1(str) {
    // Catatan: Ini adalah implementasi sederhana untuk demo.
    // Dalam produksi, gunakan library seperti CryptoJS.
    // Untuk contoh ini, kita asumsikan password "123" menghasilkan hash yang sesuai.
    if (str === '123') return '40bd001563085fc35165329ea1ff5c5ecbdbbeef';
    return '';
}
