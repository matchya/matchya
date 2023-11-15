import { useState } from 'react'
import matchyaIcon from '../assets/matchya-icon.png'
import AuthModal from './AuthModal'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import Button from './Button'

const Header = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showSignupModal, setShowSignupModal] = useState(false)

    const switchModal = () => {
        setShowLoginModal(!showLoginModal);
        setShowSignupModal(!showSignupModal);
    }

    const showSignupModalHandler = () => {
        setShowSignupModal(true);
    }

    const showLoginModalHandler = () => {
        setShowLoginModal(true);
    }

    const signup = (company_name: string, email: string, github_url: string, password: string) => {
        console.log('Company:', company_name);
        console.log('Email:', email);
        console.log('GitHub URL:', github_url);
        console.log('Password:', password);
        setShowSignupModal(false);
        setIsAuthenticated(true);
    }

    const login = (email: string, password: string) => {
        console.log('Email:', email);
        console.log('Password:', password);
        setShowLoginModal(false);
        setIsAuthenticated(true);
    }

    const logout = () => {
        setIsAuthenticated(false)
        navigate('/');
    }

    const navigateToSettings = () => {
        navigate('/settings');
    }


  return (
    <div className='w-full h-16 absolute bg-white border-2 flex justify-between'>
        { showLoginModal && <AuthModal type="login" action={login} close={() => setShowLoginModal(false)} switchModal={switchModal}  />}
        { showSignupModal && <AuthModal type="signup" action={signup} close={() => setShowSignupModal(false)} switchModal={switchModal}  />}
        <div className='w-1/5 flex justify-center items-center'>
            <img className="h-3/4 rounded-full m-6" src={ matchyaIcon } />
            <Link to='/'>
                <h3 className='text-lg m-6'>Matchya</h3>
            </Link>
        </div>
        <div className='w-1/4 flex justify-end items-center'>
            {
                isAuthenticated ? 
                ( 
                    <>
                        <Button text='Settings' color='green' border={false} hover={false} className='my-auto py-2  m-6' onClick={navigateToSettings} />
                        <Button text='Logout' color='green' border={false} hover={false} className='my-auto py-2 mx-6 mr-6' onClick={logout} />
                    </>
                ) : 
                ( 
                    <>
                        <Button text='Login' color='green' border={false} hover={false} className='my-auto py-2  m-6' onClick={showLoginModalHandler} />
                        <Button text='Sign Up' color='green' className='my-auto py-2 mx-6 mr-6' onClick={showSignupModalHandler} />
                    </>
                )
            }
        </div>
    </div>
  )
}

export default Header