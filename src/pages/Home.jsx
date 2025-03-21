import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { memeStorage } from '../lib/storage';

function Home() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemes = () => {
      const allMemes = memeStorage.getAllMemes();
      setMemes(allMemes);
      setLoading(false);
    };

    loadMemes();
  }, []);

  return (
    <>
      <Helmet>
        <title>梗图分享 - 首页</title>
        <meta name="description" content="发现和分享最有趣的梗图" />
      </Helmet>

      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-center">热门梗图</h1>
        
        {loading ? (
          <div className="text-center">加载中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
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

export default Home;