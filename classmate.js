/* ########################################################################## */
/*                 START OF GENERAL & INDEX.HTML / COURSE.HTML JS             */
/* ########################################################################## */
document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("loginModal");
    const closeModalBtn = document.getElementById("closeModal");
    const registerModal = document.getElementById("registerModal");
    const closeRegisterModalBtn = document.getElementById("closeRegisterModal");

    const ourPeopleModal = document.getElementById("ourPeopleModal");
    const closeOurPeopleModalBtn = document.getElementById("closeOurPeopleModal");
    const ourPeopleLink = document.getElementById("ourPeopleLink");

    const courseDetailModal = document.getElementById("courseDetailModal");
    const closeCourseDetailModalBtn = document.getElementById("closeCourseDetailModal");
    const courseBtns = document.querySelectorAll(".course-btn");

    const bookCourseModal = document.getElementById("bookCourseModal");
    const closeBookCourseModalBtn = document.getElementById("closeBookCourseModal");
    const openBookCourseBtn = document.getElementById("modalCourseLink");
    const bookCourseForm = document.getElementById("bookCourseForm");


    // Find all links that navigate to login.html
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const registerLinks = document.querySelectorAll('a[href="register.html"]');

    // Open modal on click, without navigating away
    loginLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            if (localStorage.getItem('loggedInUser')) {
                // Let the logout listener handle it, or do nothing here
                return;
            }
            e.preventDefault(); 
            if (registerModal) registerModal.classList.remove("show");
            if (loginModal) loginModal.classList.add("show");
        });
    });

    registerLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            if (localStorage.getItem('loggedInUser')) {
                return;
            }
            e.preventDefault(); 
            if (loginModal) loginModal.classList.remove("show");
            if (registerModal) registerModal.classList.add("show");
        });
    });

    // Open Our People Modal
    if (ourPeopleLink) {
        ourPeopleLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (loginModal) loginModal.classList.remove("show");
            if (registerModal) registerModal.classList.remove("show");
            if (ourPeopleModal) ourPeopleModal.classList.add("show");
        });
    }

    // Close modal when 'X' is clicked
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            loginModal.classList.remove("show");
        });
    }

    if (closeRegisterModalBtn) {
        closeRegisterModalBtn.addEventListener("click", () => {
            registerModal.classList.remove("show");
        });
    }

    if (closeOurPeopleModalBtn) {
        closeOurPeopleModalBtn.addEventListener("click", () => {
            ourPeopleModal.classList.remove("show");
        });
    }

    if (closeBookCourseModalBtn) {
        closeBookCourseModalBtn.addEventListener("click", () => {
            bookCourseModal.classList.remove("show");
        });
    }

    // Close modal when clicking anywhere outside of it
    window.addEventListener("click", (event) => {
        if (loginModal && event.target === loginModal) {
            loginModal.classList.remove("show");
        }
        if (registerModal && event.target === registerModal) {
            registerModal.classList.remove("show");
        }
        if (ourPeopleModal && event.target === ourPeopleModal) {
            ourPeopleModal.classList.remove("show");
        }
        if (courseDetailModal && event.target === courseDetailModal) {
            courseDetailModal.classList.remove("show");
        }
        if (bookCourseModal && event.target === bookCourseModal) {
            bookCourseModal.classList.remove("show");
        }
    });

    // Course Detail Modal Logic
    if (courseDetailModal) {
        courseBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Get data from button
                const title = btn.getAttribute("data-title");
                const description = btn.getAttribute("data-description");

                // Populate modal
                document.getElementById("modalCourseTitle").innerHTML = `<span class="text-black">${title}</span>`;
                document.getElementById("modalCourseDescription").textContent = description;

                // Show modal
                courseDetailModal.classList.add("show");
            });
        });

        // Close modal with 'X'
        if (closeCourseDetailModalBtn) {
            closeCourseDetailModalBtn.addEventListener("click", () => {
                courseDetailModal.classList.remove("show");
            });
        }

        // Open Book Course Modal from Course Detail Modal
        if (openBookCourseBtn) {
            openBookCourseBtn.addEventListener("click", () => {
                const courseTitle = document.getElementById("modalCourseTitle").textContent;
                // Populate the hidden input in the booking form
                document.getElementById("bookingCourseName").value = courseTitle;
                // Pre-select the course in the new dropdown
                document.getElementById("booking-course-select").value = courseTitle;
                courseDetailModal.classList.remove("show"); // Hide the details modal
                bookCourseModal.classList.add("show"); // Show the booking modal
            });
        }
    }

    // Book Course Form Submission Logic
    if (bookCourseForm) {
        bookCourseForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const courseImageInput = document.getElementById("booking-image");
            const file = courseImageInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const bookingData = {
                        fullName: document.getElementById("booking-name").value,
                        phone: document.getElementById("booking-phone").value,
                        email: document.getElementById("booking-email").value,
                        selectedCourse: document.getElementById("booking-course-select").value,
                        transactionId: document.getElementById("transaction-id").value,
                        courseImage: event.target.result // Base64 string of the image
                    };

                    // Save to localStorage
                    saveBooking(bookingData);

                    // Give feedback and close modal
                    alert("Your course booking has been submitted successfully!");
                    bookCourseForm.reset();
                    if (bookCourseModal) {
                        bookCourseModal.classList.remove("show");
                    }
                };
                reader.readAsDataURL(file); // Read the image as a Base64 string
            } else {
                alert("Please upload a transaction image.");
            }
        });
    }

    function saveBooking(newBooking) {
        // Get existing bookings or initialize an empty array
        const bookings = JSON.parse(localStorage.getItem('courseBookings')) || [];
        bookings.push(newBooking);
        // Save back to localStorage
        localStorage.setItem('courseBookings', JSON.stringify(bookings));
    }

    /* ########################################################################## */
    /*                       START OF STUDENT REGISTRATION/LOGIN                  */
    /* ########################################################################## */
    
    // Student Registration
    const registerForms = document.querySelectorAll('#registerForm');
    registerForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername')?.value || document.getElementById('reg-username')?.value;
            const phone = document.getElementById('regPhone')?.value || document.getElementById('reg-phone')?.value;
            const email = document.getElementById('regEmail')?.value || document.getElementById('reg-email')?.value;
            const password = document.getElementById('regPassword')?.value || document.getElementById('reg-password')?.value;
            const confirmPassword = document.getElementById('regConfirmPassword')?.value || document.getElementById('reg-confirm-password')?.value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            const students = JSON.parse(localStorage.getItem('registeredStudents')) || [];
            const exists = students.find(s => s.username === username || s.email === email);
            if (exists) {
                alert('User with this username or email already exists!');
                return;
            }

            students.push({ username, phone, email, password });
            localStorage.setItem('registeredStudents', JSON.stringify(students));
            
            alert('Registration successful! You can now login.');
            
            if (document.getElementById('registerModal')) {
                document.getElementById('registerModal').classList.remove('show');
                if (document.getElementById('loginModal')) {
                    document.getElementById('loginModal').classList.add('show');
                }
            } else {
                window.location.href = 'login.html';
            }
        });
    });

    // Student Login
    const loginForms = document.querySelectorAll('#loginForm');
    loginForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername')?.value || document.getElementById('username')?.value;
            const password = document.getElementById('loginPassword')?.value || document.getElementById('password')?.value;

            const students = JSON.parse(localStorage.getItem('registeredStudents')) || [];
            const user = students.find(s => s.username === username && s.password === password);

            if (user) {
                alert('Login successful! Welcome, ' + username);
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                
                if (document.getElementById('loginModal')) {
                    document.getElementById('loginModal').classList.remove('show');
                }
                updateNavWithUser();
                
                if (window.location.pathname.includes('login.html')) {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Invalid username or password!');
            }
        });
    });

    // Show User on Nav
    function updateNavWithUser() {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                if(link.textContent.includes('Login/Registration') || link.classList.contains('login-btn')) {
                    link.textContent = 'Welcome, ' + user.username;
                    link.href = '#';
                    link.style.backgroundColor = '#f59e0b';
                    link.style.color = '#fff';
                    link.style.borderRadius = '20px';
                    link.style.padding = '8px 16px';
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        if(confirm('Do you want to logout?')) {
                            localStorage.removeItem('loggedInUser');
                            window.location.reload();
                        }
                    });
                }
            });
        }
    }
    updateNavWithUser();

    /* ########################################################################## */
    /*                          START OF ADMIN LOGIN JS                           */
    /* ########################################################################## */
    
    const adminLoginModal = document.getElementById("adminLoginModal");
    const closeAdminLoginModalBtn = document.getElementById("closeAdminLoginModal");
    const adminBtn = document.getElementById("adminBtn");
    const adminLoginForm = document.getElementById("adminLoginForm");

    if (adminBtn) {
        adminBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (adminLoginModal) {
                adminLoginModal.classList.add("show");
            }
        });
    }

    if (closeAdminLoginModalBtn) {
        closeAdminLoginModalBtn.addEventListener("click", () => {
            if (adminLoginModal) {
                adminLoginModal.classList.remove("show");
            }
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById("admin-username");
            const passwordInput = document.getElementById("admin-password");
            
            // Admin credentials
            const admins = {
                "Mrinmoy": "100",
                "Sayan": "101",
                "Sayak": "102"
            };
            
            // Check if the username exists and the password is correct
            if (admins.hasOwnProperty(usernameInput.value) && admins[usernameInput.value] === passwordInput.value) {
                alert("Admin logged in successfully!");
                adminLoginModal.classList.remove("show");
                window.location.href = "admin.html";
            } else {
                alert("Login failed, please enter valid username or password.");
                passwordInput.value = ""; // Clear password field for security
                usernameInput.focus();
            }
        });
    }

    /* ########################################################################## */
    /*                           END OF ADMIN LOGIN JS                            */
    /* ########################################################################## */


    /* ########################################################################## */
    /*                          START OF SKILLS.HTML JS                           */
    /*            GRAPH TELEMETRY CONTROLLER                                      */
    /* ########################################################################## */
    const tideNodes = document.querySelectorAll(".tide-node");
    const filterButtons = document.querySelectorAll(".tide-filter-btn");
    const domainCards = document.querySelectorAll(".tide-domain-card");
    const liveAmplitudeScore = document.getElementById("liveAmplitudeScore");

    // Telemetry data dictionary for each node buoy
    const telemetryDictionary = {
        react: {
            category: "FRONTEND ARCHITECTURE",
            title: "React 19 & Next.js 14 Enterprise Stack",
            desc: "Master server-side rendering (SSR), React Server Components (RSCs), advanced concurrency, and micro-frontend federation used by production engineering teams at Netflix, Airbnb, and Vercel.",
            code: `// Live SSR Throughput Check\nexport async function getTelemetryData() {\n  const stream = await initTideStream({ cache: 'force-cache' });\n  return stream.benchmark({ latency: '< 8ms', status: 200 });\n}`,
            bar1Label: "Architecture Scalability & Clean Code",
            bar1Val: "98%",
            bar2Label: "Runtime Performance & Memory Optimization",
            bar2Val: "96%",
            bar3Label: "Production Deployment & Security Checks",
            bar3Val: "99%",
            amplitude: "98.4%"
        },
        node: {
            category: "DISTRIBUTED BACKEND",
            title: "Node.js, Express & Microservices Engine",
            desc: "Architect non-blocking event loops, cluster concurrency, gRPC RPC communication, and distributed event sourcing pipelines capable of sustaining millions of concurrent WebSocket streams.",
            code: `// Cluster Workers Concurrency Engine\nimport cluster from 'node:cluster';\nif (cluster.isPrimary) {\n  forkWorkers({ instances: 'MAX_CPUS', loadBalance: 'round-robin' });\n}`,
            bar1Label: "High-Concurrency WebSocket Scalability",
            bar1Val: "95%",
            bar2Label: "Event Loop Latency & Garbage Collection",
            bar2Val: "94%",
            bar3Label: "JWT OAuth2 & API Rate-Limiting Defense",
            bar3Val: "97%",
            amplitude: "95.8%"
        },
        python: {
            category: "AI & LLM SYSTEMS",
            title: "Python AI, LangChain & LLM Agent Loops",
            desc: "Engineer production Retrieval-Augmented Generation (RAG) pipelines, autonomous reasoning agents, vector embeddings indexing, and custom PyTorch transformer fine-tuning loops.",
            code: `// Autonomous Agentic RAG Pipeline\nconst agent = new LangChainAgent({ model: 'llama-3-70b' });\nconst context = await vectorDb.similaritySearch(query, { topK: 5 });\nreturn agent.synthesize({ context, prompt: sysPrompt });`,
            bar1Label: "Vector DB Retrieval & Embedding Accuracy",
            bar1Val: "96%",
            bar2Label: "LLM Token Cost & Inference Optimization",
            bar2Val: "93%",
            bar3Label: "Agentic Loop Guardrails & Hallucination Checks",
            bar3Val: "95%",
            amplitude: "96.2%"
        },
        db: {
            category: "HIGH-THROUGHPUT DATA",
            title: "PostgreSQL, Redis Clusters & Kafka Queues",
            desc: "Design sub-millisecond data architectures, ACID compliant distributed transactions, multi-master replication, and real-time Kafka event streaming engines handling petabyte-scale loads.",
            code: `// Redis Sub-ms In-Memory Caching Strategy\nconst cached = await redisCluster.get(\`user:session:\${id}\`);\nif (!cached) return fetchAndWarmCache(id, { ttl: 3600 });\nreturn JSON.parse(cached);`,
            bar1Label: "SQL Query Indexing & Execution Plans",
            bar1Val: "97%",
            bar2Label: "In-Memory Cache Hit Ratio & Eviction",
            bar2Val: "98%",
            bar3Label: "Data Encryption at Rest & Transit SSL",
            bar3Val: "99%",
            amplitude: "97.5%"
        },
        devops: {
            category: "CLOUD NATIVE DEVOPS",
            title: "Kubernetes Swarm, Docker & AWS Cloud Native",
            desc: "Orchestrate self-healing containerized microservices across multi-region AWS infrastructure using Terraform IaC, automated zero-downtime canary rollouts, and GitOps CI/CD pipelines.",
            code: `# Kubernetes High-Availability Deployment\napiVersion: apps/v1\nkind: Deployment\nspec:\n  replicas: 12\n  strategy: { type: RollingUpdate, maxSurge: 25% }`,
            bar1Label: "Container Cold-Start & Image Size Optimization",
            bar1Val: "94%",
            bar2Label: "Auto-Scaling & CPU/Memory Utilization",
            bar2Val: "95%",
            bar3Label: "Zero-Trust VPC Network Policies & IAM",
            bar3Val: "98%",
            amplitude: "94.9%"
        },
        core: {
            category: "FAANG SYSTEMS DSA",
            title: "C++ Systems Architecture & Competitive DSA",
            desc: "Conquer low-latency systems engineering, custom memory allocators, lock-free multi-threading, and dynamic programming algorithms required to clear elite technical interviews at FAANG firms.",
            code: `// Lock-Free Multi-Threaded Queue in C++20\ntemplate<typename T>\nclass LockFreeQueue {\n  std::atomic<Node<T>*> head_, tail_;\n  bool try_push(const T& val) noexcept;\n};`,
            bar1Label: "Time Complexity (Big-O) & Cache Locality",
            bar1Val: "98%",
            bar2Label: "Low-Latency Heap Memory Management",
            bar2Val: "97%",
            bar3Label: "Systems Deadlock & Race Condition Hardening",
            bar3Val: "99%",
            amplitude: "98.1%"
        }
    };

    if (tideNodes.length > 0) {
        // Node Click Listener to update inspector panel
        tideNodes.forEach((node) => {
            node.addEventListener("click", () => {
                // Remove active class from all nodes
                tideNodes.forEach((n) => n.classList.remove("active"));
                node.classList.add("active");

                const nodeId = node.getAttribute("data-id");
                const data = telemetryDictionary[nodeId];

                if (data) {
                    const catEl = document.getElementById("inspectorCategory");
                    const titleEl = document.getElementById("inspectorTitle");
                    const descEl = document.getElementById("inspectorDesc");
                    const codeEl = document.getElementById("inspectorCode");
                    const bar1Val = document.getElementById("bar1Val");
                    const bar1Fill = document.getElementById("bar1Fill");
                    const bar2Val = document.getElementById("bar2Val");
                    const bar2Fill = document.getElementById("bar2Fill");
                    const bar3Val = document.getElementById("bar3Val");
                    const bar3Fill = document.getElementById("bar3Fill");

                    if (catEl) catEl.textContent = data.category;
                    if (titleEl) titleEl.textContent = data.title;
                    if (descEl) descEl.textContent = data.desc;
                    if (codeEl) codeEl.textContent = data.code;
                    if (liveAmplitudeScore) liveAmplitudeScore.textContent = data.amplitude;

                    // Animate metrics
                    if (bar1Val && bar1Fill) {
                        bar1Val.textContent = data.bar1Val;
                        bar1Fill.style.width = "0%";
                        setTimeout(() => bar1Fill.style.width = data.bar1Val, 50);
                    }
                    if (bar2Val && bar2Fill) {
                        bar2Val.textContent = data.bar2Val;
                        bar2Fill.style.width = "0%";
                        setTimeout(() => bar2Fill.style.width = data.bar2Val, 50);
                    }
                    if (bar3Val && bar3Fill) {
                        bar3Val.textContent = data.bar3Val;
                        bar3Fill.style.width = "0%";
                        setTimeout(() => bar3Fill.style.width = data.bar3Val, 50);
                    }
                }
            });
        });

        // Category Filter Buttons
        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.getAttribute("data-filter");

                // Filter tide nodes
                tideNodes.forEach((node) => {
                    const nodeCat = node.getAttribute("data-category");
                    if (filter === "all" || nodeCat === filter || nodeCat === "all") {
                        node.style.opacity = "1";
                        node.style.pointerEvents = "auto";
                        node.style.transform = "translate(-50%, -50%) scale(1)";
                    } else {
                        node.style.opacity = "0.2";
                        node.style.pointerEvents = "none";
                        node.style.transform = "translate(-50%, -50%) scale(0.7)";
                    }
                });

                // Filter domain showcase cards
                domainCards.forEach((card) => {
                    const cardCat = card.getAttribute("data-category");
                    if (filter === "all" || cardCat === filter || cardCat === "all") {
                        card.style.display = "flex";
                        setTimeout(() => card.style.opacity = "1", 10);
                    } else {
                        card.style.opacity = "0";
                        setTimeout(() => card.style.display = "none", 300);
                    }
                });
            });
        });
    }

    /* ########################################################################## */
    /*                           END OF SKILLS.HTML JS                            */
    /* ########################################################################## */


    /* ########################################################################## */
    /*                          START OF ADVANCE.HTML JS                          */
    /*                                                                            */
    /* ########################################################################## */

    // 1. Advance Domain Track Filters
    const advanceFilterBtns = document.querySelectorAll(".advance-filter-btn");
    const advanceCohortCards = document.querySelectorAll(".advance-cohort-card");

    if (advanceFilterBtns.length > 0 && advanceCohortCards.length > 0) {
        advanceFilterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                advanceFilterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.getAttribute("data-filter");
                advanceCohortCards.forEach((card) => {
                    const category = card.getAttribute("data-category");
                    if (filter === "all" || category === filter) {
                        card.style.display = "flex";
                        setTimeout(() => {
                            card.style.opacity = "1";
                            card.style.transform = "scale(1)";
                        }, 20);
                    } else {
                        card.style.opacity = "0";
                        card.style.transform = "scale(0.95)";
                        setTimeout(() => {
                            card.style.display = "none";
                        }, 300);
                    }
                });
            });
        });
    }

    // 2. Interactive Career Roadmap Simulator Tabs
    const timelineSteps = document.querySelectorAll(".timeline-step");
    if (timelineSteps.length > 0) {
        const phaseData = {
            phase1: {
                badge: "PHASE 01 : FOUNDATIONAL HARDENING",
                title: "Core Concurrency & High-Load Architecture",
                desc: "We strip away high-level abstractions to teach you how operating systems, memory allocators, and non-blocking event loops actually execute your code under heavy traffic.",
                rps: "250,000+ Req/sec",
                mem: "-64% Overhead Reduction",
                rel: "99% Systems Round Alignment",
                code: `// Phase 1 Benchmark Check: Thread Pool Optimization\nexport async function verifyHighLoadConcurrency() {\n  const cluster = new DistributedWorkerPool({ threads: 'auto' });\n  return cluster.stressTest({ concurrency: 100000, latency: '< 12ms' });\n}`
            },
            phase2: {
                badge: "PHASE 02 : DISTRIBUTED SCALE & SHARDING",
                title: "Distributed Systems, Caching & Message Queues",
                desc: "Implement Kafka event streaming, Redis sub-millisecond clusters, GraphQL supergraphs, and consistent database sharding over multi-region topologies.",
                rps: "1,200,000+ Req/sec",
                mem: "Sub-0.8ms Read Latency",
                rel: "100% System Design Defense",
                code: `// Phase 2 Benchmark Check: Redis Sharded Event Stream\nexport async function initDistributedBus() {\n  const kafka = new KafkaBroker({ brokers: ['aws-us-east-1a', 'aws-eu-west-1'] });\n  await kafka.subscribe({ topic: 'telemetry.highload', fromBeginning: true });\n}`
            },
            phase3: {
                badge: "PHASE 03 : PRODUCTION HARDENING & DEFENSE",
                title: "Capstone Deployment & FAANG Architecture Defense",
                desc: "Deploy self-healing Kubernetes clusters, build zero-downtime GitOps CI/CD pipelines, and defend your architecture choices against senior mock interviewers.",
                rps: "Zero-Downtime Rollout",
                mem: "Self-Healing K8s Replica",
                rel: "Guaranteed Interview Referral",
                code: `// Phase 3 Benchmark Check: Automated Canary Rollout\nexport async function verifyK8sCanaryDeployment() {\n  const cluster = await KubeOrchestrator.connect({ namespace: 'production' });\n  return cluster.verifyHealth({ canaryWeight: 10, errorBudget: '0.01%' });\n}`
            }
        };

        timelineSteps.forEach((step) => {
            step.addEventListener("click", () => {
                timelineSteps.forEach((s) => s.classList.remove("active"));
                step.classList.add("active");

                const phaseKey = step.getAttribute("data-phase");
                const data = phaseData[phaseKey];
                if (data && document.getElementById("roadmapInspector")) {
                    document.getElementById("phaseBadgeText").textContent = data.badge;
                    document.getElementById("phaseTitleText").textContent = data.title;
                    document.getElementById("phaseDescText").textContent = data.desc;
                    document.getElementById("phaseRpsText").textContent = data.rps;
                    document.getElementById("phaseMemText").textContent = data.mem;
                    document.getElementById("phaseRelText").textContent = data.rel;
                    document.getElementById("phaseCodeText").textContent = data.code;
                }
            });
        });
    }

    // 3. Syllabus Accordion Toggle Buttons
    const syllabusToggleBtns = document.querySelectorAll(".syllabus-toggle-btn");
    syllabusToggleBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            btn.classList.toggle("expanded");
            const content = btn.nextElementSibling;
            if (content) {
                content.classList.toggle("show");
            }
        });
    });

    // 4. Live Seat Telemetry Countdown Simulator
    const seatValElem = document.getElementById("seatCountVal");
    if (seatValElem) {
        let seats = 14;
        setInterval(() => {
            if (seats > 3 && Math.random() > 0.65) {
                seats--;
                seatValElem.textContent = `${seats} SEATS`;
                seatValElem.style.color = "#ef4444";
                setTimeout(() => {
                    seatValElem.style.color = "";
                }, 1200);
            }
        }, 15000);
    }


    /* ########################################################################## */
    /*                           END OF ADVANCE.HTML JS                           */
    /* ########################################################################## */


    /* ########################################################################## */
    /*                            START OF FAQ.HTML JS                            */
    /*                                                                            */
    /* ########################################################################## */

    // 1. FAQ Live Real-Time Search Engine
    const faqSearchInput = document.getElementById("faqSearchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const searchStatusTag = document.getElementById("searchStatusTag");
    const faqItemCards = document.querySelectorAll(".faq-item-card");

    if (faqSearchInput && faqItemCards.length > 0) {
        faqSearchInput.addEventListener("input", () => {
            const query = faqSearchInput.value.toLowerCase().trim();
            let activeCount = 0;

            if (query.length > 0) {
                if (clearSearchBtn) clearSearchBtn.style.display = "block";
            } else {
                if (clearSearchBtn) clearSearchBtn.style.display = "none";
            }

            faqItemCards.forEach((card) => {
                const keywords = card.getAttribute("data-keywords") || "";
                const textContent = card.innerText.toLowerCase();
                if (keywords.includes(query) || textContent.includes(query) || query === "") {
                    card.style.display = "block";
                    setTimeout(() => card.style.opacity = "1", 10);
                    activeCount++;
                } else {
                    card.style.opacity = "0";
                    setTimeout(() => card.style.display = "none", 250);
                }
            });

            if (searchStatusTag) {
                searchStatusTag.textContent = `${activeCount} ITEMS ACTIVE`;
            }
        });

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener("click", () => {
                faqSearchInput.value = "";
                faqSearchInput.dispatchEvent(new Event("input"));
                faqSearchInput.focus();
            });
        }
    }

    // 2. FAQ Category Tabs
    const faqTabBtns = document.querySelectorAll(".faq-tab-btn");
    if (faqTabBtns.length > 0 && faqItemCards.length > 0) {
        faqTabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                faqTabBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                const category = btn.getAttribute("data-category");
                let count = 0;
                faqItemCards.forEach((card) => {
                    const cardCat = card.getAttribute("data-category");
                    if (category === "all" || cardCat === category) {
                        card.style.display = "block";
                        setTimeout(() => card.style.opacity = "1", 10);
                        count++;
                    } else {
                        card.style.opacity = "0";
                        setTimeout(() => card.style.display = "none", 250);
                    }
                });

                if (searchStatusTag) {
                    searchStatusTag.textContent = `${count} ITEMS ACTIVE`;
                }
            });
        });
    }

    // 3. FAQ Accordion Click Toggles
    const faqQuestionHeaders = document.querySelectorAll(".faq-question-header");
    faqQuestionHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            const card = header.parentElement;
            // Toggle current card
            card.classList.toggle("active");
        });
    });

    // 4. Automated Diagnostic Telemetry Solver Engine
    const runDiagBtn = document.getElementById("runDiagBtn");
    const errorSignatureSelect = document.getElementById("errorSignatureSelect");
    const problemNotesInput = document.getElementById("problemNotesInput");
    const diagOutputContent = document.getElementById("diagOutputContent");

    if (runDiagBtn && errorSignatureSelect && diagOutputContent) {
        const diagSolutions = {
            oom: {
                title: "DIAGNOSTIC REPORT // DOCKER EXIT CODE 137 (OOM KILLED)",
                status: "CRITICAL HARDWARE ALLOCATION LIMIT EXCEEDED",
                steps: [
                    "[OK] Memory trace verified: Container requested 4.8GB during concurrent RAG embedding.",
                    "[ACTION REQUIRED] Open Docker Desktop -> Settings -> Resources -> Memory -> Slide to 6.0 GB minimum.",
                    "[CODE FIX] In your Node/Python worker, implement streaming batching instead of loading exact dataset in memory:",
                    "   $ node --max-old-space-size=4096 --expose-gc server.js",
                    "[VERIFICATION] Run '$ docker stats' during load test to ensure memory stays below 80% watermark."
                ]
            },
            cors: {
                title: "DIAGNOSTIC REPORT // WEBSOCKET wss:// CORS & PROXY TIMEOUT",
                status: "REVERSE PROXY HANDSHAKE UPGRADE REJECTED",
                steps: [
                    "[OK] Analyzing WebSocket upgrade headers and CORS preflight response...",
                    "[ACTION REQUIRED] Nginx ingress is dropping long-lived TCP connections after 60 seconds.",
                    "[CODE FIX] Inject the following directives into your reverse proxy block:",
                    "   proxy_set_header Upgrade $http_upgrade;\n   proxy_set_header Connection \"upgrade\";\n   proxy_read_timeout 3600s;",
                    "[CLIENT CHECK] Ensure client socket auto-reconnect heartbeat ping is set to 25 seconds."
                ]
            },
            hydration: {
                title: "DIAGNOSTIC REPORT // NEXT.JS 14 HYDRATION TREE MISMATCH",
                status: "CLIENT DOM GENERATED DIFFERENT TREE THAN SERVER RENDER",
                steps: [
                    "[OK] Scanning React component tree for non-deterministic functions (Date.now(), window, Math.random())...",
                    "[ACTION REQUIRED] You accessed 'localStorage' inside the root render loop before client mount.",
                    "[CODE FIX] Wrap all browser-specific window/storage checks inside useEffect or use dynamic import with ssr:false:",
                    "   const ClientDashboard = dynamic(() => import('./Dashboard'), { ssr: false });",
                    "[VERIFICATION] Re-run '$ next build && next start' to verify zero SSR warnings."
                ]
            },
            postgres: {
                title: "DIAGNOSTIC REPORT // POSTGRESQL SUB-MS DEADLOCK ON HIGH CONCURRENCY",
                status: "TRANSACTION LOCK CONFLICT DETECTED IN ROW UPDATE",
                steps: [
                    "[OK] Inspecting pg_stat_activity queries across active connection pool...",
                    "[ACTION REQUIRED] Multiple workers are acquiring shared row locks in inconsistent ordering.",
                    "[CODE FIX] Sort target IDs before issuing multi-row UPDATE or use FOR UPDATE SKIP LOCKED for queue workers:",
                    "   SELECT * FROM tasks WHERE status = 'pending' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 10;",
                    "[POOL OPTIMIZATION] Set PgBouncer transaction pooling mode with max_client_conn = 1000."
                ]
            },
            enrollment: {
                title: "DIAGNOSTIC REPORT // TRANSACTION ID VERIFICATION STATUS",
                status: "BANKING API CLEARANCE IN PROGRESS",
                steps: [
                    "[OK] Querying ClassMate UPI / Banking verification settlement queue...",
                    "[STATUS] Standard verification window is 15-45 minutes. Your transaction verification is currently queued at Priority #2.",
                    "[INSTANT ACCESS] If transaction occurred > 45 minutes ago, dispatch Transaction ID and screenshot directly via our support channel:",
                    "   Support WhatsApp / Hotline: +91 9123025207",
                    "[AUTO-DISPATCH] Once cleared, your login credentials and Discord VIP invite will be emailed instantly."
                ]
            }
        };

        runDiagBtn.addEventListener("click", () => {
            const sig = errorSignatureSelect.value;
            const notes = problemNotesInput ? problemNotesInput.value.trim() : "";
            const report = diagSolutions[sig] || diagSolutions["oom"];

            runDiagBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Running Automated Diagnostics...`;
            runDiagBtn.disabled = true;

            setTimeout(() => {
                runDiagBtn.innerHTML = `<i class="fas fa-bolt"></i> Run Automated Diagnostic & Get Solution`;
                runDiagBtn.disabled = false;

                let outputHTML = `
                    <div style="color: #60a5fa; font-weight:700; margin-bottom: 10px;">${report.title}</div>
                    <div style="color: #f59e0b; margin-bottom: 15px;">>>> STATUS: ${report.status}</div>
                `;

                if (notes.length > 0) {
                    outputHTML += `<div style="color: #94a3b8; font-size:12px; margin-bottom: 12px;">// User Diagnostic Notes Analyzed: "${notes}"</div>`;
                }

                report.steps.forEach((step, idx) => {
                    outputHTML += `<div style="margin-bottom: 8px; font-family:'Fira Code', monospace;">${step}</div>`;
                });

                diagOutputContent.innerHTML = outputHTML;
                diagOutputContent.scrollTop = 0;
            }, 750);
        });
    }

    /* --- 5. Senior Architect Live Telemetry & Interactive Mouse-Driven Color Atmosphere --- */
    const activeLiveContainer = document.querySelector(".live-bg-container, .faq-moonlight-bg");
    if (activeLiveContainer) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let rafPending = false;
        const cachedOrbs = Array.from(document.querySelectorAll(".color-orb"));

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(() => {
                    const xPercent = (mouseX / window.innerWidth) * 100;
                    const yPercent = (mouseY / window.innerHeight) * 100;
                    
                    activeLiveContainer.style.setProperty("--cursor-x", `${xPercent}%`);
                    activeLiveContainer.style.setProperty("--cursor-y", `${yPercent}%`);

                    // High-performance 60Hz/120Hz GPU-accelerated parallax transform across spheres
                    const deltaX = (mouseX - window.innerWidth / 2) * 0.06;
                    const deltaY = (mouseY - window.innerHeight / 2) * 0.06;
                    cachedOrbs.forEach((orb, idx) => {
                        const depth = ((idx % 4) + 1) * 0.5;
                        orb.style.transform = `translate3d(${deltaX * depth}px, ${deltaY * depth}px, 0px)`;
                    });
                    rafPending = false;
                });
            }
        }, { passive: true });
    }

    /* ========================================================================== */
    /*                         LIVE NAVBAR PIXEL CAT ENGINE                       */
    /* ========================================================================== */
    function initNavbarPixelCat() {
        const cat = document.getElementById("cat");
        const navbar = document.querySelector(".navbar");
        const hiBubble = cat ? cat.querySelector(".cat-hi-bubble") : null;
        if (!cat || !navbar) return;

        const navWidth = navbar.offsetWidth || 1000;

        // Randomize initial direction & X position on page load: Not always left-to-right at x = 0!
        let dir = Math.random() < 0.5 ? 1 : -1;
        let x = Math.floor(Math.random() * (navWidth - 160)) + 40;

        let isJumping = false;
        let isWaving = false;
        let isSlipping = false;
        let jumpY = 0;
        let jumpVy = 0;
        const gravity = 0.45;

        // Pick a distinct startup stage when the page loads right out of the box!
        const startupStageRoll = Math.random();
        if (startupStageRoll < 0.42) {
            // Stage 1 (42% chance): Immediately start waving hello ("HI!") where spawned on page load!
            isWaving = true;
            cat.classList.add("cat-waving");
            if (hiBubble) {
                hiBubble.textContent = "HI!";
                if (dir === -1) {
                    hiBubble.style.setProperty("transform", "scaleX(-1) scale(1.25)", "important");
                    hiBubble.style.setProperty("left", "-10px", "important");
                } else {
                    hiBubble.style.setProperty("transform", "scaleX(1) scale(1.25)", "important");
                    hiBubble.style.setProperty("left", "27px", "important");
                }
            }
            setTimeout(() => {
                isWaving = false;
                cat.classList.remove("cat-waving");
            }, 2200);
        } else if (startupStageRoll < 0.56) {
            // Stage 2 (14% chance): Start immediately airborne leaping across the navbar!
            isJumping = true;
            jumpVy = -6.5;
            cat.classList.add("cat-jumping");
        }

        // Frequent State Loop: Trigger paw waving ("say HI!") much more frequently than mid-navbar slips!
        setInterval(() => {
            if (isJumping || isWaving || isSlipping) return;

            const roll = Math.random();
            const inMiddleSection = x > 120 && x < navbar.offsetWidth - 120;

            if (roll < 0.64) {
                // 64% chance: Stop and say HI! with paw + white speech bubble
                isWaving = true;
                cat.classList.add("cat-waving");

                if (hiBubble) {
                    hiBubble.textContent = "HI!";
                    if (dir === -1) {
                        hiBubble.style.setProperty("transform", "scaleX(-1) scale(1.25)", "important");
                        hiBubble.style.setProperty("left", "-10px", "important");
                    } else {
                        hiBubble.style.setProperty("transform", "scaleX(1) scale(1.25)", "important");
                        hiBubble.style.setProperty("left", "27px", "important");
                    }
                }

                setTimeout(() => {
                    isWaving = false;
                    cat.classList.remove("cat-waving");
                }, 2400);
            } else if (inMiddleSection && roll < 0.80) {
                // 16% chance while in middle: Slip and fall down!
                triggerRealisticFall("MID", dir);
            }
        }, 1600);

        function triggerRealisticFall(fallType, fallDir) {
            isSlipping = true;
            cat.classList.add("cat-slipping");

            if (hiBubble) {
                hiBubble.textContent = "OMG!!";
                if (fallDir === -1) {
                    hiBubble.style.setProperty("transform", "scaleX(-1) scale(1.3)", "important");
                    hiBubble.style.setProperty("left", "-18px", "important");
                } else {
                    hiBubble.style.setProperty("transform", "scaleX(1) scale(1.3)", "important");
                    hiBubble.style.setProperty("left", "27px", "important");
                }
            }

            const scaleStr = fallDir === -1 ? "-0.64" : "0.64";

            if (fallType === "MID") {
                // Skidding slip right off the front edge in the middle of the navbar!
                const tiltAngle = fallDir === 1 ? "18deg" : "-18deg";
                cat.style.setProperty("transform", `translateY(22px) rotate(${tiltAngle}) scale(${scaleStr}, 0.64)`, "important");
            } else {
                // Dangling off the far right or left corner edges!
                if (fallDir === 1) {
                    x = navbar.offsetWidth - 16;
                    cat.style.left = x + "px";
                    cat.style.setProperty("transform", "translateY(22px) rotate(32deg) scale(0.64, 0.64)", "important");
                } else {
                    x = -6;
                    cat.style.left = x + "px";
                    cat.style.setProperty("transform", "translateY(22px) rotate(-32deg) scale(-0.64, 0.64)", "important");
                }
            }

            // Phase 2: After 1.5s of realistic bicycling and paw hooking, heave back up onto the glass ledge!
            setTimeout(() => {
                cat.classList.remove("cat-slipping");
                cat.classList.add("cat-climbing");
                cat.style.setProperty("transform", `translateY(-4px) rotate(0deg) scale(${scaleStr}, 0.64)`, "important");

                if (fallType === "EDGE") {
                    if (fallDir === 1) x = navbar.offsetWidth - 36;
                    if (fallDir === -1) x = 16;
                    cat.style.left = x + "px";
                }

                // Phase 3: Safely recovered on all 4 paws ("all is okay")!
                setTimeout(() => {
                    cat.classList.remove("cat-climbing");
                    cat.style.setProperty("transform", `translateY(0px) rotate(0deg) scale(${scaleStr}, 0.64)`, "important");

                    setTimeout(() => {
                        isSlipping = false;
                        if (hiBubble) hiBubble.textContent = "HI!";
                        if (fallType === "EDGE") {
                            dir = -fallDir; // Turn around safely from the edge!
                        }
                    }, 300);
                }, 400);
            }, 1500);
        }

        function triggerSayHiAfterTurn() {
            if (isWaving || isSlipping || isJumping) return;
            isWaving = true;
            cat.classList.add("cat-waving");
            if (hiBubble) {
                hiBubble.textContent = "HI!";
                if (dir === -1) {
                    hiBubble.style.setProperty("transform", "scaleX(-1) scale(1.25)", "important");
                    hiBubble.style.setProperty("left", "-10px", "important");
                } else {
                    hiBubble.style.setProperty("transform", "scaleX(1) scale(1.25)", "important");
                    hiBubble.style.setProperty("left", "27px", "important");
                }
            }
            setTimeout(() => {
                isWaving = false;
                cat.classList.remove("cat-waving");
            }, 2400);
        }

        function animateCat() {
            if (!isWaving && !isSlipping) {
                // If jumping over text, move slightly faster horizontally to clear the hurdle
                const currentSpeed = isJumping ? 2.8 : 1.5;
                x += dir * currentSpeed;

                // Check edge behavior: 20% chance to slip, 80% chance to turn around safely (and frequently say HI!)
                if (x >= navbar.offsetWidth - 32) {
                    if (!isJumping && Math.random() < 0.20) {
                        triggerRealisticFall("EDGE", 1);
                    } else {
                        dir = -1;
                        if (Math.random() < 0.45) triggerSayHiAfterTurn();
                    }
                }

                if (x <= 12) {
                    if (!isJumping && Math.random() < 0.20) {
                        triggerRealisticFall("EDGE", -1);
                    } else {
                        dir = 1;
                        if (Math.random() < 0.45) triggerSayHiAfterTurn();
                    }
                }

                // Check hurdle: Jump specifically when approaching/passing over navbar text items!
                if (!isJumping && !isSlipping) {
                    const textItems = navbar.querySelectorAll(".nav-links li, .logo");
                    textItems.forEach((item) => {
                        const startX = item.offsetLeft;
                        const endX = startX + item.offsetWidth;

                        // Check if cat is right at the edge of a text word
                        const approachingRight = dir === 1 && x >= startX - 22 && x <= startX - 8;
                        const approachingLeft = dir === -1 && x <= endX + 22 && x >= endX + 8;

                        if ((approachingRight || approachingLeft) && !item._jumpCooldown && Math.random() < 0.65) {
                            isJumping = true;
                            jumpVy = -6.8; // Leap up right over the text item!
                            cat.classList.add("cat-jumping");
                            item._jumpCooldown = true;
                            setTimeout(() => { item._jumpCooldown = false; }, 6000);
                        }
                    });
                }
            }

            if (isJumping && !isSlipping) {
                jumpY += jumpVy;
                jumpVy += gravity;
                if (jumpY >= 0) {
                    jumpY = 0;
                    isJumping = false;
                    cat.classList.remove("cat-jumping");
                }
            }

            if (!isSlipping) {
                const scaleXStr = dir === -1 ? "-0.64" : "0.64";
                cat.style.setProperty("transform", `translateY(${jumpY}px) scale(${scaleXStr}, 0.64)`, "important");
                cat.style.left = x + "px";
            }

            requestAnimationFrame(animateCat);
        }

        animateCat();
    }

    initNavbarPixelCat();

    /* ########################################################################## */
    /*                         CASINO ROLL ANIMATION FOR NAMES                    */
    /* ########################################################################## */
    function initCasinoRollAnimation() {
        const rollers = document.querySelectorAll(".casino-roller");
        if (!rollers.length) return;

        const names = ["MRINMOY NASKAR", "SAYAN SARKAR"];

        rollers.forEach((roller) => {
            const windowEl = roller.querySelector(".casino-window");
            const reelEl = roller.querySelector(".casino-reel");
            if (!windowEl || !reelEl) return;

            let currentIndex = 0;
            let isSpinning = false;

            // Initialize content cleanly
            reelEl.innerHTML = `<span class="casino-item">${names[currentIndex]}</span>`;

            function spinToNext() {
                if (isSpinning) return;
                isSpinning = true;

                const nextIndex = (currentIndex + 1) % names.length;
                const itemHeight = windowEl.offsetHeight || 28;
                const numSpins = 6; // Number of intermediate slots whirling past

                // Build multi-spin reel strip
                reelEl.innerHTML = `<span class="casino-item">${names[currentIndex]}</span>`;
                for (let i = 1; i < numSpins; i++) {
                    const blurName = names[(currentIndex + i) % names.length];
                    reelEl.innerHTML += `<span class="casino-item spinning-blur">${blurName}</span>`;
                }
                reelEl.innerHTML += `<span class="casino-item">${names[nextIndex]}</span>`;

                // Reset position instantly
                reelEl.style.transition = "none";
                reelEl.style.transform = "translateY(0px)";
                void reelEl.offsetHeight; // Force DOM reflow

                // Start slot machine spin decelerating bounce animation
                const targetY = -(numSpins * itemHeight);
                reelEl.style.transition = "transform 1.3s cubic-bezier(0.15, 0.85, 0.3, 1.15)";
                reelEl.style.transform = `translateY(${targetY}px)`;

                // Play slot glow on roller during spin
                roller.classList.add("slot-spinning");

                setTimeout(() => {
                    currentIndex = nextIndex;
                    reelEl.style.transition = "none";
                    reelEl.innerHTML = `<span class="casino-item">${names[currentIndex]}</span>`;
                    reelEl.style.transform = "translateY(0px)";
                    isSpinning = false;

                    roller.classList.remove("slot-spinning");
                    roller.classList.add("slot-win-glow");
                    setTimeout(() => roller.classList.remove("slot-win-glow"), 900);
                }, 1300);
            }

            // Auto spin every 3.2 seconds
            setInterval(spinToNext, 3200);

            // Allow manual spin on click!
            roller.addEventListener("click", () => {
                spinToNext();
            });
        });
    }

    initCasinoRollAnimation();

    /* ########################################################################## */
    /*                             END OF FAQ.HTML JS                             */
    /* ########################################################################## */
});