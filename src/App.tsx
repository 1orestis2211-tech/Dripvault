import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  price: number | null;
  size: string;
  category: string;
  condition: string;
  image: string; // legacy single image path (kept for backward-compat)
  images?: string[]; // optional gallery image paths (first is primary)
};

const PRODUCTS: Product[] = [
  { id: 'dv-001', name: 'Barcelona 25/26 Home Shirt', price: 65, size: 'M', category: 'Football Shirts', condition: 'New with tags', image: '/images/barcelona_jersey.jpg', images: ['/images/barcelona_jersey.jpg', '/images/barcelona_jersey_2.jpg'] },
  { id: 'dv-002', name: 'Milan 24/25 Home Shirt', price: 65, size: 'M', category: 'Football Shirts', condition: 'New with tags', image: '/images/milan_jersey.jpg', images: ['/images/milan_jersey.jpg', '/images/milan_jersey_2.jpg'] },
  { id: 'dv-003', name: 'Corteiz France Tee Black', price: 75, size: 'S', category: 'Designer Clothing', condition: 'New with tags', image: '/images/corteiz_france_tee.jpg', images: ['/images/corteiz_france_tee.jpg', '/images/corteiz_france_tee_2.jpg'] },
  { id: 'dv-004', name: 'Corteiz OG Island Tee Black', price: null, size: 'M', category: 'Designer Clothing', condition: 'Brand New', image: '/images/corteiz_og_tee.jpg', images: ['/images/corteiz_og_tee.jpg', '/images/corteiz_og_tee_2.jpg'] },
  { id: 'dv-005', name: 'Trapstar Tee', price: null, size: 'M', category: 'Designer Clothing', condition: 'Used, Like New', image: '/images/trapstar_tee.jpg', images: ['/images/trapstar_tee.jpg', '/images/trapstar_tee_2.jpg'] },
  { id: 'dv-006', name: 'Black Yeezy Slides', price: null, size: '44', category: 'Footwear', condition: 'Brand New', image: '/images/yeezy_slides.jpg', images: ['/images/yeezy_slides.jpg', '/images/yeezy_slides_2.jpg'] },
  { id: 'dv-007', name: 'New Product 1', price: 80, size: 'L', category: 'Designer Clothing', condition: 'New with tags', image: '/images/new_product_1.jpg', images: ['/images/new_product_1.jpg', '/images/new_product_1_2.jpg'] },
  { id: 'dv-008', name: 'New Product 2', price: 90, size: 'XL', category: 'Football Shirts', condition: 'Used, Like New', image: '/images/new_product_2.jpg', images: ['/images/new_product_2.jpg', '/images/new_product_2_2.jpg'] },
];

const CATEGORIES = ['All', 'Football Shirts', 'Designer Clothing', 'Footwear'];
const SIZES = ['S', 'M', 'L', 'XL', '44'];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium tracking-wide border-orange-400 text-orange-300">{children}</span>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <motion.div className="mb-8 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      {eyebrow && <div className="mb-2 text-xs uppercase tracking-[0.2em] text-orange-400">{eyebrow}</div>}
      <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">{title}</h2>
      {subtitle && <p className="mt-2 text-zinc-300 max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
}

