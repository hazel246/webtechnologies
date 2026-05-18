// ═══════════════════════════════════════════════════════════════════════════════
// MAIN.JS - RESPONSIVE NAVIGATION & MOBILE MENU FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════════════════
// 
// This file handles:
// 1. Hamburger menu toggle for mobile devices
// 2. Dropdown menu toggle on mobile
// 3. Menu close on navigation link click
// 4. Window resize handling (reset menu if screen becomes larger)
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
                // Don't close if this is a dropdown toggle
                if (!this.classList.contains('dropdown-toggle')) {
                    hamburgerBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                    
                    // Also close all dropdowns
                    document.querySelectorAll('.nav-item-custom.dropdown-open').forEach(item => {
                        item.classList.remove('dropdown-open');
                    });
                }
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
    
    // [CONCEPT: DROPDOWN LINK CLICK] - Close menu when clicking dropdown items
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close mobile menu after selecting dropdown item
            if (window.innerWidth <= 768) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Close all dropdowns
                document.querySelectorAll('.nav-item-custom.dropdown-open').forEach(item => {
                    item.classList.remove('dropdown-open');
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
    
    console.log('[MAIN.JS] Responsive navigation functionality loaded ✓');
    
});

// ═══════════════════════════════════════════════════════════════════════════════
// SLICK CAROUSEL - PRODUCTS SECTION (from advanced-features.js)
// ═══════════════════════════════════════════════════════════════════════════════

$(document).ready(function() {

  if (typeof $.fn.slick !== 'undefined') {
    try {
      $('.products-carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 500,
        prevArrow: '#prevBtn',
        nextArrow: '#nextBtn',
        pauseOnHover: true,
        responsive: [
          { breakpoint: 99999, settings: { slidesToShow: 3, slidesToScroll: 1 } },
          { breakpoint: 1199,  settings: { slidesToShow: 2, slidesToScroll: 1 } },
          { breakpoint: 768,   settings: { slidesToShow: 1, slidesToScroll: 1 } },
          { breakpoint: 480,   settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
      });

      setTimeout(function() {
        try { $('.products-carousel').slick('slickPlay'); } catch(e) {}
      }, 500);

      function updateSlideCounter() {
        try {
          var slickInstance = $('.products-carousel').slick('getSlick');
          var totalSlides = slickInstance.slideCount;
          var currentSlide = slickInstance.currentSlide + 1;
          $('#slideCounter').text('Showing ' + currentSlide + ' of ' + totalSlides);
        } catch(e) {}
      }

      setTimeout(updateSlideCounter, 100);
      $('.products-carousel').on('afterChange', function() { updateSlideCounter(); });

      $(document).on('mouseenter', '.slick-slide .product-card', function() {
        try { $('.products-carousel').slick('slickPause'); } catch(e) {}
      });
      $(document).on('mouseleave', '.slick-slide .product-card', function() {
        try { $('.products-carousel').slick('slickPlay'); } catch(e) {}
      });

    } catch(error) {
      console.error('[CAROUSEL] Failed to initialize:', error);
    }
  }

  // Smooth scroll for hash links
  $('a[href^="#"]').on('click', function(e) {
    var href = $(this).attr('href');
    if (href !== '#' && href !== '#!' && $(href).length) {
      e.preventDefault();
      var offset = $(href).offset().top - 100;
      $('html, body').animate({ scrollTop: offset }, 800, 'swing');
    }
  });

  // Quote form AJAX
  $('#quoteForm').submit(function(e) {
    e.preventDefault();
    var fullname = $('#quoteName').val().trim();
    var phone = $('#quotePhone').val().trim();
    var email = $('#quoteEmail').val().trim();
    if (!fullname || !phone || !email) {
      $('#errorText').text('Please fill in all required fields');
      $('#quoteErrorMsg').fadeIn();
      return false;
    }
    var $btn = $('#quoteSubmitBtn');
    var originalText = $btn.html();
    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...');
    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts',
      type: 'POST',
      data: $(this).serialize(),
      dataType: 'json',
      success: function() {
        $('#quoteErrorMsg').hide();
        $('#quoteSuccessMsg').slideDown(300);
        $('#quoteForm')[0].reset();
        $btn.prop('disabled', false).html(originalText);
        setTimeout(function() { $('#quoteSuccessMsg').slideUp(300); }, 4000);
      },
      error: function() {
        $('#errorText').text('Submission failed. Please try again.');
        $('#quoteErrorMsg').slideDown(300);
        $btn.prop('disabled', false).html(originalText);
      }
    });
    return false;
  });

});
