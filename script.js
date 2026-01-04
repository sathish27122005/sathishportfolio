document.addEventListener('DOMContentLoaded', () => {
    // 3D Carousel Logic
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const items = document.querySelectorAll('.carousel-item');
        const radius = 400; // Distance from center

        // Distribute items in a circle
        items.forEach((item, index) => {
            const theta = (360 / items.length) * index;
            item.style.transform = `rotateY(${theta}deg) translateZ(${radius}px)`;
        });

        let currDeg = 0;
        let isRotating = true;
        let rotationDirection = 1; // 1 for clockwise, -1 for counterclockwise
        let maxRotation = 60; // Maximum rotation angle in each direction

        // Auto rotation with oscillation
        let autoRotate = setInterval(() => {
            if (isRotating) {
                currDeg += rotationDirection * 0.3;

                // Change direction when reaching max rotation
                if (Math.abs(currDeg) >= maxRotation) {
                    rotationDirection *= -1;
                }

                carousel.style.transform = `rotateY(${currDeg}deg)`;
            }
        }, 50);

        // Pause rotation on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                isRotating = false;
            });

            carouselContainer.addEventListener('mouseleave', () => {
                isRotating = true;
            });

            // Mouse Drag Interaction
            let isDown = false;
            let startX;
            // let currentRotation = 0; // Unused
            const container = carouselContainer; // Use the same reference

            container.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX;
                clearInterval(autoRotate); // Stop auto rotate on interaction
                container.style.cursor = 'grabbing';
            });

            container.addEventListener('mouseleave', () => {
                isDown = false;
                container.style.cursor = 'grab';
                // Restart auto rotate
                autoRotate = setInterval(() => {
                    currDeg -= 1;
                    carousel.style.transform = `rotateY(${currDeg}deg)`;
                }, 50);
            });

            container.addEventListener('mouseup', () => {
                isDown = false;
                container.style.cursor = 'grab';
                // Restart auto rotate
                autoRotate = setInterval(() => {
                    currDeg -= 1;
                    carousel.style.transform = `rotateY(${currDeg}deg)`;
                }, 50);
            });

            container.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX;
                const walk = (x - startX) * 0.2; // Rotate sensitivity
                currDeg += walk;
                carousel.style.transform = `rotateY(${currDeg}deg)`;
                startX = x;
            });
        }
    }

    // Cursor Effect
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.top = e.clientY + 'px';
        cursor.style.left = e.clientX + 'px';

        // Slight delay for follower
        setTimeout(() => {
            follower.style.top = e.clientY + 'px';
            follower.style.left = e.clientX + 'px';
        }, 50);
    });

    // Hover effects for cursor
    const links = document.querySelectorAll('a, .card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            follower.style.width = '80px';
            follower.style.height = '80px';
            follower.style.border = '1px solid #fff'; // White border on dark bg
            cursor.style.backgroundColor = 'transparent';
        });
        link.addEventListener('mouseleave', () => {
            follower.style.width = '40px';
            follower.style.height = '40px';
            follower.style.border = '1px solid var(--primary)';
            cursor.style.backgroundColor = 'var(--primary)';
        });
    });

    // Reveal on Scroll
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    // Note: Add class .animate-on-scroll to elements you want to fade in if needed
    // Currently handling .about-card via css hover, but can add scroll reveal here

    // Numeric Counter Animation
    const stats = document.querySelectorAll('.num');

    // Function to run the counter animation
    const runCounterAnimation = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-val');
            let count = 0;
            const updateCount = () => {
                const inc = target / 100;
                if (count < target) {
                    count += inc;
                    stat.innerText = Math.ceil(count) + '+';
                    setTimeout(updateCount, 20);
                } else {
                    stat.innerText = target + '+';
                }
            };
            updateCount();
        });
    };

    // Run animation immediately on page load
    runCounterAnimation();

    // Also run on scroll for redundancy (in case user refreshes)
    let started = false;
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            runCounterAnimation();
            started = true;
        }
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) statsObserver.observe(statsSection);

    // Tilt Effect for About Card
    const card = document.querySelector('.about-card');
    if (card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // Project Modal Functionality
    const modal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTechStack = document.getElementById('modalTechStack');
    const closeModal = document.querySelector('.close-modal');
    // Project data - customize these with your actual project details
    const projects = [
        {
            title: "Automatic Touchless Water Dispenser Using Arduino Uno",
            description: "This project aims to design an automatic water dispenser that supplies water without physical contact. An ultrasonic sensor detects the presence of a hand or container near the outlet, and the Arduino Uno processes this input to control a water motor via a relay. When an object is detected within a set distance, the motor turns ON to dispense water; once removed, the motor turns OFF automatically. This system promotes hygiene, water conservation, and automation, making it suitable for homes, colleges, hospitals, and public places.",
            image: "photos/project1.png",
            technologies: ["Arduino Uno", "Ultrasonic Sensor (HC-SR04)", "Water Motor / Pump", "Relay Module", "Battery / Power Supply", "Breadboard", "Jumper Wires", "Embedded C / Arduino IDE"],
            features: [
                "Touchless Operation for improved hygiene",
                "Automatic ON/OFF Control of water motor",
                "Water Saving System – Dispenses only when needed",
                "Low Cost & Easy to Build using basic components",
                "Compact and Portable Design",
                "Can be Extended with IoT, LCD display, or timer control"
            ],
            galleryImages: ["photos/project11.jpeg"], // Converted to array
            video: "vedios/project11.mp4"
        },
        {
            title: "Voice Controlled Home Automation Using ESP32 & Google Assistant",
            description: "This project implements a voice-controlled home automation system where household appliances are operated using voice commands through Google Assistant. An ESP32 microcontroller acts as the central controller, receiving commands via Wi-Fi from a cloud platform and switching appliances ON or OFF using relay modules. When the user gives a voice command, Google Assistant processes it and sends the control signal through the internet. The ESP32 receives this command in real time and activates the corresponding relay, enabling seamless and hands-free control of home appliances.",
            image: "photos/project2.png",
            technologies: ["Embedded Systems", "Internet of Things (IoT)", "Wi-Fi communication", "Cloud automation", "Voice recognition"],
            features: [
                "Hands-free appliance control",
                "Real-time response via internet",
                "Low-cost and energy-efficient design",
                "Scalable for multiple devices",
                "Applications: Smart homes, assistive living, energy management systems"
            ],
            galleryImages: ["photos/project21.jpeg", "photos/project22.jpeg"],
            video: "vedios/project21.mp4"
        },
        {
            title: "Mesh Networking Using LoRa Module",
            description: "This project implements a wireless mesh network using LoRa technology, where multiple nodes communicate with each other over long distances. Each node can send, receive, and forward data, enabling multi-hop communication across the network. If one node fails, the network automatically reroutes data through other available nodes, ensuring reliable and fault-tolerant communication. Due to the long-range and low-power nature of LoRa, this system is well suited for IoT applications such as smart agriculture, environmental monitoring, campus-wide communication, and disaster management systems.",
            image: "photos/project3.png",
            technologies: [
                "ESP32 Microcontroller",
                "LoRa Module (433 MHz / 868 MHz / 915 MHz)",
                "LoRa Mesh / Multi-Hop Communication",
                "Arduino IDE",
                "Embedded C/C++",
                "Power Supply (Battery/Adapter)"
            ],
            features: [
                "Long-range communication (up to several kilometers)",
                "Self-healing mesh topology",
                "Low power consumption",
                "Scalable network design",
                "Reliable data delivery"
            ],
            galleryImages: ["photos/project31.jpeg", "photos/project32.jpeg", "photos/project33.jpeg"],
            video: "vedios/project31.mp4"
        }
    ];

    // Detect if we are on the Project Details Page
    if (window.location.pathname.includes('project.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        if (projectId !== null && projects[projectId]) {
            const project = projects[projectId];

            document.getElementById('projectTitle').innerText = project.title;
            document.getElementById('projectImage').src = project.image;
            document.getElementById('projectDescription').innerText = project.description;

            const techContainer = document.getElementById('projectTech');
            techContainer.innerHTML = '';
            project.technologies.forEach(tech => {
                const tag = document.createElement('div');
                tag.className = 'tech-item';
                tag.innerText = tech;
                techContainer.appendChild(tag);
            });

            // Populate features
            const featuresContainer = document.getElementById('projectFeatures');
            if (featuresContainer && project.features) {
                let featuresHtml = '<ul style="list-style: none; padding-left: 0;">';
                project.features.forEach(feature => {
                    featuresHtml += `<li style="margin-bottom: 0.8rem; color: #ddd;"><i class="fas fa-check-circle" style="color: var(--primary); margin-right: 10px;"></i>${feature}</li>`;
                });
                featuresHtml += '</ul>';
                featuresContainer.innerHTML = featuresHtml;
            }

            // Optional: Update page title
            document.title = `${project.title} | Sathish Portfolio`;

            // Handle Media Section
            const mediaSection = document.getElementById('mediaSection');
            const imageContainer = document.getElementById('imageContainer');
            const videoContainer = document.getElementById('videoContainer');
            const projectExtraImage = document.getElementById('projectExtraImage');
            const projectVideo = document.getElementById('projectVideo');
            const projectVideoSource = document.getElementById('projectVideoSource');

            let hasMedia = false;
            console.log("Checking project media for:", project.title);
            console.log("Additional Image:", project.additionalImage);
            console.log("Video:", project.video);

            // Handle Gallery Images
            if (project.galleryImages && project.galleryImages.length > 0) {
                let imagesHtml = '<h3 style="color: var(--secondary); margin-bottom: 1rem; font-size: 1.5rem;">Project Gallery</h3>';
                project.galleryImages.forEach(imgSrc => {
                    imagesHtml += `<img src="${imgSrc}" alt="Project Detail" style="width: 100%; border-radius: 10px; border: 1px solid var(--primary); margin-bottom: 1rem;">`;
                });
                imageContainer.innerHTML = imagesHtml;
                imageContainer.style.display = 'block';
                hasMedia = true;
            } else {
                imageContainer.style.display = 'none';
            }

            // Handle Video
            if (project.video) {
                projectVideoSource.src = project.video;
                projectVideo.load(); // Reload video element to apply new source
                videoContainer.style.display = 'block';
                hasMedia = true;
            } else {
                videoContainer.style.display = 'none';
            }

            // Show/Hide entire section
            if (hasMedia) {
                mediaSection.style.display = 'block';
            } else {
                mediaSection.style.display = 'none';
            }
        }
    } else {
        // We are likely on index.html, setup carousel click for navigation
        const carouselItems = document.querySelectorAll('.carousel-item');
        carouselItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Navigate to project details page
                window.location.href = `project.html?id=${index}`;
            });
        });
    }

    // Modal code is no longer needed for navigation, but keeping generic closing logic if other modals exist
    // ... (rest of generic UI code)     

    // Check if modal elements exist before adding listeners to avoid errors on project.html
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
        const closeModal = document.querySelector('.close-modal');
        // Close modal when clicking the X
        closeModal.addEventListener('click', () => {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Certificate Modal Functionality
    const certificates = [
        {
            title: "AR/VR & Immersive Tech",
            image: "photos/certificate1.jpg",
            learnings: [
                "Basics of Augmented Reality (AR)",
                "Basics of Virtual Reality (VR)",
                "Immersive Technology Tools & Platforms",
                "3D Environment and Interaction Design",
                "Industrial & Real-World Applications of AR/VR"
            ]
        },
        {
            title: "Internet of Things",
            image: "photos/certificate2.jpeg",
            learnings: [
                "IoT Architecture & Protocols (MQTT, HTTP, CoAP)",
                "Microcontroller Programming (ESP32/NodeMCU)",
                "Sensor Interfacing & Data Acquisition",
                "Cloud Platforms & IoT Dashboards",
                "Wireless Communication Standards (Wi-Fi, BLE)"
            ]
        },
        {
            title: "NPTEL Entrepreneurship",
            image: "photos/certificate3.jpeg",
            learnings: [
                "Business Model Canvas & Lean Startup",
                "Market Research & Customer Discovery",
                "Financial Planning & Funding Strategies",
                "Product Development Lifecycle",
                "Go-to-Market Strategies"
            ]
        },
        {
            title: "NPTEL Internet of Things (IoT)",
            image: "photos/certificate4.jpeg",
            learnings: [
                "IoT Architecture & Layers",
                "Sensing & Actuation",
                "Communication Protocols (MQTT, CoAP)",
                "Cloud Computing for IoT",
                "Industrial IoT Applications"
            ]
        },
        {
            title: "Embedded System with IoT",
            image: "photos/certificate5.jpeg",
            learnings: [
                "Microcontroller Architectures",
                "Sensor Integration",
                "IoT Communication Protocols",
                "Real-time Data Processing",
                "Embedded C / Python Programming"
            ]
        },
        {
            title: "Fundamentals in Switchgear and Fuses",
            image: "photos/certificate6.jpeg",
            learnings: [
                "Circuit Breakers & Fuses",
                "Power System Protection",
                "Switchgear Components & Operation",
                "Fault Analysis & Safety",
                "Industrial Standards & Applications"
            ]
        },

    ];

    const certModal = document.getElementById('certificateModal');
    if (certModal) {
        const certCards = document.querySelectorAll('.cert-card');
        const certImage = document.getElementById('certModalImage');
        const certTitle = document.getElementById('certModalTitle');
        const certLearnings = document.getElementById('certLearningsList');
        // Close button inside this specific modal
        const closeCert = certModal.querySelector('.close-modal');

        // Add click event to each card
        certCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                // Ensure we have data for this index
                if (certificates[index]) {
                    const data = certificates[index];
                    certImage.src = data.image;
                    certTitle.innerText = data.title;

                    // Clear previous list
                    certLearnings.innerHTML = '';

                    // Populate learnings
                    data.learnings.forEach(item => {
                        const li = document.createElement('li');
                        li.innerHTML = `<i class="fas fa-check" style="color: var(--primary); margin-right: 8px;"></i>${item}`;
                        li.style.color = '#ccc';
                        li.style.marginBottom = '0.5rem';
                        certLearnings.appendChild(li);
                    });

                    certModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close logic
        closeCert.addEventListener('click', () => {
            certModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                certModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Contact Form Gmail Direct
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('senderName').value;
            const message = document.getElementById('messageBody').value;

            // Get rating
            const ratingInput = document.querySelector('input[name="rating"]:checked');
            const rating = ratingInput ? ratingInput.value : "No rating given";

            const email = "sk7726413@gmail.com";
            const subject = `Portfolio Feedback from ${name}`;
            const body = `Rating: ${rating}/5 Stars\n\n${message}\n\n- Sent from ${name}`;

            // Construct Mailto URL
            const gmailLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Open in new tab
            window.open(gmailLink, '_blank');

            // Optional: clear form
            contactForm.reset();
        });
    }

    // Gravity Button Logic
    const gravityBtn = document.getElementById('gravityBtn');
    if (gravityBtn) {
        gravityBtn.addEventListener('click', () => {
            if (confirm("WARNING: This will break the page layout! Are you sure?")) {
                enableGravity();
            }
        });
    }

    function enableGravity() {
        // Select all elements that should fall
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, span, img, .card, .glass-panel, input, textarea, button, .circle-spin, .about-card');
        const bodies = [];

        // Freeze scrolling
        document.body.style.overflow = 'hidden';

        elements.forEach(el => {
            // Skip the gravity button itself so you can see it
            if (el.id === 'gravityBtn') return;

            const rect = el.getBoundingClientRect();

            // Only affect elements within view or close to it
            // if (rect.top > window.innerHeight || rect.bottom < 0) return;

            // Store original state and physics props
            bodies.push({
                el: el,
                x: rect.left,
                y: rect.top,
                vx: (Math.random() - 0.5) * 4, // Random horizontal velocity
                vy: 0, // Initial vertical velocity
                rotation: 0,
                vr: (Math.random() - 0.5) * 2 // Rotation velocity
            });

            // Set fixed positioning to break layout
            el.style.position = 'fixed';
            el.style.left = rect.left + 'px';
            el.style.top = rect.top + 'px';
            el.style.margin = '0';
            el.style.width = rect.width + 'px';
            el.style.transition = 'none'; // Disable CSS transitions for physics
            el.style.zIndex = '1000';
        });

        const gravity = 0.5;
        const friction = 0.99;
        const bounce = 0.7;

        function update() {
            bodies.forEach(body => {
                // Apply forces
                body.vy += gravity;
                body.vx *= friction;
                body.x += body.vx;
                body.y += body.vy;
                body.rotation += body.vr;

                // Floor collision
                const floor = window.innerHeight;
                const height = body.el.offsetHeight;

                if (body.y + height > floor) {
                    body.y = floor - height;
                    body.vy *= -bounce; // Bounce
                    body.vx *= 0.8; // Floor friction
                }

                // Screen boundaries (optional)
                const width = body.el.offsetWidth;
                if (body.x < 0) {
                    body.x = 0;
                    body.vx *= -bounce;
                } else if (body.x + width > window.innerWidth) {
                    body.x = window.innerWidth - width;
                    body.vx *= -bounce;
                }

                // Update DOM
                body.el.style.left = body.x + 'px';
                body.el.style.top = body.y + 'px';
                body.el.style.transform = `rotate(${body.rotation}deg)`;
            });

            requestAnimationFrame(update);
        }

        update();
    }

    // Comet Button Logic
    const cometBtn = document.getElementById('cometBtn');
    if (cometBtn) {
        cometBtn.addEventListener('click', () => {
            createComet();
        });
    }

    function createComet() {
        const comet = document.createElement('div');
        comet.className = 'comet';

        // Random starting position (mostly top-left area)
        const startX = Math.random() * (window.innerWidth / 2) - 100;
        const startY = -100;

        comet.style.left = startX + 'px';
        comet.style.top = startY + 'px';

        document.body.appendChild(comet);

        // Remove after animation matches CSS duration
        setTimeout(() => {
            comet.remove();
        }, 1500);
    }

    // Initialize Gravity if button exists (re-bind check)
    // (Existing gravity logic is already there, no need to duplicate)
});
