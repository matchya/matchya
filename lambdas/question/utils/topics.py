import random

FRONTEND_TOPICS = {
    "HTML": [
        "HTML5", "Semantic HTML", "HTML Tags", "Forms", "Tables", "Accessibility"
    ],
    "CSS": [
        "CSS3", "Selectors", "Box Model", "Flexbox", "Grid", "Responsive Design", "Transitions", "Animations"
    ],
    "JavaScript": [
        "ES6+", "Variables", "Data Types", "Functions", "Objects", "Arrays", "DOM Manipulation", "Events",
        "AJAX", "Promises", "Async/Await", "Closures", "Modules", "Webpack"
    ],
    "Build & Dependency Management": [
        "Webpack", "Babel", "Parcel", "npm", "Yarn"
    ],
    "Version Control": [
        "Git", "GitHub", "GitLab", "BitBucket", "Git Flow", "Pull Request", "Code Review", "Continuous Integration", "Continuous Deployment"
    ],
    "Testing": [
        "Unit Testing", "Integration Testing", "End-to-End Testing", "Jest", "Testing Library", "Cypress"
    ],
    "Frontend Structure and Behavior": [
        "Components", "Props", "State", "Lifecycle Methods", "Hooks", "Virtual DOM", "Reactivity", "Directives", "Reactive Forms", "Template-Driven Forms"
    ],
    "Web Performance": [
        "Optimization", "Lazy Loading", "Performance Metrics", "Browser Rendering", "Critical Rendering Path"
    ],
}


BACKEND_TOPICS = {
    "Network": [
        "HTTP", "HTTPS", "TCP/IP", "DNS", "URL", "Web Browser", "Web Server", "Internet Protocol", "IP Address", "Domain Name", "CDN"
    ],
    "API": [
        "RESTful API", "GraphQL", "WebSocket", "Microservices", "Serverless Architecture"
    ],
    "Database": [
        "Database Design", "SQL", "NoSQL", "DBMS", "ORM",
        "Cache", "Caching Strategies", "Cache Invalidation", "Cache Hit", "Cache Miss"
    ],
    "Security": [
        "SSL/TLS", "HTTPS", "Encryption", "Authentication", "Authorization",
        "JWT", "OWASP", "Security Best Practices", "Penetration Testing",
        "Firewalls", "Intrusion Detection System", "Intrusion Prevention System",
        "VPN", "Security Auditing", "Secure Coding Practices"
    ],
    "DevOps": [
        "Docker", "Kubernetes", "CI/CD", "DevOps", "Containerization",
        "Container", "Container Orchestration", "Pod", "Docker Compose", "Container Registry"
    ],
    "Architecture": [
        "MVC", "MVVM", "Microservices", "Monolithic Architecture", "Serverless Architecture",
        "Event-Driven Architecture", "Hexagonal Architecture"
    ],
    "Message Queue": [
        "Message Queue", "Message Broker", "Message Oriented Middleware", "Message Bus", "Publish-Subscribe Pattern",
    ],
    "Version Control": [
        "Git", "GitHub", "GitLab", "BitBucket", "Git Flow", "Pull Request", "Code Review", "Continuous Integration", "Continuous Deployment"
    ],
}

DEVOPS_TOPICS = {
    "Containerization": [
        "Docker", "Containerization", "Container Image", "Dockerfile", "Container Registry"
    ],
    "Orchestration": [
        "Kubernetes", "Container Orchestration", "Pod", "Scaling"
    ],
    "CI/CD": [
        "Continuous Integration", "Automated Testing", "Release Management"
    ],
    "Infrastructure as Code": [
        "Terraform", "CloudFormation", "Deployment Automation", "Configuration Management"
    ],
    "DevOps Practices": [
        "Collaboration", "Automation", "Feedback Loop", "DevOps Mindset"
    ],
    "Monitoring and Logging": [
        "Monitoring", "Logging", "Performance Metrics", "Observability"
    ],
    "Release Strategies": [
        "Rolling Deployment", "Blue-Green Deployment", "Canary Release", "Feature Toggles"
    ],
    "Scalability": [
        "Auto Scaling", "Load Balancers", "Elasticity"
    ]
}


