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
    lucide.createIcons();
    document.getElementById('btn-refresh')?.addEventListener('click', () => window.location.reload());
}

document.addEventListener('DOMContentLoaded', initAdminLayout);
