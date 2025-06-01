// DOM Elements
const navHome = document.getElementById('nav-home');
const navFlights = document.getElementById('nav-flights');
const navBookings = document.getElementById('nav-bookings');
const navLogin = document.getElementById('nav-login');
const navRegister = document.getElementById('nav-register');
const navLogout = document.getElementById('nav-logout');

const homeSection = document.getElementById('home-section');
const flightsSection = document.getElementById('flights-section');
const bookingSection = document.getElementById('booking-section');
const bookingsSection = document.getElementById('bookings-section');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const confirmationSection = document.getElementById('confirmation-section');

const searchForm = document.getElementById('search-form');
const flightsContainer = document.getElementById('flights-container');
const selectedFlightDiv = document.getElementById('selected-flight');
const bookingForm = document.getElementById('booking-form');
const bookingsContainer = document.getElementById('bookings-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const confirmationDetails = document.getElementById('confirmation-details');
const returnHomeButton = document.getElementById('return-home');

// User state
let currentUser = null;
let selectedFlight = null;

// Check if user is logged in from localStorage
function checkLoggedInStatus() {
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateNavigation(true);
    } else {
        updateNavigation(false);
    }
}

// Update navigation based on login status
function updateNavigation(isLoggedIn) {
    if (isLoggedIn) {
        navLogin.classList.add('hidden');
        navRegister.classList.add('hidden');
        navLogout.classList.remove('hidden');
        navBookings.classList.remove('hidden');
    } else {
        navLogin.classList.remove('hidden');
        navRegister.classList.remove('hidden');
        navLogout.classList.add('hidden');
        navBookings.classList.add('hidden');
    }
}

// Hide all sections
function hideAllSections() {
    homeSection.classList.add('hidden');
    flightsSection.classList.add('hidden');
    bookingSection.classList.add('hidden');
    bookingsSection.classList.add('hidden');
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    confirmationSection.classList.add('hidden');
}

// Navigation event listeners
navHome.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllSections();
    homeSection.classList.remove('hidden');
});

navFlights.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllSections();
    flightsSection.classList.remove('hidden');
    fetchAllFlights();
});

navBookings.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentUser) {
        hideAllSections();
        loginSection.classList.remove('hidden');
        return;
    }
    hideAllSections();
    bookingsSection.classList.remove('hidden');
    fetchUserBookings();
});

navLogin.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllSections();
    loginSection.classList.remove('hidden');
});

navRegister.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllSections();
    registerSection.classList.remove('hidden');
});

navLogout.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    currentUser = null;
    updateNavigation(false);
    hideAllSections();
    homeSection.classList.remove('hidden');
});

returnHomeButton.addEventListener('click', () => {
    hideAllSections();
    homeSection.classList.remove('hidden');
});

// Search form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    
    searchFlights(origin, destination, date);
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateNavigation(true);
            hideAllSections();
            homeSection.classList.remove('hidden');
            loginForm.reset();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, phone, password, role: 'customer' })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Registration successful! Please login.');
            hideAllSections();
            loginSection.classList.remove('hidden');
            registerForm.reset();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
    }
});

// Booking form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser || !selectedFlight) {
        alert('Please login and select a flight');
        return;
    }
    
    const passengerName = document.getElementById('passenger-name').value;
    const passengerEmail = document.getElementById('passenger-email').value;
    const passengerPhone = document.getElementById('passenger-phone').value;
    const seatClass = document.getElementById('seat-class').value;
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: currentUser.id,
                flightId: selectedFlight._id,
                passengerDetails: {
                    name: passengerName,
                    email: passengerEmail,
                    phone: passengerPhone
                },
                seatClass
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayConfirmation(data.booking);
            bookingForm.reset();
        } else {
            alert(data.message || 'Booking failed');
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('An error occurred during booking. Please try again.');
    }
});

// Fetch all flights
async function fetchAllFlights() {
    try {
        const response = await fetch('/api/flights');
        const flights = await response.json();
        displayFlights(flights);
    } catch (error) {
        console.error('Error fetching flights:', error);
        flightsContainer.innerHTML = '<p>Error loading flights. Please try again later.</p>';
    }
}

// Search flights
async function searchFlights(origin, destination, date) {
    try {
        const queryParams = new URLSearchParams();
        if (origin) queryParams.append('origin', origin);
        if (destination) queryParams.append('destination', destination);
        if (date) queryParams.append('date', date);
        
        const response = await fetch(`/api/flights/search?${queryParams}`);
        const flights = await response.json();
        
        hideAllSections();
        flightsSection.classList.remove('hidden');
        displayFlights(flights);
    } catch (error) {
        console.error('Error searching flights:', error);
        flightsContainer.innerHTML = '<p>Error searching flights. Please try again later.</p>';
    }
}

