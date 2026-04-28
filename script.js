// Cursor Follower
const cursor = document.getElementById('cursor');
let lastFocusedElement = null;
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

document.addEventListener('mousemove', (e) => {
  if (cursor) {
    // The CSS transform: translate(-50%, -50%) handles centering
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

// Intro Text Scroll Progress
const revealText = document.getElementById('reveal-text');

if (revealText) {
  // Split text into words and wrap in spans
  const text = revealText.textContent.trim();
  const words = text.split(/\s+/);
  revealText.innerHTML = ''; // Clear existing text
  words.forEach(word => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = word + ' ';
    revealText.appendChild(span);
  });
}

window.addEventListener('scroll', () => {
  if (revealText) {
    const rect = revealText.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    let progress = 0;
    
    // Start transition when top of text is in viewport
    if (rect.top < windowHeight && rect.bottom > 0) {
      const totalScrollDistance = windowHeight * 0.5; // Complete transition over half viewport height
      const currentScroll = windowHeight - rect.top - (windowHeight * 0.2); // Add a small delay
      
      progress = Math.min(Math.max(currentScroll / totalScrollDistance, 0), 1);
    }
    
    const wordSpans = revealText.querySelectorAll('.word');
    const activeCount = Math.floor(progress * wordSpans.length);
    
    wordSpans.forEach((span, index) => {
      if (index < activeCount) {
        span.classList.add('active');
      } else {
        span.classList.remove('active');
      }
    });
  }
});

window.addEventListener('scroll', () => {
  if (!navbar) {
    return;
  }

  const currentScrollY = Math.max(window.scrollY, 0);
  const scrollDelta = currentScrollY - lastScrollY;
  const isMenuOpen = document.getElementById('nav-links')?.classList.contains('active');

  navbar.classList.toggle('scrolled', currentScrollY > 16);

  if (isMenuOpen || currentScrollY <= 120) {
    navbar.classList.remove('nav-hidden');
  } else if (scrollDelta > 8) {
    navbar.classList.add('nav-hidden');
  } else if (scrollDelta < -8) {
    navbar.classList.remove('nav-hidden');
  }

  if (Math.abs(scrollDelta) > 4) {
    lastScrollY = currentScrollY;
  }
}, { passive: true });

// Modal Toggle
window.toggleModal = function(show) {
  const modal = document.getElementById('modal-overlay');
  if (modal) {
    if (show) {
      lastFocusedElement = document.activeElement;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const firstField = modal.querySelector('input, textarea');
      firstField?.focus();
    } else {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      lastFocusedElement?.focus();
    }
  }
};

document.addEventListener('keydown', (event) => {
  const modal = document.getElementById('modal-overlay');
  const isModalOpen = modal?.classList.contains('active');

  if (!isModalOpen) {
    return;
  }

  if (event.key === 'Escape') {
    window.toggleModal(false);
    return;
  }

  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = modal.querySelectorAll(
    'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Active Link Highlighting using IntersectionObserver
const sections = document.querySelectorAll('header[id], section[id]');

const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -60% 0px', // Trigger when section is around the upper middle part of the screen
  threshold: 0
};

const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const currentId = entry.target.getAttribute('id');
      
      navLinksItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        }
      });
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach(section => observer.observe(section));

// Static contact form fallback
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const contactEmail = 'shalder99.ee@gmail.com';

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hi Sharmistha,\n\n${message}\n\nSender details:\nName: ${name}\nEmail: ${email}`
    );

    window.location.href = `mailto:${contactEmail}?cc=${encodeURIComponent(email)}&subject=${subject}&body=${body}`;

    if (formStatus) {
      formStatus.hidden = false;
      formStatus.textContent = 'Your message is ready in your email app with a copy addressed to you.';
    }
  });
}
