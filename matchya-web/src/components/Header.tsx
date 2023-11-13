import { useState } from 'react'
import matchyaIcon from '../assets/matchya-icon.png'
import LoginModal from './LoginModal'

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)

    const showLoginModalHandler = () => {
        setShowLoginModal(true);
    }

    const login = () => {
        setShowLoginModal(false);
        setIsAuthenticated(true)
    }

    const logout = () => {
        setIsAuthenticated(false)
    }

  return (
    <div className='w-full h-16 absolute bg-white border-2 flex justify-between'>
        { showLoginModal && <LoginModal login={login} />}
        <div className='w-1/5 flex justify-center items-center'>
            <img className="h-3/4 rounded-full m-6" src={ matchyaIcon } />
            <h3 className='text-lg m-6'>Matchya</h3>
        </div>
        <div className='w-1/4 flex justify-end items-center'>
            {
                isAuthenticated && (
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6'>
                        Settings
                    </button>
                )
            }
            <button 
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6'
                onClick={isAuthenticated ? logout: showLoginModalHandler}>
                { isAuthenticated ? 'Logout' : 'Login'}
            </button>
        </div>
    </div>
  )
}

export default Header