const partidasBaseUrl = '/admin/partidas/';

const FASE_LABELS = {
    GRUPOS: 'Grupos',
    OITAVAS: 'Oitavas de final',
    QUARTAS: 'Quartas de final',
    SEMIFINAL: 'Semifinal',
    TERCEIRO_LUGAR: 'Disputa 3º lugar',
    FINAL: 'Final'
};

const STATUS_LABELS = {
    AGENDADA: 'Agendada',
    EM_ANDAMENTO: 'Em andamento',
    ENCERRADA: 'Encerrada'
};

function exibirBandeira(imgId, codigoId, url, codigo) {
    const img = document.getElementById(imgId);
    const codigoEl = document.getElementById(codigoId);
    codigoEl.textContent = codigo || '—';

    if (url && url.trim() !== '') {
        img.src = url;
        img.classList.remove('hidden');
        codigoEl.classList.add('hidden');
    } else {
        img.src = '';
        img.classList.add('hidden');
        codigoEl.classList.remove('hidden');
    }
}

function abrirModalCadastro() {
    const form = document.getElementById('form-partida');
    form.action = '/admin/partidas';
    form.reset();
    document.getElementById('modal-formulario-titulo').textContent = 'Cadastrar partida';
    document.getElementById('btn-salvar-partida').textContent = 'Salvar';
    document.getElementById('modal-formulario').showModal();
}

function abrirModalEdicao(btn) {
    const form = document.getElementById('form-partida');
    form.action = partidasBaseUrl + btn.dataset.id;
    document.getElementById('modal-formulario-titulo').textContent = 'Editar partida';
    document.getElementById('btn-salvar-partida').textContent = 'Atualizar';
    document.getElementById('selecaoAId').value = btn.dataset.selecaoAId || '';
    document.getElementById('selecaoBId').value = btn.dataset.selecaoBId || '';
    document.getElementById('dataHora').value = btn.dataset.dataHora || '';
    document.getElementById('estadio').value = btn.dataset.estadio || '';
    document.getElementById('fase').value = btn.dataset.fase || 'GRUPOS';
    document.getElementById('grupo').value = btn.dataset.grupo || '';
    document.getElementById('status').value = btn.dataset.status || '';
    document.getElementById('modal-formulario').showModal();
}

function abrirModalDetalhes(btn) {
    document.getElementById('modal-detalhes-selecao-a').textContent = btn.dataset.selecaoA || '—';
    document.getElementById('modal-detalhes-selecao-b').textContent = btn.dataset.selecaoB || '—';
    document.getElementById('modal-detalhes-data-hora').textContent = btn.dataset.dataHora || '—';
    document.getElementById('modal-detalhes-estadio').textContent =
        btn.dataset.estadio && btn.dataset.estadio.trim() !== '' ? btn.dataset.estadio : '—';
    document.getElementById('modal-detalhes-fase').textContent = FASE_LABELS[btn.dataset.fase] || '—';
    document.getElementById('modal-detalhes-grupo').textContent =
        btn.dataset.grupo && btn.dataset.grupo.trim() !== '' ? btn.dataset.grupo : '—';
    document.getElementById('modal-detalhes-status').textContent = STATUS_LABELS[btn.dataset.status] || '—';
    document.getElementById('modal-detalhes-cadastro').textContent = btn.dataset.cadastro || '—';
    document.getElementById('modal-detalhes-atualizado').textContent = btn.dataset.atualizado || '—';

    const golsA = btn.dataset.golsA;
    const golsB = btn.dataset.golsB;
    document.getElementById('modal-detalhes-placar').textContent =
        golsA !== undefined && golsB !== undefined && golsA !== '' && golsB !== ''
            ? `${golsA} × ${golsB}` : '—';

    exibirBandeira(
        'modal-detalhes-bandeira-a', 'modal-detalhes-codigo-a',
        btn.dataset.bandeiraA, btn.dataset.codigoA
    );
    exibirBandeira(
        'modal-detalhes-bandeira-b', 'modal-detalhes-codigo-b',
        btn.dataset.bandeiraB, btn.dataset.codigoB
    );

    document.getElementById('modal-detalhes').showModal();
}

