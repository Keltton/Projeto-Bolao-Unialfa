const selecoesBaseUrl = '/admin/selecoes/';

function abrirModalCadastro() {
    const form = document.getElementById('form-selecao');
    form.action = '/admin/selecoes';
    form.reset();
    document.getElementById('bandeiraUrlAtual').value = '';
    document.getElementById('modal-formulario-titulo').textContent = 'Cadastrar seleção';
    document.getElementById('btn-salvar-selecao').textContent = 'Salvar';
    document.getElementById('preview-bandeira-container').classList.add('hidden');
    document.getElementById('bandeira').required = false;
    document.getElementById('modal-formulario').showModal();
}

function abrirModalEdicao(btn) {
    const form = document.getElementById('form-selecao');
    form.action = selecoesBaseUrl + btn.dataset.id;
    document.getElementById('modal-formulario-titulo').textContent = 'Editar seleção';
    document.getElementById('btn-salvar-selecao').textContent = 'Atualizar';
    document.getElementById('nome').value = btn.dataset.nome || '';
    document.getElementById('codigoFifa').value = btn.dataset.codigo || '';
    document.getElementById('grupo').value = btn.dataset.grupo || '';
    document.getElementById('bandeira').value = '';
    document.getElementById('bandeiraUrlAtual').value = btn.dataset.bandeira || '';

    const previewContainer = document.getElementById('preview-bandeira-container');
    const preview = document.getElementById('preview-bandeira');
    if (btn.dataset.bandeira) {
        preview.src = btn.dataset.bandeira;
        previewContainer.classList.remove('hidden');
    } else {
        previewContainer.classList.add('hidden');
    }

    document.getElementById('bandeira').required = false;
    document.getElementById('modal-formulario').showModal();
}

function abrirModalDetalhes(btn) {
    const bandeiraUrl = btn.dataset.bandeira;
    const codigo = btn.dataset.codigo || '—';
    const img = document.getElementById('modal-detalhes-bandeira');
    const placeholder = document.getElementById('modal-detalhes-bandeira-placeholder');

    document.getElementById('modal-detalhes-nome').textContent = btn.dataset.nome || '—';
    document.getElementById('modal-detalhes-codigo-texto').textContent = codigo;
    document.getElementById('modal-detalhes-codigo').textContent = codigo;
    document.getElementById('modal-detalhes-grupo').textContent =
        btn.dataset.grupo && btn.dataset.grupo.trim() !== '' ? btn.dataset.grupo : '—';
    document.getElementById('modal-detalhes-cadastro').textContent = btn.dataset.cadastro || '—';
    document.getElementById('modal-detalhes-atualizado').textContent = btn.dataset.atualizado || '—';

    if (bandeiraUrl && bandeiraUrl.trim() !== '') {
        img.src = bandeiraUrl;
        img.classList.remove('hidden');
        placeholder.classList.add('hidden');
    } else {
        img.classList.add('hidden');
        placeholder.classList.remove('hidden');
    }

    document.getElementById('modal-detalhes').showModal();
}

function initSelecoesPage() {
    initLiveClock();
    lucide.createIcons();

    document.getElementById('bandeira')?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const preview = document.getElementById('preview-bandeira');
        const container = document.getElementById('preview-bandeira-container');

        preview.src = URL.createObjectURL(file);
        container.classList.remove('hidden');
    });

    document.getElementById('btn-nova-selecao')?.addEventListener('click', abrirModalCadastro);
    document.getElementById('btn-cancelar-formulario')?.addEventListener('click', () => {
        document.getElementById('modal-formulario').close();
    });
    document.getElementById('btn-cancelar-exclusao')?.addEventListener('click', () => {
        document.getElementById('modal-excluir').close();
    });

    document.querySelectorAll('.btn-ver-selecao').forEach(btn => {
        btn.addEventListener('click', () => abrirModalDetalhes(btn));
    });

    document.querySelectorAll('.btn-editar-selecao').forEach(btn => {
        btn.addEventListener('click', () => abrirModalEdicao(btn));
    });

    document.querySelectorAll('.btn-excluir-selecao').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('modal-excluir-texto').textContent =
                `Deseja excluir ${btn.dataset.nome}? Esta ação não pode ser desfeita.`;
            document.getElementById('form-excluir').action =
                selecoesBaseUrl + btn.dataset.id + '/excluir';
            document.getElementById('modal-excluir').showModal();
        });
    });

    if (document.getElementById('page-selecoes')?.dataset.erro) {
        document.getElementById('modal-formulario')?.showModal();
    }
}

document.addEventListener('DOMContentLoaded', initSelecoesPage);
