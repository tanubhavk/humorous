document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeButton = document.getElementById('theme-button');
    const body = document.body;
    const themeIcon = themeButton.querySelector('i');
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.className = `${savedTheme}-theme`;
    
    // Update icon based on current theme
    updateThemeIcon();
    
    themeButton.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        
        updateThemeIcon();
    });
    
    function updateThemeIcon() {
        if (body.classList.contains('dark-theme')) {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.team-member, .project-card, .hero-content, .section-title');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.1;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    // Set initial state for animations with staggered delay
    const staggeredElements = document.querySelectorAll('.team-member, .project-card');
    staggeredElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });
    
    document.querySelectorAll('.hero-content, .section-title').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Add parallax effect to shapes
    window.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
    
    // Add class to animate elements when they come into view
    const addAnimatedClass = () => {
        document.querySelectorAll('.team-member, .project-card, .hero-content, .section-title').forEach(element => {
            if (element.getBoundingClientRect().top < window.innerHeight / 1.1) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run animation check on load and scroll
    window.addEventListener('load', () => {
        animateOnScroll();
        addAnimatedClass();
    });
    window.addEventListener('scroll', () => {
        animateOnScroll();
        addAnimatedClass();
    });
    
    // Add CSS class for animations
    const style = document.createElement('style');
    style.textContent = `
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}); 