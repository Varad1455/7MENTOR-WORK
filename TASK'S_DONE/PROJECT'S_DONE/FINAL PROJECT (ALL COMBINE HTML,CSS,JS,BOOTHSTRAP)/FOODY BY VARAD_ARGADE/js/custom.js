// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

// isotope js
$(window).on('load', function () {
    $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        })
    });

    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    })
});

// nice select
$(document).ready(function() {
    $('select').niceSelect();
});

/** google_map js **/
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(18.5204, 73.8567),
        zoom: 15,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    
    // Add marker for Pune location
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(18.5204, 73.8567),
        map: map,
        title: 'Foody Restaurant - Pune, Maharashtra'
    });
}

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 0,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        1000: {
            items: 2
        }
    }
});

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init('YOUR_PUBLIC_KEY');
}

// Cart functionality
let cart = [];
let isLoggedIn = false;
let userProfilePic = null;

function addToCart(name, price, image) {
    if (!checkAuth()) return;
    
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    
    localStorage.setItem('foodyCart', JSON.stringify(cart));
    updateCartUI();
    showAddedToCartMessage(name);
}

function removeFromCart(name) {
    if (!checkAuth()) return;
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('foodyCart', JSON.stringify(cart));
    updateCartUI();
}

function updateQuantity(name, quantity) {
    if (!checkAuth()) return;
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = Math.max(1, quantity);
        localStorage.setItem('foodyCart', JSON.stringify(cart));
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartItemsDisplay = document.getElementById('cartItemsDisplay');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) {
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
            cartCount.textContent = totalItems;
        } else {
            cartCount.style.display = 'none';
        }
    }
    
    const cartHTML = cart.length === 0 ? '<p>Your cart is empty</p>' : 
        cart.map(item => `
            <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0;">${item.name}</h4>
                    <p style="margin: 0; color: #666;">₹${item.price}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="updateQuantity('${item.name}', ${item.quantity - 1})" style="background: #ddd; border: none; width: 30px; height: 30px; border-radius: 3px; cursor: pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', ${item.quantity + 1})" style="background: #ddd; border: none; width: 30px; height: 30px; border-radius: 3px; cursor: pointer;">+</button>
                    <button onclick="removeFromCart('${item.name}')" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">Remove</button>
                </div>
            </div>
        `).join('');
    
    if (cartItems) {
        cartItems.innerHTML = cartHTML;
    }
    
    if (cartItemsDisplay) {
        cartItemsDisplay.innerHTML = cart.length === 0 ? 
            '<p style="text-align: center; color: #666; font-size: 18px; margin-top: 100px;">Your cart is empty. Add some delicious items from our menu!</p>' :
            cartHTML + `<div style="border-top: 2px solid #ffbe33; padding-top: 15px; margin-top: 15px; text-align: center;"><h3>Total: ₹${totalPrice.toFixed(2)}</h3></div>`;
    }
    
    if (cartTotal) {
        cartTotal.textContent = totalPrice.toFixed(2);
    }
}

function toggleCart() {
    if (!checkAuth()) return;
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    }
}

function showAddedToCartMessage(itemName) {
    const message = document.createElement('div');
    message.innerHTML = `${itemName} added to cart!`;
    message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px; border-radius: 5px; z-index: 1001; animation: slideIn 0.3s ease;';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
}

function checkout() {
    if (!checkAuth()) return;
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'payment.html';
}

// Authentication system
function checkAuth() {
    if (!isLoggedIn) {
        window.location.href = 'index.html?login=true';
        return false;
    }
    return true;
}

function handleUserClick() {
    if (isLoggedIn) {
        toggleUserDropdown();
    } else {
        showLogin();
        toggleAuthModal();
    }
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
    }
}

function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    }
}

function toggleLoginModal() {
    toggleAuthModal();
}

