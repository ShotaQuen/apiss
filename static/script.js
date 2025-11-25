// Global variables
let apiData = null;
let currentEndpoint = null;

// DOM elements
const themeToggle = document.getElementById('themeToggle');
const mobileToggle = document.getElementById('mobileToggle');
const docsSearch = document.getElementById('docsSearch');
const docsCategories = document.getElementById('docsCategories');
const endpointDetails = document.getElementById('endpointDetails');
const apiSelect = document.getElementById('apiSelect');
const parametersContainer = document.getElementById('parametersContainer');
const sendRequestBtn = document.getElementById('sendRequest');
const clearFormBtn = document.getElementById('clearForm');
const responseStatus = document.getElementById('responseStatus');
const responseContent = document.getElementById('responseContent');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    loadApiDocumentation();
    initializeApiTesting();
    initializeAnimations();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Navigation
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('show');
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavLink() {
    const sections = ['home', 'features', 'docs', 'test'];
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`[href="#${sectionId}"]`);
        
        if (section && navLink) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

// API Documentation
async function loadApiDocumentation() {
    try {
        showLoading();
        const response = await fetch('https://berak-new-pjq3.vercel.app/api/check');
        apiData = await response.json();
        
        if (apiData.status) {
            renderApiCategories();
            populateApiSelect();
        } else {
            console.error('Failed to load API data');
        }
    } catch (error) {
        console.error('Error loading API documentation:', error);
    } finally {
        hideLoading();
    }
}

