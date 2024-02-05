import { Link } from 'react-router-dom';

const MainNav = () => {
  return (
    <div className="flex space-x-8">
      <Link
        to="/assessments"
        className="text-sm font-bold text-matcha-800 hover:text-matcha-600"
      >
        Assessments
      </Link>
      <Link
        to="/candidates"
        className="text-sm font-bold text-matcha-900 hover:text-matcha-600"
      >
        Candidates
      </Link>
      <Link
        to="/interviews"
        className="text-sm font-bold text-matcha-900 hover:text-matcha-600"
      >
        Interviews
      </Link>
    </div>
  );
};

export default MainNav;
