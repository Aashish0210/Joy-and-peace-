/**
 * app.js - User Interface Logic & Event Handling
 * Connects the DOM elements to the booking engine and drives all page animations and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialization & Theme Toggling ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  // Load saved theme
  const savedTheme = localStorage.getItem('peace_joy_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('peace_joy_theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
    } else {
      themeIcon.className = 'fas fa-moon';
    }
  }

  // --- Mobile Hamburger Menu ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close nav menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- Smooth Scroll & Active Nav Highlights ---
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 100; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < scrollPosition + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      }
    });
  });

  // --- Dynamically Populate Room Select Dropdowns ---
  const heroRoomSelect = document.getElementById('hero-room');
  const bookingRoomSelect = document.getElementById('booking-room');
  const heroGuestsSelect = document.getElementById('hero-guests');
  const bookingGuestsSelect = document.getElementById('booking-guests');

  function populateRoomDropdowns() {
    if (heroRoomSelect) {
      heroRoomSelect.innerHTML = ROOMS.map(room => 
        `<option value="${room.id}">${room.name}</option>`
      ).join('');
    }
    if (bookingRoomSelect) {
      bookingRoomSelect.innerHTML = ROOMS.map(room => 
        `<option value="${room.id}">${room.name} ($${room.price}/night)</option>`
      ).join('');
    }
    // Set initial guest choices
    updateGuestOptions(heroRoomSelect, heroGuestsSelect);
    updateGuestOptions(bookingRoomSelect, bookingGuestsSelect);
  }

  function updateGuestOptions(roomSelectEl, guestsSelectEl) {
    if (!roomSelectEl || !guestsSelectEl) return;
    const roomId = roomSelectEl.value;
    const room = ROOMS.find(r => r.id === roomId);
    if (!room) return;

    const currentVal = guestsSelectEl.value || 1;
    guestsSelectEl.innerHTML = '';
    for (let i = 1; i <= room.capacity; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${i} Guest${i > 1 ? 's' : ''}`;
      if (parseInt(currentVal) === i) opt.selected = true;
      guestsSelectEl.appendChild(opt);
    }
    if (parseInt(currentVal) > room.capacity) {
      guestsSelectEl.value = room.capacity;
    }
  }

  if (heroRoomSelect) {
    heroRoomSelect.addEventListener('change', () => updateGuestOptions(heroRoomSelect, heroGuestsSelect));
  }
  if (bookingRoomSelect) {
    bookingRoomSelect.addEventListener('change', () => updateGuestOptions(bookingRoomSelect, bookingGuestsSelect));
  }

  populateRoomDropdowns();

  // --- Space-Optimized Master-Detail Showcase Layout ---
  const compactListEl = document.getElementById('rooms-compact-list');
  const showcaseEl = document.getElementById('rooms-detail-showcase');
  let activeRoomId = 'standard_twin';

  function renderRooms(filter = 'all') {
    if (!compactListEl || !showcaseEl) return;

    const filteredRooms = ROOMS.filter(room => {
      if (filter === 'couple') return room.capacity <= 2;
      if (filter === 'group') return room.capacity > 2;
      return true;
    });

    // If active room is not in the filtered list, default to the first room in the filtered list
    if (filteredRooms.length > 0 && !filteredRooms.some(r => r.id === activeRoomId)) {
      activeRoomId = filteredRooms[0].id;
    }

    // Populate compact list
    compactListEl.innerHTML = filteredRooms.map(room => `
      <div class="room-compact-item ${room.id === activeRoomId ? 'active' : ''}" data-id="${room.id}">
        <div class="room-compact-thumb">
          <img src="${room.image}" alt="${room.name}">
        </div>
        <div class="room-compact-details">
          <h4 class="room-compact-name">${room.name}</h4>
          <span class="room-compact-meta">
            <i class="fas fa-user-friends"></i> Max ${room.capacity} • ${room.size}
          </span>
        </div>
        <div class="room-compact-price">
          <strong>${room.currency}${room.price}</strong>
          <span>/ nt</span>
        </div>
      </div>
    `).join('');

    // Attach click listeners to list items
    const items = compactListEl.querySelectorAll('.room-compact-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        activeRoomId = item.dataset.id;
        
        // Update active class
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        renderRoomShowcase(activeRoomId);
      });
    });

    // Render active room in showcase
    if (filteredRooms.length > 0) {
      renderRoomShowcase(activeRoomId);
    } else {
      showcaseEl.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-muted);">No rooms match your filter criteria.</div>';
    }
  }

  function renderRoomShowcase(roomId) {
    if (!showcaseEl) return;
    const room = ROOMS.find(r => r.id === roomId);
    if (!room) return;

    // Reset showcase view for entrance animation
    showcaseEl.style.opacity = '0';
    
    setTimeout(() => {
      showcaseEl.innerHTML = `
        <div class="showcase-content">
          <div class="showcase-gallery">
            <img src="${room.image}" alt="${room.name}">
            <div class="showcase-price-tag">${room.currency}${room.price} <span>/ night</span></div>
          </div>
          <div class="showcase-details">
            <div class="showcase-header">
              <h3 class="showcase-title">${room.name}</h3>
              <div class="showcase-meta">
                <span><i class="fas fa-user-friends"></i> Max ${room.capacity} Guests</span>
                <span><i class="fas fa-expand-arrows-alt"></i> ${room.size}</span>
                <span><i class="fas fa-eye"></i> ${room.view}</span>
                <span><i class="fas fa-bed"></i> ${room.beds}</span>
              </div>
              <p class="showcase-desc">${room.description}</p>
            </div>
            <div>
              <div class="showcase-features">
                ${room.amenities.slice(0, 5).map(a => `<span class="feature-tag"><i class="fas ${a.icon}"></i> ${a.name}</span>`).join('')}
              </div>
              <div class="showcase-actions">
                <button class="btn btn-secondary btn-sm" onclick="openRoomModal('${room.id}')">View Details</button>
                <button class="btn btn-primary btn-sm" onclick="selectRoomForBooking('${room.id}')">Book Stay Now</button>
              </div>
            </div>
          </div>
        </div>
      `;
      showcaseEl.style.opacity = '1';
    }, 150);
  }

  // --- Category Filters logic ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRooms(btn.dataset.filter);
      if (compactListEl) compactListEl.scrollLeft = 0;
    });
  });

  renderRooms();

  // --- Dynamic Dining Menu Tabs ---
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuList = document.getElementById('menu-list');

  const menuItems = {
    breakfast: [
      { name: 'Organic Himalayan Coffee', price: '$2.50', desc: 'Freshly brewed local beans harvested from the foothills of Nepal.' },
      { name: 'Traditional Masala Chiya', price: '$1.50', desc: 'Black tea brewed with milk, ginger, cardamom, clove, and cinnamon.' },
      { name: 'Patan Breakfast Set', price: '$6.00', desc: 'Eggs to order, toasted artisan sourdough, local organic honey, fresh fruit salad.' },
      { name: 'Fluffy Pancake Stack', price: '$5.00', desc: 'Served with fresh bananas, chopped almonds, and a drizzle of wild maple syrup.' }
    ],
    drinks: [
      { name: 'Local Mint Chiya Cooler', price: '$2.00', desc: 'Refreshing iced black tea with fresh garden mint and lime.' },
      { name: 'Fresh Mango Lassi', price: '$3.00', desc: 'Creamy yogurt smoothie blended with sweet local Nepalese mangoes.' },
      { name: 'Himalayan Herbal Fusion', price: '$2.00', desc: 'Infusion of chamomile, lemongrass, and local mint leaves.' },
      { name: 'Patan Craft Soda', price: '$2.50', desc: 'Home-fermented ginger beer brewed with organic ginger root.' }
    ]
  };

  function renderMenu(type) {
    if (!menuList) return;
    menuList.innerHTML = '';
    menuItems[type].forEach(item => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      div.innerHTML = `
        <div class="menu-details">
          <h4>${item.name}</h4>
          <p>${item.desc}</p>
        </div>
        <div class="menu-price">${item.price}</div>
      `;
      menuList.appendChild(div);
    });
  }

  renderMenu('breakfast'); // initial load

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderMenu(tab.dataset.tab);
    });
  });

  // --- Interactive Local Guide Map & Guide List ---
  const mapPins = document.querySelectorAll('.map-pin');
  const guideItems = document.querySelectorAll('.guide-item');
  const mapPopup = document.getElementById('map-popup');

  const attractionData = {
    guesthouse: { name: 'Peace & Joy Guest House', desc: 'Your cozy sanctuary, located on Lonla Tole Marga.', detail: 'Close to historical sites, yet quiet and peaceful.', distance: 'Center Point', image: 'assets/hero_background.png' },
    p1: { name: 'Patan Durbar Square', desc: 'UNESCO World Heritage site with ancient Newari temples.', detail: 'Marvel at medieval palaces, golden carvings, and stone temples.', distance: '5 mins walk', image: 'assets/paton_square.png' },
    p2: { name: 'The Golden Temple (Hiranya Varna Mahavihar)', desc: 'Beautiful golden monastery dating back to the 12th century.', detail: 'Watch traditional Buddhist rituals and intricate bronze reliefs.', distance: '7 mins walk', image: 'assets/rooftop_terrace.png' },
    p3: { name: 'Mahaboudha Temple', desc: 'The Temple of a Thousand Buddhas built with terracotta bricks.', detail: 'Every single brick is carved with a miniature image of the Buddha.', distance: '10 mins walk', image: 'assets/deluxe_room.png' },
    p4: { name: 'Pim Bahal Pond', desc: 'A serene historical pond with a lakeside Buddhist stupa.', detail: 'Great spot for a quiet evening stroll away from the crowds.', distance: '8 mins walk', image: 'assets/twin_room.png' }
  };

  function showAttractionDetails(id) {
    // Update active pin class
    mapPins.forEach(pin => pin.classList.remove('active'));
    const targetPin = document.querySelector(`.map-pin.${id}`);
    if (targetPin) targetPin.classList.add('active');

    // Update active guide item list class
    guideItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.id === id) item.classList.add('active');
    });

    // Populate and slide up popup card
    const data = attractionData[id];
    if (data && mapPopup) {
      mapPopup.querySelector('h4').textContent = data.name;
      mapPopup.querySelector('p').textContent = data.desc;
      mapPopup.querySelector('span').textContent = `Distance: ${data.distance}`;
      mapPopup.querySelector('img').src = data.image;
      mapPopup.classList.add('active');
    }
  }

  mapPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const id = pin.classList.contains('guesthouse') ? 'guesthouse' : pin.classList[1];
      showAttractionDetails(id);
    });
  });

  guideItems.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      showAttractionDetails(id);
    });
  });

  // --- Reviews Slider/Carousel ---
  let activeReviewIndex = 0;
  const reviewSlidesContainer = document.getElementById('review-slides-container');
  const prevReviewBtn = document.getElementById('prev-review-btn');
  const nextReviewBtn = document.getElementById('next-review-btn');

  function renderReviews() {
    if (!reviewSlidesContainer) return;
    reviewSlidesContainer.innerHTML = '';
    const reviews = getReviews();

    if (reviews.length === 0) {
      reviewSlidesContainer.innerHTML = '<div class="text-center text-muted">No reviews yet. Be the first to add one!</div>';
      return;
    }

    reviews.forEach((rev, idx) => {
      const slide = document.createElement('div');
      slide.className = `review-slide ${idx === activeReviewIndex ? 'active' : ''}`;
      slide.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">${rev.name.charAt(0).toUpperCase()}</div>
            <div class="reviewer-details">
              <h4>${rev.name}</h4>
              <p>${rev.country} • ${rev.date}</p>
            </div>
          </div>
          <div class="review-rating">
            ${Array.from({ length: 5 }, (_, i) => `<i class="${i < rev.rating ? 'fas' : 'far'} fa-star"></i>`).join('')}
          </div>
        </div>
        <p class="review-content">"${rev.comment}"</p>
      `;
      reviewSlidesContainer.appendChild(slide);
    });
  }

  function changeReviewSlide(step) {
    const reviews = getReviews();
    if (reviews.length === 0) return;
    activeReviewIndex = (activeReviewIndex + step + reviews.length) % reviews.length;
    renderReviews();
  }

  if (prevReviewBtn) prevReviewBtn.addEventListener('click', () => changeReviewSlide(-1));
  if (nextReviewBtn) nextReviewBtn.addEventListener('click', () => changeReviewSlide(1));

  renderReviews(); // initial load

  // Add Review Form Interactions
  const starSelects = document.querySelectorAll('.star-rating-select i');
  const ratingInput = document.getElementById('review-rating-value');
  const reviewForm = document.getElementById('add-review-form');

  starSelects.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.val);
      ratingInput.value = val;
      
      // Update star coloring
      starSelects.forEach(s => {
        const sVal = parseInt(s.dataset.val);
        if (sVal <= val) {
          s.className = 'fas fa-star active';
        } else {
          s.className = 'far fa-star';
        }
      });
    });
  });

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('review-name').value.trim();
      const country = document.getElementById('review-country').value.trim();
      const rating = ratingInput.value;
      const comment = document.getElementById('review-comment').value.trim();

      const result = addReview({ name, country, rating, comment });
      if (result.success) {
        reviewForm.reset();
        ratingInput.value = '5';
        starSelects.forEach(s => s.className = 'fas fa-star active');
        activeReviewIndex = 0; // go to the newly added review
        renderReviews();
        
        // Show success alert
        alert('Thank you for sharing your experience! Your review has been added.');
      } else {
        alert(result.error);
      }
    });
  }

  // --- Booking Section / Form Operations ---
  const bookingForm = document.getElementById('hotel-booking-form');
  const roomSelect = document.getElementById('booking-room');
  const checkInInput = document.getElementById('booking-checkin');
  const checkOutInput = document.getElementById('booking-checkout');
  const guestsInput = document.getElementById('booking-guests');
  const breakfastCheckbox = document.getElementById('booking-breakfast');

  // Summary Elements
  const summaryRoom = document.getElementById('summary-room');
  const summaryNights = document.getElementById('summary-nights');
  const summaryRoomSubtotal = document.getElementById('summary-room-subtotal');
  const summaryBreakfast = document.getElementById('summary-breakfast');
  const summaryBreakfastRow = document.getElementById('summary-breakfast-row');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryService = document.getElementById('summary-service');
  const summaryTax = document.getElementById('summary-tax');
  const summaryTotal = document.getElementById('summary-total');

  // Set default dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (checkInInput) {
    checkInInput.value = today.toISOString().split('T')[0];
    checkInInput.min = today.toISOString().split('T')[0];
  }
  if (checkOutInput) {
    checkOutInput.value = tomorrow.toISOString().split('T')[0];
    checkOutInput.min = tomorrow.toISOString().split('T')[0];
  }

  function updateBookingSummary() {
    if (!roomSelect || !checkInInput || !checkOutInput) return;

    const roomId = roomSelect.value;
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const guests = guestsInput.value || 1;
    const breakfast = breakfastCheckbox.checked;

    if (!roomId || !checkIn || !checkOut) return;

    // Check validity of dates
    const cIn = new Date(checkIn);
    const cOut = new Date(checkOut);
    if (cIn >= cOut) {
      // Set default checkout to +1 day
      const newOut = new Date(cIn);
      newOut.setDate(newOut.getDate() + 1);
      checkOutInput.value = newOut.toISOString().split('T')[0];
      return updateBookingSummary();
    }

    const cost = calculateCost(roomId, checkIn, checkOut, guests, breakfast);
    if (!cost) return;

    const room = ROOMS.find(r => r.id === roomId);

    // Update UI elements
    summaryRoom.textContent = `${room.name} (${cost.nights} nights)`;
    summaryNights.textContent = `${cost.nights} nights x $${cost.roomPrice}`;
    summaryRoomSubtotal.textContent = `$${cost.roomSubtotal.toFixed(2)}`;

    if (breakfast) {
      summaryBreakfastRow.style.display = 'flex';
      summaryBreakfast.textContent = `$${cost.breakfastTotal.toFixed(2)}`;
    } else {
      summaryBreakfastRow.style.display = 'none';
    }

    summarySubtotal.textContent = `$${cost.subtotal.toFixed(2)}`;
    summaryService.textContent = `$${cost.serviceCharge.toFixed(2)}`;
    summaryTax.textContent = `$${cost.tax.toFixed(2)}`;
    summaryTotal.textContent = `$${cost.total.toFixed(2)}`;
  }

  // Hook listeners for booking form updates
  const formUpdateFields = [roomSelect, checkInInput, checkOutInput, guestsInput, breakfastCheckbox];
  formUpdateFields.forEach(field => {
    if (field) {
      field.addEventListener('change', updateBookingSummary);
      field.addEventListener('input', updateBookingSummary);
    }
  });

  updateBookingSummary(); // initial pricing update

  // Booking Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const bookingData = {
        roomId: roomSelect.value,
        checkIn: checkInInput.value,
        checkOut: checkOutInput.value,
        guestName: document.getElementById('booking-name').value.trim(),
        guestEmail: document.getElementById('booking-email').value.trim(),
        guestRequests: document.getElementById('booking-requests').value.trim(),
        guestsCount: guestsInput.value,
        includeBreakfast: breakfastCheckbox.checked
      };

      const result = createBooking(bookingData);
      
      if (result.success) {
        bookingForm.reset();
        
        // Restore default dates
        checkInInput.value = today.toISOString().split('T')[0];
        checkOutInput.value = tomorrow.toISOString().split('T')[0];
        updateBookingSummary();

        // Refresh My Reservations View
        renderMyBookings();
        
        // Show Receipt modal
        showReceiptModal(result.booking);
      } else {
        alert(`Booking failed: ${result.error}`);
      }
    });
  }

  // --- Active Reservations View ---
  const myBookingsList = document.getElementById('my-bookings-list');

  function renderMyBookings() {
    if (!myBookingsList) return;
    myBookingsList.innerHTML = '';
    const bookings = getBookings();

    if (bookings.length === 0) {
      myBookingsList.innerHTML = `
        <div class="bookings-empty">
          <i class="fas fa-calendar-times"></i>
          <p>You have no active reservations at the moment.</p>
        </div>
      `;
      return;
    }

    bookings.forEach(booking => {
      const ticket = document.createElement('div');
      ticket.className = 'booking-ticket';
      ticket.innerHTML = `
        <div class="ticket-main">
          <span class="ticket-id">${booking.id}</span>
          <h4>${booking.roomName}</h4>
          <div class="ticket-dates">
            <i class="far fa-calendar-alt"></i>
            <span>${booking.checkIn} to ${booking.checkOut}</span>
            <span>(${booking.cost.nights} nights, ${booking.guestsCount} guests)</span>
          </div>
        </div>
        <div class="ticket-status">
          <span class="status-badge ${booking.status}">${booking.status}</span>
        </div>
        <div class="ticket-actions">
          ${booking.status === 'confirmed' ? `
            <button class="btn btn-secondary btn-sm" onclick="openEditBookingModal('${booking.id}')">Modify</button>
            <button class="btn btn-primary btn-sm" onclick="triggerCancelBooking('${booking.id}')">Cancel</button>
          ` : '<span class="text-muted" style="font-size:0.85rem">Reservation Closed</span>'}
        </div>
      `;
      myBookingsList.appendChild(ticket);
    });
  }
  
  renderMyBookings(); // initial load

  // Global functions attached to window for click triggers
  window.triggerCancelBooking = function(bookingId) {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      const res = cancelBooking(bookingId);
      if (res.success) {
        renderMyBookings();
        alert('Your reservation has been cancelled successfully.');
      } else {
        alert(res.error);
      }
    }
  };

  // --- Modals Controller ---
  const genericModal = document.getElementById('generic-modal');
  const genericModalContent = genericModal.querySelector('.modal-content-inner');
  const genericModalClose = genericModal.querySelector('.modal-close-btn');

  function closeModal() {
    genericModal.classList.remove('active');
    setTimeout(() => {
      genericModalContent.innerHTML = '';
    }, 300); // clear after animation completes
  }

  genericModalClose.addEventListener('click', closeModal);
  genericModal.addEventListener('click', (e) => {
    if (e.target === genericModal) closeModal();
  });

  window.openRoomModal = function(roomId) {
    const room = ROOMS.find(r => r.id === roomId);
    if (!room) return;

    genericModalContent.innerHTML = `
      <div class="room-modal-body">
        <div class="room-modal-img">
          <img src="${room.image}" alt="${room.name}">
        </div>
        <div class="room-modal-details">
          <h3>${room.name}</h3>
          <p class="room-desc">${room.description}</p>
          <div class="room-modal-amenities">
            ${room.amenities.map(a => `
              <div class="modal-amenity-item">
                <i class="fas ${a.icon}"></i>
                <span>${a.name}</span>
              </div>
            `).join('')}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; border-top:1px solid var(--border-color); padding-top:20px">
            <div>
              <span style="font-size:0.85rem; color:var(--text-secondary)">Rate per night</span>
              <h4 style="font-size:1.5rem; color:var(--accent-brick)">${room.currency}${room.price}</h4>
            </div>
            <button class="btn btn-primary" onclick="selectRoomForBooking('${room.id}'); closeModal();">Instant Book</button>
          </div>
        </div>
      </div>
    `;
    genericModal.classList.add('active');
  };

  window.selectRoomForBooking = function(roomId) {
    const agodaUrl = "https://www.agoda.com/peace-and-joy-guest-house_2/hotel/all/kathmandu-np.html?countryId=120&finalPriceView=1&isShowMobileAppPrice=false&cid=-1&numberOfBedrooms=&familyMode=false&adults=1&children=0&rooms=1&maxRooms=0&checkIn=2026-06-20&isCalendarCallout=false&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=0&showReviewSubmissionEntry=false&currencyCode=USD&isFreeOccSearch=false&los=7&searchrequestid=e28bbd05-2904-401b-aa5a-c58d2e67cda0&ds=rvkvaEtiHRqidx2m";
    window.open(agodaUrl, '_blank');
  };

  function showReceiptModal(booking) {
    genericModalContent.innerHTML = `
      <div class="receipt-body">
        <div class="receipt-header">
          <div class="receipt-icon">
            <i class="fas fa-check"></i>
          </div>
          <h3>Booking Confirmed!</h3>
          <p style="color:var(--text-secondary)">We look forward to welcoming you at Peace & Joy</p>
        </div>
        <div class="receipt-details">
          <div class="receipt-row">
            <span>Booking ID:</span>
            <strong>${booking.id}</strong>
          </div>
          <div class="receipt-row">
            <span>Guest Name:</span>
            <strong>${booking.guestName}</strong>
          </div>
          <div class="receipt-row">
            <span>Room Selected:</span>
            <strong>${booking.roomName}</strong>
          </div>
          <div class="receipt-row">
            <span>Dates:</span>
            <strong>${booking.checkIn} to ${booking.checkOut} (${booking.cost.nights} nights)</strong>
          </div>
          <div class="receipt-row">
            <span>Guests:</span>
            <strong>${booking.guestsCount} Guest(s)</strong>
          </div>
          <div class="receipt-row">
            <span>Breakfast Included:</span>
            <strong>${booking.includeBreakfast ? 'Yes' : 'No'}</strong>
          </div>
          <div class="receipt-row total">
            <span>Total Amount:</span>
            <strong>$${booking.cost.total.toFixed(2)}</strong>
          </div>
        </div>
        <div style="display:flex; justify-content:center; gap:12px">
          <button class="btn btn-secondary" onclick="closeModal()">Close Window</button>
          <a href="#my-bookings" class="btn btn-primary" onclick="closeModal()">Manage Booking</a>
        </div>
      </div>
    `;
    genericModal.classList.add('active');
  }

  window.openEditBookingModal = function(bookingId) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const room = ROOMS.find(r => r.id === booking.roomId);
    const maxCapacity = room ? room.capacity : 2;

    genericModalContent.innerHTML = `
      <div class="edit-modal-body">
        <h3>Modify Reservation: ${booking.id}</h3>
        <form id="edit-booking-form">
          <div class="form-group" style="margin-bottom:16px">
            <label>Room Name</label>
            <input type="text" value="${booking.roomName}" disabled style="background:var(--bg-tertiary)">
          </div>
          <div class="review-form-grid" style="margin-bottom:16px">
            <div class="form-group">
              <label for="edit-checkin">Check-in Date</label>
              <input type="date" id="edit-checkin" value="${booking.checkIn}" min="${today.toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
              <label for="edit-checkout">Check-out Date</label>
              <input type="date" id="edit-checkout" value="${booking.checkOut}" min="${today.toISOString().split('T')[0]}">
            </div>
          </div>
          <div class="review-form-grid" style="margin-bottom:24px">
            <div class="form-group">
              <label for="edit-guests">Guests Count (Max ${maxCapacity})</label>
              <input type="number" id="edit-guests" value="${booking.guestsCount}" min="1" max="${maxCapacity}">
            </div>
            <div class="form-group" style="flex-direction:row; align-items:center; gap:10px; margin-top:28px">
              <input type="checkbox" id="edit-breakfast" ${booking.includeBreakfast ? 'checked' : ''} style="width:20px; height:20px">
              <label for="edit-breakfast" style="text-transform:none">Include Breakfast (+$6/day)</label>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:12px">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Discard</button>
            <button type="submit" class="btn btn-gold">Save Modifications</button>
          </div>
        </form>
      </div>
    `;
    
    genericModal.classList.add('active');

    // Attach form handler
    const editForm = document.getElementById('edit-booking-form');
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const checkInVal = document.getElementById('edit-checkin').value;
      const checkOutVal = document.getElementById('edit-checkout').value;
      const guestsVal = document.getElementById('edit-guests').value;
      const breakfastVal = document.getElementById('edit-breakfast').checked;

      const res = updateBooking(bookingId, checkInVal, checkOutVal, guestsVal, breakfastVal);
      if (res.success) {
        renderMyBookings();
        closeModal();
        alert('Reservation updated successfully.');
      } else {
        alert(`Modification Failed: ${res.error}`);
      }
    });
  };

  // --- External Booking Selection Trigger (from floating search bar) ---
  const heroCheckAvailabilityBtn = document.getElementById('hero-check-availability');
  if (heroCheckAvailabilityBtn) {
    heroCheckAvailabilityBtn.addEventListener('click', () => {
      const hCheckIn = document.getElementById('hero-checkin').value;
      const hCheckOut = document.getElementById('hero-checkout').value;
      const hGuests = document.getElementById('hero-guests').value || 1;

      // Build dynamic Agoda search link with chosen dates and length of stay
      const checkinVal = hCheckIn || '2026-06-20';
      const checkinDate = new Date(checkinVal);
      const checkoutDate = new Date(hCheckOut || '2026-06-21');
      const los = Math.max(1, Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))) || 7;
      
      const agodaUrl = `https://www.agoda.com/peace-and-joy-guest-house_2/hotel/all/kathmandu-np.html?adults=${hGuests}&rooms=1&checkIn=${checkinVal}&los=${los}&currencyCode=USD`;
      window.open(agodaUrl, '_blank');
    });
  }
  
  // Set floating search bar default dates
  const heroCheckIn = document.getElementById('hero-checkin');
  const heroCheckOut = document.getElementById('hero-checkout');
  if (heroCheckIn) {
    heroCheckIn.value = today.toISOString().split('T')[0];
    heroCheckIn.min = today.toISOString().split('T')[0];
  }
  if (heroCheckOut) {
    heroCheckOut.value = tomorrow.toISOString().split('T')[0];
    heroCheckOut.min = tomorrow.toISOString().split('T')[0];
  }

  // --- Premium Mock Concierge Chat Assistant Widget ---
  const chatButton = document.getElementById('concierge-chat-btn');
  const chatWindow = document.getElementById('concierge-chat-window');
  const chatClose = document.getElementById('concierge-chat-close');
  const chatForm = document.getElementById('concierge-chat-form');
  const chatMessages = document.getElementById('concierge-chat-messages');

  if (chatButton && chatWindow) {
    chatButton.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
    });

    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('concierge-chat-input');
      const text = input.value.trim();
      if (!text) return;

      // Append guest message
      appendChatMessage('guest', text);
      input.value = '';

      // Mock concierge response after a small delay
      setTimeout(() => {
        let response = "Thank you for reaching out to Peace & Joy. A member of our multilingual team will reply shortly via email. How else can we help you in the meantime?";
        if (text.toLowerCase().includes('price') || text.toLowerCase().includes('rate')) {
          response = "Our rates start at just $12/night for the Budget Double Room up to $26/night for our Quadruple Room, excluding local taxes. You can view real-time availability and book directly through our official Agoda page!";
        } else if (text.toLowerCase().includes('location') || text.toLowerCase().includes('where') || text.toLowerCase().includes('durbar')) {
          response = "We are located on Lonla Tole Marga in Patan, Lalitpur, which is exactly a 5 to 6 minute walk from Patan Durbar Square! It is a quiet and secure cultural neighborhood.";
        } else if (text.toLowerCase().includes('wifi') || text.toLowerCase().includes('internet')) {
          response = "We provide complimentary high-speed fiber Wi-Fi throughout the entire guest house, including all private rooms, common kitchens, and the rooftop terrace.";
        }
        appendChatMessage('concierge', response);
      }, 800);
    });

    function appendChatMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${sender}`;
      msgDiv.innerHTML = `
        <div class="chat-msg-bubble">
          ${text}
        </div>
      `;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
});
