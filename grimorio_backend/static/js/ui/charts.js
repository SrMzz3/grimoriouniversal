/* js/ui/charts.js — Gráficos para o mestre */

const Charts = (() => {

  function renderRadar(characters, container) {
    if (typeof Chart === 'undefined') {
      container.innerHTML = '<p style="color:var(--ink-faint);">📊 Chart.js não carregado. Adicione o script.</p>';
      return;
    }

    const statKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const statLabels = {
      str: 'Força', dex: 'Destreza', con: 'Constituição',
      int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma'
    };

    const colors = [
      { bg: 'rgba(212, 184, 75, 0.2)', border: '#d4b84b' },
      { bg: 'rgba(0, 240, 255, 0.2)', border: '#00f0ff' },
      { bg: 'rgba(184, 154, 240, 0.2)', border: '#b89af0' },
      { bg: 'rgba(102, 232, 153, 0.2)', border: '#66e899' },
      { bg: 'rgba(248, 113, 113, 0.2)', border: '#f87171' },
    ];

    const datasets = characters.map((char, i) => {
      const color = colors[i % colors.length];
      const stats = char.stats || {};
      const data = statKeys.map(key => {
        const val = stats[key];
        if (char.sysId === 'op') {
          return Math.max(0, (val || 1) - 1);
        }
        return val || 10;
      });

      return {
        label: char.name,
        data: data,
        backgroundColor: color.bg,
        borderColor: color.border,
        pointBackgroundColor: color.border,
        pointBorderColor: '#fff',
        pointRadius: 4,
        borderWidth: 2,
      };
    });

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 350;
    container.appendChild(canvas);

    new Chart(canvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels: Object.values(statLabels),
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: '#f0e8d4', font: { size: 11 } }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 20,
            grid: { color: 'rgba(255,255,255,0.08)' },
            pointLabels: { color: '#c0b090', font: { size: 10 } },
            ticks: { color: '#8a7a6a', backdropColor: 'transparent', stepSize: 5 }
          }
        }
      }
    });
  }

  function renderStrengthBars(characters, container) {
    container.innerHTML = '';

    const statKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const statLabels = {
      str: 'Força', dex: 'Destreza', con: 'Constituição',
      int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma'
    };

    const colors = ['#d4b84b', '#00f0ff', '#b89af0', '#66e899', '#f87171'];

    const header = document.createElement('div');
    header.style.cssText = `
      font-family: 'Cinzel', serif;
      font-size: 13px;
      color: var(--gold);
      margin-bottom: 12px;
      text-align: center;
    `;
    header.textContent = '🏆 Pontos Fortes dos Personagens';
    container.appendChild(header);

    statKeys.forEach((statKey, idx) => {
      const block = document.createElement('div');
      block.style.cssText = `
        margin-bottom: 12px;
        padding: 8px 12px;
        background: var(--parch-3);
        border-radius: var(--r-md);
        border-left: 3px solid ${colors[idx % colors.length]};
      `;

      const title = document.createElement('div');
      title.style.cssText = `
        font-size: 12px;
        color: ${colors[idx % colors.length]};
        font-weight: 600;
        margin-bottom: 6px;
        font-family: 'Cinzel', serif;
        letter-spacing: 0.04em;
      `;
      title.textContent = statLabels[statKey];
      block.appendChild(title);

      const sorted = [...characters].sort((a, b) => {
        const valA = a.stats?.[statKey] || 10;
        const valB = b.stats?.[statKey] || 10;
        return valB - valA;
      });

      const maxVal = Math.max(...sorted.map(c => c.stats?.[statKey] || 10), 10);

      sorted.forEach(char => {
        const val = char.stats?.[statKey] || 10;
        const pct = Math.max(5, (val / maxVal) * 100);

        const row = document.createElement('div');
        row.style.cssText = `
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 2px 0;
        `;

        const name = document.createElement('span');
        name.style.cssText = `
          font-size: 11px;
          color: var(--ink-dim);
          min-width: 70px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `;
        name.textContent = char.name;
        row.appendChild(name);

        const barWrap = document.createElement('div');
        barWrap.style.cssText = `
          flex: 1;
          background: var(--parch-s);
          border-radius: 3px;
          height: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
        `;

        const barFill = document.createElement('div');
        barFill.style.cssText = `
          height: 100%;
          width: ${pct}%;
          background: ${colors[idx % colors.length]};
          border-radius: 3px;
          transition: width 0.6s ease;
          opacity: 0.8;
        `;
        barWrap.appendChild(barFill);
        row.appendChild(barWrap);

        const value = document.createElement('span');
        value.style.cssText = `
          font-size: 11px;
          color: var(--ink);
          min-width: 25px;
          text-align: right;
          font-weight: 600;
        `;
        value.textContent = val;
        row.appendChild(value);

        block.appendChild(row);
      });

      container.appendChild(block);
    });
  }

  function renderGameChart(characters, container) {
    container.innerHTML = '';

    const grupos = {};
    const sysInfo = {
      'dnd': { nome: 'D&D 5e', icon: '⚔️', cor: 'var(--gold)' },
      'op': { nome: 'Ordem Paranormal', icon: '🌙', cor: 'var(--op-cyan)' },
      'custom': { nome: 'Sistema Próprio', icon: '✍️', cor: 'var(--purple)' },
    };

    characters.forEach(char => {
      const sysId = char.sysId || 'custom';
      if (!grupos[sysId]) {
        grupos[sysId] = {
          sysId: sysId,
          ...(sysInfo[sysId] || { nome: sysId, icon: '🎲', cor: 'var(--ink-dim)' }),
          jogadores: [],
          total: 0
        };
      }
      grupos[sysId].jogadores.push(char);
      grupos[sysId].total++;
    });

    const gruposArray = Object.values(grupos);
    const maxTotal = Math.max(...gruposArray.map(g => g.total), 1);

    const title = document.createElement('div');
    title.style.cssText = `
      font-family: 'Cinzel', serif;
      font-size: 13px;
      color: var(--gold);
      margin-bottom: 12px;
      text-align: center;
    `;
    title.textContent = '🎲 Jogos Ativos na Mesa';
    container.appendChild(title);

    if (gruposArray.length === 0) {
      container.innerHTML += '<p style="color:var(--ink-faint);text-align:center;padding:20px;">Nenhum personagem compartilhado ainda.</p>';
      return container;
    }

    gruposArray.forEach(grupo => {
      const row = document.createElement('div');
      row.style.cssText = `
        margin-bottom: 10px;
      `;

      const header = document.createElement('div');
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        margin-bottom: 2px;
      `;
      header.innerHTML = `
        <span style="color: ${grupo.cor}; font-weight: 600;">
          ${grupo.icon} ${grupo.nome}
        </span>
        <span style="color: var(--ink-dim); font-size: 11px;">
          ${grupo.total} jogador${grupo.total > 1 ? 'es' : ''}
        </span>
      `;
      row.appendChild(header);

      const barWrap = document.createElement('div');
      barWrap.style.cssText = `
        background: var(--parch-3);
        border-radius: 4px;
        height: 16px;
        overflow: hidden;
        border: 1px solid var(--border);
      `;

      const pct = (grupo.total / maxTotal) * 100;
      const barFill = document.createElement('div');
      barFill.style.cssText = `
        height: 100%;
        width: ${pct}%;
        background: ${grupo.cor};
        border-radius: 4px;
        transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        opacity: 0.8;
      `;
      barWrap.appendChild(barFill);
      row.appendChild(barWrap);

      if (grupo.jogadores.length > 0) {
        const playerList = document.createElement('div');
        playerList.style.cssText = `
          font-size: 11px;
          color: var(--ink-faint);
          padding: 3px 4px 0 4px;
        `;
        playerList.textContent = '▸ ' + grupo.jogadores.map(p => 
          `${p.name}${p.cls ? ` (${p.cls})` : ''}`
        ).join(', ');
        row.appendChild(playerList);
      }

      container.appendChild(row);
    });

    const totalJogadores = gruposArray.reduce((acc, g) => acc + g.total, 0);
    const totalSistemas = gruposArray.length;

    const summary = document.createElement('div');
    summary.style.cssText = `
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--border);
      font-size: 11px;
      color: var(--ink-dim);
      text-align: center;
    `;
    summary.textContent = `📊 ${totalSistemas} sistema${totalSistemas > 1 ? 's' : ''} ativo${totalSistemas > 1 ? 's' : ''} · ${totalJogadores} jogador${totalJogadores > 1 ? 'es' : ''}`;
    container.appendChild(summary);

    return container;
  }

  return {
    renderRadar,
    renderStrengthBars,
    renderGameChart,
  };
})();

window.Charts = Charts;
console.log('✅ Charts carregado!');
