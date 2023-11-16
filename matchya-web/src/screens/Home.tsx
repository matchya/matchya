import { useState } from "react";
import { candidates, criteria } from "../data";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ScoreCard from "../components/ScoreCard";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  }

  return ( 
    <div className="pt-16 bg-gray-100 h-screen"> {/* Padding top for the header */}
      {showModal && <AddCandidateModal close={() => setShowModal(false)} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold text-gray-900">Top Candidates</h1>
          <Button text="Add candidate" color="green" outline={false} onClick={showModalHandler}  />
        </div>

        <div className="h-full flex flex-col lg:flex-row gap-4">
          <div className="w-2/3 overflow-hidden sm:rounded-md">
            {candidates.map((candidate, index) => (
              <ScoreCard key={index} score={candidate} />
            ))}
          </div>
          <div className="h-full w-1/3 bg-white shadow overflow-hidden sm:rounded-md">
            <CriteriaBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


const CriteriaBox = () => {
  return (
    <div className="px-6 py-4 h-full">
      <h3 className="text-lg font-bold">Generated Criteria</h3>
      <ul className="list-disc pl-6 mt-4">
        {criteria.map((criterion, index) => (
          <li key={index} className="text-sm text-gray-600">{criterion}</li>
        ))}
      </ul>
    </div>
  );
}


// Modal

interface ModalProps {
  close: () => void;
}

const AddCandidateModal = ({ close }: ModalProps) => {
  const [name, setName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const handleAddCandidate = (event?: React.MouseEvent) => {
    event?.preventDefault();
    console.log(name, githubUrl);
    close();
  }

  const clickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.target as HTMLDivElement).id === 'outside') {
      close();
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      id="outside"
      onClick={clickOutside}
    >
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">
          Add a new candidate
        </h1>
        <div className="space-y-6">
          <FormInput label="Name" id="name" type="text" className="my-3" value={name} onChange={(e) => setName(e.target.value)} />
          <FormInput label="GitHub Account URL" id="github_url" type="url" className="my-3" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
          <div className="flex justify-end w-full">
            <Button text="Add" color="green" className="w-1/3" onClick={handleAddCandidate} /> 
            <Button text="Cancel" color="red" className="w-1/3" onClick={close} />
          </div>
        </div>
      </div>
    </div>
  );
}