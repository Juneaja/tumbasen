import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  Phone, 
  MapPin, 
  Clock,
  ChevronRight,
  UtensilsCrossed,
  Coffee,
  Candy,
  Trash
} from 'lucide-react';

// Types
interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// Data
const MENU_DATA: MenuItem[] = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    price: 25000,
    category: "makanan",
    image: "https://images.unsplash.com/photo-1603131365146-246df08383f5?auto=format&fit=crop&q=80&w=800",
    description: "Nasi goreng aromatik dengan telur mata sapi, ayam suwir, dan kerupuk."
  },
  {
    id: 2,
    name: "Ayam Geprek Sambal Korek",
    price: 22000,
    category: "makanan",
    image: "https://images.unsplash.com/photo-1626202133282-f8502c70851f?auto=format&fit=crop&q=80&w=800",
    description: "Ayam crispy yang digeprek dengan sambal bawang super pedas."
  },
  {
    id: 3,
    name: "Mie Goreng Jawa",
    price: 18000,
    category: "makanan",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    description: "Mie kuning dimasak dengan bumbu kecap manis dan sayuran segar."
  },
  {
    id: 4,
    name: "Es Teh Manis",
    price: 5000,
    category: "minuman",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    description: "Teh Seduh asli dengan gula murni, disajikan dingin."
  },
  {
    id: 5,
    name: "Es Jeruk Peras",
    price: 8000,
    category: "minuman",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800",
    description: "Jeruk peras murni yang kaya akan Vitamin C."
  },
  {
    id: 6,
    name: "Pisang Goreng Keju",
    price: 15000,
    category: "snack",
    image: "https://images.unsplash.com/photo-1600271772470-bd22a4d788b5?auto=format&fit=crop&q=80&w=800",
    description: "Pisang kepok goreng dengan taburan keju cheddar melimpah."
  },
  {
    id: 7,
    name: "Martabak Telur",
    price: 35000,
    category: "snack",
    image: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=800",
    description: "Martabak gurih dengan isian daging sapi dan daun bawang."
  },
  {
    id: 8,
    name: "Kopi Hitam Sidikalang",
    price: 12000,
    category: "minuman",
    image: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=800",
    description: "Kopi robusta mantap dari dataran tinggi Sidikalang."
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: <UtensilsCrossed size={18} /> },
  { id: 'makanan', name: 'Makanan', icon: <UtensilsCrossed size={18} /> },
  { id: 'minuman', name: 'Minuman', icon: <Coffee size={18} /> },
  { id: 'snack', name: 'Snack', icon: <Candy size={18} /> },
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredMenu = MENU_DATA.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const orderDetails = cart.map(item => `- ${item.name} (${item.quantity}x)`).join('\n');
    const message = `Halo Beli Aja Sukodadi! Saya ingin memesan:\n\n${orderDetails}\n\nTotal: Rp ${cartTotal.toLocaleString('id-ID')}\n\nMohon segera diproses ya. Terima kasih!`;
    const whatsappUrl = `https://wa.me/6289602337878?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <span className="font-extrabold text-xl tracking-tight hidden sm:block">
              Beli Aja <span className="text-primary tracking-tighter">Sukodadi</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari makanan favorit..." 
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-6">
                🚀 Pengiriman Tercepat di Sukodadi
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Rasakan Lezatnya <br />
                <span className="text-secondary">Kuliner Lokal</span> Terbaik
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-xl">
                Lapar tapi malas keluar? Pesan sekarang dan nikmati kelezatan 
                hidangan autentik Sukodadi langsung di depan pintu rumahmu.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="#menu" className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-red-600 transform hover:-translate-y-1 transition-all shadow-lg shadow-primary/20">
                  Lihat Menu
                </a>
                <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </motion.div>
          </div>
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-[400px] object-cover" 
                alt="Delicious Food"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-bold text-xl uppercase tracking-widest opacity-80">Menu Hari Ini</p>
                <h3 className="text-3xl font-black">Nasi Campur Spesial</h3>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -z-10 blur-[100px] opacity-20 bg-primary w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 blur-[100px] opacity-20 bg-secondary w-96 h-96 rounded-full translate-y-1/2 -translate-x-1/2" />
      </header>

      {/* Categories */}
      <section className="py-8 bg-white border-y border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-4 no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Menu Grid */}
      <main id="menu" className="flex-1 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Menu Kami</h2>
              <p className="text-slate-500">Pilih dari berbagai hidangan terbaik pilihan kami.</p>
            </div>
            <div className="text-slate-400 font-medium hidden sm:block">
              {filteredMenu.length} Produk ditemukan
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredMenu.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-slate-800">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-slate-800 tracking-tight">
                        <span className="text-sm font-medium mr-0.5">Rp</span>
                        {item.price.toLocaleString('id-ID')}
                      </span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-2xl hover:bg-primary transition-all shadow-md active:scale-95"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredMenu.length === 0 && (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full text-slate-300 mb-6">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tidak ada hasil</h3>
              <p className="text-slate-500">Coba gunakan kata kunci atau kategori lain.</p>
            </div>
          )}
        </div>
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Keranjang Kamu</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                      <ShoppingBag size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Keranjang Masih Kosong</h3>
                    <p className="text-slate-500">Ayo tambahkan makanan lezat ke sini!</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-primary mb-3">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-8">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 flex items-center justify-center hover:bg-slate-50 text-slate-500"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 flex items-center justify-center hover:bg-slate-50 text-slate-500"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-sm font-black text-slate-900 ml-auto">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-200 space-y-4 bg-slate-50/50">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="font-black text-slate-900">Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-red-600 transition-all flex items-center justify-center gap-3"
                  >
                    <Phone size={24} />
                    Pesan via WhatsApp
                  </button>
                  <button 
                    onClick={() => {
                        if(confirm('Yakin ingin mengosongkan keranjang?')) {
                            setCart([]);
                        }
                    }}
                    className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash size={18} />
                    Kosongkan Keranjang
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-900 pt-20 pb-10 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <span className="font-extrabold text-2xl tracking-tight">
                Beli Aja Sukodadi
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8">
              Pilihan cerdas untuk kuliner berkualitas di Sukodadi. 
              Melayani dengan hati, mengantar dengan cepat.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                <Phone size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                <MapPin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                <Clock size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Menu Populer</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Nasi Goreng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ayam Geprek</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Es Jeruk</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Martabak</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Kontak Kami</h4>
            <div className="space-y-4 text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary shrink-0" size={20} />
                <p>Jl. Raya Sukodadi No. 123, Lamongan, Jawa Timur</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary shrink-0" size={20} />
                <p>+62 896-0233-7878</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-primary shrink-0" size={20} />
                <p>Setiap Hari: 08:00 - 22:00</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Beli Aja Sukodadi. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Mobile Only) */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <ShoppingBag size={28} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-7 h-7 bg-white text-primary text-xs font-black flex items-center justify-center rounded-full border-4 border-primary">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
