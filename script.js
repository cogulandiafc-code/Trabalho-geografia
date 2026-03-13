// Particle Background System
const canvas = document.getElementById('bg-particles');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 250; // More particles for a "granulation" effect
const colors = ['#005BAC', '#EF4444']; // Azul e Vermelho da França

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5, // Smaller dots
            speedX: (Math.random() - 0.5) * 1.5, // Slightly faster to always be moving
            speedY: (Math.random() - 0.5) * 1.5,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.5; // Slightly more visible
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
animateParticles();

// Scroll Reveal Logic
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);

// Curiosity Card Toggle
function toggleCuriosity() {
    const front = document.getElementById('curiosity-front');
    const back = document.getElementById('curiosity-reveal');
    
    if (back.classList.contains('hidden')) {
        front.classList.add('hidden');
        back.classList.remove('hidden');
    } else {
        back.classList.add('hidden');
        front.classList.remove('hidden');
    }
}

// Side Panel Toggle
function togglePanel() {
    const panel = document.getElementById('side-panel');
    panel.classList.toggle('open');
}

// Chart.js Graph Initialization
let chartRendered = false;
function renderChart() {
    if(chartRendered) return;
    const ctxChart = document.getElementById('gdpChart');
    if(!ctxChart) return;
    
    // Approximate Nominal GDP in Trillions US$ (Estimates)
    const data = {
        labels: ['EUA', 'China', 'Alemanha', 'Japão', 'Índia', 'Reino Unido', 'França', 'Brasil'],
        datasets: [{
            label: 'PIB Nominal (Trilhões US$)',
            data: [28.7, 18.5, 4.5, 4.1, 3.9, 3.4, 3.2, 2.3],
            backgroundColor: [
                'rgba(0, 0, 0, 0.85)', // EUA
                'rgba(0, 0, 0, 0.85)', // China
                'rgba(0, 0, 0, 0.85)', // Alemanha
                'rgba(0, 0, 0, 0.85)', // Japão
                'rgba(0, 0, 0, 0.85)', // India
                'rgba(0, 0, 0, 0.85)', // UK
                '#005BAC',             // França (Highlighted)
                'rgba(0, 0, 0, 0.85)'  // Brasil
            ],
            borderColor: [
                '#000000',
                '#000000',
                '#000000',
                '#000000',
                '#000000',
                '#000000',
                '#3B82F6',
                '#000000'
            ],
            borderWidth: 1,
            borderRadius: 6
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#6B7280' } // Darker text for white bg
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'US$ ' + context.parsed.y + ' Trilhões';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }, // Darker finer grid
                    ticks: { color: '#6B7280' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#6B7280' }
                }
            }
        }
    };

    new Chart(ctxChart, config);
    chartRendered = true;
}

// Observe when chart container is visible to trigger animation
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            renderChart();
        }
    });
}, { threshold: 0.1 });

// Attaching Observer to chart container when window loads
window.addEventListener('load', () => {
    const chartContainer = document.querySelector('.chart-container');
    if(chartContainer) {
        chartObserver.observe(chartContainer);
    }
});
