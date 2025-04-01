// Dark Mode Toggle (existing code)
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.classList.add(currentTheme);
    updateIcon();
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const theme = body.classList.contains('dark-mode') ? 'dark-mode' : '';
    localStorage.setItem('theme', theme);
    updateIcon();
});

function updateIcon() {
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('bi-moon');
        themeIcon.classList.add('bi-sun');
    } else {
        themeIcon.classList.remove('bi-sun');
        themeIcon.classList.add('bi-moon');
    }
}

// Project Filtering (existing code)
const filterButtons = document.querySelectorAll('.project-filters .btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const cardCategory = card.parentElement.getAttribute('data-category');
            
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.parentElement.style.display = 'block';
            } else {
                card.parentElement.style.display = 'none';
            }
        });
    });
});

// Smooth scrolling for anchor links (existing code)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// NEW CODE: 3D Model Viewer Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all model viewers with enhanced interactions
    setupModelViewers();
    
    // Initialize entrance animations for game cards
    setupGameCardAnimations();
});

function setupModelViewers() {
    // Get all model viewers on the page
    const modelViewers = document.querySelectorAll('model-viewer');
    
    modelViewers.forEach(modelViewer => {
        // Create the container structure if not already present
        if (!modelViewer.parentElement.classList.contains('model-container')) {
            // Get the parent element
            const parent = modelViewer.parentElement;
            
            // Create model container
            const modelContainer = document.createElement('div');
            modelContainer.className = 'model-container';
            
            // Create character glow effect
            const characterGlow = document.createElement('div');
            characterGlow.className = 'character-glow';
            
            // Create model overlay with character name
            const modelOverlay = document.createElement('div');
            modelOverlay.className = 'model-overlay';
            const altText = modelViewer.getAttribute('alt');
            modelOverlay.textContent = altText.split(' from ')[0];
            
            // Create model controls
            const modelControls = document.createElement('div');
            modelControls.className = 'model-controls';
            modelControls.innerHTML = `
                <span class="model-control-btn rotate-btn" title="Rotate"><i class="bi bi-arrow-repeat"></i></span>
                <span class="model-control-btn zoom-btn" title="Zoom"><i class="bi bi-zoom-in"></i></span>
            `;
            
            // Setup the new structure
            parent.replaceChild(modelContainer, modelViewer);
            modelContainer.appendChild(modelViewer);
            modelContainer.appendChild(characterGlow);
            modelContainer.appendChild(modelOverlay);
            modelContainer.appendChild(modelControls);
            
            // Set enhanced model viewer attributes
            modelViewer.setAttribute('environment-image', 'neutral');
            modelViewer.setAttribute('exposure', '1.2');
            modelViewer.setAttribute('shadow-intensity', '1');
            modelViewer.setAttribute('auto-rotate', 'false');
            modelViewer.setAttribute('rotation-per-second', '30deg');
        }
        
        // Store the original camera orbit and field of view
        const originalOrbit = modelViewer.getAttribute('camera-orbit');
        const originalFOV = modelViewer.getAttribute('field-of-view');
        
        modelViewer.dataset.originalOrbit = originalOrbit;
        modelViewer.dataset.originalFOV = originalFOV;
    });
    
    // Add event listeners to model containers
    const modelContainers = document.querySelectorAll('.model-container');
    
    modelContainers.forEach(container => {
        const modelViewer = container.querySelector('model-viewer');
        const rotateBtn = container.querySelector('.rotate-btn');
        const zoomBtn = container.querySelector('.zoom-btn');
        
        // Add hover effects
        container.addEventListener('mouseenter', () => {
            modelViewer.autoRotate = true;
        });
        
        container.addEventListener('mouseleave', () => {
            if (!rotateBtn.classList.contains('active')) {
                modelViewer.autoRotate = false;
            }
        });
        
        // Rotate button functionality
        if (rotateBtn) {
            rotateBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentlyRotating = modelViewer.autoRotate;
                modelViewer.autoRotate = !currentlyRotating;
                
                // Toggle active class
                rotateBtn.classList.toggle('active', !currentlyRotating);
                
                if (!currentlyRotating) {
                    // Start rotation and add glow effect
                    container.querySelector('.character-glow').style.opacity = '1';
                } else {
                    // Stop rotation
                    container.querySelector('.character-glow').style.opacity = '0';
                }
            });
        }
        
        // Zoom button functionality
        if (zoomBtn) {
            zoomBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Toggle between zoomed in and normal view
                if (!zoomBtn.classList.contains('active')) {
                    const currentFOV = modelViewer.getAttribute('field-of-view');
                    const newFOV = currentFOV ? parseInt(currentFOV) - 10 + 'deg' : '20deg';
                    modelViewer.setAttribute('field-of-view', newFOV);
                    zoomBtn.classList.add('active');
                    zoomBtn.querySelector('i').classList.remove('bi-zoom-in');
                    zoomBtn.querySelector('i').classList.add('bi-zoom-out');
                } else {
                    modelViewer.setAttribute('field-of-view', modelViewer.dataset.originalFOV || '30deg');
                    zoomBtn.classList.remove('active');
                    zoomBtn.querySelector('i').classList.remove('bi-zoom-out');
                    zoomBtn.querySelector('i').classList.add('bi-zoom-in');
                }
            });
        }
        
        // Make model viewer interactive
        modelViewer.addEventListener('click', () => {
            // Toggle between different camera angles on click
            const currentOrbit = modelViewer.cameraOrbit;
            const defaultOrbit = modelViewer.dataset.originalOrbit;
            const alternateOrbit = '0deg 85deg 2.5m';
            
            if (currentOrbit === defaultOrbit || currentOrbit === '') {
                modelViewer.cameraOrbit = alternateOrbit;
            } else {
                modelViewer.cameraOrbit = defaultOrbit;
            }
        });
    });
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.closest('.model-container')) {
            const container = document.activeElement.closest('.model-container');
            const modelViewer = container.querySelector('model-viewer');
            
            switch(e.key) {
                case 'ArrowLeft':
                    rotateCameraHorizontally(modelViewer, -10);
                    break;
                case 'ArrowRight':
                    rotateCameraHorizontally(modelViewer, 10);
                    break;
                case 'ArrowUp':
                    rotateCameraVertically(modelViewer, -10);
                    break;
                case 'ArrowDown':
                    rotateCameraVertically(modelViewer, 10);
                    break;
                case '+':
                case '=':
                    zoomCamera(modelViewer, -5);
                    break;
                case '-':
                case '_':
                    zoomCamera(modelViewer, 5);
                    break;
            }
        }
    });
}

