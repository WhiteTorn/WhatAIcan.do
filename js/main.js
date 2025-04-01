// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // --- Set Current Date for Last Updated ---
    const lastUpdated = document.getElementById('last-updated');
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    lastUpdated.textContent = 'Last updated: ' + formatter.format(now);
    
    // --- Core Table Functionality ---
    const table = document.getElementById('capabilities-table');
    const tableBody = table.querySelector('tbody');
    const dataRows = Array.from(tableBody.querySelectorAll('tr')).filter(row => !row.querySelector('td.category-header'));
    
    // --- Highlight Best Cells Animation ---
    const bestCells = document.querySelectorAll('.best-cell');
    bestCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            // Add pulsing effect when hovered
            const star = cell.querySelector('.indicator-best');
            if (star) {
                star.style.animation = 'star-pulse 0.8s infinite alternate ease-in-out';
            }
            
            // Highlight the entire row
            const row = cell.closest('tr');
            if (row) {
                row.style.backgroundColor = 'rgba(255, 250, 230, 0.4)';
            }
        });
        
        cell.addEventListener('mouseleave', () => {
            // Reset animations
            const star = cell.querySelector('.indicator-best');
            if (star) {
                star.style.animation = 'star-pulse 2.5s infinite alternate ease-in-out';
            }
            
            // Reset row highlighting
            const row = cell.closest('tr');
            if (row) {
                row.style.backgroundColor = '';
            }
        });
    });

    // --- Apply odd/even classes for zebra striping ---
    function applyOddEvenClasses() {
        let isOdd = true;
        let currentCategory = '';
        
        Array.from(tableBody.querySelectorAll('tr')).forEach(row => {
            // Skip category headers when applying odd/even
            if (row.querySelector('td.category-header')) {
                currentCategory = row.querySelector('td.category-header').textContent.trim();
                isOdd = true; // Reset on new category
                return;
            }
            
            if (row.style.display !== 'none') {
                row.classList.remove('odd-row', 'even-row');
                row.classList.add(isOdd ? 'odd-row' : 'even-row');
                
                // Add data attribute for category and capability
                if (!row.hasAttribute('data-category')) {
                    row.setAttribute('data-category', currentCategory);
                }
                
                if (!row.hasAttribute('data-capability')) {
                    const text = row.querySelector('td:first-child')?.textContent.trim();
                    if (text) row.setAttribute('data-capability', text);
                }
                
                isOdd = !isOdd;
            }
        });
    }

    // Initial setup
    applyOddEvenClasses();
    
    // --- Model Card Animations ---
    const cards = document.querySelectorAll('.model-card');
    
    if (cards.length) {
        const cardObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, entry.target.dataset.index * 100);
                        cardObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.dataset.index = index;
            cardObserver.observe(card);
        });
    }
    
    // --- Table row hover effects ---
    dataRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            // Find the model with the best performance in this row
            const bestCell = row.querySelector('.best-cell');
            if (bestCell) {
                const columnIndex = Array.from(row.cells).indexOf(bestCell);
                const headerCell = table.querySelector(`thead tr th:nth-child(${columnIndex + 1})`);
                
                // Highlight the corresponding header
                if (headerCell) {
                    headerCell.style.transform = 'translateY(-3px)';
                    headerCell.style.boxShadow = '0 6px 12px -3px rgba(0,0,0,0.1)';
                }
            }
        });
        
        row.addEventListener('mouseleave', () => {
            // Reset all header cells
            const headerCells = table.querySelectorAll('thead tr th');
            headerCells.forEach(cell => {
                cell.style.transform = '';
                cell.style.boxShadow = '';
            });
        });
    });
});