// ═══════════════════════════════════════════════════════════════════════════════
// ASSIGNMENT 2: RESPONSIVE HAMBURGER MENU (Vanilla JavaScript)
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    
    // [CONCEPT: DOM MANIPULATION] - Get references to hamburger button and menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link-custom');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // [CONCEPT: EVENT LISTENERS] - Toggle menu visibility when hamburger is clicked
    hamburgerBtn.addEventListener('click', function() {
        // [CONCEPT: CLASS MANIPULATION] - Toggle 'active' class for animations
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // [CONCEPT: EVENT LISTENERS] - Close menu when a navigation link is clicked (Bonus Feature)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Only close menu on mobile devices (when menu exists as overlay)
            if (window.innerWidth <= 768) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // [CONCEPT: MOBILE DROPDOWN HANDLING] - Handle dropdown menus on mobile devices
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Only handle dropdowns on mobile devices
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Prevent link navigation
                
                // [CONCEPT: PARENT ELEMENT NAVIGATION] - Get the parent list item
                const parentItem = toggle.closest('.nav-item-custom');
                
                // [CONCEPT: CLASS MANIPULATION] - Toggle dropdown open state
                parentItem.classList.toggle('dropdown-open');
                
                // [CONCEPT: SIBLING ELEMENTS] - Close other open dropdowns
                document.querySelectorAll('.nav-item-custom.dropdown-open').forEach(item => {
                    if (item !== parentItem) {
                        item.classList.remove('dropdown-open');
                    }
                });
            }
        });
    });
    
    // [CONCEPT: HANDLE WINDOW RESIZE] - Reset menu when resizing from mobile to desktop
    window.addEventListener('resize', function() {
        // [CONCEPT: CONDITIONAL LOGIC] - Close mobile menu when screen becomes larger
        if (window.innerWidth > 768) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            
            // [CONCEPT: ELEMENT ITERATION] - Reset all dropdown states
            document.querySelectorAll('.nav-item-custom.dropdown-open').forEach(item => {
                item.classList.remove('dropdown-open');
            });
        }
    });
    
});
