// State aplikasi
let data = {};
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
        console.log('Data dari data.json:', data); 
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
                    page === 'contact' ? 'Kontak - JD Toys' : 'JD Toys';

    if (page === 'home') {
        renderHome();
    } else if (page === 'about') {
        renderAbout();
    } else if (page === 'contact') {
        renderContact();
    } else {
        content.innerHTML = `
            <div class="container">
                <h2>Halaman Tidak Ditemukan</h2>
                <p>Silakan pilih halaman dari menu navigasi.</p>
            </div>
        `;
    }
}

function renderHome() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="hero-section" id="headline">
            <h1>Hasilkan Kreativitas Anak Anda!</h1>
            <p>Alat belajar inovatif dari JD Toys untuk masa depan cerah anak Anda.</p>
            <a href="https://shopee.co.id/jd_toys?categoryId=100638&entryPoint=ShopByPDP&itemId=3844645299 target="_blank" class="cta-btn">Belanja Sekarang!</a>
        </div>

        <div class="landing-section zigzag">
            <div class="icon">
                <img src="https://img.icons8.com/color/96/000000/product.png" alt="Keunggulan Produk">
            </div>
            <div class="text-content">
                <h2>Kenapa Produk Kami Unggul?</h2>
                <p>Produk kami dirancang khusus untuk anak: ringan, aman, dan nyaman digunakan. Cocok untuk belajar, menggambar, atau bermain kreatif di rumah.</p>
            </div>
        </div>

        <div class="landing-section zigzag reverse">
            <div class="icon">
                <img src="https://img.icons8.com/color/96/family.png" alt="Orang Tua">
            </div>
            <div class="text-content">
                <h2>Nilai Tambah untuk Orang Tua</h2>
                <p>Kami memahami kebutuhan orang tua modern—produk JD Toys mudah dibersihkan, hemat tempat, dan hadir dengan harga ramah di kantong.</p>
            </div>
        </div>

        <div class="landing-section zigzag">
            <div class="icon">
                <img src="https://img.icons8.com/color/96/clock.png" alt="Waktu Terbatas">
            </div>
            <div class="text-content">
                <h2>Jangan Lewatkan Kesempatan Ini!</h2>
                <p>Penawaran ini hanya berlaku dalam waktu terbatas. Stok cepat habis karena banyak peminat. Segera dapatkan sebelum kehabisan!</p>
            </div>
        </div>

        <div class="landing-section zigzag reverse">
            <div class="icon">
                <img src="https://img.icons8.com/color/96/gift.png" alt="Hadiah Khusus">
            </div>
            <div class="text-content">
                <h2>Bonus Eksklusif</h2>
                <p>Dapatkan <strong>Spidol dan Penghapus GRATIS</strong> untuk pembelian prdouk papan tulis kami!</p>
            </div>
        </div>
        <div class="products-section">
            <h2>Produk Terbaik Kami</h2>
            <div class="products">
                ${currentProducts.length > 0 ? currentProducts.map(product => `
                    <div class="product-card">
                        <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}" class="zoomable" onclick="showZoomModal('${product.image || 'https://via.placeholder.com/150'}')">
                        <h3>${product.name}</h3>
                        <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                        <div class="button-group">
                            <button class="detail-btn" onclick="showDetailModal('${product.name}', '${product.image || 'https://via.placeholder.com/150'}', '${product.description}', '${product.price.toLocaleString('id-ID')}')">Lihat Detail</button>
                            <a href="https://shopee.co.id/" target="_blank">Beli Sekarang</a>
                        </div>
                        <span class="badge">Stok Terbatas</span>
                    </div>
                `).join('') : '<p style="text-align: center; color: #777;">Belum ada produk yang tersedia.</p>'}
            </div>
        </div>
        <div class="landing-section zigzag">
            <div class="icon">
                <img src="https://img.icons8.com/color/96/shopping-cart-loaded.png" alt="Ayo Belanja">
            </div>
            <div class="text-content">
                <h2>Siap Belanja Sekarang?</h2>
                <p>Temukan produk terbaik untuk tumbuh kembang anak Anda hanya di JD Toys. Klik tombol di bawah untuk belanja di Shopee!</p>
                <a href="https://shopee.co.id/jd_toys?categoryId=100638&entryPoint=ShopByPDP&itemId=3844645299" target="_blank" class="cta-btn">Beli Sekarang di Shopee!</a>
            </div>
        </div>

        <div class="landing-section zigzag reverse">
            <div class="icon">
                <img src="https://img.icons8.com/color/96/warranty-card.png" alt="Garansi Kami">
            </div>
            <div class="text-content">
                <h2>Garansi Tanpa Risiko</h2>
                <p>Kami memberikan <strong>jaminan uang kembali 100%</strong></p>
            </div>
        </div>
        <div class="landing-section zigzag">
           <div class="icon">
                <img src="https://img.icons8.com/color/96/book.png" alt="note">
            </div>
            <div class="text-content">
                <h2>Kualitas Produk Terjamin dengan Lebih dari 25.000 Review dari Pelanggan Setia Kami!!!</h2>
            </div>
        </div>
        <div class="landing-section zigzag reverse">
           <div class="icon">
                <img src="https://img.icons8.com/color/96/information.png" alt="NB">
            </div>
            <div class="text-content">
                <h2>Tunggu apa lagi? Jangan lewatkan kesempatan anda untuk mempunyai produk dari JDTOYS</h2>
            </div>
        </div>
    `;
}

// Render Halaman Tentang Kami
function renderAbout() {
    const content = document.getElementById('content');
    content.innerHTML = `
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

// Modal Detail dan Zoom
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
