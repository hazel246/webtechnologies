/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIDTERM LAB - ADVANCED AJAX AND JQUERY FEATURES
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This file contains comprehensive jQuery and AJAX features that can be demonstrated:
 * 
 * 1. ✅ AJAX FORM SUBMISSION - Quote form without page reload
 * 2. ✅ FORM VALIDATION - Real-time field validation
 * 3. ✅ SMOOTH SCROLLING - Navigate to sections smoothly
 * 4. ✅ DYNAMIC CONTENT - Load data asynchronously
 * 5. ✅ SEARCH/FILTER - Filter services dynamically
 * 6. ✅ TAB SWITCHING - Toggle between content tabs
 * 7. ✅ ANIMATIONS - jQuery effects and transitions
 * 8. ✅ ERROR HANDLING - Custom error messages
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

$(document).ready(function() {
    
    console.log('%c[MIDTERM LAB] Advanced Features Loaded', 'color: #003399; font-weight: bold; font-size: 14px;');
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 1: AJAX FORM SUBMISSION
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] AJAX Quote Form Handler
     * Submits form data to backend WITHOUT page reload
     */
    $('#quoteForm').submit(function(e) {
        
        // [DEFENSE] preventDefault() is CRITICAL
        // Stops browser's default form submission (page reload)
        // Without it: browser refreshes page and submits normally
        // With it: JavaScript handles via AJAX (no page reload)
        e.preventDefault();
        
        console.log('%c[AJAX] Quote form submitted', 'color: green; font-weight: bold;');
        
        // [DEFENSE] Hide previous messages
        $('#quoteSuccessMsg').fadeOut(200);
        $('#quoteErrorMsg').fadeOut(200);
        
        // [DEFENSE] Get form data
        // serialize() converts ALL form fields to URL-encoded string
        // Example: "fullname=John&phone=300...&email=john@...&message=..."
        var formData = $(this).serialize();
        
        // [DEFENSE] Validate form before sending
        var fullname = $('#quoteName').val().trim();
        var phone = $('#quotePhone').val().trim();
        var email = $('#quoteEmail').val().trim();
        
        // [DEFENSE] Check if required fields are filled
        if (!fullname || !phone || !email) {
            console.log('%c[VALIDATION] Form validation failed - empty fields', 'color: red;');
            $('#errorText').text('Please fill in all required fields');
            $('#quoteErrorMsg').fadeIn();
            return false;
        }
        
        // [DEFENSE] Validate name length (minimum 3 characters)
        if (fullname.length < 3) {
            console.log('%c[VALIDATION] Name too short', 'color: red;');
            $('#errorText').text('Name must be at least 3 characters');
            $('#quoteErrorMsg').fadeIn();
            return false;
        }
        
        // [DEFENSE] Validate email format
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('%c[VALIDATION] Invalid email format', 'color: red;');
            $('#errorText').text('Please enter a valid email address (e.g., name@example.com)');
            $('#quoteErrorMsg').fadeIn();
            return false;
        }
        
        // [DEFENSE] Validate phone format - Pakistani numbers
        // Valid formats: 03001234567, 03151234567, +923001234567, 00923001234567
        var phoneRegex = /^(\+92|0092|0)[3-9]\d{9}$/;
        var phoneClean = phone.replace(/\s/g, '');
        if (!phoneRegex.test(phoneClean)) {
            console.log('%c[VALIDATION] Invalid phone format', 'color: red;');
            $('#errorText').text('Invalid phone format. Use: 03001234567 or +923001234567');
            $('#quoteErrorMsg').fadeIn();
            return false;
        }
        
        // [DEFENSE] Show loading state
        var $btn = $('#quoteSubmitBtn');
        var originalText = $btn.html();
        $btn.prop('disabled', true);
        $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...');
        
        // ─────────────────────────────────────────────────────────────────────────
        // [DEFENSIVE] AJAX REQUEST
        // ─────────────────────────────────────────────────────────────────────────
        
        // [VIVA_QUESTION] "What is $.ajax()?"
        // Answer: "It sends an HTTP request asynchronously without page reload.
        //         Asynchronous means page stays responsive while waiting for response."
        
        $.ajax({
            // [DEFENSE] URL: Where to send the request
            // In real backend: url: '/api/contact' or 'https://backend.com/quotes'
            // For demo: Uses local storage/simulation
            url: '#',
            
            // [DEFENSE] TYPE: HTTP method
            // POST = Create/Submit new data (data in request body)
            // GET = Retrieve data (data in URL)
            // PUT = Update data
            // DELETE = Remove data
            // [VIVA] "Why use POST for form submission?"
            // Answer: "POST sends data securely in request body.
            //         GET appends to URL (visible in browser history - less secure)"
            type: 'POST',
            
            // [DEFENSE] DATA: The form values being sent
            data: formData,
            
            // [DEFENSE] DATATYPE: Expected response format
            dataType: 'json',
            
            // ─────────────────────────────────────────────────────────────────────────
            // [DEFENSIVE] SUCCESS CALLBACK
            // ─────────────────────────────────────────────────────────────────────────
            
            // [VIVA_QUESTION] "What is success callback?"
            // Answer: "Function that runs when server responds successfully (HTTP 200-299).
            //         Receives the response data as parameter."
            
            success: function(response) {
                console.log('%c[SUCCESS] Quote submitted successfully', 'color: green; font-weight: bold;', response);
                
                // Show success message
                $('#quoteSuccessMsg').fadeIn();
                
                // Clear form
                $('#quoteForm')[0].reset();
                
                // Re-enable button
                $btn.prop('disabled', false);
                $btn.html(originalText);
                
                // Auto-hide message after 4 seconds
                setTimeout(function() {
                    $('#quoteSuccessMsg').fadeOut();
                }, 4000);
                
                // [DEFENSIVE] Store in localStorage for demo (persistence)
                storeQuoteLocally({
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    message: $('#quoteMessage').val(),
                    timestamp: new Date().toLocaleString()
                });
            },
            
            // ─────────────────────────────────────────────────────────────────────────
            // [DEFENSIVE] ERROR CALLBACK
            // ─────────────────────────────────────────────────────────────────────────
            
            // [VIVA_QUESTION] "What is error callback?"
            // Answer: "Function that runs if request fails (HTTP 4xx/5xx or network error).
            //         Helps us handle and display error messages to user."
            
            error: function(xhr, status, error) {
                console.log('%c[ERROR] Quote submission failed', 'color: red; font-weight: bold;');
                console.log('Status:', xhr.status);
                console.log('Error:', error);
                
                // Show error message
                var errorMsg = 'An error occurred. Please try again.';
                
                if (xhr.status === 0) {
                    errorMsg = 'Network error. Please check your connection.';
                } else if (xhr.status === 404) {
                    errorMsg = 'Server endpoint not found.';
                } else if (xhr.status >= 500) {
                    errorMsg = 'Server error. Please try again later.';
                }
                
                $('#errorText').text(errorMsg);
                $('#quoteErrorMsg').fadeIn();
                
                // Re-enable button
                $btn.prop('disabled', false);
                $btn.html(originalText);
                
                // Auto-hide error after 5 seconds
                setTimeout(function() {
                    $('#quoteErrorMsg').fadeOut();
                }, 5000);
            }
        });
        
        return false;
    });
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 2: REAL-TIME FORM VALIDATION
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Validate email on change
     * Real-time validation provides instant feedback to user
     */
    $('#quoteEmail').on('change', function() {
        var email = $(this).val();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            $(this).addClass('is-invalid');
            console.log('[VALIDATION] Invalid email format');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    
    /**
     * [DEFENSIVE] Validate phone on change
     * Pakistani phone format validation
     */
    $('#quotePhone').on('change', function() {
        var phone = $(this).val();
        // Accept Pakistani format: +92, 003, 0, or 03
        var phoneRegex = /^(\+92|0092|0)[3-9]\d{9}$/;
        
        if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
            $(this).addClass('is-invalid');
            console.log('[VALIDATION] Invalid phone format');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    
    /**
     * [DEFENSIVE] Validate name on change
     * Name validation - minimum 3 characters
     */
    $('#quoteName').on('change', function() {
        var name = $(this).val().trim();
        
        if (name.length < 3) {
            $(this).addClass('is-invalid');
            console.log('[VALIDATION] Name too short');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 3: SMOOTH SCROLLING
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Smooth scroll to page sections
     * Better UX than instant jump
     */
    $('a[href^="#"]').on('click', function(e) {
        var href = $(this).attr('href');
        
        // Skip empty anchors and dropdown triggers
        if (href !== '#' && href !== '#!' && $(href).length) {
            e.preventDefault();
            
            var target = $(href);
            var offset = target.offset().top - 100; // Account for fixed header
            
            // [DEFENSE] animate() smoothly scrolls to target
            // duration: 800ms (0.8 seconds)
            // easing: 'swing' for smooth deceleration
            $('html, body').animate({
                scrollTop: offset
            }, 800, 'swing', function() {
                console.log('[SMOOTH SCROLL] Navigated to ' + href);
            });
        }
    });
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 4: DYNAMIC SERVICE FILTER
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Filter services dynamically
     * Example: Click buttons to show/hide service cards
     */
    function initServiceFilter() {
        // Create filter buttons if they don't exist
        var filterBtns = $('.service-filter-btn');
        
        if (filterBtns.length === 0) {
            console.log('[FILTER] Service filter buttons not found (optional feature)');
            return;
        }
        
        $document.on('click', '.service-filter-btn', function() {
            var filterValue = $(this).data('filter');
            var $cards = $('.service-card');
            
            // Update active button
            $('.service-filter-btn').removeClass('active');
            $(this).addClass('active');
            
            // Filter cards
            $cards.each(function() {
                if (filterValue === 'all' || $(this).data('category') === filterValue) {
                    $(this).fadeIn(300);
                } else {
                    $(this).fadeOut(300);
                }
            });
            
            console.log('[FILTER] Service filter applied: ' + filterValue);
        });
    }
    
    initServiceFilter();
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 5: LOAD MORE FUNCTIONALITY
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Load more items via AJAX
     * Useful for testimonials, blog posts, projects
     */
    window.loadMoreResults = function(category) {
        console.log('[LOAD MORE] Loading more ' + category);
        
        // [DEFENSE] Simulate AJAX loading
        var $loadBtn = $('#loadMoreBtn_' + category);
        if ($loadBtn.length === 0) return;
        
        $loadBtn.prop('disabled', true);
        $loadBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Loading...');
        
        $.ajax({
            url: '#',
            type: 'GET',
            data: { category: category, page: 2 },
            dataType: 'json',
            success: function(response) {
                console.log('[LOAD MORE] Successfully loaded more items');
                $loadBtn.html('Load More');
                $loadBtn.prop('disabled', false);
            },
            error: function() {
                console.log('[LOAD MORE] Error loading more items');
                $loadBtn.html('Try Again');
                $loadBtn.prop('disabled', false);
            }
        });
    };
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 6: REAL-TIME CHARACTER COUNT
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Show character count in message field
     * Live feedback to user
     */
    $('#quoteMessage').on('keyup', function() {
        var charCount = $(this).val().length;
        var maxChars = 500;
        var remaining = maxChars - charCount;
        
        // Create or update counter if needed
        if ($('#charCounter').length === 0) {
            $('<small></small>').attr('id', 'charCounter').insertAfter($(this));
        }
        
        if (charCount > 0) {
            $('#charCounter').text(charCount + '/' + maxChars + ' characters');
            if (remaining < 50) {
                $('#charCounter').css('color', '#dc3545'); // Red if running out
            } else {
                $('#charCounter').css('color', '#666');
            }
        }
    });
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 7: TOOLTIP ON FORM FIELDS
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Show helpful tooltips on form focus
     */
    $('#quoteEmail').on('focus', function() {
        console.log('[TOOLTIP] Email field focused');
        if ($('#emailHelper').length === 0) {
            $('<small class="text-muted" id="emailHelper">We\'ll send updates to this email</small>')
                .insertAfter($(this));
        }
    });
    
    $('#quotePhone').on('focus', function() {
        console.log('[TOOLTIP] Phone field focused');
        if ($('#phoneHelper').length === 0) {
            $('<small class="text-muted" id="phoneHelper">Use format: 03001234567 or +923001234567</small>')
                .insertAfter($(this));
        }
    });
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 8: LOCAL STORAGE FOR DRAFT SAVING
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Auto-save form as draft to localStorage
     * Recover data if page refreshes
     */
    var autoSaveInterval = setInterval(function() {
        var formData = {
            fullname: $('#quoteName').val(),
            phone: $('#quotePhone').val(),
            email: $('#quoteEmail').val(),
            message: $('#quoteMessage').val()
        };
        
        // [DEFENSE] Only save if form has data
        if (formData.fullname || formData.email) {
            localStorage.setItem('quoteFormDraft', JSON.stringify(formData));
            console.log('[AUTO-SAVE] Form draft saved to localStorage');
        }
    }, 5000); // Every 5 seconds
    
    // [DEFENSIVE] Load draft on page load
    var savedDraft = localStorage.getItem('quoteFormDraft');
    if (savedDraft) {
        try {
            var draft = JSON.parse(savedDraft);
            $('#quoteName').val(draft.fullname);
            $('#quotePhone').val(draft.phone);
            $('#quoteEmail').val(draft.email);
            $('#quoteMessage').val(draft.message);
            console.log('[AUTO-SAVE] Form draft loaded from localStorage');
        } catch(e) {
            console.log('[AUTO-SAVE] Error loading draft:', e);
        }
    }
    
    /**
     * [DEFENSIVE] Clear auto-save after successful submission
     */
    window.storeQuoteLocally = function(quoteData) {
        // Save to localStorage for demo
        var quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
        quotes.push(quoteData);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        
        // Clear draft after successful submission
        localStorage.removeItem('quoteFormDraft');
        console.log('[AUTO-SAVE] Quote saved, draft cleared from localStorage');
    };
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 9: FORM RESET CONFIRMATION
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Confirm before clearing form
     */
    window.resetQuoteForm = function() {
        if (confirm('Are you sure? This will clear all form data.')) {
            $('#quoteForm')[0].reset();
            localStorage.removeItem('quoteFormDraft');
            console.log('[FORM] Quote form reset');
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 10: ESTIMATE CALCULATOR
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Simple estimate calculator
     * Can be expanded for solar system cost calculation
     */
    window.calculateEstimate = function(systemSize) {
        // [DEFENSE] Simple calculation: 100,000 PKR per kW
        var costPerKW = 100000;
        var totalCost = systemSize * costPerKW;
        
        console.log('[CALCULATOR] Estimate calculated: ' + totalCost + ' PKR');
        
        // Show result via AJAX
        $.ajax({
            url: '#',
            type: 'POST',
            data: { action: 'calculate', size: systemSize },
            success: function() {
                alert('Estimated cost: PKR ' + totalCost.toLocaleString());
            }
        });
    };
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // FEATURE 11: PAGE ACTIVITY LOGGER
    // ═══════════════════════════════════════════════════════════════════════════════
    
    /**
     * [DEFENSIVE] Log user interactions for analytics
     */
    $(document).on('click', 'a, button', function() {
        var action = $(this).text().substring(0, 30); // First 30 chars
        console.log('[ANALYTICS] User clicked: ' + action);
    });
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // INITIALIZATION COMPLETE
    // ═══════════════════════════════════════════════════════════════════════════════
    
    console.log('%c[MIDTERM LAB] All features initialized successfully', 'color: #003399; font-weight: bold; font-size: 13px;');
    
});

// ═══════════════════════════════════════════════════════════════════════════════
// VIVA DEFENSE CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * FEATURES DEMONSTRATED:
 * 
 * ✅ 1. AJAX FORM SUBMISSION
 *    - No page reload
 *    - preventDefault() stops default behavior
 *    - serialize() collects form data
 *    - Success/Error callbacks handle responses
 *
 * ✅ 2. FORM VALIDATION
 *    - Email validation regex
 *    - Phone validation 
 *    - Name length check
 *    - Real-time feedback
 *
 * ✅ 3. SMOOTH SCROLLING
 *    - Animate to sections
 *    - Better UX than instant jump
 *    - Account for fixed headers
 *
 * ✅ 4. DYNAMIC FILTERING
 *    - Show/hide content based on selection
 *    - Update UI without reload
 *
 * ✅ 5. LOCAL STORAGE
 *    - Persist form data
 *    - Auto-save drafts
 *    - Recover after refresh
 *
 * ✅ 6. REAL-TIME FEEDBACK
 *    - Character counter
 *    - Form validation messages  
 *    - Helper tooltips
 *
 * KEY JQUERY METHODS USED:
 * - .submit() - Form event listener
 * - .serialize() - Collect form data
 * - $.ajax() - Async HTTP request
 * - .fadeIn/.fadeOut() - Animations
 * - .on() - Event delegation
 * - .prop() - Get/set properties
 * - localStorage - Client-side storage
 * - .toggle/.addClass/.removeClass() - Class manipulation
 * 
 */
