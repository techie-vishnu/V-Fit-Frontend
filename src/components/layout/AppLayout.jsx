import React, { useState } from 'react'
import Sidebar from './Sidebar';
import Sidebar1 from './Sidebar1';
import Header from './Header';
import ContentArea from './ContentArea';

function AppLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
    };
    return (
        <>
            <div className={`tw:flex tw:min-h-screen ${isDarkMode ? 'dark' : ''}`}>
                {/* <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} /> */}
                <Sidebar1 isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                <div className="tw:flex-1 tw:flex tw:flex-col">
                    <Header toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                    <ContentArea />
                </div>
            </div>
        </>
    )
}

export default AppLayout