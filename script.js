// Intersection Observer for Scroll Animations (Replaces Framer Motion logic)
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-slide-left, .reveal-slide-right');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                // Optional: Unobserve if you only want the animation to happen once
                // observer.unobserve(entry.target); 
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
            navbar.classList.replace('bg-darkBg/80', 'bg-darkBg/95');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.classList.replace('bg-darkBg/95', 'bg-darkBg/80');
        }
    });

    // Initialize Circuit Background Canvas
    initCircuitBg();
});

// Smooth Scroll fallback handling
function scrollToSection(id) {
    const el = document.getElementById(id);
    if(el) {
        window.scrollTo({
            top: el.offsetTop,
            behavior: 'smooth'
        });
    }
}

// Interactive Circuit Background for Hero Section
function initCircuitBg() {
    const container = document.getElementById('circuit-bg');
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    
    function resize() {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    // Circuit data structures
    const nodes = [];
    const lines = [];
    const particles = [];
    
    const nodeCount = 40;
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1
        });
    }

    // Create orthological lines (Manhattan style typical in circuits)
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = Math.abs(nodes[i].x - nodes[j].x);
            const dy = Math.abs(nodes[i].y - nodes[j].y);
            
            // Connect only if relatively close
            if (dx < 150 && dy < 150 && Math.random() > 0.6) {
                // Determine bend point for right angle connection
                const midX = Math.random() > 0.5 ? nodes[i].x : nodes[j].x;
                const midY = midX === nodes[i].x ? nodes[j].y : nodes[i].y;
                
                lines.push({
                    start: nodes[i],
                    end: nodes[j],
                    mid: { x: midX, y: midY },
                    active: Math.random() > 0.8,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw lines
        lines.forEach(line => {
            line.pulsePhase += 0.02;
            const isPulsing = Math.sin(line.pulsePhase) > 0.8;
            
            ctx.beginPath();
            ctx.moveTo(line.start.x, line.start.y);
            ctx.lineTo(line.mid.x, line.mid.y);
            ctx.lineTo(line.end.x, line.end.y);
            
            // Neon Cyan coloring for active lines, otherwise dark gray
            if (line.active && isPulsing) {
                ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00f0ff';
            } else {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.lineWidth = 1;
                ctx.shadowBlur = 0;
            }
            ctx.stroke();
        });

        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + 1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00f0ff';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}
