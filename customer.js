'use strict';
(() => {
 const apiBase=String(window.THAO_API_BASE_URL||'').trim().replace(/\/+$/,'');
 const TOKEN_KEY='thao-pet-backend-jwt';
 const $=s=>document.querySelector(s);
 const loading=$('#customer-loading'), content=$('#customer-content');
 const goLogin=()=>{location.replace('login.html?role=customer');};
 const token=(()=>{try{return sessionStorage.getItem(TOKEN_KEY)||'';}catch{return '';}})();
 const forget=()=>{try{sessionStorage.removeItem(TOKEN_KEY);}catch{}};
 const getJson=async(path,auth=true)=>{
   const controller=new AbortController(),tid=setTimeout(()=>controller.abort(),18000);
   try {
     const res=await fetch(apiBase+path,{headers:auth?{Authorization:'Bearer '+token}:{},cache:'no-store',signal:controller.signal});
     const data=await res.json().catch(()=>null);
     if(!res.ok)throw new Error((data&&data.detail)||'HTTP '+res.status);
     return data;
   } finally {clearTimeout(tid);} 
 };
 const safeStore=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};
 const productLink=p=>p.dynamic?`san-pham.html?id=${encodeURIComponent(p.id)}`:`chi-tiet-${p.id}.html`;
 const makeItem=(p,extra)=>{
   const a=document.createElement('a');a.className='customer-list-item';a.href=productLink(p);
   const img=document.createElement('img');img.alt='';img.loading='lazy';img.src=p.image || `assets/category-${p.categoryId||'cho'}.webp`;
   img.onerror=()=>{img.onerror=null;img.src='assets/category-cho.webp';};
   const div=document.createElement('div'),span=document.createElement('span'),small=document.createElement('small');
   span.textContent=p.name;small.textContent=extra||'';div.append(span,small);a.append(img,div);return a;
 };
 const empty=(text)=>{const p=document.createElement('div');p.className='customer-empty';p.textContent=text;return p;};
 async function start(){
   if(!token){goLogin();return;}
   if(!/^https?:\/\//.test(apiBase)){loading.innerHTML='<h1>Chưa cấu hình Backend API.</h1><p>Mở api-config.js để sửa.</p>';return;}
   let me;
   try {me=await getJson('/api/auth/me');}
   catch(err){forget();loading.textContent='Phiên đã hết hạn hoặc API chưa kết nối được: '+err.message;const a=document.createElement('a');a.href='login.html?role=customer';a.textContent=' Đăng nhập lại';loading.append(a);return;}
   if(me.role==='admin'){location.replace('admin.html');return;}
   if(me.role!=='customer'){forget();goLogin();return;}
   $('#customer-username').textContent=me.username;
   $('#profile-username').textContent=me.username;
   loading.hidden=true;content.hidden=false;
   const products=new Map((window.SHOP_PRODUCTS||[]).map(p=>[p.id,p]));
   try{
     const cloud=await getJson('/api/products?limit=200',false);
     for(const p of cloud.items||[])products.set(p.id,p);
   } catch { /* local demo products still shown */ }
   const cart=safeStore('thao-pet-cart-demo',{});
   const fav=safeStore('thao-pet-favorites-demo',[]);
   const wishNode=$('#customer-wishlist'),cartNode=$('#customer-cart');
   const wishlist=Array.isArray(fav)?fav:[];
   for(const id of wishlist){const p=products.get(id);if(p)wishNode.append(makeItem(p,'Xem chi tiết sản phẩm'));}
   if(!wishNode.childElementCount)wishNode.append(empty('Chưa có sản phẩm yêu thích trong trình duyệt này.'));
   if(cart && typeof cart==='object')for(const [id,qty] of Object.entries(cart)){const p=products.get(id);if(p && Number(qty)>0)cartNode.append(makeItem(p,`Số lượng: ${qty} • ${new Intl.NumberFormat('vi-VN').format(Number(p.price||0))}đ/sản phẩm`));}
   if(!cartNode.childElementCount)cartNode.append(empty('Giỏ hàng đang trống. Hãy trở lại cửa hàng để chọn sản phẩm.'));
   $('#customer-logout').addEventListener('click',async()=>{
     try{await fetch(apiBase+'/api/auth/logout',{method:'POST',headers:{Authorization:'Bearer '+token}});}catch{}
     forget();goLogin();
   });
 }
 start();
})();