function atualizarPreviewPlacar() {
    const golsA = document.getElementById('golsSelecaoA').value || 0;
    const golsB = document.getElementById('golsSelecaoB').value || 0;
    document.getElementById('modal-resultado-placar-preview').textContent = `${golsA} × ${golsB}`;
}

function ajustarGols(targetId, action) {
    const input = document.getElementById(targetId);
    const valorAtual = parseInt(input.value, 10) || 0;
    const max = parseInt(input.max, 10) || 99;

    if (action === 'increment') {
        input.value = Math.min(valorAtual + 1, max);
    } else {
        input.value = Math.max(valorAtual - 1, 0);
    }

    atualizarPreviewPlacar();
}

function abrirModalResultado(btn) {
    document.getElementById('modal-resultado-selecao-a').textContent = btn.dataset.selecaoA || '—';
    document.getElementById('modal-resultado-selecao-b').textContent = btn.dataset.selecaoB || '—';
    document.getElementById('modal-resultado-data-hora').textContent = btn.dataset.dataHora || '';
    document.getElementById('golsSelecaoA').value = btn.dataset.golsA ?? 0;
    document.getElementById('golsSelecaoB').value = btn.dataset.golsB ?? 0;

    exibirBandeira(
        'modal-resultado-bandeira-a', 'modal-resultado-codigo-a',
        btn.dataset.bandeiraA, btn.dataset.codigoA
    );
    exibirBandeira(
        'modal-resultado-bandeira-b', 'modal-resultado-codigo-b',
        btn.dataset.bandeiraB, btn.dataset.codigoB
    );

    atualizarPreviewPlacar();
    document.getElementById('form-resultado').action = partidasBaseUrl + btn.dataset.id + '/resultado';
    document.getElementById('modal-resultado').showModal();
    lucide.createIcons();
}

function validarFormularioPartida(event) {
    const selecaoA = document.getElementById('selecaoAId').value;
    const selecaoB = document.getElementById('selecaoBId').value;

    if (selecaoA && selecaoB && selecaoA === selecaoB) {
        event.preventDefault();
        alert('Selecione duas seleções diferentes.');
        return false;
    }
    return true;
}

function initPartidasPage() {
    initLiveClock();
    lucide.createIcons();

    document.getElementById('form-partida')?.addEventListener('submit', validarFormularioPartida);

    document.getElementById('btn-nova-partida')?.addEventListener('click', abrirModalCadastro);
    document.getElementById('btn-cancelar-formulario')?.addEventListener('click', () => {
        document.getElementById('modal-formulario').close();
    });
    document.getElementById('btn-cancelar-resultado')?.addEventListener('click', () => {
        document.getElementById('modal-resultado').close();
    });

    document.getElementById('golsSelecaoA')?.addEventListener('input', atualizarPreviewPlacar);
    document.getElementById('golsSelecaoB')?.addEventListener('input', atualizarPreviewPlacar);

    document.querySelectorAll('[data-target][data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            ajustarGols(btn.dataset.target, btn.dataset.action);
        });
    });
    document.getElementById('btn-cancelar-exclusao')?.addEventListener('click', () => {
        document.getElementById('modal-excluir').close();
    });

    document.querySelectorAll('.btn-ver-partida').forEach(btn => {
        btn.addEventListener('click', () => abrirModalDetalhes(btn));
    });

    document.querySelectorAll('.btn-editar-partida').forEach(btn => {
        btn.addEventListener('click', () => abrirModalEdicao(btn));
    });

    document.querySelectorAll('.btn-resultado-partida').forEach(btn => {
        btn.addEventListener('click', () => abrirModalResultado(btn));
    });

    document.querySelectorAll('.btn-excluir-partida').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('modal-excluir-texto').textContent =
                `Deseja excluir ${btn.dataset.selecaoA} × ${btn.dataset.selecaoB}? Esta ação não pode ser desfeita.`;
            document.getElementById('form-excluir').action =
                partidasBaseUrl + btn.dataset.id + '/excluir';
            document.getElementById('modal-excluir').showModal();
        });
    });

    if (document.getElementById('page-partidas')?.dataset.erro) {
        document.getElementById('modal-formulario')?.showModal();
    }
}

document.addEventListener('DOMContentLoaded', initPartidasPage);

