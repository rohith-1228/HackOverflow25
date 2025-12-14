document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Gallery Search and Filter Functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchTitle = document.getElementById('search-title');
    const searchCategory = document.getElementById('search-category');
    const searchArea = document.getElementById('search-area');
    const searchDate = document.getElementById('search-date');
    const issueCards = document.querySelectorAll('.col[data-title]');

    searchBtn.addEventListener('click', filterCards);
    searchTitle.addEventListener('input', filterCards);
    searchCategory.addEventListener('change', filterCards);
    searchArea.addEventListener('input', filterCards);
    searchDate.addEventListener('change', filterCards);

    function filterCards() {
        const titleQuery = searchTitle.value.toLowerCase().trim();
        const categoryQuery = searchCategory.value.toLowerCase().trim();
        const areaQuery = searchArea.value.toLowerCase().trim();
        const dateQuery = searchDate.value;

        issueCards.forEach(card => {
            const cardTitle = card.dataset.title.toLowerCase();
            const cardCategory = card.dataset.category.toLowerCase();
            const cardArea = card.dataset.area.toLowerCase();
            const cardDate = card.dataset.date;

            const matchesTitle = cardTitle.includes(titleQuery);
            const matchesCategory = !categoryQuery || cardCategory === categoryQuery;
            const matchesArea = cardArea.includes(areaQuery);
            const matchesDate = !dateQuery || cardDate === dateQuery;

            if (matchesTitle && matchesCategory && matchesArea && matchesDate) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

});