function FilterBar(props: {
  query: string; setQuery: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  size: string; setSize: (v: string) => void;
  sort: string; setSort: (v: string) => void;
  onClear: () => void; isFiltered: boolean;
}) {
  const { query, setQuery, category, setCategory, size, setSize, sort, setSort, onClear, isFiltered } = props;
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-1 md:col-span-2">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search teams, brands, items…" className="w-full rounded-2xl border border-orange-500/40 bg-zinc-950 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60" />
      </div>
      <div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-2xl border border-orange-500/40 bg-zinc-950 px-5 py-3 text-sm">
          {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <select value={size} onChange={(e) => setSize(e.target.value)} className="rounded-2xl border border-orange-500/40 bg-zinc-950 px-5 py-3 text-sm">
          {['All', ...SIZES].map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border border-orange-500/40 bg-zinc-950 px-5 py-3 text-sm">
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>
      {isFiltered && (
        <div className="col-span-full flex justify-end mt-2">
          <button onClick={onClear} className="rounded-xl bg-zinc-800 border border-orange-400 px-4 py-2 text-xs font-bold text-orange-300 hover:bg-orange-900/20 transition">Clear Filters</button>
        </div>
      )}
    </div>
  );
}

function ProductCard({ item, onAdd }: { item: Product; onAdd: (p: Product) => void }) {
  const message = encodeURIComponent(`Hi DripVault Plug, I'm interested in: ${item.name} (ID: ${item.id}). Is it still available?`);
  const unavailable = false; // Always allow Add to Cart even if price is null
  const [activeIdx, setActiveIdx] = useState(0);
  const primaryImage = (item.images && item.images.length > 0 ? item.images[Math.min(activeIdx, item.images.length - 1)] : item.image) || item.image;
  return (
    <motion.div className="group rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 overflow-hidden hover:shadow-2xl hover:border-violet-400/60 transition-all" whileHover={{ scale: 1.05, rotate: 1 }}>
      <div className="aspect-[4/3] w-full bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden relative">
        <img src={primaryImage} alt={item.name} className="h-full w-full object-cover object-center" />
        {unavailable && (<span className="absolute top-2 left-2 bg-zinc-900/80 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-400 shadow">Unavailable</span>)}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-white text-xl drop-shadow-lg">{item.name}</h3>
            <p className="text-xs text-zinc-400">{item.condition}</p>
          </div>
          <div className="text-right">
            <div className="text-orange-400 font-extrabold text-lg">{item.price ? `€${item.price}` : 'DM for Price'}</div>
            <div className="text-xs text-zinc-400">Size: {item.size}</div>
          </div>
        </div>
        {item.images && item.images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {item.images.map((src, idx) => (
              <button key={src + idx} onClick={() => setActiveIdx(idx)} className={`h-12 w-12 shrink-0 rounded-md border ${idx === activeIdx ? 'border-orange-500' : 'border-zinc-700'} overflow-hidden`}>
                <img src={src} alt={`${item.name} ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-2">
          <Badge>{item.category}</Badge>
          <button onClick={() => onAdd(item)} className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black hover:bg-orange-400 active:scale-[.98]">Add to Cart</button>
        </div>
        <div className="mt-3 text-xs text-zinc-500">Or quick link via <a className="underline hover:text-violet-400" href={`https://wa.me/?text=${message}`} target="_blank" rel="noreferrer">WhatsApp</a></div>
      </div>
    </motion.div>
  );
}

function HeroNav() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-black/90 border-b border-zinc-800 flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-3">
        <div className="bg-orange-400 text-black font-extrabold rounded-full w-10 h-10 flex items-center justify-center text-lg">DV</div>
        <div>
          <div className="font-extrabold text-xl leading-tight">DripVault Plug</div>
          <div className="text-xs text-orange-300">Authentic Football & Designer</div>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <a href="#shop" className="hover:underline font-bold">Shop</a>
        <a href="#about" className="hover:underline font-bold">About</a>
        <a href="#reviews" className="hover:underline font-bold">Reviews</a>
        <a href="#faq" className="hover:underline font-bold">FAQ</a>
        <a href="https://www.instagram.com/dripvault_plug/" target="_blank" rel="noreferrer" className="ml-4 rounded-xl bg-orange-400 px-5 py-2 font-bold text-black hover:bg-orange-300 transition">Instagram</a>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 px-8 py-20 bg-black" id="hero">
      <div className="flex-1 max-w-xl">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">Authentic Football Shirts<br />& Designer Drip</h1>
        <p className="mb-8 text-lg">Curated pieces, verified quality, fast shipping. Shop the latest drops or DM us to secure your size.</p>
        <div className="flex gap-4 mb-8">
          <a href="#shop" className="rounded-xl bg-orange-400 px-6 py-3 font-bold text-black hover:bg-orange-300 transition">Shop the Drop</a>
          <a href="https://www.instagram.com/dripvault_plug/" target="_blank" rel="noreferrer" className="rounded-2xl border-2 border-orange-400 px-6 py-3 font-bold hover:bg-orange-400 hover:text-black transition">DM on Instagram</a>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="rounded-full border border-orange-400 px-4 py-1 text-xs font-bold">Authenticity Guaranteed</span>
          <span className="rounded-full border border-orange-400 px-4 py-1 text-xs font-bold">Curated Sourcing</span>
          <span className="rounded-full border border-orange-400 px-4 py-1 text-xs font-bold">Fast Dispatch</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img src="/images/hero1.jpg" alt="DripVault community" className="rounded-3xl shadow-2xl w-full max-w-md object-cover" />
      </div>
    </section>
  );
}

type CartLine = { product: Product; quantity: number };

function formatCurrency(n: number) {
  return `€${n.toFixed(2)}`;
}

export default function App() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [size, setSize] = useState('All');
  const [sort, setSort] = useState('featured');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);

  const isFiltered = category !== 'All' || size !== 'All' || query.trim() !== '' || sort !== 'featured';

  const filtered = useMemo(() => {
    let data = [...PRODUCTS];
    if (category !== 'All') data = data.filter((p) => p.category === category);
    if (size !== 'All') data = data.filter((p) => (p.size || '').toString() === size);
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.condition || '').toLowerCase().includes(q));
    }
    if (sort === 'price_asc') data.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === 'price_desc') data.sort((a, b) => (b.price || 0) - (a.price || 0));
    return data;
  }, [category, query, size, sort]);

  function handleClearFilters() {
    setCategory('All');
    setQuery('');
    setSize('All');
    setSort('featured');
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((l) => l.product.id !== id));
  }

  function updateQty(id: string, qty: number) {
    setCart((prev) => prev.map((l) => (l.product.id === id ? { ...l, quantity: Math.max(1, qty) } : l)));
  }

  const subtotal = cart.reduce((sum, l) => sum + (l.product.price || 0) * l.quantity, 0);
  const cartCount = cart.reduce((n, l) => n + l.quantity, 0);

  const checkoutText = useMemo(() => {
    const lines = cart.map((l) => `${l.quantity} x ${l.product.name}${l.product.price ? ` @ €${l.product.price}` : ''}`);
    const totalLine = subtotal > 0 ? `Total: €${subtotal.toFixed(2)}` : '';
    return encodeURIComponent([`Hi DripVault Plug, I'd like to order:`, ...lines, totalLine].filter(Boolean).join("\n"));
  }, [cart, subtotal]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-orange-400 font-sans">
      {/* Nav with cart button */}
      <div className="w-full sticky top-0 z-50 bg-black/90 border-b border-zinc-800 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-400 text-black font-extrabold rounded-full w-10 h-10 flex items-center justify-center text-lg">DV</div>
          <div>
            <div className="font-extrabold text-xl leading-tight">DripVault Plug</div>
            <div className="text-xs text-orange-300">Authentic Football & Designer</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="#shop" className="hover:underline font-bold">Shop</a>
          <button onClick={() => setCartOpen(true)} className="relative rounded-xl border-2 border-orange-400 px-4 py-2 font-bold hover:bg-orange-400 hover:text-black transition">
            Cart
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-orange-500 text-black text-xs font-bold rounded-full px-2 py-0.5">{cartCount}</span>}
          </button>
          <a href="https://www.instagram.com/dripvault_plug/" target="_blank" rel="noreferrer" className="rounded-xl bg-orange-400 px-5 py-2 font-bold text-black hover:bg-orange-300 transition">Instagram</a>
        </div>
      </div>
      <HeroSection />
      <motion.section id="top" className="relative overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="mx-auto max-w-7xl px-4 py-24 sm:py-32 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">DripVault — Authentic Streetwear & Football Shirts</h1>
            <p className="mt-6 text-zinc-300 max-w-xl text-lg">Curated designer tees, football shirts & slides. 100% authentic. Built for resellers, collectors, and true style heads.</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#shop" className="rounded-2xl bg-orange-500 px-7 py-3 font-bold text-black hover:bg-orange-400 shadow-xl shadow-orange-500/30">Shop Now</a>
              <a href="https://www.instagram.com/dripvault_plug/" target="_blank" rel="noreferrer" className="rounded-2xl border-2 border-orange-500 px-7 py-3 font-bold text-orange-400 hover:bg-orange-500/10">DM on Instagram</a>
            </div>
          </div>
        </div>
      </motion.section>

      <section id="shop" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow="Shop" title="Latest Arrivals" subtitle="Authentic streetwear & football shirts ready to cop." />
        <FilterBar
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          size={size}
          setSize={setSize}
          sort={sort}
          setSort={setSort}
          onClear={handleClearFilters}
          isFiltered={isFiltered}
        />
        <div className="mb-4 text-sm text-zinc-400 flex items-center gap-2">
          <span className="font-bold text-orange-400">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''} found
        </div>
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}>
          {filtered.map((item) => (<ProductCard key={item.id} item={item} onAdd={addToCart} />))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-zinc-400 py-14 border border-dashed border-zinc-700 rounded-2xl">No items match your filters. Try clearing search or switching category.</div>
          )}
        </motion.div>

        <div className="mt-16 flex items-center justify-center">
          <a href="https://www.instagram.com/dripvault_plug/" target="_blank" rel="noreferrer" className="rounded-2xl bg-orange-500 px-8 py-4 font-bold text-black hover:bg-orange-400 shadow-lg shadow-orange-500/30">See More on Instagram</a>
        </div>
      </section>
      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-extrabold">Your Cart</h3>
              <button onClick={() => setCartOpen(false)} className="rounded-md border border-orange-400 px-3 py-1 text-sm">Close</button>
            </div>
            {cart.length === 0 ? (
              <p className="text-zinc-400">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((l) => (
                  <div key={l.product.id} className="flex items-center gap-3 border border-zinc-800 rounded-xl p-3">
                    <img src={(l.product.images && l.product.images[0]) || l.product.image} alt={l.product.name} className="w-20 h-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <div className="font-bold">{l.product.name}</div>
                      <div className="text-sm text-zinc-400">{l.product.price ? formatCurrency(l.product.price) : 'DM for Price'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(l.product.id, l.quantity - 1)} className="w-7 h-7 rounded-md border border-zinc-700">-</button>
                      <div className="w-8 text-center">{l.quantity}</div>
                      <button onClick={() => updateQty(l.product.id, l.quantity + 1)} className="w-7 h-7 rounded-md border border-zinc-700">+</button>
                    </div>
                    <button onClick={() => removeFromCart(l.product.id)} className="ml-2 text-xs text-zinc-400 underline">Remove</button>
                  </div>
                ))}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-zinc-400">Subtotal</div>
                  <div className="font-extrabold">{formatCurrency(subtotal)}</div>
                </div>
                <a href={`https://wa.me/?text=${checkoutText}`} target="_blank" rel="noreferrer" className="block text-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-black hover:bg-orange-400">Checkout via WhatsApp</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


