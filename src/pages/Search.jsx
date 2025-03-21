import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { memeStorage } from '../lib/storage';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const searchResults = memeStorage.searchMemes(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>搜索梗图</title>
        <meta name="description" content="搜索你想要的梗图" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">搜索梗图</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入关键词搜索..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              搜索
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center">搜索中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((meme) => (
              <div key={meme.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={meme.image_url}
                  alt={meme.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{meme.title}</h2>
                  {meme.description && (
                    <p className="text-gray-600 mb-2">{meme.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {meme.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Search;