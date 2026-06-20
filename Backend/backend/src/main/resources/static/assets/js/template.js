function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container || !message) return;

    const alertClass = type === 'success' ? 'alert-success'
        : type === 'error' ? 'alert-error'
        : 'alert-info';

    const icon = type === 'success' ? 'check-circle'
        : type === 'error' ? 'alert-circle'
        : 'info';

    const toast = document.createElement('div');
    toast.className = `alert ${alertClass} shadow-lg min-w-72`;

    const iconEl = document.createElement('i');
    iconEl.setAttribute('data-lucide', icon);
    iconEl.className = 'w-5 h-5 shrink-0';

    const textEl = document.createElement('span');
    textEl.textContent = message;

    toast.appendChild(iconEl);
    toast.appendChild(textEl);
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}



function initFlashToasts() {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const { sucesso, erro } = container.dataset;
    if (sucesso) showToast(sucesso, 'success');
    if (erro) showToast(erro, 'error');
}

function updateMenuIcon() {
    const toggle = document.getElementById('sidebar-toggle');
    const icon = document.getElementById('menu-icon');
    if (!icon) return;
    icon.setAttribute('data-lucide', toggle.checked ? 'panel-left-close' : 'panel-left');
    lucide.createIcons();
}

function initLiveClock() {
    const el = document.getElementById('live-clock');
    if (!el) return;
    const tick = () => {
        el.textContent = new Date().toLocaleString('pt-BR', {
            weekday: 'short', day: '2-digit', month: 'short',
            hour: '2-digit', minute: '2-digit'
        });
    };
    tick();
    setInterval(tick, 60000);
}

function initSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    if (!toggle) return;

    const isDesktop = () => window.innerWidth >= 1024;

    toggle.addEventListener('change', () => {
        if (isDesktop()) {
            localStorage.setItem('sidebar-open', toggle.checked);
        }
        updateMenuIcon();
    });

    window.addEventListener('resize', () => {
        if (!isDesktop()) {
            toggle.checked = false;
        } else {
            const stored = localStorage.getItem('sidebar-open');
            toggle.checked = stored !== null ? stored === 'true' : true;
        }
        updateMenuIcon();
    });

    updateMenuIcon();
}

function initAdminLayout() {
    initSidebarToggle();
    initFlashToasts();
    initPerfilModal();
    lucide.createIcons();
    document.getElementById('btn-refresh')?.addEventListener('click', () => window.location.reload());
}

function atualizarPreviewAvatarPerfil(file) {
    const preview = document.getElementById('perfil-preview-avatar');
    const inicial = document.getElementById('perfil-preview-inicial');
    if (!preview || !inicial) return;

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.classList.remove('hidden');
        inicial.classList.add('hidden');
        return;
    }

    const avatarUrl = document.getElementById('perfil-avatar-url-atual')?.value;
    if (avatarUrl && avatarUrl.trim() !== '') {
        preview.src = avatarUrl;
        preview.classList.remove('hidden');
        inicial.classList.add('hidden');
    } else {
        preview.src = '';
        preview.classList.add('hidden');
        inicial.classList.remove('hidden');
    }
}

function abrirModalPerfil() {
    const page = document.getElementById('page-perfil');
    if (!page) return;

    document.getElementById('perfil-nome').value = page.dataset.nome || '';
    document.getElementById('perfil-email').value = page.dataset.email || '';
    document.getElementById('perfil-avatar-url-atual').value = page.dataset.avatar || '';
    document.getElementById('perfil-avatar').value = '';
    document.getElementById('perfil-senha-atual').value = '';
    document.getElementById('perfil-nova-senha').value = '';
    document.getElementById('perfil-confirmar-senha').value = '';
    atualizarPreviewAvatarPerfil(null);
    document.getElementById('modal-perfil')?.showModal();
    lucide.createIcons();
}

function validarFormularioPerfil(event) {
    const novaSenha = document.getElementById('perfil-nova-senha')?.value || '';
    const confirmarSenha = document.getElementById('perfil-confirmar-senha')?.value || '';
    const senhaAtual = document.getElementById('perfil-senha-atual')?.value || '';

    if (novaSenha || confirmarSenha || senhaAtual) {
        if (!senhaAtual) {
            event.preventDefault();
            alert('Informe a senha atual para alterar a senha.');
            return false;
        }
        if (novaSenha.length < 6) {
            event.preventDefault();
            alert('A nova senha deve ter no mínimo 6 caracteres.');
            return false;
        }
        if (novaSenha !== confirmarSenha) {
            event.preventDefault();
            alert('A confirmação da senha não confere.');
            return false;
        }
    }
    return true;
}

function initPerfilModal() {
    document.getElementById('btn-meu-perfil')?.addEventListener('click', abrirModalPerfil);
    document.getElementById('btn-cancelar-perfil')?.addEventListener('click', () => {
        document.getElementById('modal-perfil')?.close();
    });

    document.getElementById('form-perfil')?.addEventListener('submit', validarFormularioPerfil);

    document.getElementById('perfil-avatar')?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            atualizarPreviewAvatarPerfil(file);
        }
    });

    const page = document.getElementById('page-perfil');
    if (page?.dataset.abrirModal === 'true') {
        abrirModalPerfil();
    }
}

document.addEventListener('DOMContentLoaded', initAdminLayout);