function previewProfilePic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userProfilePic = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
        // Check if user exists in localStorage
        const storedUser = localStorage.getItem('foodyUser');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.email === email && userData.password === password) {
                isLoggedIn = true;
                userProfilePic = userData.profilePic;
                localStorage.setItem('foodyLoginState', 'true');
                updateUserDisplay();
                showNotification(`Welcome back ${userData.name}!`, 'success');
                toggleAuthModal();
                
                // Reset form
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
                document.getElementById('profilePicInput').value = '';
                return false;
            } else {
                showNotification('Invalid email or password!', 'info');
                return false;
            }
        } else {
            // No account exists, redirect to signup
            showNotification('No account found! Please create an account first.', 'info');
            showSignup();
            return false;
        }
    }
    return false;
}

function updateUserDisplay() {
    const profilePic = document.getElementById('profilePic');
    const userIcon = document.getElementById('userIcon');
    
    if (profilePic && userIcon) {
        if (userProfilePic) {
            profilePic.src = userProfilePic;
            profilePic.style.display = 'block';
            userIcon.style.display = 'none';
        } else {
            userIcon.className = 'fa fa-user-circle';
        }
    }
}

function showUserMenu() {
    const choice = prompt('Select option:\n1. View Profile\n2. My Orders\n3. Settings\n4. Logout');
    
    switch(choice) {
        case '1':
            showNotification('Profile feature coming soon!', 'info');
            break;
        case '2':
            showNotification('Orders feature coming soon!', 'info');
            break;
        case '3':
            showNotification('Settings feature coming soon!', 'info');
            break;
        case '4':
            logout();
            break;
    }
}

function logout() {
    isLoggedIn = false;
    userProfilePic = null;
    localStorage.setItem('foodyLoginState', 'false');
    const profilePic = document.getElementById('profilePic');
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    
    if (profilePic && userIcon) {
        profilePic.style.display = 'none';
        userIcon.style.display = 'block';
        userIcon.className = 'fa fa-user';
    }
    if (userDropdown) {
        userDropdown.style.display = 'none';
    }
    showNotification('Logged out successfully', 'success');
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Sign Up for Foody';
}

function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Login to Foody';
}

function previewSignupPic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userProfilePic = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'info');
        return false;
    }
    
    if (name && email && phone && password) {
        // Store user data in localStorage
        const userData = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            profilePic: userProfilePic
        };
        localStorage.setItem('foodyUser', JSON.stringify(userData));
        localStorage.setItem('foodyLoginState', 'true');
        
        isLoggedIn = true;
        updateUserDisplay();
        showNotification(`Welcome ${name}! Account created successfully`, 'success');
        toggleAuthModal();
        
        // Reset form
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPhone').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('signupProfilePic').value = '';
    }
    return false;
}

function checkAuthAndRedirect(event) {
    if (!checkAuth()) {
        event.preventDefault();
        return false;
    }
    return true;
}

// Search functionality
function toggleSearchDropdown() {
    const dropdown = document.getElementById('searchDropdown');
    if (dropdown) {
        const isActive = dropdown.classList.contains('active');
        
        if (isActive) {
            dropdown.classList.remove('active');
        } else {
            dropdown.classList.add('active');
            setTimeout(() => {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    }
}

function performSearch(event) {
    event.preventDefault();
    if (!checkAuth()) return false;
    
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm) {
        window.location.href = `menu.html?search=${encodeURIComponent(searchTerm)}`;
    }
    return false;
}

// Booking functionality
function bookTable(event) {
    event.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('phoneNumber').value;
    const email = document.getElementById('customerEmail').value;
    const persons = document.getElementById('persons').value;
    const date = document.getElementById('bookingDate').value;
    
    if (!name || !phone || !email || !persons || !date) {
        alert('Please fill all fields');
        return false;
    }
    
    const templateParams = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        booking_date: date,
        number_of_persons: persons,
        restaurant_name: 'Foody Restaurant',
        restaurant_location: 'Pune, Maharashtra'
    };
    
    if (typeof emailjs !== 'undefined') {
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                showThankYouModal(name, email, phone, persons, date);
                document.getElementById('bookingForm').reset();
            }, function(error) {
                showThankYouModal(name, email, phone, persons, date);
                console.log('Email error:', error);
                document.getElementById('bookingForm').reset();
            });
    } else {
        showThankYouModal(name, email, phone, persons, date);
        document.getElementById('bookingForm').reset();
    }
    
    return false;
}

