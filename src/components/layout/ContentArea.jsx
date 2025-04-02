import React from 'react'
import Container from 'react-bootstrap/Container';
import { Outlet } from 'react-router';

function ContentArea() {
    return (
        <>
            <div className="tw:flex-1 tw:p-4 tw:dark:bg-gray-900 tw:dark:text-gray-100 tw:bg-gray-50 tw:text-gray-800">
                <Container>
                    <div className='mt-5'>
                        <Outlet />
                    </div>
                </Container>
            </div>
        </>
    )
}

export default ContentArea