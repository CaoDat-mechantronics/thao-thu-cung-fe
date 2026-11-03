'use strict';
/* Front-end demo: danh mục trang riêng, sản phẩm chi tiết HTML riêng và giỏ hàng dùng chung. */
(()=>{
  const CATEGORIES=[
    {id:'cho',name:'Đồ ăn cho chó',emoji:'🐶',description:'Bữa ăn ngon cho cún yêu'},
    {id:'meo',name:'Đồ ăn cho mèo',emoji:'🐱',description:'Chiều chuộng boss meo'},
    {id:'suc-khoe',name:'Chăm sóc sức khỏe',emoji:'🧴',description:'Chăm sóc dịu dàng mỗi ngày'},
    {id:'dinh-duong',name:'Dinh dưỡng đặc biệt',emoji:'🥣',description:'Khẩu phần theo từng giai đoạn'},
    {id:'phu-kien',name:'Phụ kiện & hỗ trợ',emoji:'🎀',description:'Những món đồ thật xinh'},
    {id:'bo-sung',name:'Thức ăn bổ sung',emoji:'🍪',description:'Món thưởng vui miệng'}
  ];
  const HOT_IDS=['cho-01','meo-01','phu-kien-01','bo-sung-02','cho-02','meo-03','phu-kien-03','dinh-duong-01'];
  const catalogBase=window.THAO_SHOW_STATIC_CATALOG===false?[]:(window.SHOP_PRODUCTS||[]);
  let items=[];
  let byId=new Map();
  function setItems(posts=[]){
    const visible=posts.filter(p=>p.status==='published');
    const normalize=p=>({...p,categoryName:CATEGORIES.find(c=>c.id===p.categoryId)?.name||'Sản phẩm'});
    // Firebase takes priority for the same product ID after legacy import.
    const merged=new Map(catalogBase.map(p=>[p.id,p]));
    visible.forEach(p=>merged.set(p.id,p));
    items=[...merged.values()].map(normalize);
    byId=new Map(items.map(p=>[p.id,p]));
  }
  setItems();
  const hotItems=()=>[...new Map([...items.filter(p=>p.dynamic&&p.hot),...HOT_IDS.map(id=>byId.get(id)).filter(Boolean)].map(p=>[p.id,p])).values()];
  const cart=new Map();
  const wishlist=new Set();
  const money=n=>new Intl.NumberFormat('vi-VN').format(n)+'đ';
  const safe=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const detailLink=p=>p.dynamic?`san-pham.html?id=${encodeURIComponent(p.id)}`:`chi-tiet-${p.id}.html`;
  const catLink=id=>`danh-muc-${id}.html`;
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const STORAGE_CART='thao-pet-cart-demo';
  const STORAGE_FAV='thao-pet-favorites-demo';
  let toastTimer,previousFocus;

  function restore(){
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_CART)||'{}');
      for(const [id,n] of Object.entries(saved)) if(Number.isSafeInteger(n)&&n>0&&n<=100) cart.set(id,n);
      const liked=JSON.parse(localStorage.getItem(STORAGE_FAV)||'[]');
      if(Array.isArray(liked))for(const id of liked)wishlist.add(id);
    }catch(e){}
  }
  function save(){try{localStorage.setItem(STORAGE_CART,JSON.stringify(Object.fromEntries(cart)));localStorage.setItem(STORAGE_FAV,JSON.stringify([...wishlist]));}catch(e){}}
  function notify(message){const t=$('#toast');if(!t)return;t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,2900);}
  function isSale(p){return Number.isFinite(p.oldPrice)&&p.oldPrice>p.price;}
  function discount(p){return isSale(p)?Math.round((1-p.price/p.oldPrice)*100):0;}
  function badgeHtml(p,context=''){
    if(context==='sale'&&isSale(p))return `<span class="product-ribbon sale">GIẢM ${discount(p)}%</span>`;
    if(context==='hot'||((HOT_IDS.includes(p.id)||p.hot)&&!isSale(p)))return '<span class="product-ribbon hot">🔥 HOT</span>';
    if(isSale(p))return `<span class="product-ribbon sale">-${discount(p)}%</span>`;
    if(p.badge)return `<span class="product-ribbon">${safe(p.badge)}</span>`;
    return '';
  }
  function productImage(p, mode='card'){
    const cls=p.photoIsReal?'real-product-photo':'';
    const alt=p.dynamic?`Ảnh sản phẩm ${p.name}`:p.photoIsReal?`Ảnh chụp thật minh họa nhóm hàng: ${p.name}`:`Hình vẽ minh họa ${p.name}`;
    const imageFallback=p.fallbackImage||(p.dynamic?`assets/category-${p.categoryId}.webp`:'');
    return `<img class="${cls}" src="${safe(p.image)}" data-fallback="${safe(imageFallback)}" alt="${safe(alt)}" loading="${mode==='detail'?'eager':'lazy'}" width="560" height="480">`;
  }
  function productCard(p,context=''){
    return `<article class="product-card" data-product-card="${p.id}">
       <div class="product-thumb"><a href="${detailLink(p)}" aria-label="Xem chi tiết ${safe(p.name)}">${productImage(p)}</a>
        ${badgeHtml(p,context)}<button class="wish-button ${wishlist.has(p.id)?'active':''}" type="button" data-favorite="${p.id}" aria-label="${wishlist.has(p.id)?'Bỏ yêu thích':'Yêu thích'} ${safe(p.name)}" aria-pressed="${wishlist.has(p.id)}">${wishlist.has(p.id)?'♥':'♡'}</button></div>
       <div class="product-card-body"><span class="product-cat">${safe(CATEGORIES.find(c=>c.id===p.categoryId)?.emoji||'🐾')} ${safe(p.categoryName)}</span>
         <a class="product-name" href="${detailLink(p)}">${safe(p.name)}</a>
         <p class="product-desc">${safe(p.short)}</p><span class="product-pack">✦ ${safe(p.size)}</span>
         <div class="product-prices"><strong>${money(p.price)}</strong>${isSale(p)?`<del>${money(p.oldPrice)}</del>`:''}</div>
         <div class="product-actions"><a class="button-detail" href="${detailLink(p)}">Chi tiết</a><button type="button" class="button-add" data-add="${p.id}">＋ Thêm giỏ</button></div>
       </div>
     </article>`;
  }
  function productGrid(root,products,context=''){
    if(root)root.innerHTML=products.map(p=>productCard(p,context)).join('');
  }
  function renderHome(){
    productGrid($('#home-hot-grid'),hotItems().slice(0,8),'hot');
    productGrid($('#home-sale-grid'),items.filter(isSale).sort((a,b)=>Number(Boolean(b.dynamic))-Number(Boolean(a.dynamic))).slice(0,4),'sale');
    const shelves=$('#home-category-shelves');
    if(shelves){shelves.innerHTML=CATEGORIES.map(c=>{
      const goods=items.filter(p=>p.categoryId===c.id);
      return `<section class="category-shelf"><div class="shelf-heading"><div><h3>${c.emoji} ${safe(c.name)}</h3><p>${safe(c.description)}</p></div><a href="${catLink(c.id)}">Xem cả danh mục →</a></div><div class="product-grid">${goods.map(p=>productCard(p)).join('')}</div></section>`;
    }).join('');}
  }
  function sortProducts(list,sort){
    const a=list.slice();
    if(sort==='price-asc')a.sort((x,y)=>x.price-y.price);
    else if(sort==='price-desc')a.sort((x,y)=>y.price-x.price);
    else if(sort==='name')a.sort((x,y)=>x.name.localeCompare(y.name,'vi'));
    return a;
  }
  function searchable(p){return `${p.name} ${p.short} ${p.size} ${p.categoryName}`.toLocaleLowerCase('vi');}
  function renderListing(root){
    const type=root.dataset.listing;
    const category=root.dataset.category;
    const search=root.querySelector('[data-filter-search]');
    const sort=root.querySelector('[data-filter-sort]');
    const grid=root.querySelector('[data-list-grid]');
    const count=root.querySelector('[data-result-count]');
    const empty=root.querySelector('[data-no-result]');
    const query=(new URLSearchParams(window.location.search)).get('q');
    if(query)search.value=query;
    function render(){
      const text=search.value.trim().toLocaleLowerCase('vi');
      let list=items;
      if(type==='category')list=list.filter(p=>p.categoryId===category);
      if(type==='sale')list=list.filter(isSale);
      if(type==='hot')list=hotItems();
      if(text)list=list.filter(p=>searchable(p).includes(text));
      list=sortProducts(list,sort.value);
      productGrid(grid,list,type);
      count.textContent=`🐾 Hiển thị ${list.length} sản phẩm${type==='category'?' trong danh mục này':''}`;
      empty.hidden=list.length>0;
    }
    search.addEventListener('input',render);
    sort.addEventListener('change',render);
    root._refreshListing=render;
    render();
  }
  function renderDetail(){
    const root=$('#detail-root');if(!root)return;
    const dynamicId=(new URLSearchParams(window.location.search)).get('id');
    const p=byId.get(root.dataset.productId||dynamicId);
    if(!p){root.innerHTML='<p>Không tìm thấy sản phẩm.</p>';return;}
    root.innerHTML=`<div class="detail-visual">${productImage(p,'detail')}${badgeHtml(p,isSale(p)?'sale':HOT_IDS.includes(p.id)?'hot':'')}</div>
      <div class="detail-copy"><span class="eyebrow">🐾 ${safe(p.categoryName).toUpperCase()}</span><h1>${safe(p.name)}</h1>
      <p class="detail-lead">${safe(p.short)}</p>
      <div class="detail-cost"><strong>${money(p.price)}</strong>${isSale(p)?`<del>${money(p.oldPrice)}</del><span class="detail-save">Giảm minh họa ${discount(p)}%</span>`:''}</div>
      <div class="detail-attributes"><div><span>Quy cách</span><b>${safe(p.size)}</b></div><div><span>Danh mục</span><b>${safe(p.categoryName)}</b></div><div><span>Mã sản phẩm</span><b>${safe(p.id.toUpperCase())}</b></div><div><span>Loại hình</span><b>${p.dynamic?'Sản phẩm cửa hàng':'Hàng mẫu minh họa'}</b></div></div>
      <div class="detail-actions"><div class="qty-group"><button type="button" data-qty-change="-1" aria-label="Giảm số lượng">−</button><input id="detail-quantity" type="number" min="1" max="100" value="1" inputmode="numeric" aria-label="Số lượng"><button type="button" data-qty-change="1" aria-label="Tăng số lượng">+</button></div><button type="button" class="detail-add" data-detail-add="${p.id}">🛒 Thêm vào giỏ hàng</button></div>
      <div class="detail-feature-text"><h3>💛 Thông tin sản phẩm</h3><p>${safe(p.dynamic?(p.description||p.short):p.short+' Đây là nội dung giới thiệu mẫu theo danh mục, bạn có thể thay thế bằng thông tin thành phần, công dụng, xuất xứ và hướng dẫn sử dụng đã xác minh khi nhập sản phẩm thật.') .replaceAll('\n','<br>')}</p></div>
      <p class="detail-note">${p.dynamic?'ⓘ Thông tin, giá và ảnh do cửa hàng đăng; vui lòng xác nhận trước khi đặt mua. ': 'ⓘ Tên, giá, quy cách và ưu đãi là dữ liệu demo. '}${!p.dynamic?(p.photoIsReal?`Ảnh chụp thật chỉ minh họa loại sản phẩm, không phải ảnh đúng mặt hàng đang bán. <a href="${safe(p.photoSource)}" target="_blank" rel="noopener noreferrer">Xem nguồn ảnh và giấy phép</a>.`:'Hình bao bì là minh họa.'):''} Chưa hỗ trợ thanh toán trực tuyến.</p><a class="view-all" href="${catLink(p.categoryId)}">← Quay lại ${safe(p.categoryName)}</a></div>`;
    productGrid($('#related-grid'),items.filter(x=>x.categoryId===p.categoryId&&x.id!==p.id).slice(0,4));
  }
  function updateCount(){const count=[...cart.values()].reduce((n,x)=>n+x,0);$$('[data-cart-count]').forEach(n=>{n.textContent=String(count);n.hidden=count===0 && !n.classList.contains('hero-count');});}
  function addToCart(id,qty=1){
    const p=byId.get(id);if(!p)return;
    qty=Math.max(1,Math.min(100,Number(qty)||1));
    cart.set(id,Math.min(100,(cart.get(id)||0)+qty));save();updateCount();
    notify(`🐾 Đã thêm ${p.name} vào giỏ hàng!`);
  }
  function renderCart(){
    const root=$('#cart-content');if(!root)return;
    if(cart.size===0){root.innerHTML='<div class="cart-empty"><span class="big">🛒</span><h3>Giỏ hàng đang trống</h3><p>Bé cưng đang chờ món quà đầu tiên đó!</p><a class="pill-button" href="tat-ca-san-pham.html">Khám phá sản phẩm →</a></div>';return;}
    let total=0;
    root.innerHTML=[...cart].map(([id,n])=>{
      const p=byId.get(id);if(!p)return '';
      total+=p.price*n;
      return `<div class="cart-row"><a href="${detailLink(p)}"><img loading="lazy" src="${safe(p.image)}" data-fallback="${safe(p.fallbackImage||'')}" alt=""></a><div class="cart-item-data"><a href="${detailLink(p)}">${safe(p.name)}</a><small>${safe(p.size)}</small><strong>${money(p.price*n)}</strong><div class="cart-row-tools"><button type="button" data-cart-delta="-1" data-id="${id}" aria-label="Giảm số lượng ${safe(p.name)}">−</button><span>${n}</span><button type="button" data-cart-delta="1" data-id="${id}" aria-label="Tăng số lượng ${safe(p.name)}">+</button><button type="button" class="remove-item" data-cart-remove="${id}">Xóa</button></div></div></div>`;
    }).join('')+`<div class="cart-total"><span>Tạm tính</span><strong>${money(total)}</strong></div><button type="button" class="checkout-demo" data-checkout-demo>Đặt hàng / Thanh toán (demo)</button><p class="cart-demo-note">Giá và giỏ hàng chỉ để thử giao diện, chưa có hệ thống thanh toán và xác nhận đơn hàng.</p>`;
  }
  function cartOpen(){const shade=$('#drawer-shade'),drawer=$('#cart-drawer');if(!shade||!drawer)return;previousFocus=document.activeElement;shade.hidden=false;drawer.hidden=false;document.body.style.overflow='hidden';renderCart();const close=drawer.querySelector('[data-cart-close]');close?.focus();}
  function cartClose(){const shade=$('#drawer-shade'),drawer=$('#cart-drawer');if(!shade||!drawer)return;shade.hidden=true;drawer.hidden=true;document.body.style.overflow='';if(previousFocus?.isConnected)previousFocus.focus();}
  function updateQty(id,delta){const n=(cart.get(id)||0)+delta;if(n<=0)cart.delete(id);else cart.set(id,Math.min(100,n));save();updateCount();renderCart();}
  function toggleWish(id){const p=byId.get(id);if(!p)return;if(wishlist.has(id))wishlist.delete(id);else wishlist.add(id);save();$$(`[data-favorite="${id}"]`).forEach(el=>{const active=wishlist.has(id);el.classList.toggle('active',active);el.textContent=active?'♥':'♡';el.setAttribute('aria-pressed',String(active));el.setAttribute('aria-label',(active?'Bỏ yêu thích ':'Yêu thích ')+p.name);});notify(wishlist.has(id)?`♡ Đã lưu ${p.name} vào yêu thích`:`Đã bỏ yêu thích ${p.name}`);}
  function bindEvents(){
    // Khi ngoại tuyến hoặc ảnh nguồn gặp lỗi, hiển thị bao bì minh họa cũ.
    document.addEventListener('error',e=>{
      const img=e.target;
      if(img?.tagName!=='IMG'||!img.dataset.fallback||img.dataset.fallbackUsed)return;
      img.dataset.fallbackUsed='1';
      img.src=img.dataset.fallback;
      img.classList.remove('real-product-photo');
    },true);
    document.addEventListener('click',e=>{
      const a=e.target.closest('[data-add]');if(a){addToCart(a.dataset.add);return;}
      const fav=e.target.closest('[data-favorite]');if(fav){toggleWish(fav.dataset.favorite);return;}
      if(e.target.closest('[data-cart-open]')){cartOpen();return;}
      if(e.target.closest('[data-cart-close]')||e.target.closest('#drawer-shade')){cartClose();return;}
      const delta=e.target.closest('[data-cart-delta]');if(delta){updateQty(delta.dataset.id,Number(delta.dataset.cartDelta));return;}
      const remove=e.target.closest('[data-cart-remove]');if(remove){cart.delete(remove.dataset.cartRemove);save();updateCount();renderCart();return;}
      if(e.target.closest('[data-checkout-demo]')){notify('Đây là website demo, chưa kết nối thanh toán hoặc tạo đơn hàng.');return;}
      if(e.target.closest('[data-account]')){let signed=false;try{signed=Boolean(sessionStorage.getItem('thao-pet-backend-jwt'));}catch{} window.location.href=signed?'tai-khoan.html':'login.html?role=customer';return;}
      const contact=e.target.closest('[data-contact]');if(contact){notify('Số điện thoại hiện chưa được cấu hình.');return;}
      const toggle=e.target.closest('[data-nav-toggle]');if(toggle){const menu=toggle.closest('.site-header').querySelector('.nav-main');const open=menu.classList.toggle('mobile-open');document.body.classList.toggle('mobile-nav-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Đóng menu':'Mở menu');return;}
      const change=e.target.closest('[data-qty-change]');if(change){const input=$('#detail-quantity');if(input){input.value=String(Math.max(1,Math.min(100,(Number(input.value)||1)+Number(change.dataset.qtyChange))));}return;}
      const addDetail=e.target.closest('[data-detail-add]');if(addDetail){addToCart(addDetail.dataset.detailAdd,Number($('#detail-quantity')?.value)||1);return;}
    });
    document.addEventListener('submit',e=>{
      const form=e.target.closest('[data-search-form]');if(!form)return;
      e.preventDefault();const value=form.querySelector('input[type=search]')?.value.trim()||'';
      window.location.href='tat-ca-san-pham.html'+(value?'?q='+encodeURIComponent(value):'');
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){cartClose();document.body.classList.remove('mobile-nav-open');$$('.nav-main.mobile-open').forEach(el=>{el.classList.remove('mobile-open');const button=el.closest('.site-header')?.querySelector('[data-nav-toggle]');if(button){button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Mở menu');}});}
      if(e.key==='Tab'&&!$('#cart-drawer')?.hidden){
        const focusable=Array.from($('#cart-drawer').querySelectorAll('button,a[href],input')).filter(el=>!el.disabled&&el.getClientRects().length);
        if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
      }
    });
  }
  function refreshCatalog(posts){
    setItems(posts);
    for(const id of [...cart.keys()])if(!byId.has(id))cart.delete(id);
    save();renderHome();
    $$('[data-listing]').forEach(root=>root._refreshListing?.());
    renderDetail();updateCount();
  }
  function init(){
    restore();renderHome();$$('[data-listing]').forEach(renderListing);renderDetail();updateCount();bindEvents();
    window.addEventListener('shop:products',e=>refreshCatalog(e.detail||[]));
    if(Array.isArray(window.__SHOP_LATEST_POSTS))refreshCatalog(window.__SHOP_LATEST_POSTS);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
