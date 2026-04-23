// 1. Imports MUST be at the very top for ESLint
import { ArrowRight, Clock, Plus, Check, X, Trash2, AlertCircle, Edit2, Eye, EyeOff } from 'lucide-react';
import { Footer } from '../Footer';
import { useState } from 'react';

// Asset Imports
import admissionsFair from '../../../assets/AdmissionsFairBG.jpg';
import mentorProgram from '../../../assets/AlumniMentorBG.jpg';
import globalAlumni from '../../../assets/GlobalAlumniBG.jpg';
import achievements1 from '../../../assets/Achievements1BG.jpg';
import achievements2 from '../../../assets/Achievements2BG.jpg';
import whoMadeCut from '../../../assets/WhoCutBG.jpg';

// 2. Constants come after imports
const PLACEHOLDER = "https://images.unsplash.com/photo-1523050335456-c6bb7f9cc997?auto=format&fit=crop&q=80&w=800";

// Define the NewsItem type explicitly to avoid the TypeScript error
interface NewsItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  content?: string; // Added content field for editing
  date: string;
  image: any;
  status: 'pending' | 'approved' | 'declined' | 'hidden'; // Added 'hidden'
}

interface NewsItemProps extends NewsItem {
  onApprove?: (id: number) => void;
  onDecline?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (item: NewsItem) => void; // Added onEdit
  onHide?: (id: number) => void; // Added onHide
  onReadMore?: (item: NewsItem) => void; // Added onReadMore
  isAdminView?: boolean;
}