function showThankYouModal(name, email, phone, persons, date) {
    const bookingDetails = document.getElementById('bookingDetails');
    const modal = document.getElementById('thankYouModal');
    
    if (bookingDetails && modal) {
        const formattedDate = new Date(date).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        bookingDetails.innerHTML = `
            <strong>Booking Details:</strong><br>
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Phone:</strong> ${phone}<br>
            <strong>Date:</strong> ${formattedDate}<br>
            <strong>Persons:</strong> ${persons}<br>
            <strong>Restaurant:</strong> Foody Restaurant, Pune
        `;
        
        modal.style.display = 'block';
    }
}

function closeThankYouModal() {
    const modal = document.getElementById('thankYouModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'info' ? '#2196F3' : '#ffbe33'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1001;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Animation functions
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .bounce-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

function stickyNavigation() {
    const header = document.querySelector('.header_section');
    const scrollPosition = window.scrollY;
    
    if (header) {
        if (scrollPosition > 100) {
            header.classList.add('sticky');
            document.body.classList.add('sticky-offset');
        } else {
            header.classList.remove('sticky');
            document.body.classList.remove('sticky-offset');
        }
    }
}

// Event listeners
window.addEventListener('scroll', function() {
    animateOnScroll();
    stickyNavigation();
});

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('searchDropdown');
    const searchBtn = document.querySelector('.nav_search-btn');
    const userDropdown = document.getElementById('userDropdown');
    const userLink = document.querySelector('.user_link');
    
    if (dropdown && searchBtn && !dropdown.contains(event.target) && !searchBtn.contains(event.target)) {
        dropdown.classList.remove('active');
    }
    
    if (userDropdown && userLink && !userDropdown.contains(event.target) && !userLink.contains(event.target)) {
        userDropdown.style.display = 'none';
    }
});

// Initialize login state from localStorage
function initializeLoginState() {
    const storedUser = localStorage.getItem('foodyUser');
    const loginState = localStorage.getItem('foodyLoginState');
    
    if (storedUser && loginState === 'true') {
        const userData = JSON.parse(storedUser);
        isLoggedIn = true;
        userProfilePic = userData.profilePic;
        updateUserDisplay();
    }
    
    // Load cart from localStorage
    const storedCart = localStorage.getItem('foodyCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
}

// Save login state to localStorage
function saveLoginState() {
    localStorage.setItem('foodyLoginState', isLoggedIn.toString());
}

// Social media coming soon popup
function showSocialComingSoon(platform) {
    alert(`Coming Soon on ${platform}! 🚀\n\nWe're working hard to bring Foody to ${platform}. Stay tuned for updates!`);
}

// Initialize on DOM ready
$(document).ready(function() {
    // Add click handlers for social media icons
    $('.footer_social a').click(function(e) {
        e.preventDefault();
        const iconClass = $(this).find('i').attr('class');
        let platform = 'Social Media';
        
        if (iconClass.includes('facebook')) platform = 'Facebook';
        else if (iconClass.includes('twitter')) platform = 'Twitter';
        else if (iconClass.includes('instagram')) platform = 'Instagram';
        
        showSocialComingSoon(platform);
    });
    
    // Initialize login state first
    initializeLoginState();
    
    // Check if redirected for login
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true' && !isLoggedIn) {
        setTimeout(() => {
            showLogin();
            toggleAuthModal();
        }, 500);
    }
    
    const today = new Date().toISOString().split('T')[0];
    const bookingDate = document.getElementById('bookingDate');
    if (bookingDate) {
        bookingDate.setAttribute('min', today);
    }
    
    const products = [
        { name: 'Margherita Pizza', price: 299, image: 'images/f1.png' },
        { name: 'Chicken Burger', price: 199, image: 'images/f2.png' },
        { name: 'Creamy Pasta', price: 249, image: 'images/f3.png' }
    ];
    
    const addToCartButtons = document.querySelectorAll('.food_section .options a');
    addToCartButtons.forEach((button, index) => {
        if (products[index]) {
            button.onclick = function(e) {
                e.preventDefault();
                addToCart(products[index].name, products[index].price, products[index].image);
            };
        }
    });
    
    setTimeout(animateOnScroll, 100);
});