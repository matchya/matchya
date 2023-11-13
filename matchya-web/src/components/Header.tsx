import React, { useState } from 'react'
import matchyaIcon from '../assets/matchya-icon.png'

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const login = () => {
        setIsAuthenticated(!isAuthenticated)
    }

  return (
    <div className='w-full h-16 border-2 flex justify-between'>
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
                onClick={login}>
                { isAuthenticated ? 'Logout' : 'Login'}
            </button>
        </div>
    </div>
  )
}

export default Header