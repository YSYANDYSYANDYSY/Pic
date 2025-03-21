import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { auth, memeStorage, imageStorage } from '../lib/storage';

function Upload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.user();
      if (!user) throw new Error('请先登录');

      if (!formData.image) throw new Error('请选择图片');

      // 将图片转换为Base64
      const imageUrl = await imageStorage.uploadImage(formData.image);

      // 创建梗图记录
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [];

      const meme = memeStorage.addMeme({
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        user_id: user.id,
        tags
      });

      toast.success('上传成功！');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>上传梗图</title>
        <meta name="description" content="上传分享你的梗图" />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">上传梗图</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              标题
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              描述
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              图片
            </label>
            <input
              type="file"
              accept="image/*"
              required
              className="mt-1 block w-full"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              标签 (用逗号分隔)
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="搞笑, 动漫, 表情包"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? '上传中...' : '上传'}
          </button>
        </form>
      </div>
    </>
  );
}

export default Upload;