MOBILE_TOPICS = {
    "Mobile Development Basics": [
        "Mobile Operating Systems (iOS, Android)", "Mobile App Architecture",
        "Cross-platform vs. Native Development", "Mobile Development Life Cycle"
    ],
    "UI/UX Development": [
        "UI Components", "Layouts", "Material Design (Android)", "Human Interface Guidelines (iOS)",
        "Mobile UX Principles", "Responsive Design", "Accessibility in Mobile Apps"
    ],
    "Mobile App Navigation and Security": [
        "Navigation Controllers (iOS)", "Fragments and Activities (Android)", "Routing in Cross-platform Apps",
        "Token-based Authentication", "Biometric Authentication", "Secure Data Storage"
    ],
    "Networking and Data Persistence": [
        "HTTP/HTTPS", "RESTful APIs", "GraphQL for Mobile", "Handling Network Requests",
        "Local Storage", "SQLite (iOS, Android)", "Core Data (iOS)", "Room Database (Android)"
    ],
    "Push Notifications": [
        "iOS Push Notifications", "Firebase Cloud Messaging (FCM)", "Push Notification Services"
    ],
    "Mobile Testing": [
        "Unit Testing", "UI Testing", "Emulator/Simulator Testing",
        "TestFlight (iOS)", "Google Play Console (Android)"
    ],
    "Mobile DevOps": [
        "Mobile Continuous Integration", "App Distribution",
        "Crash Reporting", "Mobile Analytics"
    ],
    "Performance Optimization": [
        "Memory Management", "Image and Asset Optimization",
        "Network Performance", "App Profiling"
    ]
}


SOFTWARE_ENGINEERING_TOPICS = {
    "Software Development Life Cycle": [
        "SDLC", "Waterfall", "Agile", "Scrum", "Kanban", "Lean", "Extreme Programming", "Continuous Delivery", "Continuous Deployment"
    ],
    "Software Architecture": [
        "MVC", "MVVM", "Microservices", "Monolithic Architecture", "Serverless Architecture",
        "Event-Driven Architecture", "Hexagonal Architecture"
    ],
    "Software Design Patterns": [
        "Design Patterns", "Creational Patterns", "Structural Patterns", "Behavioral Patterns", "Architectural Patterns"
    ],
    "Software Testing": [
        "Unit Testing", "Integration Testing", "End-to-End Testing", "Jest", "Testing Library", "Cypress"
    ]
}


def get_random_topics_by_position_type_and_level(type, level, num_topics=8):
    """
    Returns a list of random topics from the given topics.
    """
    level_probabilities = [0.3, 0.5, 0.2]
    if level == "Junior":
        level_probabilities = [0.6, 0.3, 0.1]
    elif level == "Intermediate":
        level_probabilities = [0.3, 0.4, 0.3]
    elif level == "Senior":
        level_probabilities = [0.2, 0.4, 0.4]

    if type == "Frontend Engineer":
        return get_random_topics(FRONTEND_TOPICS, level_probabilities, num_topics)
    elif type == "Backend Engineer":
        return get_random_topics(BACKEND_TOPICS, level_probabilities, num_topics)
    elif type == "DevOps Engineer":
        return get_random_topics(DEVOPS_TOPICS, level_probabilities, num_topics)
    elif type == "Mobile Engineer":
        return get_random_topics(MOBILE_TOPICS, level_probabilities, num_topics)
    elif type == "Software Engineer":
        return get_topic_for_software_engineer(level_probabilities, num_topics)

    return get_random_topics_from_all(level_probabilities, num_topics)


def get_random_topics(topics, level_probabilities, num_topics):
    """
    Returns a list of random topics from the given topics.
    """
    LEVELS = ['Easy', 'Medium', 'Hard']
    result = []
    category_list = list(topics.keys())
    counter = 0
    while counter < num_topics:
        category = category_list[(counter % len(category_list))]
        random_topic = random.choice(topics[category])
        topic_and_level = {
            'topic': random_topic,
            'difficulty': random.choices(LEVELS, weights=level_probabilities)
        }
        result.append(topic_and_level)
        counter += 1
    return result


def get_topic_for_software_engineer(level_probabilities, num_topics):
    """
    Returns a list of random topics from the given topics.
    """
    half_num_topics = int(num_topics / 2)
    result = get_random_topics(SOFTWARE_ENGINEERING_TOPICS, level_probabilities, half_num_topics)
    result += get_random_topics_from_all(level_probabilities, (num_topics - half_num_topics))
    return result


def get_random_topics_from_all(level_probabilities, num_topics):
    """
    Returns a list of random topics from all topics
    """
    LEVELS = ['Easy', 'Medium', 'Hard']
    result = []
    counter = 0
    while counter < num_topics:
        mod = counter % 4
        if mod == 0:
            topics = FRONTEND_TOPICS
        elif mod == 1:
            topics = BACKEND_TOPICS
        elif mod == 2:
            topics = DEVOPS_TOPICS
        else:
            topics = MOBILE_TOPICS

        category_list = list(topics.keys())
        category = random.choice(category_list)
        random_topic = random.choice(topics[category])
        topic_and_level = {
            'topic': random_topic,
            'difficulty': random.choices(LEVELS, weights=level_probabilities)
        }
        result.append(topic_and_level)
        counter += 1
    return result
