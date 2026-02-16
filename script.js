/* ==========================================
   Nano Banana Prompt Gallery - script.js
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- ダークモードトグル ---
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleIcon(next);
    });

    function updateToggleIcon(theme) {
        const icon = themeToggle.querySelector('.theme-toggle-icon');
        const label = themeToggle.querySelector('.theme-toggle-label');
        if (theme === 'dark') {
            icon.textContent = '☀️';
            label.textContent = 'ライト';
        } else {
            icon.textContent = '🌙';
            label.textContent = 'ダーク';
        }
    }

    // --- コピー機能 ---
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            const code = card.querySelector('code');
            const text = code.textContent;

            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '✅ コピーしました！';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋 プロンプトをコピー';
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // フォールバック
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                btn.textContent = '✅ コピーしました！';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋 プロンプトをコピー';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // --- ライトボックス（画像ポップアップ） ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    // 画像クリックで開く
    document.querySelectorAll('.card-image-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const img = wrapper.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // ✕ボタンで閉じる
    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    // 画像外クリックで閉じる
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // --- カテゴリフィルター ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    const noResults = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });

    // --- テキスト検索 ---
    searchInput.addEventListener('input', () => {
        applyFilters();
    });

    function applyFilters() {
        const activeFilter = document.querySelector('.filter-btn.active');
        const category = activeFilter ? activeFilter.dataset.category : 'all';
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
            const cardCategory = card.dataset.category;
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const prompt = card.querySelector('code').textContent.toLowerCase();

            const matchCategory = category === 'all' || cardCategory === category;
            const matchSearch = query === '' || title.includes(query) || prompt.includes(query);

            if (matchCategory && matchSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // 結果なし表示
        if (visibleCount === 0) {
            noResults.classList.add('visible');
        } else {
            noResults.classList.remove('visible');
        }
    }
});
