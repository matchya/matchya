import hpImage from '@/assets/hp-image.jpg';
import sampleChecklist from '@/assets/sample-checklist.png';
import sampleEvaluations from '@/assets/sample-evaluations.png';
import { Button } from '@/components';

interface HomePageTemplateProps {
  onNavigateToAuth: () => void;
}

const HomePageTemplate = ({ onNavigateToAuth }: HomePageTemplateProps) => {
  return (
    <div className="w-full h-2/3 flex flex-col items-center">
      <div className="flex">
        <div className=" mt-16 w-1/3 ml-auto mt-32">
          <h2 className="text-2xl font-bold">AI Recruiting Software</h2>

          <h1 className="text-5xl font-bold mt-2">
            Find Tech Talent with AI Insight
          </h1>
          <p className="text-md mt-6">
            Matchya is the key to unlocking a new era of talent acquisition for
            companies seeking skilled software engineers. Leveraging AI, Matchya
            transforms the hiring landscape, making it faster, more precise, and
            incredibly efficient. With our platform, companies can discover the
            perfect match in candidates, ensuring a seamless fit of skills and
            requirements. Welcome to the future of tech recruitment, where
            finding the right talent is as smart and swift as the technology
            that powers it.
          </p>
          <div className="buttons mt-10">
            <Button
              variant="default"
              size="lg"
              type="button"
              className="m-6 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 h-16 w-48 text-xl"
              onClick={onNavigateToAuth}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              type="button"
              className="m-6 border border-2 border-green-600 text-green-600 font-bold py-4 px-4 h-16 w-48 text-xl"
              onClick={() => {}}
            >
              Contact Us
            </Button>
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center mx-20">
          <img
            src={hpImage}
            alt="checklist-screen"
            className="rounded-3xl h-3/4"
          />
        </div>
      </div>

      <div className="w-full mx-auto px-28">
        <h3 className="text-3xl font-bold text-center">
          Having trouble finding the right talent?
        </h3>
        <div className="w-full flex justify-around items-center mt-8 py-3 px-28">
          <h4 className="text-2xl font-bold text-center w-1/2">
            1. Identifying True Talent
          </h4>
          <p className="w-1/2">
            Assessing a software engineer's skill set isn't straightforward.
            Coding tests and interviews can reveal some information, but they
            don't always show how a candidate will perform in real-world
            scenarios. Moreover, some candidates might perform poorly in
            high-pressure interview situations despite being highly skilled.
          </p>
        </div>
        <div className="w-full flex justify-around items-center py-3 px-28">
          <h4 className="text-2xl font-bold text-center w-1/2">
            2. Technical Compatibility
          </h4>
          <p className="w-1/2">
            It's vital to ensure that a candidate's experience aligns with the
            specific technologies and methodologies used in your company. Even
            skilled engineers may struggle if they're unfamiliar with your tech
            stack, potentially leading to significant onboarding time and
            productivity challenges.
          </p>
        </div>
        <div className="w-full flex justify-around items-center py-3 px-28">
          <h4 className="text-2xl font-bold text-center w-1/2">
            3. Understanding Needs
          </h4>
          <p className="w-1/2">
            Sometimes, companies struggle to define what they actually need in a
            software engineer. Without a clear understanding of the necessary
            skills and experience for a particular role, it's hard to find and
            evaluate suitable candidates.
          </p>
        </div>
        <div className="w-full flex justify-around items-center py-3 px-28">
          <h4 className="text-2xl font-bold text-center w-1/2">
            4. Time Investment
          </h4>
          <p className="w-1/2">
            Finding the right engineer with the ideal mix of skills, cultural
            fit, and technical compatibility can be a lengthy process. It often
            involves sifting through numerous candidates and conducting
            extensive interviews, leading to significant time commitments from
            your team.
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-28 mt-32">
        <h3 className="text-4xl font-bold text-center">
          Matchya solves these challenges with AI
        </h3>
      </div>

      <div className="w-full mt-16 py-16 px-28 bg-green-100">
        <h4 className="text-2xl font-bold text-center">
          Generate a technical checklist for your company's needs
        </h4>
        <div className="w-full mt-8 flex justify-around items-center">
          <div className="w-1/2 flex justify-center items-center mx-20">
            <img src={sampleChecklist} alt="checklist-screen" />
          </div>
          <div className="w-1/2">
            <p className="text-md indent-6">
              Initially, it conducts a deep dive into your company's GitHub
              data, extracting key skills indicative of your operational
              requirements. This intelligent analysis results in a custom-fit
              checklist, perfectly aligned with your expectations. You don't
              need to spend time defining your needs; Matchya does it for you.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full py-16 px-28 bg-green-200">
        <h4 className="text-2xl font-bold text-center">
          Evaluate candidates automatically with AI
        </h4>
        <div className="w-full mt-8 flex justify-around items-center">
          <div className="w-1/2 flex justify-center items-center mx-20">
            <img src={sampleEvaluations} alt="candidates-screen" />
          </div>
          <div className="w-1/2">
            <p className="text-md indent-6">
              It evaluates their technical contributions, coding quality, and
              project relevance, providing a nuanced understanding of their
              suitability. This AI-driven approach makes the process faster,
              more accurate, and fairer, ensuring that you find the right
              candidate for the job.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full py-16 px-28 bg-green-100">
        <h4 className="text-2xl font-bold text-center">
          Generate questions for interviews
        </h4>
        <div className="w-full mt-8 flex justify-around items-center">
          {/* <div className="w-1/2 flex justify-center items-center mx-20">
            <img src={sampleEvaluations} alt="candidates-screen" />
          </div> */}
          <div className="w-1/2 mx-auto">
            <p className="text-md indent-6">
              This feature is still in development, but it will be available
              soon. It will automatically generate questions for interviews
              based on the company's technical checklist, providing a
              structured approach to the process. Even if you're not a technical
              expert, you'll be able to conduct a thorough interview, ensuring
              that you find the right fit for your company.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-28 mt-48">
        <h3 className="text-3xl font-bold text-center">
          Ready to begin your journey with Matchya?
        </h3>
        <p className="text-md mt-2 text-center">
          Sign up for free and start finding the right talent today.
        </p>
      </div>
      
      <div className="bg-white w-full flex justify-center mb-12">
        <div>
          <Button
            variant="default"
            size="lg"
            type="button"
            className="m-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 h-14 w-48 text-xl"
            onClick={onNavigateToAuth}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePageTemplate;
