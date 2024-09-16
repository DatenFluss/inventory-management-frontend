import React from 'react';

function Footer() {
    return (
        <footer className="footer bg-light text-center mt-5">
            <div className="container">
                <span className="text-muted">&copy; {new Date().getFullYear()} Your Company Name</span>
            </div>
        </footer>
    );
}

export default Footer;
