import { Score } from '../types';

export const mockCriteria: string[] = [
    'Knows Python',
    'Used Django before'
];

export const mockCandidates: Score[] = [
    { 
        name: 'Ben Parker', value: 8.0, 
        details: 'Ben Parker\'s problem-solving acumen is evident in his diverse project portfolio, which underscores his adaptability and mastery of software development principles. His commitment to clean, maintainable code and best practices contributes to project scalability and success. Moreover, his collaborative approach and strong communication skills make him an invaluable asset to any development team.',
        evaluations: [
            { criteria: 'Knows Python', score: 9.0, reason: "Ben exhibits a high level of proficiency in Python, with a keen understanding of advanced concepts such as generators, decorators, and context managers." },
            { criteria: 'Used Django before', score: 7.0, reason: "Ben has practical experience with Django, having developed several web applications. He is familiar with Django ORM, views, and templates, although there's room for deeper expertise in Django REST framework." },
        ] 
    },
    { 
        name: 'Paul Carter', value: 6.0, 
        details: 'Paul Carter\'s firm grasp of software development is reflected in his consistent problem-solving capabilities. His practical approach to complex challenges and reliable coding skills mark him as a promising candidate. His proactive learning attitude and ability to adapt to new technologies enhance his value as a team member.',
        evaluations: [
            { criteria: 'Knows Python', score: 6.0, reason: 'Paul has a competent grasp of Python, with experience in writing clean and maintainable code. He is comfortable with common Python libraries and frameworks and shows potential for further growth in this language.' },
            { criteria: 'Used Django before', score: 6.0, reason: 'Paul has hands-on experience with Django, capable of handling typical web development tasks. He understands the framework\'s structure and conventions and can navigate its documentation to implement required functionality.' },
        ]
    },
];
