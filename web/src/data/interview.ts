import { Interview } from '@/types';

export const mockedInterview: Interview = {
  id: 'ccb6e4a0-7811-4767-9244-ff17c80395a4',
  totalScore: 2.98,
  summary:
    "The candidate''s performance is inconsistent. They demonstrate a lack of understanding and depth in some technical topics such as Agile methodologies, MVVM architectural pattern, Cypress for UI testing, Flexbox in CSS, and some performance metrics. However, the candidate shows a good understanding of Database Management Systems, UI Testing, and the importance of performance metrics in software development. They provide insightful discussions with specific examples in these areas. Overall, the candidate''s strengths lie in their understanding of UI testing, DBMS, and the importance of performance metrics, but there is a need for improvement in depth and specific examples in other technical areas.",
  createdAt: '2024-01-29 02:16:34.700078',
  candidate: {
    id: '09daf246-2013-4088-9190-cd2923c1218e',
    name: 'Ken Okiebisu',
    email: 'ken@matchya.ai',
  },
  assessment: {
    id: '889c26c8-93f5-4df2-a0d3-5c9664d13ad8',
    name: 'Checking if everything works',
  },
  answers: [
    {
      questionId: '75f18b0a-0c44-4de1-9a47-17a39cea0083',
      questionText:
        'Explain the key features and benefits of using Cypress for UI testing. How does Cypress differ from other UI testing frameworks, and what are its limitations? Provide examples of scenarios where Cypress excels and where it may not be the best choice for UI testing.',
      questionTopic: 'Cypress',
      questionDifficulty: 'medium',
      videoUrl:
        'https://dev-data-question-response-video.s3.amazonaws.com/ccb6e4a0-7811-4767-9244-ff17c80395a4/75f18b0a-0c44-4de1-9a47-17a39cea0083.webm',
      feedback:
        "The candidate's answer lacks depth and specific examples. They fail to articulate the key features and benefits of using Cypress for UI testing. The answer does not demonstrate a good understanding of Cypress or its advantages over other frameworks.",
      score: 2,
    },
    {
      questionId: '2dc4c0b1-6582-48bf-a8cc-03f7c768fe0c',
      questionText:
        'Explain the concept of Creational Design Patterns. Provide examples of at least three different creational patterns, their use cases, and how they contribute to creating objects in a flexible and decoupled manner.',
      questionTopic: 'Creational Patterns',
      questionDifficulty: 'hard',
      videoUrl:
        'https://dev-data-question-response-video.s3.amazonaws.com/ccb6e4a0-7811-4767-9244-ff17c80395a4/2dc4c0b1-6582-48bf-a8cc-03f7c768fe0c.webm',
      feedback:
        'The candidate briefly mentions the concept of creational design patterns but fails to provide examples or use cases of specific patterns. There is a lack of depth in explaining how these patterns contribute to flexible and decoupled object creation. The understanding of creational design patterns is limited, and the response lacks specific examples and real-world scenarios.',
      score: 3.9,
    },
    {
      questionId: 'd2473533-d80b-4e0d-bb53-2a179f626243',
      questionText:
        'Explain the role of Agile methodologies in software development. How does Agile differ from traditional waterfall methods, and what are the key benefits and challenges of using Agile?',
      questionTopic: 'Agile',
      questionDifficulty: 'medium',
      videoUrl:
        'https://dev-data-question-response-video.s3.amazonaws.com/ccb6e4a0-7811-4767-9244-ff17c80395a4/d2473533-d80b-4e0d-bb53-2a179f626243.webm',
      feedback:
        "The candidate's answer does not address the question at all. They have misunderstood the topic and provided an unrelated response. The score is therefore 0 as the candidate lacks understanding of Agile principles and methodologies, and fails to analyze the benefits and challenges of Agile.",
      score: 0,
    },
    {
      questionId: 'ab909d38-7c4b-44c2-b823-56aa1bf02bf9',
      questionText:
        'Explain the Model-View-ViewModel (MVVM) architectural pattern. Describe the key components of MVVM and how they interact. Provide an example of how MVVM is used in a real-world application and discuss its benefits and challenges.',
      questionTopic: 'MVVM',
      questionDifficulty: 'hard',
      videoUrl:
        'https://dev-data-question-response-video.s3.amazonaws.com/ccb6e4a0-7811-4767-9244-ff17c80395a4/ab909d38-7c4b-44c2-b823-56aa1bf02bf9.webm',
      feedback:
        "The candidate's answer does not demonstrate any understanding of the MVVM architectural pattern or its key components. The answer lacks any mention of real-world examples, impact, benefits, or challenges of MVVM. It is evident that the candidate did not address the question at all, resulting in a score of 0.",
      score: 0,
    },
    {
      questionId: 'f98cb061-5626-41a2-bbc5-bbc172e12207',
      questionText:
        'Explain the concept of Flexbox in CSS. Describe the key properties and features of Flexbox and how it differs from traditional CSS layout methods like floats and positioning. Provide examples of scenarios where Flexbox is a suitable choice for layout design.',
      questionTopic: 'Flexbox',
      questionDifficulty: 'easy',
      videoUrl:
        'https://dev-data-question-response-video.s3.amazonaws.com/ccb6e4a0-7811-4767-9244-ff17c80395a4/f98cb061-5626-41a2-bbc5-bbc172e12207.webm',
      feedback:
        "The candidate's answer does not demonstrate any understanding of the concept of Flexbox in CSS, its key properties, features, or its differences from traditional CSS layout methods. The answer is completely inadequate and lacks any relevant information. Therefore, the score is 0.",
      score: 0,
    },
    {
      questionId: '0fa8cce3-bb6f-4ca2-b2f3-be61b126df49',
      questionText:
        'Explain the concept of Database Management Systems (DBMS). Describe the key components and functionalities of a DBMS and how it differs from traditional file systems. Discuss the advantages and challenges of using a DBMS for data storage and retrieval.',
      questionTopic: 'DBMS',
      questionDifficulty: 'hard',
      videoUrl:
        'https://dev-data-question-response-video.s3.amazonaws.com/ccb6e4a0-7811-4767-9244-ff17c80395a4/0fa8cce3-bb6f-4ca2-b2f3-be61b126df49.webm',
      feedback:
        'The candidate demonstrates a good understanding of DBMS components and functionalities, articulates differences from traditional file systems, and provides specific examples. The analysis of advantages and challenges of using a DBMS is insightful with good depth and specific examples. The explanation of differences from traditional file systems is clear and provides specific examples and scenarios. However, there is room for improvement in providing comprehensive and detailed explanations, including deeper insights into trade-offs and best practices.',
      score: 7.2,
    },
    {
      questionId: '54a5e86e-268a-4370-b333-ccf54187ab73',
      questionText:
        'Explain the importance of Performance Metrics in software development. Describe at least three key performance metrics used to evaluate the performance of a web application. Discuss how these metrics impact user experience and overall application performance.',
      questionTopic: 'Performance Metrics',
      questionDifficulty: 'easy',
      videoUrl:
        'https://dev-data-question-response-video.s3.amazonaws.com/ccb6e4a0-7811-4767-9244-ff17c80395a4/54a5e86e-268a-4370-b333-ccf54187ab73.webm',
      feedback:
        'The candidate briefly mentions the importance of performance metrics but lacks depth and specific examples. The answer lacks a comprehensive understanding of performance metrics and their impact on user experience and overall application performance.',
      score: 3.5,
    },
    {
      questionId: 'de61b2fd-c086-4840-9b51-186271cc12c1',
      questionText:
        'Describe the importance of UI Testing in the software development lifecycle. Explain the key challenges and benefits of UI testing, and discuss how UI testing contributes to the overall quality of a software product.',
      questionTopic: 'UI Testing',
      questionDifficulty: 'medium',
      videoUrl:
        'https://dev-data-question-response-video.s3.amazonaws.com/ccb6e4a0-7811-4767-9244-ff17c80395a4/de61b2fd-c086-4840-9b51-186271cc12c1.webm',
      feedback:
        "The candidate demonstrates a good understanding of the importance of UI Testing, articulating its significance with specific examples. They also provide a good depth of discussion on the key challenges and benefits of UI Testing, explaining how it contributes to the overall quality of a software product. The explanation of UI testing's contribution to software quality is clear and includes specific examples, showing an understanding of trade-offs and complexities. However, there is room for improvement in providing comprehensive and insightful discussions with real-world scenarios to achieve a higher score.",
      score: 7.2,
    },
  ],
};

export const mockedInterviews: Interview[] = [mockedInterview];
