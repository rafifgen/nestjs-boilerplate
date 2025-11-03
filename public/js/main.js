// Theme toggling functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('themeToggle');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggle');

  // Check for saved user preference, if any, load the value from localStorage
  const currentTheme = localStorage.getItem('theme');

  // If the user previously chose a theme, apply it to the document
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  } else {
    // If no theme was previously set, default to dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  function toggleTheme() {
    // Toggle between dark and light
    let theme = document.documentElement.getAttribute('data-theme');
    let switchToTheme = theme === 'dark' ? 'light' : 'dark';

    // Save the choice in localStorage
    localStorage.setItem('theme', switchToTheme);

    // Apply the theme to the document
    document.documentElement.setAttribute('data-theme', switchToTheme);
  }

  // Add event listeners for both desktop and mobile theme toggles
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  }
});

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (question && answer && icon) {
      question.addEventListener('click', () => {
        const isCurrentlyOpen = !answer.classList.contains('hidden');

        // Close all other FAQ items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherIcon = otherItem.querySelector('.faq-icon');
            
            if (otherAnswer && otherIcon) {
              otherAnswer.classList.add('hidden');
              otherIcon.style.transform = 'rotate(0deg)';
            }
          }
        });

        // Toggle current item
        if (isCurrentlyOpen) {
          // Close current item
          answer.classList.add('hidden');
          icon.style.transform = 'rotate(0deg)';
        } else {
          // Open current item
          answer.classList.remove('hidden');
          icon.style.transform = 'rotate(45deg)';
        }
      });
    }
  });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerOffset = 80; // Adjust based on your fixed header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Add scroll effects for better visual feedback
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe FAQ items for scroll animation
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
  });
});

// ==========================================
// PRICING FUNCTIONALITY
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const monthlyBtn = document.getElementById('monthly-btn');
  const yearlyBtn = document.getElementById('yearly-btn');
  const monthlyPlan = document.getElementById('monthly-plan');
  const yearlyPlan = document.getElementById('yearly-plan');

  if (monthlyBtn && yearlyBtn && monthlyPlan && yearlyPlan) {
    // Switch to monthly plan
    function switchToMonthly() {
      // Update button states
      monthlyBtn.classList.add('bg-green-500', 'text-white');
      monthlyBtn.classList.remove('bg-transparent', 'border', 'border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
      
      yearlyBtn.classList.remove('bg-green-500', 'text-white');
      yearlyBtn.classList.add('bg-transparent', 'border', 'border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');

      // Update plan visibility
      monthlyPlan.classList.remove('hidden');
      yearlyPlan.classList.add('hidden');
    }

    // Switch to yearly plan
    function switchToYearly() {
      // Update button states
      yearlyBtn.classList.add('bg-green-500', 'text-white');
      yearlyBtn.classList.remove('bg-transparent', 'border', 'border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
      
      monthlyBtn.classList.remove('bg-green-500', 'text-white');
      monthlyBtn.classList.add('bg-transparent', 'border', 'border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');

      // Update plan visibility
      yearlyPlan.classList.remove('hidden');
      monthlyPlan.classList.add('hidden');
    }

    // Event listeners
    monthlyBtn.addEventListener('click', switchToMonthly);
    yearlyBtn.addEventListener('click', switchToYearly);
  }
});

// ==========================================
// TESTIMONIALS CAROUSEL FUNCTIONALITY
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const testimonialsTrack = document.querySelector('.testimonials-track');
  
  if (testimonialsTrack) {
    // Clone testimonials for seamless infinite scroll
    const testimonials = Array.from(testimonialsTrack.children);
    
    // Clone all testimonials and append them for seamless loop
    testimonials.forEach(testimonial => {
      const clone = testimonial.cloneNode(true);
      testimonialsTrack.appendChild(clone);
    });
    
    // Pause animation on hover for better UX
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (testimonialsContainer) {
      testimonialsContainer.addEventListener('mouseenter', () => {
        testimonialsTrack.style.animationPlayState = 'paused';
      });
      
      testimonialsContainer.addEventListener('mouseleave', () => {
        testimonialsTrack.style.animationPlayState = 'running';
      });
    }
  }
});