// Display flights
function displayFlights(flights) {
    flightsContainer.innerHTML = '';
    
    if (flights.length === 0) {
        flightsContainer.innerHTML = '<p>No flights found matching your criteria.</p>';
        return;
    }
    
    flights.forEach(flight => {
        const departureDate = new Date(flight.departureTime);
        const arrivalDate = new Date(flight.arrivalTime);
        
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        flightCard.innerHTML = `
            <h3>${flight.airline} - ${flight.flightNumber}</h3>
            <p><strong>From:</strong> ${flight.origin}</p>
            <p><strong>To:</strong> ${flight.destination}</p>
            <p><strong>Departure:</strong> ${departureDate.toLocaleString()}</p>
            <p><strong>Arrival:</strong> ${arrivalDate.toLocaleString()}</p>
            <p><strong>Price:</strong> $${flight.price.toFixed(2)}</p>
            <p><strong>Available Seats:</strong> ${flight.availableSeats}</p>
            <button class="btn book-flight" data-flight='${JSON.stringify(flight)}'>Book Now</button>
        `;
        
        flightsContainer.appendChild(flightCard);
    });
    
    // Add event listeners to book buttons
    document.querySelectorAll('.book-flight').forEach(button => {
        button.addEventListener('click', function() {
            if (!currentUser) {
                alert('Please login to book a flight');
                hideAllSections();
                loginSection.classList.remove('hidden');
                return;
            }
            
            selectedFlight = JSON.parse(this.getAttribute('data-flight'));
            displayBookingForm(selectedFlight);
        });
    });
}

// Display booking form with selected flight details
function displayBookingForm(flight) {
    const departureDate = new Date(flight.departureTime);
    const arrivalDate = new Date(flight.arrivalTime);
    
    selectedFlightDiv.innerHTML = `
        <h3>${flight.airline} - ${flight.flightNumber}</h3>
        <p><strong>From:</strong> ${flight.origin}</p>
        <p><strong>To:</strong> ${flight.destination}</p>
        <p><strong>Departure:</strong> ${departureDate.toLocaleString()}</p>
        <p><strong>Arrival:</strong> ${arrivalDate.toLocaleString()}</p>
        <p><strong>Price:</strong> $${flight.price.toFixed(2)}</p>
    `;
    
    // Pre-fill passenger info if user is logged in
    if (currentUser) {
        document.getElementById('passenger-name').value = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('passenger-email').value = currentUser.email;
    }
    
    hideAllSections();
    bookingSection.classList.remove('hidden');
}

// Fetch user bookings
async function fetchUserBookings() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/bookings/user/${currentUser.id}`);
        const bookings = await response.json();
        displayBookings(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        bookingsContainer.innerHTML = '<p>Error loading bookings. Please try again later.</p>';
    }
}

// Display user bookings
function displayBookings(bookings) {
    bookingsContainer.innerHTML = '';
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p>You have no bookings yet.</p>';
        return;
    }
    
    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        
        // Get ticket and flight info
        const ticketInfo = booking.tickets.map(ticket => {
            const flight = ticket.flight;
            const departureDate = new Date(flight.departureTime);
            const arrivalDate = new Date(flight.arrivalTime);
            
            return `
                <div class="ticket-info">
                    <p><strong>Flight:</strong> ${flight.airline} - ${flight.flightNumber}</p>
                    <p><strong>From:</strong> ${flight.origin} <strong>To:</strong> ${flight.destination}</p>
                    <p><strong>Departure:</strong> ${departureDate.toLocaleString()}</p>
                    <p><strong>Arrival:</strong> ${arrivalDate.toLocaleString()}</p>
                    <p><strong>Seat:</strong> ${ticket.seatNumber} (${ticket.class})</p>
                    <p><strong>Status:</strong> ${ticket.status}</p>
                </div>
            `;
        }).join('');
        
        bookingCard.innerHTML = `
            <h3>Booking Reference: ${booking.bookingReference}</h3>
            <p><strong>Date:</strong> ${new Date(booking.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            <p><strong>Total Amount:</strong> $${booking.totalAmount.toFixed(2)}</p>
            <h4>Tickets:</h4>
            ${ticketInfo}
        `;
        
        bookingsContainer.appendChild(bookingCard);
    });
}

// Display booking confirmation
function displayConfirmation(booking) {
    confirmationDetails.innerHTML = `
        <h2>Booking Successful!</h2>
        <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
        <p><strong>Total Amount:</strong> $${booking.totalAmount.toFixed(2)}</p>
        <p>A confirmation email has been sent to your email address.</p>
    `;
    
    hideAllSections();
    confirmationSection.classList.remove('hidden');
}

// Initialize the application
function init() {
    checkLoggedInStatus();
    hideAllSections();
    homeSection.classList.remove('hidden');
}

// Start the application
init();
