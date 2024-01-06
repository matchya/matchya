import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { clientEndpoint, githubClientId } from '@/config/env';
import { axiosInstance } from '@/lib/client';
import { useCompanyStore, usePositionStore } from '@/store/store';
import { PositionSetupPageTemplate } from '@/template';

const PositionSetupPage = () => {
  const navigate = useNavigate();
  const { id, me } = useCompanyStore();
  const { setupPosition } = usePositionStore();
  const [selectedType, setSelectedType] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const { github_username } = useCompanyStore();
  const [selectedRepositories, setSelectedRepositories] = useState<string[]>(
    []
  );
  const [phase, setPhase] = useState(github_username ? 1 : 0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === 0 && github_username) {
      setPhase(1);
    }
  }, [github_username]);

  const integrateGitHub = async () => {
    const redirectUri = `${clientEndpoint}/auth/github/callback`;
    const loginUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=repo,user`;

    window.location.href = loginUrl;
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
  };

  const handleSelectLevel = (level: string) => {
    setSelectedLevel(level);
  };

  const handlePositionSubmit = async () => {
    const data = {
      company_id: id,
      type: selectedType,
      level: selectedLevel,
    };
    try {
      const res = await axiosInstance.post('/positions', data);
      if (res.data.status === 'success') {
        me();
        setupPosition(false);
        navigate('/dashboard');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleNext = () => {
    if (phase === 1 && selectedType === '') return;
    if (phase === 2 && selectedLevel === '') return;
    if (phase === 2 && github_username) setPhase(4);
    else if (phase === 3 || phase === 5) handlePositionSubmit();
    else setPhase(phase + 1);
  };

  const handleUnselect = useCallback((framework: string) => {
    setSelectedRepositories(prev => prev.filter(s => s !== framework));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelectedRepositories(prev => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    []
  );

  const handleAddItem = (item: string) => {
    if (selectedRepositories.includes(item)) return;
    setSelectedRepositories((prev: string[]) => [...prev, item]);
  };

  return (
    <PositionSetupPageTemplate
      inputRef={inputRef}
      phase={phase}
      selectedRepositories={selectedRepositories}
      selectedType={selectedType}
      selectedLevel={selectedLevel}
      integrateGitHub={integrateGitHub}
      handleSelectType={handleSelectType}
      handleSelectLevel={handleSelectLevel}
      handleNext={handleNext}
      handlePrev={() => setPhase(phase - 1)}
      handleUnselect={handleUnselect}
      handleKeyDown={handleKeyDown}
      handleAddItem={handleAddItem}
    />
  );
};

export default PositionSetupPage;
