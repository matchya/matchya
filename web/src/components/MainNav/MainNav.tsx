import { Link } from 'react-router-dom';

const MainNav = () => {
  return (
    <div className="flex space-x-8">
      <Link
        to="/candidates"
        className="text-sm font-bold text-black hover:text-gray-200"
      >
        Candidates
      </Link>
      <Link
        to="/tests"
        className="text-sm font-bold text-black hover:text-gray-200"
      >
        Tests
      </Link>
      <Link
        to="/interviews"
        className="text-sm font-bold text-black hover:text-gray-200"
      >
        Interviews
      </Link>
    </div>
  );
};

export default MainNav;
