// ===================================
// Theme Management
// ===================================

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (!themeIcon) return;

        if (this.currentTheme === 'dark') {
            themeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            `;
        } else {
            themeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            `;
        }
    }
}

// ===================================
// Profile Management
// ===================================

class ProfileManager {
    constructor() {
        this.profileData = this.loadProfileData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderProfile();
    }

    loadProfileData() {
        const saved = localStorage.getItem('profileData');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default profile data
        return {
            name: 'Toleubayev Yershat',
            bio: 'Разработчик с фокусом на адаптивные решения и инновационные технологии',
            skills: ['Адаптивность'],
            phone: '+77780958898',
            github: 'https://github.com',
            projects: 'Работа с языковыми моделями (LM) - разработка и внедрение решений на основе современных технологий искусственного интеллекта',
            experience: 'В разработке и изучении современных технологий. Фокус на практическом применении знаний.',
            education: 'Самообразование и практический опыт в области разработки программного обеспечения.'
        };
    }

    saveProfileData() {
        localStorage.setItem('profileData', JSON.stringify(this.profileData));
    }

    updateProfile(updates) {
        this.profileData = { ...this.profileData, ...updates };
        this.saveProfileData();
        this.renderProfile();
    }

    renderProfile() {
        // Update name
        const nameElements = document.querySelectorAll('.hero-title, .brand-text');
        nameElements.forEach(el => {
            if (el) el.textContent = this.profileData.name;
        });

        // Update bio
        const bioElement = document.querySelector('.hero-bio');
        if (bioElement) bioElement.textContent = this.profileData.bio;

        // Update phone
        const phoneElement = document.querySelector('.contact-link[href^="tel"]');
        if (phoneElement) phoneElement.href = `tel:${this.profileData.phone}`;

        // Update GitHub
        const githubElement = document.querySelector('.contact-link[href*="github"]');
        if (githubElement) githubElement.href = this.profileData.github;

        // Update skills
        this.renderSkills();

        // Update about section
        this.renderAbout();
    }

    renderSkills() {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) return;

        skillsGrid.innerHTML = '';
        this.profileData.skills.forEach(skill => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skillsGrid.appendChild(skillTag);
        });
    }

    renderAbout() {
        const aboutCards = document.querySelectorAll('.about-card');
        if (aboutCards.length >= 3) {
            // Projects card
            const projectsCard = aboutCards[0];
            const projectsText = projectsCard.querySelector('.card-text');
            if (projectsText) projectsText.textContent = this.profileData.projects;

            // Experience card
            const experienceCard = aboutCards[1];
            const experienceText = experienceCard.querySelector('.card-text');
            if (experienceText) experienceText.textContent = this.profileData.experience;

            // Education card
            const educationCard = aboutCards[2];
            const educationText = educationCard.querySelector('.card-text');
            if (educationText) educationText.textContent = this.profileData.education;
        }
    }

    bindEvents() {
        const form = document.getElementById('profileForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Real-time validation
        const inputs = form?.querySelectorAll('.form-input');
        inputs?.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Validation rules
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать минимум 2 символа';
                }
                break;
            case 'phone':
                if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Введите корректный номер телефона';
                }
                break;
            case 'github':
                if (value && !/^https:\/\/github\.com\/[\w\-\.]+/.test(value)) {
                    isValid = false;
                    errorMessage = 'Введите корректную ссылку на GitHub';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateForm() {
        const form = document.getElementById('profileForm');
        if (!form) return false;

        const inputs = form.querySelectorAll('.form-input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    handleFormSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const formData = new FormData(e.target);
        const updates = {
            name: formData.get('name') || document.getElementById('nameInput').value,
            bio: document.getElementById('bioInput').value,
            skills: document.getElementById('skillsInput').value.split(',').map(s => s.trim()).filter(s => s),
            phone: document.getElementById('phoneInput').value,
            github: document.getElementById('githubInput').value,
            projects: document.getElementById('projectsInput').value
        };

        this.updateProfile(updates);
        this.closeEditModal();
        
        // Show success message
        this.showNotification('Профиль успешно обновлен!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '1001',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-out'
        });

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#22C55E';
                break;
            case 'error':
                notification.style.backgroundColor = '#EF4444';
                break;
            default:
                notification.style.backgroundColor = '#3B82F6';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    openEditModal() {
        const modal = document.getElementById('editModal');
        if (!modal) return;

        // Populate form with current data
        document.getElementById('nameInput').value = this.profileData.name;
        document.getElementById('bioInput').value = this.profileData.bio;
        document.getElementById('skillsInput').value = this.profileData.skills.join(', ');
        document.getElementById('phoneInput').value = this.profileData.phone;
        document.getElementById('githubInput').value = this.profileData.github;
        document.getElementById('projectsInput').value = this.profileData.projects;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeEditModal() {
        const modal = document.getElementById('editModal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===================================
// Smooth Scrolling
// ===================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================================
// Resume Download
// ===================================

function downloadResume() {
    // Create a simple text resume
    const resumeContent = `
Toleubayev Yershat
Разработчик

КОНТАКТНАЯ ИНФОРМАЦИЯ:
Телефон: +77780958898
GitHub: https://github.com

НАВЫКИ:
• Адаптивность
• Разработка веб-приложений
• Работа с языковыми моделями

ПРОЕКТЫ:
• Работа с языковыми моделями (LM) - разработка и внедрение решений на основе современных технологий искусственного интеллекта

ОПЫТ РАБОТЫ:
В разработке и изучении современных технологий. Фокус на практическом применении знаний.

ОБРАЗОВАНИЕ:
Самообразование и практический опыт в области разработки программного обеспечения.
    `;

    // Create blob and download
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Toleubayev_Yershat_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===================================
// GitHub Integration
// ===================================

class GitHubIntegration {
    constructor() {
        this.username = 'your-github-username'; // This should be updated with actual username
        this.init();
    }

    async init() {
        try {
            await this.loadRepositories();
        } catch (error) {
            console.log('GitHub integration not available');
        }
    }

    async loadRepositories() {
        // This would normally fetch from GitHub API
        // For now, we'll show placeholder content
        console.log('GitHub repositories would be loaded here');
    }
}

// ===================================
// Animation on Scroll
// ===================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, this.observerOptions);

            // Observe elements that should animate on scroll
            document.querySelectorAll('.about-card, .project-card, .resume-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                this.observer.observe(el);
            });
        }
    }
}

// ===================================
// Global Functions (for HTML onclick handlers)
// ===================================

function openEditModal() {
    if (window.profileManager) {
        window.profileManager.openEditModal();
    }
}

function closeEditModal() {
    if (window.profileManager) {
        window.profileManager.closeEditModal();
    }
}

// ===================================
// App Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    window.themeManager = new ThemeManager();
    window.profileManager = new ProfileManager();
    window.smoothScroll = new SmoothScroll();
    window.githubIntegration = new GitHubIntegration();
    window.scrollAnimations = new ScrollAnimations();

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('editModal');
        if (modal && e.target === modal) {
            window.profileManager.closeEditModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.profileManager.closeEditModal();
        }
    });

    console.log('Portfolio app initialized successfully');
});

// ===================================
// Performance Monitoring
// ===================================

// Monitor performance
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 0);
    });
}

// ===================================
// Error Handling
// ===================================

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});