import React, { useState } from "react";
import { ShoppingBag, ShoppingCart, Plus, Minus, Trash, Send, CheckCircle, ArrowLeft, Tag, HelpCircle } from "lucide-react";
import { Product, CartItem } from "../types";

interface ShopRoomProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (productId: string) => void;
  onUpdateCartQty: (productId: string, qty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  patientPhone: string;
}

export default function ShopRoom({ 
  products, 
  cart, 
  onAddToCart, 
  onUpdateCartQty, 
  onRemoveFromCart, 
  onClearCart,
  patientPhone 
}: ShopRoomProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingNotes, setShippingNotes] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [checkoutSummaryUrl, setCheckoutSummaryUrl] = useState("");

  const categories = ["الكل", "عسل طبيعي", "أعشاب علاجية", "مكملات غذائية", "أغذية صحية"];

  const filteredProducts = selectedCategory === "الكل" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Cart item with full details
  const cartWithDetails = cart.map((item) => {
    const prod = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: prod,
    };
  }).filter(item => item.product !== undefined) as { productId: string; quantity: number; product: Product }[];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = cartWithDetails.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartWithDetails.length === 0) return;

    // Build structured WhatsApp summary as required by PHP checkout spec!
    const itemsList = cartWithDetails
      .map((item, idx) => `${idx + 1}. ${item.product.name} (عدد: ${item.quantity}) - ${item.product.price * item.quantity} ريال`)
      .join("\n");

    const messageText = `مرحباً د. شيماء، أود تأكيد شراء منتجات صحية من متجر العيادة الخاص بي:\n\n` +
      `📞 هاتف المريض: ${patientPhone}\n` +
      `---------------------------------------\n` +
      `${itemsList}\n` +
      `---------------------------------------\n` +
      `💰 المجموع الإجمالي: ${subTotal} ريال سعودي\n` +
      `📝 ملاحظات التوصيل: ${shippingNotes || "لا يوجد ملاحظات إضافية"}\n\n` +
      `شكراً جزيلاً لتقديم مكملات أصلية ومضمونة!`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/966551234567?text=${encodedMessage}`; // Simulate clinic official phone prefix

    setCheckoutSummaryUrl(whatsappUrl);
    setOrderCompleted(true);
    
    // Clear and close cart
    onClearCart();
    setShippingNotes("");

    // Automatically open WhatsApp in new tab safely
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-clinic-surface border border-clinic-primary/10 rounded-3xl p-6 md:p-8 shadow-md relative">
      
      {/* Title Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-clinic-primary/10 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-6 h-6 animate-float" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-clinic-charcoal">متجر الأغذية والمكملات الصحية</h2>
            <p className="text-xs text-clinic-primary font-semibold">توفير بدائل وسكريات دايت طبيعية 100% ومكملات حرق دهون منتقاة بعناية</p>
          </div>
        </div>

        {/* Cart trigger button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-clinic-secondary text-white font-bold py-2 px-5 rounded-2xl text-xs hover:bg-clinic-secondary/90 transition-all flex items-center gap-2 shadow-md shadow-clinic-secondary/20"
        >
          <ShoppingCart className="w-4 h-4" />
          حقيبة المشتريات
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-1 bg-clinic-accent text-clinic-charcoal border-2 border-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 select-none mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              selectedCategory === c
                ? "bg-clinic-primary text-white shadow-sm"
                : "bg-white text-clinic-charcoal border border-clinic-primary/10 hover:bg-clinic-bg"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Notification order finished state */}
      {orderCompleted && (
        <div className="bg-emerald-50 border border-emerald-250 border-emerald-300 rounded-2xl p-5 mb-6 text-emerald-800 animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-sm font-extrabold flex items-center gap-1.5 mb-1 text-emerald-900">
              <CheckCircle className="w-4 h-4 fill-current text-emerald-600" />
              تم تصدير الطلبية وتوليد ملخص الـ WhatsApp بنجاح!
            </h3>
            <p className="text-xs">تمت مكاملة عناصر السلة لتسليمها للأدمن. انفتحت نافذة مشفرة للدردشة لتسليم الدفع والعنوان الطبي.</p>
          </div>
          <div className="flex gap-2">
            <a
              href={checkoutSummaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 px-4 rounded-xl shadow-sm transition-all text-center"
            >
              افتح واتساب يدوياً للارسال
            </a>
            <button
              onClick={() => setOrderCompleted(false)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1"
            >
              تم الكشف
            </button>
          </div>
        </div>
      )}

      {/* Products Grid (1 to 4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const inCart = cart.find(c => c.productId === p.id);
          return (
            <div 
              key={p.id} 
              className="bg-white border border-clinic-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full hover:scale-[1.01]"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-clinic-bg/10 overflow-hidden">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 right-3 bg-clinic-bg/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-clinic-primary flex items-center gap-1 border border-clinic-primary/10">
                  <Tag className="w-3 h-3 text-clinic-secondary" />
                  {p.category}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div className="mb-4">
                  <h3 className="text-xs font-extrabold text-clinic-charcoal leading-snug line-clamp-1 h-5">{p.name}</h3>
                  <p className="text-[11px] text-clinic-primary mt-1 line-clamp-2 h-8 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-clinic-bg/20 p-2 rounded-xl">
                    <span className="text-xs text-clinic-primary font-bold">السعر المقدر:</span>
                    <span className="text-sm font-black text-clinic-secondary">{p.price} ر.س</span>
                  </div>

                  {inCart ? (
                    <div className="flex items-center justify-between gap-1 bg-clinic-secondary/5 border border-clinic-secondary/20 rounded-xl p-1">
                      <button
                        onClick={() => onUpdateCartQty(p.id, Math.max(inCart.quantity - 1, 0))}
                        className="bg-white text-clinic-secondary w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:bg-clinic-secondary/10 transition-all font-mono"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-clinic-secondary font-mono">{inCart.quantity}</span>
                      <button
                        onClick={() => onUpdateCartQty(p.id, inCart.quantity + 1)}
                        className="bg-white text-clinic-secondary w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:bg-clinic-secondary/10 transition-all font-mono"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(p.id)}
                      className="w-full bg-clinic-primary hover:bg-clinic-primary-light text-white text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      أضف للحقيبة الصحة
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-out Sidebar Cart Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-fade-in flex justify-end">
          
          {/* Overlay click to close */}
          <div className="flex-1" onClick={() => setIsCartOpen(false)}></div>

          {/* Cart Content */}
          <div className="w-full max-w-md bg-clinic-surface h-full shadow-2xl flex flex-col justify-between animate-slide-left p-6 select-none relative border-r border-clinic-primary/10">
            
            <div>
              {/* Header */}
              <div className="flex justify-between items-center border-b border-clinic-primary/15 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-clinic-secondary animate-pulse" />
                  <h3 className="text-sm font-black text-clinic-charcoal">حقيبة المشتريات الصحية</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-clinic-bg hover:bg-clinic-primary/10 p-2 rounded-full transition-all text-clinic-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              {cartWithDetails.length === 0 ? (
                <div className="text-center py-24 text-clinic-primary space-y-2">
                  <ShoppingBag className="w-12 h-12 stroke-[1.2] mx-auto opacity-30" />
                  <p className="text-xs font-bold">حقيبتك المشتراة ما زالت فارغة تماماً.</p>
                  <p className="text-[10px]">تصفح المتجر لضم عسل السدر أو الأعشاب للتنحيف!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {cartWithDetails.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center bg-white p-3 rounded-xl border border-clinic-primary/10 gap-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-10 h-10 object-cover rounded-lg border shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-clinic-charcoal truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-clinic-primary/80 mt-0.5 font-mono">{item.product.price} ر.س × {item.quantity}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 font-mono">
                        <button
                          onClick={() => onUpdateCartQty(item.productId, Math.max(item.quantity - 1, 0))}
                          className="bg-clinic-bg text-clinic-charcoal w-6 h-6 rounded-lg text-xs flex items-center justify-center hover:bg-clinic-primary/10 font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateCartQty(item.productId, item.quantity + 1)}
                          className="bg-clinic-bg text-clinic-charcoal w-6 h-6 rounded-lg text-xs flex items-center justify-center hover:bg-clinic-primary/10 font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemoveFromCart(item.productId)}
                          className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg mr-1"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total price + Checkout form */}
            {cartWithDetails.length > 0 && (
              <form onSubmit={handleCheckoutSubmit} className="border-t border-clinic-primary/15 pt-5 space-y-4">
                
                <div className="bg-clinic-bg p-3.5 rounded-xl space-y-1.5 text-xs font-bold text-clinic-charcoal">
                  <div className="flex justify-between">
                    <span>مجموع المنتجات:</span>
                    <span>{cartCount} قطع</span>
                  </div>
                  <div className="flex justify-between text-sm text-clinic-secondary border-t border-clinic-primary/10 pt-1.5">
                    <span>المجموع الإجمالي:</span>
                    <span className="font-mono">{subTotal} ريال سعودي</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-clinic-charcoal mb-1">📝 أدخل عنوان التوصيل أو ملاحظة تأكيد الشراء:</label>
                  <textarea
                    value={shippingNotes}
                    onChange={(e) => setShippingNotes(e.target.value)}
                    placeholder="مثال: يرجى التوصيل الشحن لمنزلي في العاصمة الرياض حي الياسمين أو استلام من مركز العيادة بالقصيم..."
                    rows={2}
                    className="w-full bg-white border border-clinic-primary/20 rounded-xl p-2.5 text-xs text-clinic-charcoal focus:outline-none focus:ring-1 focus:ring-clinic-secondary resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    تأكيد الطلبية عبر WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="bg-clinic-bg text-clinic-primary hover:text-rose-600 font-extrabold px-3 py-2.5 rounded-xl text-xs transition-all border border-clinic-primary/15"
                  >
                    تفريغ
                  </button>
                </div>

                <p className="text-[10px] text-clinic-primary/50 text-center leading-relaxed">
                  * كود العيادة يعبئ السلة في غضون ثوانٍ ويولد طلباً مشفراً للواتساب الخاص بالدكتورة شيماء للتحقق والتأكيد الطبي المباشر.
                </p>

              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
