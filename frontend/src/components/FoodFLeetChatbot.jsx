import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL;

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function extractNumbers(text = '') {
  const nums = (text.match(/\d+/g) || []).map((n) => Number(n));
  return nums;
}

/**
 * Lightweight “AI-like” chatbot that maps user messages to app actions.
 * No external LLM required.
 */
const FoodFLeetChatbot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: 'Hi! I’m FoodFLeet. Tell me what you want—e.g., “show menu”, “add Paneer Butter Masala x2”, “go to cart”, or “place order”.',
    },
  ]);
  const [input, setInput] = useState('');
  const [menuCache, setMenuCache] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const categories = useMemo(() => ['North Indian', 'South Indian', 'Chinese'], []);

  useEffect(() => {
    // Preload menu in background (best-effort)
    let cancelled = false;
    const load = async () => {
      try {
        setMenuLoading(true);
        const { data } = await axios.get(`${API_URL}/api/menu`);
        if (!cancelled) setMenuCache(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore; chatbot still works for navigation-only commands
      } finally {
        if (!cancelled) setMenuLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const pushMessage = (role, text) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, text }]);
  };

  const findMenuItemByName = (query) => {
    const q = normalize(query);
    if (!q) return null;

    // Try exact-ish match on name
    const direct = menuCache.find((m) => normalize(m.name) === q);
    if (direct) return direct;

    // Try substring match
    const contains = menuCache.find((m) => normalize(m.name).includes(q) || q.includes(normalize(m.name)));
    if (contains) return contains;

    // Token overlap
    const qTokens = new Set(q.split(' ').filter(Boolean));
    let best = null;
    let bestScore = 0;
    for (const m of menuCache) {
      const mTokens = new Set(normalize(m.name).split(' ').filter(Boolean));
      let inter = 0;
      for (const t of qTokens) {
        if (mTokens.has(t)) inter += 1;
      }
      const score = inter / Math.max(1, mTokens.size);
      if (score > bestScore) {
        bestScore = score;
        best = m;
      }
    }

    // Require a minimum overlap to avoid wrong additions
    if (bestScore >= 0.35) return best;
    return null;
  };

  const handleCommand = async (rawText) => {
    const text = normalize(rawText);
    if (!text) return;

    // Greetings / help
    if (/^(hi|hello|hey|yo)\b/.test(text) || text.includes('help') || text.includes('what can you do')) {
      return {
        type: 'assistant',
        text:
          'I can: show the menu, filter suggestions, add items to cart, view cart, go to checkout, view orders, and navigate to contact. Try: “show menu”, “add <item> x2”, “go to cart”, “my orders”, “place order”.',
      };
    }

    // Navigation commands
    if (text.includes('go to cart') || text === 'cart' || text.includes('open cart')) {
      navigate('/cart');
      return { type: 'assistant', text: 'Opening your cart.' };
    }

    if (text.includes('checkout') || text.includes('place order') || text.includes('order now')) {
      if (!user) {
        navigate('/login');
        return { type: 'assistant', text: 'Please login first so I can place your order.' };
      }
      navigate('/checkout');
      return { type: 'assistant', text: 'Taking you to checkout.' };
    }

    if (text.includes('my orders') || text.includes('orders') || text.includes('track order')) {
      if (!user) {
        navigate('/login');
        return { type: 'assistant', text: 'Please login to view your orders.' };
      }
      navigate('/myorders');
      return { type: 'assistant', text: 'Opening your orders.' };
    }

    if (text.includes('contact') || text.includes('reach us')) {
      navigate('/contact');
      return { type: 'assistant', text: 'Opening Contact Us.' };
    }

    if (text.includes('menu') || text.includes('show menu') || text.includes('full menu')) {
      navigate('/menu');
      return { type: 'assistant', text: 'Here’s the menu.' };
    }

    // Filter suggestions (navigate to existing pages)
    if (text.includes('allergy') || text.includes('allergen')) {
      navigate('/menu/allergy-filter');
      return { type: 'assistant', text: 'Opening Allergy Filter.' };
    }

    if (text.includes('calorie') || text.includes('calories') || text.includes('diet')) {
      navigate('/menu/calories-filter');
      return { type: 'assistant', text: 'Opening Calories Filter.' };
    }

    if (text.includes('budget') || text.includes('cheap') || text.includes('under')) {
      navigate('/menu/budget-filter');
      return { type: 'assistant', text: 'Opening Budget Filter.' };
    }

    if (text.includes('bulk') || text.includes('group') || text.includes('catering')) {
      navigate('/menu/bulk-booking');
      return { type: 'assistant', text: 'Opening Bulk Booking.' };
    }

    // Add to cart: “add Paneer Butter Masala”, “add ... x2”, “add ... for 2”, etc.
    if (text.startsWith('add ') || text.includes(' add ')) {
      // Remove leading “add” keyword
      const cleaned = text.replace(/^add\s+/, '').replace(/\bplease\b/g, '').trim();

      // qty extraction
      const nums = extractNumbers(cleaned);
      const qty = nums.length ? Math.max(1, nums[0]) : 1;
      const namePart = cleaned
        .replace(/\bx\s*\d+\b/g, '')
        .replace(/\bfor\s*\d+\b/g, '')
        .replace(/\bqty\s*\d+\b/g, '')
        .trim();

      const item = findMenuItemByName(namePart);
      if (!item) {
        return {
          type: 'assistant',
          text: `I couldn’t find “${namePart}” in the menu${menuLoading ? ' (menu is still loading)' : ''}. Try a shorter name like “paneer” or open the full menu and pick from there.`,
        };
      }

      for (let i = 0; i < qty; i += 1) {
        addToCart(item);
      }

      return {
        type: 'assistant',
        text: `Added ${item.name} to your cart${qty > 1 ? ` (x${qty})` : ''}.`,
      };
    }

    // Quick category commands
    for (const c of categories) {
      if (text.includes(c.toLowerCase())) {
        // best effort: just go to menu (filters are in separate pages for now)
        navigate('/menu');
        return { type: 'assistant', text: `Showing the ${c} items in the menu.` };
      }
    }

    // “What’s available?”
    if (text.includes('available') || text.includes('recommend') || text.includes('suggest')) {
      const sample = menuCache.slice(0, 6);
      if (!sample.length) {
        return { type: 'assistant', text: 'Menu is not loaded yet. Try again in a moment or open /menu.' };
      }
      const list = sample.map((m) => m.name).join(', ');
      return { type: 'assistant', text: `Here are a few popular items: ${list}. You can say “add <item name> x2”.` };
    }

    return {
      type: 'assistant',
      text: 'I didn’t fully get that. Try: “show menu”, “add <item> x2”, “go to cart”, “place order”, “my orders”, or “contact”.',
    };
  };

  const submit = async (e) => {
    void e;
    e.preventDefault();
    if (busy) return;

    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');
    pushMessage('user', trimmed);

    setBusy(true);
    try {
      const res = await handleCommand(trimmed);
      if (res?.type === 'assistant' && res.text) pushMessage('assistant', res.text);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition"
        aria-label="Open FoodFLeet chat"
      >
        <span className="block text-sm font-bold">FF</span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[360px] max-w-[90vw] bg-white shadow-2xl rounded-2xl overflow-hidden border">
          <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
            <div>
              <div className="font-bold leading-tight">FoodFLeet</div>
              <div className="text-xs text-gray-300">Chat to order faster</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">
              ✕
            </button>
          </div>

          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] bg-blue-600 text-white rounded-2xl px-3 py-2 text-sm'
                      : 'max-w-[85%] bg-white border rounded-2xl px-3 py-2 text-sm'
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {menuLoading && (
              <div className="text-xs text-gray-500">Loading menu…</div>
            )}
          </div>

          <form onSubmit={submit} className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command…"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy}
                className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-black disabled:opacity-50"
              >
                Send
              </button>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Examples: “show menu”, “add Paneer Butter Masala x2”, “go to cart”, “place order”.
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default FoodFLeetChatbot;

