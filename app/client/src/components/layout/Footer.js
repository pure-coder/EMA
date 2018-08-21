import React from 'react'

export default () => {
    return (
        <div>
            <footer className="footer-custom text-white p-3 text-right">
                &copy; {new Date().getFullYear()} Fitness App
            </footer>
        </div>
    )
}