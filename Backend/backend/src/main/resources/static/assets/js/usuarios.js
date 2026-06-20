const usuariosBaseUrl = /*[[@{/admin/usuarios/}]]*/ '/admin/usuarios/';

function initUsuariosPage() {
    initLiveClock();
    lucide.createIcons();

    document.querySelectorAll('.btn-ver-usuario').forEach(btn => {
        btn.addEventListener('click', () => {
            const avatarUrl = btn.dataset.avatar;
            const img = document.getElementById('modal-detalhes-avatar');
            const placeholder = document.getElementById('modal-detalhes-avatar-placeholder');
            const inicial = document.getElementById('modal-detalhes-inicial');

            document.getElementById('modal-detalhes-nome').textContent = btn.dataset.nome;
            document.getElementById('modal-detalhes-email').textContent = btn.dataset.email;
            document.getElementById('modal-detalhes-perfil').textContent =
                btn.dataset.perfil === 'ADMIN' ? 'Admin' : 'Usuário';
            document.getElementById('modal-detalhes-status').textContent =
                btn.dataset.status === 'ATIVO' ? 'Ativo'
                    : btn.dataset.status === 'BLOQUEADO' ? 'Bloqueado' : 'Excluído';
            document.getElementById('modal-detalhes-pontos').textContent = btn.dataset.pontos + ' pts';
            document.getElementById('modal-detalhes-placares').textContent = btn.dataset.placares;
            document.getElementById('modal-detalhes-cadastro').textContent = btn.dataset.cadastro;
            document.getElementById('modal-detalhes').showModal();
        });
    });

    document.querySelectorAll('.btn-alterar-status').forEach(btn => {
        btn.addEventListener('click', () => {
            const acao = btn.dataset.acao;
            const nome = btn.dataset.nome;
            document.getElementById('modal-confirmacao-titulo').textContent =
                acao === 'bloquear' ? 'Bloquear usuário' : 'Desbloquear usuário';
            document.getElementById('modal-confirmacao-texto').textContent =
                acao === 'bloquear'
                    ? `Deseja bloquear ${nome}? Ele não poderá mais acessar o bolão.`
                    : `Deseja desbloquear ${nome}?`;
            document.getElementById('input-status').value = btn.dataset.status;
            document.getElementById('form-alterar-status').action =
                usuariosBaseUrl + btn.dataset.id + '/status';
            document.getElementById('btn-confirmar-acao').className =
                acao === 'bloquear' ? 'btn btn-warning' : 'btn btn-success';
            document.getElementById('modal-confirmacao').showModal();
        });
    });
}

document.addEventListener('DOMContentLoaded', initUsuariosPage);
