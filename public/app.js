const loginForm = document.querySelector('#login-panel');
const registerForm = document.querySelector('#register-panel');
const loginTab = document.querySelector('#tab-login');
const registerTab = document.querySelector('#tab-register');
const notice = document.querySelector('#notice');

function showNotice(message, type = 'info') {
  notice.textContent = message;
  notice.className = `notice ${type}`;
  notice.hidden = false;
}

function setMode(mode) {
  const isLogin = mode === 'login';
  loginForm.hidden = !isLogin;
  registerForm.hidden = isLogin;
  loginTab.classList.toggle('active', isLogin);
  registerTab.classList.toggle('active', !isLogin);
  loginTab.setAttribute('aria-selected', String(isLogin));
  registerTab.setAttribute('aria-selected', String(!isLogin));
  notice.hidden = true;
}

loginTab.addEventListener('click', () => setMode('login'));
registerTab.addEventListener('click', () => setMode('register'));

async function sendRequest(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.mensaje || 'No fue posible completar la operación.');
  }
  return data;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const user = loginForm.elements.user.value.trim();
  const password = loginForm.elements.password.value;

  try {
    const result = await sendRequest('/api/login', { user, password });
    showNotice(result.mensaje, 'success');
  } catch (error) {
    showNotice(error.message, 'error');
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const user = registerForm.elements.user.value.trim();
  const password = registerForm.elements.password.value;
  const confirm = registerForm.elements.confirm.value;

  if (password !== confirm) {
    showNotice('Las contraseñas no coinciden.', 'error');
    return;
  }

  try {
    const result = await sendRequest('/api/registro', { user, password });
    registerForm.reset();
    setMode('login');
    showNotice(result.mensaje, 'success');
    loginForm.elements.user.value = user;
  } catch (error) {
    showNotice(error.message, 'error');
  }
});
