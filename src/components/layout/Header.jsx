import React, { useState } from 'react'

function Header({ toggleSidebar, toggleDarkMode, isDarkMode }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="tw:bg-white tw:dark:bg-gray-900 tw:shadow tw:p-4 tw:flex tw:justify-between tw:items-center">
            {/* Sidebar Toggle Button (Left) */}
            <button onClick={toggleSidebar} className="tw:md:invisible tw:p-2 tw:bg-gray-200 tw:dark:bg-gray-700 tw:rounded">
                <svg className="tw:w-6 tw:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>

            {/* Dark Mode Toggle Button (Right) */}
            <div className="tw:flex tw:items-center tw:gap-x-4">
                <button onClick={toggleDarkMode} className="tw:p-2 tw:bg-gray-200 tw:dark:bg-gray-700 tw:rounded">
                    {isDarkMode ? '🌞' : '🌙'}
                </button>

                {/* User Dropdown */}
                <div className="tw:relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="tw:flex tw:items-center tw:gap-x-2">
                        <span className="tw:text-gray-700 tw:dark:text-gray-200">User</span>
                        <svg className="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="tw:absolute tw:right-0 tw:mt-5 tw:w-48 tw:bg-white tw:dark:bg-gray-800 tw:rounded tw:shadow-lg">
                            <ul className="py-2 px-auto tw:text-gray-700 tw:dark:text-gray-200">
                                <li className="tw:px-4 tw:py-2 tw:hover:bg-gray-100 tw:dark:tw:hover:bg-gray-700">Profile</li>
                                <li className="tw:px-4 tw:py-2 tw:hover:bg-gray-100 tw:dark:tw:hover:bg-gray-700">Settings</li>
                                <li className="tw:px-4 tw:py-2 tw:hover:bg-gray-100 tw:dark:tw:hover:bg-gray-700">Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header