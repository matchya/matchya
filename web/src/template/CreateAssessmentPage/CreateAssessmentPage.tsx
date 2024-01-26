import { Link } from 'react-router-dom';

import { Input, Button, Icons } from '@/components';

const positions = [
  'Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'DevOps Engineer',
  'Mobile Engineer',
  'Fullstack Engineer',
];
const levels = ['Junior', 'Mid-Level', 'Senior', 'Lead'];

interface CreateAssessmentPageTemplateProps {
  testName: string;
  selectedPosition: string;
  selectedLevel: string;
  advanceSettingOpen: boolean;
  topicInputValue: string;
  specifiedTopics: string[];
  isLoading: boolean;
  onTestNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPositionChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  setAdvanceSettingOpen: (value: boolean) => void;
  setTopicInputValue: (value: string) => void;
  handleAddTopics: () => void;
  handleRemoveTopic: (topic: string) => void;
  handleSubmit: () => void;
}

const CreateAssessmentPageTemplate = ({
  testName,
  selectedPosition,
  selectedLevel,
  advanceSettingOpen,
  topicInputValue,
  specifiedTopics,
  isLoading,
  onTestNameChange,
  onPositionChange,
  onLevelChange,
  setAdvanceSettingOpen,
  setTopicInputValue,
  handleAddTopics,
  handleRemoveTopic,
  handleSubmit,
}: CreateAssessmentPageTemplateProps) => {
  return (
    <div className="w-full min-h-screen h-[1px] bg-macha-200 overflow-y-scroll">
      <Link to="/assessments">
        <div className="w-full flex justify-start px-10 py-5">
          <p className="text-xl font-bold text-macha-800">← Back</p>
        </div>
      </Link>
      <div className="w-full md:w-[768px] px-10 py-5 rounded-lg">
        <p className="text-2xl font-bold text-black mb-4 mx-8">
          Create Assessment
        </p>
        <div className="bg-orange-50 w-full rounded-lg my-2 mx-auto p-6 pl-8">
          <p className="text-sm font-bold text-black mb-2 pl-8">
            Assessment Name
          </p>
          <Input
            value={testName}
            onChange={onTestNameChange}
            type="text"
            className="w-2/3 text-macha-800 p-1 px-4 bg-orange-50 active:ring-0 focus:ring-0"
          />
        </div>
        <div className="bg-orange-50 w-full rounded-lg my-2 mx-auto p-6 pl-8">
          <p className="text-sm font-bold text-black mb-2 pl-8">
            Position Type
          </p>
          <div className="w-full flex flex-wrap">
            {positions.map(position => (
              <div
                className="w-1/3 flex justify-start items-center my-2 cursor-pointer"
                onClick={() => onPositionChange(position)}
              >
                <p
                  className={`text-lg font-bold ${
                    selectedPosition === position && 'text-macha-700'
                  }`}
                >
                  {position}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-orange-50 w-full rounded-lg my-2 mx-auto p-6 pl-8">
          <p className="text-sm font-bold text-black mb-2 pl-8">
            Position Level
          </p>
          <div className="w-full flex flex-wrap">
            {levels.map(level => (
              <div
                className="w-1/2 flex justify-start items-center my-2 cursor-pointer"
                onClick={() => onLevelChange(level)}
              >
                <p
                  className={`text-lg font-bold ${
                    selectedLevel === level && 'text-macha-700'
                  }`}
                >
                  {level}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-orange-50 w-full rounded-lg my-2 mx-auto p-6 pl-8">
          <p className="flex items-center text-sm font-bold text-black mb-2">
            {advanceSettingOpen ? (
              <Icons.triangle_down
                onClick={() => setAdvanceSettingOpen(false)}
                className="w-4 h-4 mr-2 cursor-pointer"
              />
            ) : (
              <Icons.triangle_right
                onClick={() => setAdvanceSettingOpen(true)}
                className="w-4 h-4 mr-2 cursor-pointer"
              />
            )}
            Advanced Settings
          </p>
          {advanceSettingOpen && (
            <div className="bg-orange-50 w-full rounded-lg my-2 mx-auto mt-4 px-4">
              <p className="text-sm font-bold text-black mb-2 pl-8">
                Question Topics
              </p>
              <div className="relative">
                <Input
                  value={topicInputValue}
                  onChange={e => setTopicInputValue(e.target.value)}
                  type="text"
                  className="w-full relative text-macha-800 p-1 px-4 bg-orange-50 active:ring-0 focus:ring-0 h-12"
                />
                <Button
                  className="absolute top-0 right-0 bg-macha-700 text-macha-50 hover:bg-macha-800 hover:text-macha-100 mt-1 mr-2 h-10 w-20"
                  onClick={handleAddTopics}
                >
                  Add
                </Button>
              </div>
              <div className="w-full flex flex-wrap">
                {specifiedTopics.map(topic => (
                  <div className="px-2 py-1 flex justify-start items-center my-2 cursor-pointer bg-macha-400 mx-4 rounded-2xl">
                    <Icons.close
                      className="w-4 h-4 mr-2"
                      onClick={() => handleRemoveTopic(topic)}
                    />
                    <p className="text-sm font-bold">{topic}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-8 font-bold text-black mb-2 pl-8">
                Description
              </p>
              <textarea
                className="w-full h-32 text-black p-1 px-4 bg-orange-50 active:ring-0 focus:ring-0 border-2 text-sm"
                placeholder={
                  "Let us know more about your position to generate better questions for you.\n" +
                  "ex)\n - Seeking a front-end engineer proficient in design.\n" +
                  " - Back-end engineer with experience working for a large-scale company."
                }
              />
            </div>
          )}
        </div>
        <div className="mt-4 w-full flex justify-end">
          <div className="w-1/2 flex justify-end px-4 items-center">
            <Link to="/assessments">
              <p className="text-md font-bold text-black mr-6 cursor-pointer">
                Cancel
              </p>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-lime-400 bg-orange-700 text-sm text-macha-50 hover:bg-orange-800 hover:text-macha-100 w-1/2 py-4 rounded-sm"
            >
              Create Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessmentPageTemplate;