function renderApiCategories() {
    if (!apiData || !apiData.categories) return;
    
    docsCategories.innerHTML = '';
    
    Object.keys(apiData.categories).forEach(categoryName => {
        const category = apiData.categories[categoryName];
        
        // Create category item
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <i class="fas fa-${getCategoryIcon(categoryName)}"></i>
            ${categoryName}
        `;
        
        categoryItem.addEventListener('click', function() {
            toggleCategory(this, categoryName);
        });
        
        docsCategories.appendChild(categoryItem);
        
        // Create endpoints container
        const endpointsContainer = document.createElement('div');
        endpointsContainer.className = 'endpoints-container';
        endpointsContainer.style.display = 'none';
        
        category.endpoints.forEach(endpoint => {
            const endpointItem = document.createElement('div');
            endpointItem.className = 'endpoint-item';
            endpointItem.textContent = endpoint.path;
            endpointItem.addEventListener('click', function() {
                showEndpointDetails(endpoint, categoryName);
                
                // Update active endpoint
                document.querySelectorAll('.endpoint-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            });
            
            endpointsContainer.appendChild(endpointItem);
        });
        
        docsCategories.appendChild(endpointsContainer);
    });
    
    // Search functionality
    docsSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterEndpoints(searchTerm);
    });
}

function getCategoryIcon(categoryName) {
    const icons = {
        'AI': 'brain',
        'Download': 'download',
        'Tools': 'tools',
        'Search': 'search',
        'Random': 'random',
        'Bmkg': 'house-crack',
        'Stalk': 'user-secret'
    };
    return icons[categoryName] || 'code';
}

function toggleCategory(categoryItem, categoryName) {
    const endpointsContainer = categoryItem.nextElementSibling;
    const isExpanded = endpointsContainer.style.display !== 'none';
    
    if (isExpanded) {
        endpointsContainer.style.display = 'none';
        categoryItem.classList.remove('active');
    } else {
        // Collapse other categories
        document.querySelectorAll('.endpoints-container').forEach(container => {
            container.style.display = 'none';
        });
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Expand this category
        endpointsContainer.style.display = 'block';
        categoryItem.classList.add('active');
    }
}

function showEndpointDetails(endpoint, categoryName) {
    currentEndpoint = endpoint;
    const category = apiData.categories[categoryName];
    
    const detailsHTML = `
        <h3>${endpoint.path}</h3>
        <div class="endpoint-status ${endpoint.status === 'OK' ? 'ok' : 'error'}"> ${endpoint.status}
        </div>

        <div class="endpoint-url">
            https://berak.my.id${endpoint.path}
            <button class="copy-btn" onclick="copyToClipboard('https://berak.my.id${endpoint.path}')">
                <i class="fas fa-copy"></i>
            </button>
        </div>
        <h4>Parameters</h4>
        <table class="params-table">
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                ${endpoint.params.map(param => `
                    <tr>
                        <td><code>${param}</code></td>
                        <td>string</td>
                        <td><span class="param-required">Required</span></td>
                        <td>Parameter description for ${param}</td>
                    </tr>
                `).join('')}
                ${endpoint.params.length === 0 ? '<tr><td colspan="4">No parameters required</td></tr>' : ''}
            </tbody>
        </table>
        
        <h4>Example Request</h4>
        <div class="endpoint-url">
            https://berak.my.id${endpoint.path}${
  endpoint.params.length > 0
    ? "?" + endpoint.params.map(p => `${p}=${endpoint.example_response || "example_value"}`).join("&")
    : ""
}
            <button class="copy-btn" onclick="copyToClipboard('https://berak.my.id${endpoint.path}${
  endpoint.params.length > 0
    ? "?" + endpoint.params.map(p => `${p}=${endpoint.example_response || "example_value"}`).join("&")
    : ""
}')">
                <i class="fas fa-copy"></i>
            </button>
        </div>
        
        <h4>Example Response</h4>
        <div class="endpoint-url">
            <pre>{
  "status": true,
  "creator": "REST API Website",
  "result": {
    "message": "Example response data"
  }
}</pre>
        </div>
    `;
    
    document.querySelector('.docs-welcome').style.display = 'none';
    endpointDetails.style.display = 'block';
    endpointDetails.innerHTML = detailsHTML;
}

function filterEndpoints(searchTerm) {
    document.querySelectorAll('.endpoint-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        const parent = item.parentElement;
        
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
            parent.style.display = 'block';
            parent.previousElementSibling.classList.add('active');
        } else {
            item.style.display = 'none';
        }
    });
    
    // Hide categories with no visible endpoints
    document.querySelectorAll('.endpoints-container').forEach(container => {
        const visibleEndpoints = container.querySelectorAll('.endpoint-item[style*="block"]');
        if (visibleEndpoints.length === 0 && searchTerm) {
            container.style.display = 'none';
            container.previousElementSibling.classList.remove('active');
        }
    });
}

// API Testing
function initializeApiTesting() {
    sendRequestBtn.addEventListener('click', sendApiRequest);
    clearFormBtn.addEventListener('click', clearTestingForm);
    apiSelect.addEventListener('change', updateParameterInputs);
}

function populateApiSelect() {
    if (!apiData || !apiData.categories) return;
    
    apiSelect.innerHTML = '<option value="">Choose an endpoint...</option>';
    
    Object.keys(apiData.categories).forEach(categoryName => {
        const category = apiData.categories[categoryName];
        const optgroup = document.createElement('optgroup');
        optgroup.label = categoryName;
        
        category.endpoints.forEach(endpoint => {
            const option = document.createElement('option');
            option.value = JSON.stringify(endpoint);
            option.textContent = endpoint.path;
            optgroup.appendChild(option);
        });
        
        apiSelect.appendChild(optgroup);
    });
}

function updateParameterInputs() {
    const selectedValue = apiSelect.value;
    parametersContainer.innerHTML = '';
    
    if (!selectedValue) return;
    
    try {
        const endpoint = JSON.parse(selectedValue);
        
        if (endpoint.params && endpoint.params.length > 0) {
            endpoint.params.forEach(param => {
                const paramDiv = document.createElement('div');
                paramDiv.className = 'param-input';
                paramDiv.innerHTML = `
                    <div class="param-name">${param}</div>
                    <input type="text" class="form-control" placeholder="Enter ${param}" data-param="${param}">
                `;
                parametersContainer.appendChild(paramDiv);
            });
        } else {
            parametersContainer.innerHTML = '<p class="text-muted">No parameters required for this endpoint.</p>';
        }
    } catch (error) {
        console.error('Error parsing endpoint data:', error);
    }
}

async function sendApiRequest() {
    const selectedValue = apiSelect.value;
    if (!selectedValue) {
        showToast('Please select an API endpoint', 'error');
        return;
    }
    
    try {
        const endpoint = JSON.parse(selectedValue);
        const params = new URLSearchParams();
        
        // Collect parameter values
        const paramInputs = parametersContainer.querySelectorAll('input[data-param]');
        paramInputs.forEach(input => {
            const paramName = input.getAttribute('data-param');
            const paramValue = input.value.trim();
            if (paramValue) {
                params.append(paramName, paramValue);
            }
        });
        
        // Build request URL
        const baseUrl = 'https://berak-new-pjq3.vercel.app' + endpoint.path;
        const requestUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
        
        // Show loading
        showLoading();
        responseStatus.textContent = 'Loading...';
        responseStatus.className = 'response-status';
        responseContent.textContent = 'Sending request...';
        
        // Send request
        const response = await fetch(requestUrl);
        const data = await response.json();
        
        // Update response display
        responseStatus.textContent = response.ok ? `${response.status} OK` : `${response.status} Error`;
        responseStatus.className = `response-status ${response.ok ? 'success' : 'error'}`;
        responseContent.textContent = JSON.stringify(data, null, 2);
        
    } catch (error) {
        console.error('Error sending API request:', error);
        responseStatus.textContent = 'Request Failed';
        responseStatus.className = 'response-status error';
        responseContent.textContent = `Error: ${error.message}`;
    } finally {
        hideLoading();
    }
}

function clearTestingForm() {
    apiSelect.value = '';
    parametersContainer.innerHTML = '';
    responseStatus.textContent = '';
    responseStatus.className = 'response-status';
    responseContent.textContent = 'No request sent yet...';
}

// Utility Functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showToast('Failed to copy text', 'error');
    });
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
        <span>${message}</span>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 250px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add color based on type
    if (type === 'success') {
        toast.style.borderLeftColor = 'var(--success-color)';
        toast.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
        toast.style.borderLeftColor = 'var(--error-color)';
        toast.style.borderLeftWidth = '4px';
    }
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function showLoading() {
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Feature card interactions
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                // Scroll to docs section and highlight category
                scrollToSection('docs');
                setTimeout(() => {
                    const categoryItem = document.querySelector(`.category-item:contains('${category}')`);
                    if (categoryItem) {
                        categoryItem.click();
                    }
                }, 500);
            }
        });
    });
});

// Smooth scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Add loading states to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        docsSearch.focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape' && document.activeElement === docsSearch) {
        docsSearch.value = '';
        filterEndpoints('');
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn, .feature-card').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn.loading {
        pointer-events: none;
        opacity: 0.7;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        margin: auto;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);