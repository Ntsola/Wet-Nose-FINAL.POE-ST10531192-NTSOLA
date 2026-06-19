// Wetnose main.js - Part 3: Validation + AJAX + Conditional fields + Gallery

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. CONDITIONAL FIELDS FOR enquiry.html =====
    const serviceSelect = document.getElementById('service');
    const adoptFields = document.getElementById('adopt-fields');
    const volunteerFields = document.getElementById('volunteer-fields');
    const sponsorFields = document.getElementById('sponsor-fields');

    if (serviceSelect) {
        serviceSelect.addEventListener('change', () => {
            // Hide all first
            [adoptFields, volunteerFields, sponsorFields].forEach(f => {
                if(f) f.style.display = 'none';
            });
            
            // Show choosen
            if(serviceSelect.value === 'adopt' && adoptFields) adoptFields.style.display = 'block';
            if(serviceSelect.value === 'volunteer' && volunteerFields) volunteerFields.style.display = 'block';
            if(serviceSelect.value === 'sponsor' && sponsorFields) sponsorFields.style.display = 'block';
        });
    }

    // ===== 2. FORM VALIDATION + AJAX =====
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors(form);

            let isValid = true;

            // Name: min 2 chars
            const name = form.querySelector('#name');
            if (name && name.value.trim().length < 2) {
                showError(name, 'Name must be at least 2 characters');
                isValid = false;
            }

            // Email: must be valid format
            const email = form.querySelector('#email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email.value.trim())) {
                showError(email, 'Enter a valid email address');
                isValid = false;
            }

            // SA Phone: 10 digits starting with 0
            const phone = form.querySelector('#phone');
            const phoneRegex = /^0\d{9}$/;
            if (phone && !phoneRegex.test(phone.value.trim())) {
                showError(phone, 'Phone must be 10 digits, e.g. 0821234567');
                isValid = false;
            }

            // Message: min 10 chars for contact form only
            const message = form.querySelector('#message');
            if (message && form.id === 'contact-form' && message.value.trim().length < 10) {
                showError(message, 'Message must be at least 10 characters');
                isValid = false;
            }

            if (isValid) {
                submitFormAJAX(form, new FormData(form));
            }
        });
    });

    // ===== 3. ERROR FUNCTIONS =====
    function showError(input, message) {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        input.parentElement.appendChild(error);
        input.style.borderColor = '#e74c3c';
    }

    function clearErrors(form) {
        form.querySelectorAll('.error-message').forEach(e => e.remove());
        form.querySelectorAll('input, textarea, select').forEach(i => i.style.borderColor = '#ccc');
    }

    // ===== 4. AJAX SUBMIT =====
    function submitFormAJAX(form, formData) {
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {'Accept': 'application/json'}
        })
        .then(res => {
            if (res.ok) {
                showSuccess(form, 'Thank you! We’ll get back to you soon 🐾');
                form.reset();
                [adoptFields, volunteerFields, sponsorFields].forEach(f => {
                    if(f) f.style.display = 'none';
                });
            } else {
                throw new Error('Failed');
            }
        })
        .catch(() => {
            showSuccess(form, 'Oops! Something went wrong. Try again.');
        })
        .finally(() => {
            btn.disabled = false;
            btn.textContent = 'Submit';
        });
    }

    function showSuccess(form, message) {
        const div = document.createElement('div');
        div.className = 'success-message';
        div.textContent = message;
        form.parentElement.insertBefore(div, form.nextSibling);
        setTimeout(() => div.remove(), 5000);
    }

    // ===== 5. GALLERY LIGHTBOX =====
    document.querySelectorAll('.gallery img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:999;cursor:pointer';
            const big = document.createElement('img');
            big.src = img.src;
            big.style.maxWidth = '90%';
            big.style.maxHeight = '90%';
            big.style.borderRadius = '12px';
            overlay.appendChild(big);
            document.body.appendChild(overlay);
            overlay.onclick = () => overlay.remove();
        });
    });
});

// ====== 3. GALLERY LIGHTBOX ======
const galleryImages = document.querySelectorAll('.gallery-img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('caption');
const closeBtn = document.querySelector('.close');

if (galleryImages.length > 0) {
  galleryImages.forEach(img => {
    img.addEventListener('click', function() {
      lightbox.style.display = 'block';
      lightboxImg.src = this.src;
      caption.textContent = this.alt;
    });
  });

  closeBtn.onclick = function() {
    lightbox.style.display = 'none';
  }

  lightbox.onclick = function(e) {
    if(e.target == lightbox) lightbox.style.display = 'none';
  }
}