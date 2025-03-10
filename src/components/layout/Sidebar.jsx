import React from 'react'

function Sidebar({ isCollapsed, toggleSidebar }) {
    return (
        <div className={`bg-gray-800 dark:bg-gray-900 text-white h-screen w-64 ${isCollapsed ? 'hidden' : 'block'} md:block`}>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <nav>
                <ul className="space-y-2">
                    <li className="p-2 hover:bg-gray-700 dark:hover:bg-gray-700">Dashboard</li>
                    <li className="p-2 hover:bg-gray-700 dark:hover:bg-gray-700">Users</li>
                    <li className="p-2 hover:bg-gray-700 dark:hover:bg-gray-700">Settings</li>
                </ul>
            </nav>
            <button onClick={toggleSidebar} className="md:hidden p-2 bg-gray-700 dark:bg-gray-800 w-full">
                {isCollapsed ? 'Open Sidebar' : 'Close Sidebar'}
            </button>
        </div>
    );
}

export default Sidebar