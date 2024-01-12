import { Button, TestTable } from '@/components';
import { mockedTests } from '@/data/mock';

const TestPageTemplate = () => (
  <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden">
    <div className="w-full h-full mx-auto">
      <div>
        <div className="w-full h-full mx-auto">
          <div className="justify-between items-center py-12">
            <div className="px-12">
              <div className="mb-8 flex justify-between items-center">
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold">Your Matchya Tests</h3>
                  <p className="">Create and manage your Matchya tests here.</p>
                </div>
                <Button>Create a test</Button>
              </div>
              <TestTable tests={mockedTests} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TestPageTemplate;
