/* Thảo Thú Cưng – Frontend Username + JWT, tương thích backend FastAPI JWT Username.
 * Không dùng Firebase SDK trong trình duyệt. Không đặt khóa bí mật ở đây.
 */
const apiBase = String(window.THAO_API_BASE_URL || '').trim().replace(/\/+$/, '');
function validApiBase(base) {
  try {
    const url = new URL(base);
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname)
      && !/TEN-BACKEND|YOUR-|REPLACE|DOI-TEN/i.test(base)
      && !url.pathname.replaceAll('/', '');
  } catch { return false; }
}
const apiReady = validApiBase(apiBase);
const qs = selector => document.querySelector(selector);
const page = document.body.dataset.adminPage;
const money = n => new Intl.NumberFormat('vi-VN').format(Number(n)||0)+'đ';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cats = {'cho':'Đồ ăn cho chó','meo':'Đồ ăn cho mèo','suc-khoe':'Chăm sóc sức khỏe','dinh-duong':'Dinh dưỡng đặc biệt','phu-kien':'Phụ kiện & hỗ trợ','bo-sung':'Thức ăn bổ sung'};
const catImage = id => `assets/category-${cats[id]?id:'cho'}.webp`;
const TOKEN_KEY = 'thao-pet-backend-jwt';
function storedToken(){try{return sessionStorage.getItem(TOKEN_KEY)||'';}catch{return '';}}
function clearToken(){try{sessionStorage.removeItem(TOKEN_KEY);}catch{}token='';user=null;}
function saveToken(newToken){
  try {
    sessionStorage.setItem(TOKEN_KEY, newToken);
    return sessionStorage.getItem(TOKEN_KEY)===newToken;
  }catch{return false;}
}
let token=storedToken();
let user=null, posts=[], editing=null, processing=false, previewUrl=null;
let authSequence=0;
function note(element,message,type='') {
  if(!element)return;
  element.textContent=message;
  element.className=(element.id.includes('mode-notice')?'mode-notice ':'form-message ')+type;
}
function describeError(error) {
  return error?.message || 'Đã xảy ra lỗi không xác định.';
}
function errorFromStatus(res,data,path){
  const detail = data?.detail;
  if(typeof detail === 'string' && detail.trim()) return detail;
  if(Array.isArray(detail))return detail.map(d=>d?.msg || 'Dữ liệu không hợp lệ').join('; ');
  if(res.status===404 && path==='/api/auth/register')return 'Backend chưa có API đăng ký khách hàng. Hãy cập nhật app/main.py và app/auth_service.py.';
  if(res.status===404 && path.startsWith('/api/auth/'))return 'Backend chưa có API đăng nhập JWT Username. Hãy chạy đúng phiên bản backend mới.';
  if(res.status===401)return 'Sai tên đăng nhập hoặc mật khẩu, hoặc phiên đăng nhập đã hết hạn.';
  if(res.status===403)return 'Tài khoản không có quyền Admin. Kiểm tra --role admin trong create_user.py.';
  if(res.status===503)return 'Backend chưa kết nối được Firestore hoặc chưa cấu hình JWT. Kiểm tra Terminal FastAPI.';
  return `API trả về HTTP ${res.status}. Kiểm tra backend và địa chỉ API.`;
}
async function api(path,options={}) {
  if(!apiReady) throw new Error('Chưa cấu hình đúng địa chỉ FastAPI trong api-config.js. URL phải là http(s)://host:port, không có /api.');
  // Phân biệt đăng nhập công khai với các API cần JWT; tránh gửi JWT cũ khi login.
  const {skipAuth=false,timeoutMs=45000,...rest}=options;
  const headers=new Headers(rest.headers||{});
  if(!headers.has('Accept'))headers.set('Accept','application/json');
  if(token && !skipAuth)headers.set('Authorization','Bearer '+token);
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),timeoutMs);
  let res;
  try {
    res=await fetch(apiBase+path,{...rest,headers,cache:'no-store',signal:controller.signal,credentials:'omit'});
  }catch(error){
    if(error?.name==='AbortError')throw new Error('API không phản hồi kịp thời. Kiểm tra FastAPI/Render rồi thử lại.');
    throw new Error('Không kết nối được FastAPI. Kiểm tra server, địa chỉ API trong api-config.js và CORS_ORIGINS trong backend/.env.');
  }finally{clearTimeout(timeout);}
  if(res.status===204)return null;
  const data=await res.json().catch(()=>null);
  if(!res.ok)throw new Error(errorFromStatus(res,data,path));
  if(data===null)throw new Error('Backend không trả JSON hợp lệ. Kiểm tra đúng địa chỉ API.');
  return data;
}
function apiLocationHint(){
  if(!apiReady)return 'Chưa có URL FastAPI hợp lệ. Mở api-config.js để cấu hình.';
  const remote = location.protocol==='https:' && apiBase.startsWith('http:') && !/^http:\/\/(localhost|127\.0\.0\.1)/i.test(apiBase);
  if(remote)return 'Frontend chạy HTTPS nhưng API HTTP: trình duyệt có thể chặn Mixed Content. Hãy dùng HTTPS Render.';
  if(location.protocol==='https:' && /^http:\/\/(localhost|127\.0\.0\.1)/i.test(apiBase))return 'Frontend online đang trỏ API về localhost của máy người xem. Hãy thay bằng HTTPS Render.';
  return `API: ${apiBase}`;
}
async function checkApiConnection(){
  const out=qs('#api-connection-result');
  if(!out)return;
  out.textContent='Đang kiểm tra FastAPI...';out.className='api-connection-result';
  try {
    const data=await api('/api/health',{skipAuth:true,timeoutMs:15000});
    if(data?.status!=='ok')throw new Error('API trả về dữ liệu Health không hợp lệ.');
    const warnings=[];
    if(data.firebaseConfigured===false)warnings.push('Firebase chưa cấu hình');
    if(data.jwtConfigured===false)warnings.push('JWT_SECRET_KEY chưa đủ');
    out.textContent=`Đã kết nối FastAPI (${apiBase}). ${warnings.length?warnings.join(', ')+'.':'Có thể thử đăng nhập.'}`;
    out.className='api-connection-result '+(warnings.length?'warning':'success');
  }catch(err){out.textContent=describeError(err);out.className='api-connection-result error';}
}
function showPreview(url) {
  if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null;}
  const box=qs('#admin-image-preview');
  if(!url){box.innerHTML='<span>🐾</span><p>Hình sẽ xuất hiện ở đây</p>';return;}
  const img=document.createElement('img');img.alt='Xem trước ảnh sản phẩm';img.src=url;
  img.onerror=()=>{box.textContent='Không tải được hình ảnh này';};box.replaceChildren(img);
}
function resetForm(){
  const form=qs('#product-form');form.reset();editing=null;form.elements.editingId.value='';
  qs('#admin-form-title').textContent='Đăng bài bán hàng';
  qs('#save-product').textContent='🐾 Đăng / Lưu sản phẩm';
  qs('#cancel-edit').hidden=true;showPreview('');note(qs('#editor-message'),'');
}
function readForm() {
  const f=qs('#product-form');
  const data={
    name:f.elements.name.value.trim(), categoryId:f.elements.categoryId.value,
    size:f.elements.size.value.trim(), price:Number(f.elements.price.value),
    oldPrice:Number(f.elements.oldPrice.value||0), short:f.elements.short.value.trim(),
    description:f.elements.description.value.trim(), status:f.elements.status.value,
    hot:f.elements.hot.checked
  };
  if(!data.name || !data.short || !data.description || !data.size)throw new Error('Vui lòng nhập đầy đủ thông tin sản phẩm.');
  if(!Number.isSafeInteger(data.price)||data.price<1000||data.price>999999999)throw new Error('Giá bán không hợp lệ.');
  if(!Number.isSafeInteger(data.oldPrice)||data.oldPrice<0||data.oldPrice>999999999||(data.oldPrice && data.oldPrice<=data.price))throw new Error('Giá gốc phải lớn hơn giá bán hiện tại.');
  return data;
}
function updatePosts(data) {
  posts=(Array.isArray(data)?data:[]).slice().sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
  qs('#stat-total').textContent=String(posts.length);
  qs('#stat-published').textContent=String(posts.filter(x=>x.status==='published').length);
  qs('#stat-draft').textContent=String(posts.filter(x=>x.status==='draft').length);
  renderPosts();
}
function renderPosts() {
  const query=qs('#admin-filter').value.trim().toLocaleLowerCase('vi');
  const list=posts.filter(p=>(p.name+' '+(cats[p.categoryId]||'')).toLocaleLowerCase('vi').includes(query));
  const target=qs('#admin-products');
  if(!list.length){target.innerHTML='<div class="admin-empty">🐾 Không có bài đăng phù hợp.</div>';return;}
  target.innerHTML=list.map(p=>`<article class="post-row" data-post-id="${esc(p.id)}">
    <img src="${esc(p.image||catImage(p.categoryId))}" loading="lazy" alt="${esc(p.name)}" onerror="this.onerror=null;this.src='${catImage(p.categoryId)}'">
    <div><span class="post-title">${esc(p.name)}</span><div class="post-meta"><span class="status-chip ${p.status==='published'?'live':''}">${p.status==='published'?'Đang bán':'Bản nháp'}</span>${esc(cats[p.categoryId]||'')} • ${esc(p.size||'')}</div><span class="post-price">${money(p.price)} ${p.oldPrice>p.price?`<del style="font-size:12px;color:#997760">${money(p.oldPrice)}</del>`:''} ${p.hot?'🔥':''}</span></div>
    <div class="post-tools"><button type="button" data-post-edit="${esc(p.id)}">✎ Sửa</button><button type="button" data-post-status="${esc(p.id)}">${p.status==='published'?'Ẩn bài':'Đăng bán'}</button><button type="button" class="danger" data-post-delete="${esc(p.id)}">🗑 Xóa</button></div>
  </article>`).join('');
}
function editPost(id) {
  const p=posts.find(x=>x.id===id);if(!p)return;editing=p;
  const f=qs('#product-form');
  f.elements.editingId.value=p.id;
  for(const key of ['name','categoryId','size','price','oldPrice','short','description','status'])f.elements[key].value=p[key]??'';
  f.elements.hot.checked=Boolean(p.hot);
  f.elements.imageUrl.value=p.imageUrl||'';
  f.elements.imageFile.value='';showPreview(p.image||catImage(p.categoryId));
  qs('#admin-form-title').textContent='Chỉnh sửa bài bán hàng';qs('#save-product').textContent='💾 Lưu thay đổi';
  qs('#cancel-edit').hidden=false;
  qs('#product-form-section').scrollIntoView({behavior:'smooth',block:'start'});
}
async function refresh() {
  const data=await api('/api/admin/products');
  updatePosts(data.items);
}
async function initLogin() {
  const form=qs('#login-form'), submit=qs('#login-submit'), msg=qs('#login-message');
  const registerForm=qs('#register-form'), registerMsg=qs('#register-message');
  const password=qs('#admin-password');
  const tabs=[qs('#tab-customer'),qs('#tab-admin')];
  const params=new URLSearchParams(location.search);
  let activeRole=params.get('role')==='admin'?'admin':'customer';
  const setRole=(role)=>{
    activeRole=role==='admin'?'admin':'customer';
    const admin=activeRole==='admin';
    tabs.forEach(tab=>{
      const on=tab.dataset.role===activeRole;
      tab.setAttribute('aria-selected',String(on));
      tab.classList.toggle('active',on);
    });
    qs('#role-title').textContent=admin?'Admin':'khách hàng';
    qs('#role-description').textContent=admin
      ?'Đăng nhập để đăng bài bán hàng và quản lý sản phẩm của cửa hàng.'
      :'Đăng nhập để xem thông tin tài khoản, giỏ hàng và món yêu thích.';
    submit.textContent=admin?'Đăng nhập quản trị →':'Đăng nhập khách hàng →';
    qs('#customer-register-entry').hidden=admin;
    qs('#login-footnote').textContent=admin
      ?'Chỉ chủ cửa hàng có thể tạo tài khoản quản trị bằng create_user.py. Không có đăng ký Admin công khai.'
      :'Đăng ký ở đây chỉ tạo tài khoản khách hàng, không cấp quyền quản trị.';
    registerForm.hidden=true;form.hidden=false;registerMsg.textContent='';msg.textContent='';
    const newURL=new URL(location.href);newURL.searchParams.set('role',activeRole);history.replaceState(null,'',newURL);
  };
  tabs.forEach(tab=>tab.addEventListener('click',()=>setRole(tab.dataset.role)));
  setRole(activeRole);
  qs('#show-password').addEventListener('click',()=>{
    password.type=password.type==='password'?'text':'password';
    qs('#show-password').textContent=password.type==='password'?'Hiện':'Ẩn';
  });
  qs('#api-endpoint').textContent=apiLocationHint();
  qs('#check-api').addEventListener('click',checkApiConnection);
  if(!apiReady){
    note(qs('#login-mode-notice'),'Chưa cấu hình URL Backend. Hãy sửa api-config.js.','error');
    submit.disabled=true;qs('#register-submit').disabled=true;return;
  }
  note(qs('#login-mode-notice'),'USERNAME + JWT • Thông tin tài khoản lưu trong Firestore.','live');
  if(token){
    const currentToken=token, sequence=authSequence;
    api('/api/auth/me').then(info=>{
      if(token===currentToken && sequence===authSequence){
        location.replace(info.role==='admin'?'admin.html':'tai-khoan.html');
      }
    }).catch(()=>{if(token===currentToken && sequence===authSequence)clearToken();});
  }
  qs('#open-register').addEventListener('click',()=>{
    form.hidden=true;registerForm.hidden=false;registerMsg.textContent='';
    qs('#customer-register-entry').hidden=true;registerForm.elements.username.focus();
  });
  qs('#back-to-login').addEventListener('click',()=>{
    form.hidden=false;registerForm.hidden=true;
    qs('#customer-register-entry').hidden=activeRole==='admin';
    registerMsg.textContent='';
  });
  registerForm.addEventListener('submit',async e=>{
    e.preventDefault();if(processing || !apiReady)return;
    const username=registerForm.elements.username.value.trim().toLowerCase();
    const pass=registerForm.elements.password.value;
    const confirmation=registerForm.elements.confirmPassword.value;
    if(pass!==confirmation){note(registerMsg,'Mật khẩu xác nhận không khớp.','error');return;}
    processing=true;qs('#register-submit').disabled=true;
    note(registerMsg,'Đang tạo tài khoản khách hàng...');
    try{
      await api('/api/auth/register',{method:'POST',skipAuth:true,
        headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password:pass})});
      form.elements.username.value=username;
      registerForm.hidden=true;form.hidden=false;qs('#customer-register-entry').hidden=false;
      note(msg,'Đăng ký thành công! Hãy đăng nhập với username và mật khẩu vừa tạo.','success');
      registerForm.reset();qs('#admin-password').focus();
    }catch(err){note(registerMsg,describeError(err),'error');}
    finally{processing=false;qs('#register-submit').disabled=false;}
  });
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(processing)return;
    processing=true;authSequence+=1;submit.disabled=true;
    const username=form.elements.namedItem('username').value.trim().toLowerCase();
    const pass=form.elements.namedItem('password').value;
    clearToken();note(msg,'Đang đăng nhập...');
    try {
      if(!/^[a-z][a-z0-9_.-]{2,31}$/.test(username))throw new Error('Username không hợp lệ (3–32 ký tự, không có dấu cách hoặc @).');
      const result=await api('/api/auth/login',{method:'POST',skipAuth:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password:pass})});
      if(typeof result?.access_token!=='string' || !result.access_token || String(result?.token_type).toLowerCase()!=='bearer')
        throw new Error('Phản hồi đăng nhập không có JWT. Hãy kiểm tra phiên bản backend.');
      if(!['customer','admin'].includes(result?.user?.role))throw new Error('API không trả vai trò tài khoản hợp lệ.');
      // Backend never trusts the role selected in the UI. Server validates token and user from Firestore.
      if(result.user.role!==activeRole){
        throw new Error(activeRole==='admin'?'Đây là tài khoản khách hàng. Vui lòng chọn tab Khách hàng.':'Đây là tài khoản quản trị. Vui lòng chọn tab Quản trị viên.');
      }
      token=result.access_token;user=await api('/api/auth/me');
      if(user?.role!==activeRole)throw new Error('Quyền tài khoản không phù hợp với tab đã chọn.');
      if(!saveToken(token))throw new Error('Trình duyệt chặn sessionStorage. Vui lòng chạy frontend qua HTTP.');
      note(msg,'Đăng nhập thành công!','success');
      location.replace(activeRole==='admin'?'admin.html':'tai-khoan.html');
    } catch(err){clearToken();note(msg,describeError(err),'error');}
    finally{processing=false;submit.disabled=false;}
  });
}
async function initDashboard() {
  const loading=qs('#admin-loading'),work=qs('#admin-app');
  if(!apiReady){
    loading.innerHTML='<h1>Chưa cấu hình FastAPI</h1><p>Điền URL trong api-config.js rồi mở trang đăng nhập.</p><a href="login.html">Đăng nhập</a>';
    return;
  }
  if(!token){location.replace('login.html');return;}
  try{
    user=await api('/api/admin/me');
    qs('#admin-user').textContent=user.username||'Admin';
    note(qs('#admin-mode-notice'),'ĐÃ KẾT NỐI FASTAPI + FIRESTORE • JWT do backend ký, quyền Admin được kiểm tra ở máy chủ.','live');
    await refresh();
  }catch(err){
    clearToken();
    loading.innerHTML=`<h1>Không thể mở quản trị</h1><p>${esc(describeError(err))}</p><a href="login.html">Quay lại đăng nhập</a>`;
    return;
  }
  loading.hidden=true;work.hidden=false;
  qs('#admin-logout').addEventListener('click',async()=>{
    try { await api('/api/auth/logout',{method:'POST'}); } catch(e) { console.warn('Đăng xuất phía server:', e.message); }
    clearToken();
    location.replace('login.html');
  });
  qs('#admin-filter').addEventListener('input',renderPosts);
  qs('#reset-product-form').addEventListener('click',resetForm);
  qs('#cancel-edit').addEventListener('click',resetForm);
  qs('#product-image').addEventListener('change',e=>{
    const file=e.target.files?.[0];if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){note(qs('#editor-message'),'Ảnh phải là JPG, PNG hoặc WebP, tối đa 5 MB.','error');e.target.value='';return;}
    previewUrl=URL.createObjectURL(file);const box=qs('#admin-image-preview');
    const img=document.createElement('img');img.alt='Ảnh được chọn';img.src=previewUrl;box.replaceChildren(img);
  });
  qs('#product-image-url').addEventListener('change',e=>{
    if(qs('#product-image').files?.length)return;
    const url=e.target.value.trim();if(url.startsWith('https://'))showPreview(url);
  });
  qs('#product-form').addEventListener('submit',async e=>{
    e.preventDefault();if(processing)return;processing=true;qs('#save-product').disabled=true;
    note(qs('#editor-message'),'Đang lưu bài đăng...');
    try{
      const data=readForm();
      data.imageMediaId=editing?.imageMediaId||null;
      data.imageUrl=editing?.imageUrl||null;
      const imgUrl=qs('#product-image-url').value.trim();
      const file=qs('#product-image').files?.[0];
      if(file){
        note(qs('#editor-message'),'Đang tải ảnh lên Cloudinary qua FastAPI...');
        const form=new FormData();form.set('file',file);
        const result=await api('/api/admin/images',{method:'POST',body:form});
        data.imageMediaId=result.mediaId;data.imageUrl=null;
      }else if(imgUrl){
        if(!/^https:\/\/\S{4,2000}$/i.test(imgUrl))throw new Error('URL ảnh phải bắt đầu bằng https://.');
        data.imageUrl=imgUrl;data.imageMediaId=null;
      }
      await api(editing?`/api/admin/products/${encodeURIComponent(editing.id)}`:'/api/admin/products',{
        method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)
      });
      resetForm();await refresh();note(qs('#editor-message'),'✅ Đã lưu sản phẩm thành công.','success');
    }catch(err){note(qs('#editor-message'),describeError(err),'error');}
    finally{processing=false;qs('#save-product').disabled=false;}
  });
  qs('#admin-products').addEventListener('click',async e=>{
    const edit=e.target.closest('[data-post-edit]');if(edit){editPost(edit.dataset.postEdit);return;}
    const toggle=e.target.closest('[data-post-status]');
    const remove=e.target.closest('[data-post-delete]');
    if(toggle){const p=posts.find(x=>x.id===toggle.dataset.postStatus);if(!p)return;
      try{
        const next=p.status==='published'?'draft':'published';
        await api(`/api/admin/products/${encodeURIComponent(p.id)}/status`,{
          method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:next})
        });
        await refresh();
      }catch(err){alert(describeError(err));}
      return;
    }
    if(remove){const p=posts.find(x=>x.id===remove.dataset.postDelete);if(!p)return;
      if(!confirm(`Xóa sản phẩm "${p.name}"?`))return;
      try{
        await api(`/api/admin/products/${encodeURIComponent(p.id)}`,{method:'DELETE'});
        if(editing?.id===p.id)resetForm();await refresh();
      }catch(err){alert(describeError(err));}
    }
  });
}
if(page==='login')initLogin();
else if(page==='dashboard')initDashboard();
