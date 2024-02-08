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
      quizId: '75f18b0a-0c44-4de1-9a47-17a39cea0083',
      quizContext:
        'Explain the key features and benefits of using Cypress for UI testing. How does Cypress differ from other UI testing frameworks, and what are its limitations? Provide examples of scenarios where Cypress excels and where it may not be the best choice for UI testing.',
      quizTopic: 'Cypress',
      quizSubtopic: 'UI Testing',
      quizDifficulty: 'medium',
      videoUrl:
        'https://matchya-user-data.s3.amazonaws.com/dev/response-recording/webm/ccb6e4a0-7811-4767-9244-ff17c80395a4/75f18b0a-0c44-4de1-9a47-17a39cea0083.webm',
      feedback:
        "The candidate's answer lacks depth and specific examples. They fail to articulate the key features and benefits of using Cypress for UI testing. The answer does not demonstrate a good understanding of Cypress or its advantages over other frameworks.",
      score: 2,
    },
    {
      quizId: '2dc4c0b1-6582-48bf-a8cc-03f7c768fe0c',
      quizContext:
        'Explain the concept of Creational Design Patterns. Provide examples of at least three different creational patterns, their use cases, and how they contribute to creating objects in a flexible and decoupled manner.',
      quizTopic: 'Creational Patterns',
      quizSubtopic: 'Design Patterns',
      quizDifficulty: 'hard',
      videoUrl:
        'https://matchya-user-data.s3.amazonaws.com/dev/response-recording/webm/ccb6e4a0-7811-4767-9244-ff17c80395a4/2dc4c0b1-6582-48bf-a8cc-03f7c768fe0c.webm',
      feedback:
        'The candidate briefly mentions the concept of creational design patterns but fails to provide examples or use cases of specific patterns. There is a lack of depth in explaining how these patterns contribute to flexible and decoupled object creation. The understanding of creational design patterns is limited, and the response lacks specific examples and real-world scenarios.',
      score: 3.9,
    },
    {
      quizId: 'd2473533-d80b-4e0d-bb53-2a179f626243',
      quizContext:
        'Explain the role of Agile methodologies in software development. How does Agile differ from traditional waterfall methods, and what are the key benefits and challenges of using Agile?',
      quizTopic: 'Agile',
      quizSubtopic: 'Methodologies',
      quizDifficulty: 'medium',
      videoUrl:
        'https://matchya-user-data.s3.amazonaws.com/dev/response-recording/webm/ccb6e4a0-7811-4767-9244-ff17c80395a4/d2473533-d80b-4e0d-bb53-2a179f626243.webm',
      feedback:
        "The candidate's answer does not address the question at all. They have misunderstood the topic and provided an unrelated response. The score is therefore 0 as the candidate lacks understanding of Agile principles and methodologies, and fails to analyze the benefits and challenges of Agile.",
      score: 0,
    },
    {
      quizId: 'ab909d38-7c4b-44c2-b823-56aa1bf02bf9',
      quizContext:
        'Explain the Model-View-ViewModel (MVVM) architectural pattern. Describe the key components of MVVM and how they interact. Provide an example of how MVVM is used in a real-world application and discuss its benefits and challenges.',
      quizTopic: 'MVVM',
      quizSubtopic: 'Architectural Pattern',
      quizDifficulty: 'hard',
      videoUrl:
        'https://matchya-user-data.s3.amazonaws.com/dev/response-recording/webm/ccb6e4a0-7811-4767-9244-ff17c80395a4/ab909d38-7c4b-44c2-b823-56aa1bf02bf9.webm',
      feedback:
        "The candidate's answer does not demonstrate any understanding of the MVVM architectural pattern or its key components. The answer lacks any mention of real-world examples, impact, benefits, or challenges of MVVM. It is evident that the candidate did not address the question at all, resulting in a score of 0.",
      score: 0,
    }
  ],
};

export const mockedInterviews: Interview[] = [mockedInterview];