// Helper functions for camera manipulation
function rotateCameraHorizontally(modelViewer, degrees) {
    const orbit = modelViewer.cameraOrbit.split(' ');
    const currentDegrees = parseFloat(orbit[0]);
    orbit[0] = (currentDegrees + degrees) + 'deg';
    modelViewer.cameraOrbit = orbit.join(' ');
}

function rotateCameraVertically(modelViewer, degrees) {
    const orbit = modelViewer.cameraOrbit.split(' ');
    const currentDegrees = parseFloat(orbit[1]);
    // Limit vertical rotation to prevent flipping
    const newDegrees = Math.max(10, Math.min(170, currentDegrees + degrees));
    orbit[1] = newDegrees + 'deg';
    modelViewer.cameraOrbit = orbit.join(' ');
}

function zoomCamera(modelViewer, degrees) {
    const fov = modelViewer.getAttribute('field-of-view');
    const currentFOV = parseInt(fov);
    // Limit FOV to reasonable values
    const newFOV = Math.max(15, Math.min(45, currentFOV + degrees));
    modelViewer.setAttribute('field-of-view', newFOV + 'deg');
}

// Setup animation for game cards
function setupGameCardAnimations() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach((card, index) => {
        // Add animation delay based on index
        card.style.animationDelay = (index * 0.1) + 's';
        
        // Add observer for scroll-based animation
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            
                            // Briefly auto-rotate the model viewer
                            const modelViewer = entry.target.querySelector('model-viewer');
                            if (modelViewer) {
                                modelViewer.autoRotate = true;
                                setTimeout(() => {
                                    modelViewer.autoRotate = false;
                                }, 2000);
                            }
                        }, index * 100);
                        
                        // Stop observing once animated
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        
        observer.observe(card);
    });
}

// Run the setup once the page loads
window.addEventListener('load', () => {
    // Add initial animation for models
    const modelViewers = document.querySelectorAll('model-viewer');
    
    modelViewers.forEach((modelViewer, index) => {
        setTimeout(() => {
            // Start a brief auto-rotate on page load
            modelViewer.autoRotate = true;
            
            // Stop auto-rotate after 3 seconds
            setTimeout(() => {
                modelViewer.autoRotate = false;
            }, 3000);
        }, 500 * index);
    });
});