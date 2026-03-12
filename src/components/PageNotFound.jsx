import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {

  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-950 to-blue-800">

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-16 flex flex-col items-center gap-4 max-w-md w-full mx-4">

        {/* Emoji */}
        <div className="text-7xl">🔍</div>

        {/* 404 */}
        <h1 className="text-8xl font-black text-blue-900 leading-none">404</h1>

        {/* Divider */}
        <div className="w-16 h-1 bg-blue-600 rounded-full"></div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
        <p className="text-gray-500 text-center text-sm">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mt-4">

          {/* Back to Home */}
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>

          {/* Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Go Back
          </button>

        </div>
      </div>

      {/* Bottom text */}
      <p className="text-blue-300 text-sm mt-8">Bug Tracker © 2026</p>

    </div>
  )
}

export default PageNotFound
