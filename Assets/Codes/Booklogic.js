document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua halaman konten dari 'content-store'
    const allContentPages = Array.from(document.querySelectorAll('#content-store .page-content'));
    
    // Ambil elemen buku yang terlihat
    const leftPage = document.querySelector('.page.left');
    const rightPage = document.querySelector('.page.right');
    const leftPageContent = leftPage.querySelector('.content-area');
    const rightPageContent = rightPage.querySelector('.content-area');
    const leftPageNum = leftPage.querySelector('.page-number');
    const rightPageNum = rightPage.querySelector('.page-number');
    
    // Ambil tombol navigasi
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    let currentPageIndex = 0; // Ini adalah indeks untuk halaman KIRI

    const isMobile = () => window.innerWidth <= 900;

    // --- Logika yang Direvisi untuk Halaman Sampul ---
    // Kita akan tukar posisi Halaman 0 (Sampul) dan Halaman 1 (Kosong)
    const coverPage = allContentPages[0];
    const blankPage = allContentPages[1];
    allContentPages[0] = blankPage;
    allContentPages[1] = coverPage;
    
    // Sekarang Indeks 0 = Kiri Kosong, Indeks 1 = Kanan Sampul.
    // Di mobile, kita akan mulai dari Indeks 1 (Sampul) agar sampul langsung terlihat.
    if (isMobile()) {
        currentPageIndex = 1; 
    }

    function updateBookView() {
        const mobileView = isMobile();
        
        if (mobileView) {
            // --- TAMPILAN MOBILE (1 Halaman) ---
            
            // Sembunyikan halaman kanan
            rightPage.style.display = 'none';
            
            // Muat konten ke halaman kiri
            const content = allContentPages[currentPageIndex];
            if (content) {
                leftPageContent.innerHTML = content.innerHTML;
                leftPage.className = `page left ${content.dataset.pageType || ''}`;
                // Hitung nomor halaman yang ditampilkan
                const pageNum = (content.classList.contains('blank-page') || content.classList.contains('cover-page')) ? '' : `${currentPageIndex - 1}`; // -1 karena 0 & 1 adalah sampul
                leftPageNum.textContent = pageNum;
            } else {
                leftPageContent.innerHTML = '';
                leftPageNum.textContent = '';
            }
            
            // Atur status tombol
            prevBtn.disabled = (currentPageIndex === 1); // Indeks 1 adalah halaman sampul (awal)
            nextBtn.disabled = (currentPageIndex >= allContentPages.length - 1);

        } else {
            // --- TAMPILAN DESKTOP (2 Halaman) ---
            
            // Tampilkan kembali halaman kanan
            rightPage.style.display = 'block';

            // Muat konten halaman KIRI (indeks saat ini)
            const leftContent = allContentPages[currentPageIndex];
            if (leftContent) {
                leftPageContent.innerHTML = leftContent.innerHTML;
                leftPage.className = `page left ${leftContent.dataset.pageType || ''}`;
                // Hitung nomor halaman KIRI
                const leftNum = (leftContent.classList.contains('blank-page') || leftContent.classList.contains('cover-page')) ? '' : `${currentPageIndex - 1}`;
                leftPageNum.textContent = leftNum;
            } else {
                leftPageContent.innerHTML = '';
                leftPageNum.textContent = '';
            }

            // Muat konten halaman KANAN (indeks + 1)
            const rightContent = allContentPages[currentPageIndex + 1];
            if (rightContent) {
                rightPageContent.innerHTML = rightContent.innerHTML;
                rightPage.className = `page right ${rightContent.dataset.pageType || ''}`;
                // Hitung nomor halaman KANAN
                const rightNum = (rightContent.classList.contains('blank-page') || rightContent.classList.contains('cover-page')) ? '' : `${currentPageIndex + 1 - 1}`;
                rightPageNum.textContent = rightNum;
            } else {
                rightPageContent.innerHTML = '';
                rightPageNum.textContent = '';
            }

            // Atur status tombol
            prevBtn.disabled = (currentPageIndex === 0);
            nextBtn.disabled = (currentPageIndex + 2 >= allContentPages.length);
        }
    }

    // --- Event Listeners ---

    prevBtn.addEventListener('click', () => {
        const step = isMobile() ? 1 : 2;
        if (currentPageIndex - step >= 0) {
            currentPageIndex -= step;
            updateBookView();
            // Scroll ke atas halaman saat membalik
            leftPage.scrollTop = 0;
            rightPage.scrollTop = 0;
        }
    });

    nextBtn.addEventListener('click', () => {
        const step = isMobile() ? 1 : 2;
        if (currentPageIndex + step < allContentPages.length) {
            currentPageIndex += step;
            updateBookView();
            // Scroll ke atas halaman saat membalik
            leftPage.scrollTop = 0;
            rightPage.scrollTop = 0;
        }
    });

    // Update tampilan jika ukuran window berubah (misal: rotasi HP)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateBookView, 100);
    });

    // Tampilkan halaman pertama saat dimuat
    updateBookView();
});
