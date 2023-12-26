import { useNavigate } from 'react-router-dom';

import sampleCandidates from './sample-candidates.png';
import sampleChecklist from './sample-checklist.png';

import { Button } from '@/components';

function Home() {
  const navigate = useNavigate();

  const navigateAuth = () => {
    navigate('/auth');
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mt-16 w-full flex flex-col justify-center">
        <h1 className="text-4xl font-bold">Find Tech Talent with AI Insight</h1>
        <p className="text-md mt-4 w-3/5 mx-auto">
          Matchya is the key to unlocking a new era of talent acquisition for
          companies seeking skilled software engineers. Leveraging AI, Matchya
          transforms the hiring landscape, making it faster, more precise, and
          incredibly efficient. With our platform, companies can discover the
          perfect match in candidates, ensuring a seamless fit of skills and
          requirements. Welcome to the future of tech recruitment, where finding
          the right talent is as smart and swift as the technology that powers
          it.
        </p>
      </div>

      <div className="w-full flex justify-around items-center mt-16 py-10 px-28 bg-green-100">
        <div className="w-1/2 flex justify-center items-center mx-20">
          <img src={sampleChecklist} alt="checklist-screen" />
        </div>
        <div className="w-1/2">
          <p className="text-md indent-6">
            At the heart of Matchya is an innovative algorithm, meticulously
            engineered for two crucial tasks. Initially, it conducts a deep dive
            into your company's GitHub data, extracting key skills indicative of
            your operational requirements. This intelligent analysis results in
            a custom-fit checklist, perfectly aligned with your expectations.
          </p>
        </div>
      </div>

      <div className="w-full flex justify-around items-center py-10 px-28 bg-green-200">
        <div className="w-1/2 flex justify-center items-center mx-20">
          <img src={sampleCandidates} alt="candidates-screen" />
        </div>
        <div className="w-1/2">
          <p className="text-md indent-6">
            The algorithm then shifts focus to candidate evaluation, rigorously
            comparing their GitHub footprint with this checklist. It evaluates
            their technical contributions, coding quality, and project
            relevance, providing a nuanced understanding of their suitability.
            This dual-phase approach by Matchya not only streamlines the
            recruitment process but also ensures a highly accurate alignment of
            candidate capabilities with your company's technical demands.
          </p>
        </div>
      </div>

      <div className="bg-white w-full flex justify-center my-12">
        <div>
          <Button
            variant="default"
            size="lg"
            type="button"
            className="m-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4"
            onClick={navigateAuth}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
