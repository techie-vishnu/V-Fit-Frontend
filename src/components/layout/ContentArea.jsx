import React from 'react'
import Container from 'react-bootstrap/Container';

function ContentArea() {
    return (
        <>
            <div className="tw:flex-1 tw:p-4">
                <Container>
                    <h1 className="tw:text-2xl tw:font-bold">Welcome to the Vfit</h1>
                    <p className="tw:mt-4">This is the main content area.</p>
                </Container>
            </div>
        </>
    )
}

export default ContentArea