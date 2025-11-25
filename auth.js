// auth.js - Sistema de autenticación
window.API_URL =  'https://pvsproyectob.onrender.com';

const API_URL = window.API_URL;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupAuthEventListeners();
});

function checkAuthStatus() {
    const token = localStorage.getItem('bd2_token');
    const user = localStorage.getItem('bd2_user');
    
    if (!token || !user) {
        showAuthModal();
    } else {
        hideAuthModal();
        displayUserInfo(JSON.parse(user));
    }
}

function showAuthModal() {
    document.getElementById('authModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function showAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        document.querySelector('[data-auth-tab="login"]').classList.add('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        document.querySelector('[data-auth-tab="register"]').classList.add('active');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value;
    
    if (!username || !password) {
        showToast('Por favor completa todos los campos', 'warning');
        return;
    }
    
    showAuthLoading(true);
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            localStorage.setItem('bd2_token', data.token);
            localStorage.setItem('bd2_user', JSON.stringify(data.user));
            
            showToast('¡Bienvenido ' + data.user.username + '!', 'success');
            
            setTimeout(() => {
                hideAuthModal();
                displayUserInfo(data.user);
                if (typeof loadTables === 'function') {
                    loadTables();
                }
            }, 500);
            
        } else {
            throw new Error(data.detail || 'Error al iniciar sesión');
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        showAuthLoading(false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUser').value.trim();
    const password = document.getElementById('regPass').value;
    const passwordConfirm = document.getElementById('regPassConfirm').value;
    
    if (!username || !password || !passwordConfirm) {
        showToast('Por favor completa todos los campos', 'warning');
        return;
    }
    
    if (username.length < 3) {
        showToast('El usuario debe tener al menos 3 caracteres', 'warning');
        return;
    }
    
    if (password.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
        return;
    }
    
    if (password !== passwordConfirm) {
        showToast('Las contraseñas no coinciden', 'warning');
        return;
    }
    
    showAuthLoading(true);
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showToast('¡Registro exitoso! Ahora inicia sesión', 'success');
            
            document.getElementById('regUser').value = '';
            document.getElementById('regPass').value = '';
            document.getElementById('regPassConfirm').value = '';
            
            setTimeout(() => {
                showAuthTab('login');
                document.getElementById('loginUser').value = username;
                document.getElementById('loginPass').focus();
            }, 1000);
            
        } else {
            throw new Error(data.detail || 'Error al registrarse');
        }
        
    } catch (error) {
        console.error('Error en registro:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        showAuthLoading(false);
    }
}

function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('bd2_token');
        localStorage.removeItem('bd2_user');
        
        showToast('Sesión cerrada', 'success');
        
        setTimeout(() => {
            location.reload();
        }, 500);
    }
}

function showAuthLoading(show) {
    const loading = document.getElementById('authLoading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function displayUserInfo(user) {
    const headerActions = document.querySelector('.header-actions');
    
    let userInfo = document.querySelector('.user-info');
    
    if (!userInfo) {
        userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        
        const avatar = document.createElement('div');
        avatar.className = 'user-avatar';
        avatar.textContent = user.username.charAt(0).toUpperCase();
        
        const username = document.createElement('span');
        username.textContent = user.username;
        
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-secondary logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.title = 'Cerrar sesión';
        logoutBtn.addEventListener('click', logout);
        
        userInfo.appendChild(avatar);
        userInfo.appendChild(username);
        userInfo.appendChild(logoutBtn);
        
        headerActions.insertBefore(userInfo, headerActions.firstChild);
    }
}

function setupAuthEventListeners() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            showAuthTab(this.dataset.authTab);
        });
    });
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

window.showAuthTab = showAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;