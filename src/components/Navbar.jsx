import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/storage';

function Navbar() {
  const navigate = useNavigate();
  const user = auth.user();

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">梗图站</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-700"
              >
                首页
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-700"
              >
                搜索
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/upload"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-700"
                >
                  上传
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {user?.isAdmin ? (
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                退出管理
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                管理员登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;