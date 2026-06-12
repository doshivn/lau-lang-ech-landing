// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

// Observe elements with animation classes
const animatedElements = document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-right');
animatedElements.forEach(el => observer.observe(el));

// Initialize hero animations immediately if they are in viewport on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-up');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);
});

// Form Submission Logic (API Integration)
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('booking-submit');
        const statusDiv = document.getElementById('booking-status');
        
        // Get values
        const name = document.getElementById('booking-name').value;
        const phone = document.getElementById('booking-phone').value;
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        const guests = document.getElementById('booking-guests').value;
        
        // Update UI to loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Đang xử lý...';
        statusDiv.style.display = 'none';
        
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, phone, date, time, guests })
            });
            
            const result = await response.json();
            
            statusDiv.style.display = 'block';
            if (response.ok) {
                statusDiv.style.color = '#10B981'; // Success green
                statusDiv.innerHTML = '✅ Đặt bàn thành công! Chúng tôi sẽ liên hệ lại sớm nhất.';
                bookingForm.reset();
            } else {
                statusDiv.style.color = '#EF4444'; // Error red
                statusDiv.innerHTML = '❌ Lỗi: ' + (result.message || 'Không thể đặt bàn.');
            }
        } catch (error) {
            statusDiv.style.display = 'block';
            statusDiv.style.color = '#EF4444';
            statusDiv.innerHTML = '❌ Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.';
            console.error('Booking Error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Gửi Yêu Cầu';
        }
    });
}
