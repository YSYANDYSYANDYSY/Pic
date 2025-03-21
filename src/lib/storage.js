// 本地存储服务
const STORAGE_KEYS = {
  MEMES: 'memes',
  CURRENT_USER: 'currentUser'
};

// 预设管理员账户
const ADMIN_USER = {
  id: '1',
  email: 'admin@ysyerror.site',
  password: 'admin114514.',
  isAdmin: true
};

// 用户管理
export const auth = {
  user: () => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  signIn: ({ email, password }) => {
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(ADMIN_USER));
      return { user: ADMIN_USER };
    }
    throw new Error('邮箱或密码错误');
  },

  signOut: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// 梗图管理
export const memeStorage = {
  // 获取所有梗图
  getAllMemes: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMES) || '[]');
  },

  // 搜索梗图
  searchMemes: (query) => {
    const memes = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMES) || '[]');
    if (!query) return memes;

    const searchTerm = query.toLowerCase();
    return memes.filter(meme => 
      meme.title.toLowerCase().includes(searchTerm) ||
      meme.description?.toLowerCase().includes(searchTerm) ||
      meme.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  },

  // 添加新梗图
  addMeme: (meme) => {
    const memes = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMES) || '[]');
    const newMeme = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...meme
    };
    memes.push(newMeme);
    localStorage.setItem(STORAGE_KEYS.MEMES, JSON.stringify(memes));
    return newMeme;
  }
};

// 图片存储（Base64）
export const imageStorage = {
  uploadImage: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};