function NewsCard({ id, category, title, excerpt, content, date, image, status, onApprove, onDecline, onDelete, onEdit, onHide, onReadMore, isAdminView }: NewsItemProps) {
  return (
    <div className={`bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row h-full text-left group relative ${status === 'hidden' ? 'opacity-60' : ''}`}>
      <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-gray-200">
        <img 
          src={image || PLACEHOLDER} 
          alt={title} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${status === 'hidden' ? 'grayscale' : ''}`} 
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
      </div>
      <div className="md:w-2/3 p-8 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-bold uppercase tracking-wider">
              {category}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              {date}
            </div>
          </div>
          {isAdminView && (
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
              status === 'approved' ? 'bg-green-100 text-green-700' : 
              status === 'declined' ? 'bg-red-100 text-red-700' : 
              status === 'hidden' ? 'bg-gray-200 text-gray-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {status}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#003087] transition-colors">
          {title} {status === 'hidden' && <span className="text-gray-400 text-sm font-normal ml-2">(Hidden)</span>}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <button 
            onClick={() => onReadMore?.({ id, category, title, excerpt, content, date, image, status })}
            className="flex items-center gap-2 text-[#003087] font-bold text-sm hover:translate-x-1 transition-transform"
          >
            Read More <ArrowRight className="w-4 h-4" />
          </button>

          {isAdminView && id && (
            <div className="flex gap-2">
              {status === 'pending' && (
                <>
                  <button 
                    onClick={() => onApprove?.(id)}
                    className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                    title="Approve Post"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDecline?.(id)}
                    className="p-2 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors"
                    title="Decline Post"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              
              {/* Edit Button */}
              <button 
                onClick={() => onEdit?.({ id, category, title, excerpt, content, date, image, status })}
                className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                title="Edit Post"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Hide/Show Button */}
              <button 
                onClick={() => onHide?.(id)}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                title={status === 'hidden' ? "Unhide Post" : "Hide Post"}
              >
                {status === 'hidden' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => onDelete?.(id)}
                className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                title="Delete Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NewsView({ userRole }: { userRole: string }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'manage'>('feed');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null); // New State
  
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 1,
      category: "Scholarship",
      title: "HAPPENING NOW | Ateneo de Davao University Admissions and Scholarship Fair",
      excerpt: "The Admissions and Scholars Fair runs from January 23 to 25, 2026, bringing admissions, academic programs, and scholarships all in one place.",
      content: "The Admissions and Scholars Fair is a landmark event at ADDU, providing prospective students with everything they need to transition into university life. Attendees can speak directly with faculty from various departments and apply for financial aid programs on the spot.",
      date: "January 10, 2026",
      image: admissionsFair,
      status: 'approved'
    },
    {
      id: 2,
      category: "Programs",
      title: "New Alumni Mentorship Program Launches",
      excerpt: "Connect with fellow Ateneans and share your expertise with the next generation through our expanded mentorship initiative.",
      content: "This program facilitates meaningful connections between established professionals and graduating students. It focuses on career guidance, skill building, and professional networking within the Ateneo community.",
      date: "January 5, 2026",
      image: mentorProgram,
      status: 'approved'
    },
    {
      id: 3,
      category: "Community",
      title: "Global Alumni Chapters Expand to 15 Cities",
      excerpt: "From Manila to New York, our international network continues to grow, bringing Ateneans together across continents.",
      content: "Our expansion highlights the strength of the Blue Knight spirit worldwide. New chapters in London and Singapore have officially been inaugurated this quarter.",
      date: "December 28, 2025",
      image: globalAlumni,
      status: 'approved'
    },
    {
      id: 4,
      category: "Achievements",
      title: "Congratulations to the AdDU College of Law for their outstanding performance in the 2025 Bar Exam!",
      excerpt: "AdDU is TOP 1 among law schools with 51-100 candidates! Our university has produced 82 new Attorneys this year with a 100% passing rate.",
      content: "The AdDU College of Law has once again proven its excellence. Ranking 1st among law schools in its category, the institution maintains its tradition of forming competent and ethical lawyers for the nation.",
      date: "January 7, 2026",
      image: achievements1,
      status: 'approved'
    },
    {
      id: 5,
      category: "Achievements",
      title: "ADDU 26th in the Webometrics Philippines Ranking January 2026!",
      excerpt: "Congratulations to the Ateneo de Davao University Community on ranking 26th out of 356 universities in the Philippines!",
      content: "This ranking recognizes our university's web presence, research impact, and academic influence. We celebrate this achievement as a community dedicated to growth and digital excellence.",
      date: "January 24, 2026",
      image: achievements2,
      status: 'approved'
    },
    {
      id: 6,
      category: "Achievements",
      title: "WHO MADE THE CUT? ⚖️📚",
      excerpt: "Ateneo schools dominate the 2025 Bar exams as Ateneo de Manila University tops law schools with over 100 examinees.",
      content: "The latest Bar exam results underscore the leadership of Ateneo institutions in legal education. Across different categories, Ateneo schools have consistently secured top spots.",
      date: "January 7, 2026",
      image: whoMadeCut,
      status: 'approved'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    featured: false
  });

  const handlePublish = () => {
    if (!newPost.title || !newPost.excerpt || !newPost.content || !newPost.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      // Update existing post
      setNews(prev => prev.map(item => item.id === editingId ? {
        ...item,
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        category: newPost.category,
        image: newPost.image || PLACEHOLDER
      } : item));
      setEditingId(null);
      alert('Article updated successfully!');
    } else {
      // Create new post
      const article: NewsItem = {
        id: Date.now(),
        category: newPost.category,
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        image: newPost.image || PLACEHOLDER,
        status: 'approved'
      };

      if (newPost.featured) {
        setNews([article, ...news]);
      } else {
        setNews([...news, article]);
      }
      alert('Article published successfully!');
    }

    setNewPost({ title: '', excerpt: '', content: '', category: '', image: '', featured: false });
    setActiveTab('feed');
  };

  const handleApprove = (id: number) => {
    setNews(prevNews => prevNews.map(item => item.id === id ? { ...item, status: 'approved' as const } : item));
  };

  const handleDecline = (id: number) => {
    setNews(prevNews => prevNews.map(item => item.id === id ? { ...item, status: 'declined' as const } : item));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      setNews(prevNews => prevNews.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item: NewsItem) => {
    setNewPost({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content || '',
      category: item.category,
      image: typeof item.image === 'string' ? item.image : '',
      featured: false
    });
    setEditingId(item.id);
    setActiveTab('create');
  };

  const handleHide = (id: number) => {
    setNews(prevNews => prevNews.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'hidden' ? 'approved' : 'hidden' as const };
      }
      return item;
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Modal Overlay for Read More */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-left">
            <button 
              onClick={() => setSelectedArticle(null)} 
              className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <div className="h-64 md:h-96 w-full overflow-hidden">
              <img 
                src={selectedArticle.image || PLACEHOLDER} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="p-8 md:p-12">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-bold uppercase tracking-wider mb-4 inline-block">
                {selectedArticle.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{selectedArticle.title}</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-8">
                <Clock className="w-4 h-4" /> {selectedArticle.date}
              </div>
              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                <p className="font-semibold text-lg mb-4">{selectedArticle.excerpt}</p>
                <div className="whitespace-pre-line">{selectedArticle.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 space-y-12 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">News & Updates</h1>
            <p className="text-gray-500 font-medium">Stay informed about alumni news and announcements</p>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={() => {
                setEditingId(null);
                setNewPost({ title: '', excerpt: '', content: '', category: '', image: '', featured: false });
                setActiveTab('create');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              Post News
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-3 border-b-2 transition-colors font-semibold ${
              activeTab === 'feed' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            News Feed
          </button>
          {userRole === 'admin' && (
            <>
              <button 
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 border-b-2 transition-colors font-semibold ${
                  activeTab === 'create' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {editingId ? 'Edit Post' : 'Create Post'}
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 border-b-2 transition-colors font-semibold ${
                  activeTab === 'manage' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Manage Content
              </button>
            </>
          )}
        </div>

        {activeTab === 'feed' && (
          <>
            {/* Featured Section */}
            {news.filter(n => n.status === 'approved').length > 0 && (
              <section className="relative overflow-hidden rounded-[40px] bg-white border border-gray-100 shadow-lg">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 relative h-[450px] lg:h-auto overflow-hidden bg-gray-200">
                    <img 
                      src={news.filter(n => n.status === 'approved')[0]?.image || admissionsFair || PLACEHOLDER} 
                      alt={news.filter(n => n.status === 'approved')[0]?.title || "Featured Article"} 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-5 py-2 bg-[#003087] text-white text-[10px] rounded-full font-bold uppercase tracking-widest shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center text-left">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-bold uppercase tracking-wider w-fit mb-4">
                      {news.filter(n => n.status === 'approved')[0]?.category || "Scholarship"}
                    </span>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6 leading-tight">
                      {news.filter(n => n.status === 'approved')[0]?.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                      {news.filter(n => n.status === 'approved')[0]?.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                      <span className="text-sm text-gray-400 font-medium">{news.filter(n => n.status === 'approved')[0]?.date}</span>
                      <button 
                        onClick={() => setSelectedArticle(news.filter(n => n.status === 'approved')[0])}
                        className="text-[#003087] font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform"
                      >
                        Read More <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* News Feed */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">News Feed</h2>
                <div className="h-[2px] flex-1 bg-gray-100"></div>
              </div>
              <div className="flex flex-col gap-8">
                {news.filter(n => n.status === 'approved').slice(1).map((article) => (
                  <NewsCard key={article.id} {...article} onReadMore={setSelectedArticle} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'manage' && userRole === 'admin' && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
              <div className="h-[2px] flex-1 bg-gray-100"></div>
            </div>
            <div className="flex flex-col gap-8">
              {news.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                   <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                   <p className="text-gray-500 font-medium">No news items found.</p>
                </div>
              ) : (
                news.map((article) => (
                  <NewsCard 
                    key={article.id} 
                    {...article} 
                    isAdminView={true}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onHide={handleHide}
                    onReadMore={setSelectedArticle}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'create' && userRole === 'admin' && (
          <div className="bg-white rounded-xl border-2 border-[#003087]/20 p-8 shadow-sm text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Edit News Post' : 'Create News Post'}</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Article Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter article title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt/Summary *</label>
                <textarea 
                  rows={3}
                  placeholder="Brief summary that appears in the news feed"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Content *</label>
                <textarea 
                  rows={10}
                  placeholder="Write your full article here..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select 
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Giving">Giving</option>
                    <option value="Programs">Programs</option>
                    <option value="Community">Community</option>
                    <option value="Events">Events</option>
                    <option value="Achievements">Achievements</option>
                    <option value="Scholarship">Scholarship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image URL</label>
                  <input 
                    type="text" 
                    placeholder="Enter image URL"
                    value={newPost.image}
                    onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
              </div>
              
              {!editingId && (
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={newPost.featured}
                    onChange={(e) => setNewPost({ ...newPost, featured: e.target.checked })}
                    className="w-4 h-4 text-[#003087] border-gray-300 rounded focus:ring-[#003087]" 
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as featured article</label>
                </div>
              )}
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={handlePublish}
                  className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#002066] transition-colors font-semibold"
                >
                  {editingId ? 'Update Post' : 'Publish'}
                </button>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setNewPost({ title: '', excerpt: '', content: '', category: '', image: '', featured: false });
                    setActiveTab('feed');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}