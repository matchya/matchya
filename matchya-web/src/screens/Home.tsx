
const Home = () => {
  // This example assumes you will populate the candidate data and generated criteria
  // dynamically, but for now they are hardcoded for demonstration.
  const candidates = [
    { name: 'Ben Parker', score: 8.0, details: 'The candidate\'s proficiency in Python enables him to efficiently solve complex programming challenges, demonstrating a deep understanding of its libraries and frameworks.' },
    { name: 'Paul Carter', score: 6.0, details: 'The candidate\'s proficiency in Python enables him to efficiently solve complex programming challenges, demonstrating a deep understanding of its libraries and frameworks.' },
    // ... more candidates
  ];

  const generatedCriteria = [
    'Knows Python',
    'Used Django before'
    // ... more criteria
  ];

  return (
    <div className="pt-16 bg-gray-100 min-h-screen"> {/* Padding top for the header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold text-gray-900">Top Candidates</h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add candidate
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {candidates.map((candidate, index) => (
                <li key={index} className="px-6 py-4">
                  <h3 className="text-lg font-bold">{candidate.name}</h3>
                  <p className="text-sm text-gray-600">{candidate.details}</p>
                  {/* Example buttons, add your own interaction */}
                  <button className="text-blue-600 hover:text-blue-900 text-sm float-right">see detail</button>
                  <div className="text-2xl">{candidate.score}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-6 py-4">
              <h3 className="text-lg font-bold">Generated Criteria</h3>
              <ul className="list-disc pl-6 mt-4">
                {generatedCriteria.map((criterion, index) => (
                  <li key={index} className="text-sm text-gray-600">{criterion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
