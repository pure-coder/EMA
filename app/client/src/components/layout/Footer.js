import React from 'react'

export default () => {
    return (
        <div>
            <footer className="footer-custom text-white mt-5 p-3 text-right">
                &copy; {new Date().getFullYear()} Fitness App
            </footer>
        </div>
    )
}