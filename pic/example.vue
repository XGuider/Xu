import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, User, Menu, X, Bot, Briefcase, Video, Code, MessageSquare, Edit, BookOpen, ImageIcon, Cpu, SearchCode, Mic, Settings, Star } from 'lucide-react';

// --- 数据层 (Mock Data) ---
const mockTools = [
  { id: 1, name: 'DeepSeek', description: '深度探索 (DeepSee...', category: '热门推荐', icon: <Cpu className="w-8 h-8 text-blue-500" /> },
  { id: 2, name: '腾讯元宝', description: '腾讯元宝是一款新...', category: '热门推荐', icon: <Bot className="w-8 h-8 text-blue-400" /> },
  { id: 3, name: 'Cursor', description: 'Cursor是一款AI代...', category: '热门推荐', icon: <Code className="w-8 h-8 text-green-500" /> },
  { id: 4, name: '可灵AI', description: '可灵AI是一款新一代...', category: '热门推荐', icon: <Video className="w-8 h-8 text-red-500" /> },
  { id: 5, name: '秘塔AI搜索', description: '秘塔AI搜索是一款搜...', category: '热门推荐', icon: <SearchCode className="w-8 h-8 text-purple-500" /> },
  { id: 6, name: 'LiblibAI-哩布', description: 'LiblibAI-哩布是一个...', category: '热门推荐', icon: <ImageIcon className="w-8 h-8 text-orange-500" /> },
];

const categories = [
    { name: '热门推荐', icon: <Star /> },
    { name: 'AI办公工具', icon: <Briefcase /> },
    { name: 'AI视频工具', icon: <Video /> },
    { name: 'AI编程工具', icon: <Code /> },
    { name: 'AI聊天助手', icon: <MessageSquare /> },
    { name: 'AI写作工具', icon: <Edit /> },
    { name: 'AI学习网站', icon: <BookOpen /> },
    { name: 'AI图像工具', icon: <ImageIcon /> },
    { name: 'AI训练模型', icon: <Cpu /> },
    { name: 'AI搜索引擎', icon: <Search /> },
    { name: 'AI开发平台', icon: <Code /> },
    { name: 'AI音频工具', icon: <Mic /> },
    { name: 'AI设计工具', icon: <ImageIcon /> },
    { name: 'AI模型评测', icon: <Settings /> },
];

const hotSearches = ['Liblibai', 'Coze和子', '男昧', 'Trae国内版', '腾讯元宝', '海螺音乐'];

// --- 组件架构 (Atomic Design) ---

// **Atoms**
const IconButton = ({ children, onClick, className = '' }) => (
    <button onClick={onClick} className={`p-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}>
        {children}
    </button>
);

const CategoryLink = ({ icon, name, isActive, onClick, hasSubMenu = false }) => (
    <li onClick={onClick} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}>
        <div className="flex items-center space-x-3">
            {React.cloneElement(icon, { className: "w-5 h-5" })}
            <span className="font-medium">{name}</span>
        </div>
        {hasSubMenu && <ChevronDown className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />}
    </li>
);

// **Molecules**
const MainSearchBar = () => (
    <div className="w-full max-w-2xl mx-auto">
        <div className="relative">
            <input
                type="text"
                placeholder="请输入您要搜索的AI产品"
                className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-3 pl-5 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer" />
        </div>
        <div className="mt-4 flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-500">热门榜:</span>
            {hotSearches.map(term => (
                <a key={term} href="#" className="text-sm text-gray-600 hover:text-blue-500 bg-gray-100 px-3 py-1 rounded-md transition-colors">{term}</a>
            ))}
        </div>
    </div>
);


const ToolCard = ({ tool }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 p-4 flex items-center space-x-4">
        <div className="bg-gray-100 p-2 rounded-md">
             {React.cloneElement(tool.icon, { className: "w-8 h-8" })}
        </div>
        <div className="flex-1">
            <h3 className="text-base font-bold text-gray-800">{tool.name}</h3>
            <p className="text-gray-500 text-sm truncate">{tool.description}</p>
        </div>
    </div>
);

// **Organisms**
const Header = ({ onMenuClick }) => (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-4">
             <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600">
                <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
                 {/* 在实际项目中，请将下方的 src 替换为您的Logo图片URL */}
                 <img src="https://placehold.co/80x32/FFFFFF/000000?text=Xu&font=raleway" alt="Xu Logo" className="h-8" />
            </div>
            <nav className="hidden lg:flex items-center space-x-6">
                <a href="#" className="text-sm font-semibold text-blue-600">首页</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">提交网站</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">博客</a>
            </nav>
        </div>
        <div className="flex items-center space-x-4">
             <div className="relative hidden md:block">
                <input type="text" placeholder="搜索" className="bg-gray-100 rounded-md py-1.5 pl-8 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button className="hidden md:flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600">
                <span>ZH</span>
                <ChevronDown className="w-4 h-4"/>
            </button>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">登录/注册</a>
        </div>
    </header>
);

const Sidebar = ({ activeCategory, setActiveCategory, isOpen, onClose }) => (
    <>
        <aside className={`fixed lg:relative inset-y-0 left-0 bg-white border-r border-gray-200 w-64 p-4 transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} lg:translate-x-0 lg:shadow-none`}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-lg font-bold text-gray-800">分类导航</h2>
                <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <nav>
                <ul className="space-y-1">
                    {categories.map(category => (
                        <CategoryLink
                            key={category.name}
                            icon={category.icon}
                            name={category.name}
                            isActive={activeCategory === category.name}
                            hasSubMenu={category.name === 'AI图像工具'}
                            onClick={() => {
                                setActiveCategory(category.name);
                                if(window.innerWidth < 1024) onClose();
                            }}
                        />
                    ))}
                </ul>
            </nav>
        </aside>
        {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-20 lg:hidden"></div>}
    </>
);

const MainContent = ({ tools }) => (
    <main className="flex-1 p-6 md:p-8 bg-gray-50">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">千万用户信赖的AI工具导航平台</h1>
            <MainSearchBar />
        </div>

        <div className="mb-12">
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                 <div className="text-center">
                    <div className="w-20 h-20 bg-gray-400 rounded-full mx-auto flex items-center justify-center text-white font-bold text-4xl mb-2">1</div>
                    <div className="flex space-x-2 justify-center">
                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    </div>
                 </div>
            </div>
        </div>
        
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">热门推荐</h2>
                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">查看更多 ›</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {tools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
        </div>
    </main>
);


// **Templates/Pages**
export default function AiNavigationHomepage() {
    const [activeCategory, setActiveCategory] = useState('热门推荐');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const filteredTools = useMemo(() => {
        return mockTools.filter(tool => activeCategory === '热门推荐' || tool.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="bg-white text-gray-800 min-h-screen font-sans">
            <div className="flex">
                <Sidebar
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <div className="flex-1 flex flex-col min-h-screen">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />
                    <MainContent tools={filteredTools} />
                </div>
            </div>
        </div>
    );
}


