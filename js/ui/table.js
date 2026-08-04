/* js/ui/table.js — Sistema de Mesas com Controle de Acesso */

const TableSystem = (() => {

  const CONFIG = {
    SERVER_URL: 'https://grimorio-couchdb.ibm.com/',
  };

  // ── Criar Mesa (com Mestre) ──
  function createTable(name) {
    return new Promise((resolve, reject) => {
      const tableId = 'mesa_' + crypto.randomUUID().slice(0, 8);
      const remoteUrl = CONFIG.SERVER_URL + tableId;
      const user = StorageAdapter.getCurrentUser();
      
      if (!user) {
        reject('Nenhum usuário logado');
        return;
      }

      const table = {
        _id: 'table_' + tableId,
        id: tableId,
        name: name || 'Mesa de Aventura',
        remoteUrl: remoteUrl,
        masterId: user.id,  // ← QUEM CRIOU É O MESTRE
        masterUsername: user.username,
        members: [{
          id: user.id,
          username: user.username,
          role: 'master',  // ← ROLE
          joinedAt: new Date().toISOString()
        }],
        characters: [],
        rolls: [],
        messages: [],
        createdAt: new Date().toISOString(),
        type: 'table'
      };

      StorageAdapter.save(table)
        .then(() => {
          const inviteLink = window.location.origin + '?table=' + tableId;
          alert('✅ Mesa criada!\nLink: ' + inviteLink);
          resolve(table);
        })
        .catch(reject);
    });
  }

  // ── Entrar em Mesa ──
  function joinTable(tableId) {
    return new Promise((resolve, reject) => {
      const user = StorageAdapter.getCurrentUser();
      if (!user) {
        reject('Nenhum usuário logado');
        return;
      }

      // Busca a mesa
      StorageAdapter.get('table_' + tableId)
        .then(table => {
          // Verifica se já está na mesa
          if (table.members.some(m => m.id === user.id)) {
            resolve(table);
            return;
          }

          // Adiciona como jogador
          table.members.push({
            id: user.id,
            username: user.username,
            role: 'player',  // ← TODOS QUE ENTRAM SÃO JOGADORES
            joinedAt: new Date().toISOString()
          });

          return StorageAdapter.save(table);
        })
        .then(() => {
          // Adiciona no usuário
          user.tables = user.tables || [];
          if (!user.tables.some(t => t.id === tableId)) {
            user.tables.push({ id: tableId, role: 'player' });
            StorageAdapter.updateUser(user);
          }
          
          alert('✅ Entrou na mesa como JOGADOR!');
          resolve({ id: tableId });
        })
        .catch(reject);
    });
  }

  // ── Verificar se usuário é mestre ──
  function isMaster(tableId, userId) {
    return StorageAdapter.get('table_' + tableId)
      .then(table => {
        const member = table.members.find(m => m.id === userId);
        return member && member.role === 'master';
      })
      .catch(() => false);
  }

  // ── Verificar papel do usuário na mesa ──
  function getUserRole(tableId, userId) {
    return StorageAdapter.get('table_' + tableId)
      .then(table => {
        const member = table.members.find(m => m.id === userId);
        return member ? member.role : null;
      })
      .catch(() => null);
  }

  // ── Compartilhar Personagem na Mesa ──
  function shareCharacter(char, tableId, options = {}) {
    return new Promise((resolve, reject) => {
      const user = StorageAdapter.getCurrentUser();
      if (!user) {
        reject('Nenhum usuário logado');
        return;
      }

      const data = char.toJSON ? char.toJSON() : char;

      const doc = {
        _id: 'char_' + data.id,
        id: data.id,
        name: data.name,
        sysId: data.sysId,
        userId: user.id,
        username: user.username,
        // Dados públicos (sempre visíveis)
        publicData: {
          name: data.name,
          sysId: data.sysId,
          username: user.username,
          avatar: user.avatar || '',
          level: data.level || 1,
          cls: data.cls || '',
          race: data.race || '',
          hpMax: data.hpMax ?? 0,
          hpCur: data.hpCur ?? 0,
        },
        // Dados privados (só mestre e dono veem)
        privateData: {
          stats: data.stats || {},
          abilities: data.abilities || [],
          equip: data.equip || [],
          notes: data.notes || '',
          skillTrainingLevel: data.skillTrainingLevel || {},
          skillExtraBonuses: data.skillExtraBonuses || {},
          // D&D
          level: data.level || 1,
          cls: data.cls || '',
          clsId: data.clsId || '',
          race: data.race || '',
          raceId: data.raceId || '',
          subrace: data.subrace || null,
          subraceId: data.subraceId || null,
          subclass: data.subclass || null,
          subclassId: data.subclassId || null,
          slots: data.slots || {},
          skillProfs: data.skillProfs || {},
          skillExpertise: data.skillExpertise || {},
          // OP
          age: data.age || '',
          origin: data.origin || '',
          originId: data.originId || '',
          peCur: data.peCur ?? 0,
          peMax: data.peMax ?? 0,
          sanCur: data.sanCur ?? 0,
          sanMax: data.sanMax ?? 0,
          nexLevel: data.nexLevel ?? 0,
          nexPercent: data.nexPercent ?? 0,
          trilhas: data.trilhas || {},
          // Custom
          customSysName: data.customSysName || 'Sistema Próprio',
          customStatKeys: data.customStatKeys || [],
          customStatLabels: data.customStatLabels || {},
          customSkills: data.customSkills || [],
          customDiceSet: data.customDiceSet || [],
          customTheme: data.customTheme || 'arcano',
          customResources: data.customResources || [],
        },
        sharedAt: new Date().toISOString(),
        type: 'shared_character',
        tableId: tableId,
        // Controle de visibilidade
        visibility: {
          // Quem pode ver a ficha completa (além do dono)
          canViewFull: [user.id],  // começa só com o dono
        }
      };

      // Salva no banco da mesa
      const remoteUrl = CONFIG.SERVER_URL + tableId;
      const tableDb = new PouchDB(remoteUrl);

      tableDb.put(doc)
        .then(() => {
          alert('✅ Personagem compartilhado na mesa!');
          resolve(doc);
        })
        .catch(reject);
    });
  }

  // ── Dar permissão de visualização para outro usuário ──
  function grantViewPermission(tableId, charId, userId) {
    return new Promise((resolve, reject) => {
      const remoteUrl = CONFIG.SERVER_URL + tableId;
      const tableDb = new PouchDB(remoteUrl);

      tableDb.get('char_' + charId)
        .then(doc => {
          if (!doc.visibility.canViewFull.includes(userId)) {
            doc.visibility.canViewFull.push(userId);
          }
          return tableDb.put(doc);
        })
        .then(resolve)
        .catch(reject);
    });
  }

  // ── Buscar Personagens da Mesa (com controle de acesso) ──
  function getTableCharacters(tableId, userId) {
    return new Promise((resolve, reject) => {
      const remoteUrl = CONFIG.SERVER_URL + tableId;
      const tableDb = new PouchDB(remoteUrl);

      // Primeiro, verifica o papel do usuário
      getUserRole(tableId, userId)
        .then(role => {
          const isMaster = role === 'master';

          return tableDb.allDocs({ include_docs: true })
            .then(result => {
              const chars = result.rows
                .map(row => row.doc)
                .filter(doc => doc.type === 'shared_character');

              // Processa cada personagem
              const processed = chars.map(char => {
                const isOwner = char.userId === userId;
                const hasFullAccess = isMaster || isOwner || char.visibility.canViewFull.includes(userId);

                // Dados públicos (todo mundo vê)
                const publicData = {
                  id: char.id,
                  name: char.publicData?.name || char.name,
                  sysId: char.publicData?.sysId || char.sysId,
                  username: char.publicData?.username || char.username,
                  avatar: char.publicData?.avatar || '',
                  level: char.publicData?.level || 1,
                  cls: char.publicData?.cls || '',
                  race: char.publicData?.race || '',
                  hpMax: char.publicData?.hpMax || 0,
                  hpCur: char.publicData?.hpCur || 0,
                };

                // Se tiver acesso completo, inclui dados privados
                if (hasFullAccess) {
                  return {
                    ...publicData,
                    ...char.privateData,
                    canViewFull: true,
                    isOwner: isOwner,
                    isMaster: isMaster
                  };
                }

                // Se não tiver acesso, só dados públicos
                return {
                  ...publicData,
                  canViewFull: false,
                  isOwner: false,
                  isMaster: false
                };
              });

              resolve(processed);
            });
        })
        .catch(reject);
    });
  }

  // ── Buscar só dados públicos (para lista da mesa) ──
  function getTableCharactersPublic(tableId) {
    return new Promise((resolve, reject) => {
      const remoteUrl = CONFIG.SERVER_URL + tableId;
      const tableDb = new PouchDB(remoteUrl);

      tableDb.allDocs({ include_docs: true })
        .then(result => {
          const chars = result.rows
            .map(row => row.doc)
            .filter(doc => doc.type === 'shared_character')
            .map(char => ({
              id: char.id,
              name: char.publicData?.name || char.name,
              username: char.publicData?.username || char.username,
              avatar: char.publicData?.avatar || '',
              level: char.publicData?.level || 1,
              cls: char.publicData?.cls || '',
              race: char.publicData?.race || '',
              hpMax: char.publicData?.hpMax || 0,
              hpCur: char.publicData?.hpCur || 0,
              sysId: char.publicData?.sysId || char.sysId,
              userId: char.userId,
            }));
          resolve(chars);
        })
        .catch(reject);
    });
  }

  // ── Buscar Personagem Individual (com permissão) ──
  function getCharacterWithPermission(tableId, charId, userId) {
    return new Promise((resolve, reject) => {
      const remoteUrl = CONFIG.SERVER_URL + tableId;
      const tableDb = new PouchDB(remoteUrl);

      Promise.all([
        tableDb.get('char_' + charId),
        getUserRole(tableId, userId)
      ])
      .then(([char, role]) => {
        const isMaster = role === 'master';
        const isOwner = char.userId === userId;
        const hasPermission = char.visibility.canViewFull.includes(userId);

        if (isMaster || isOwner || hasPermission) {
          resolve(char);
        } else {
          // Retorna só dados públicos
          resolve({
            id: char.id,
            name: char.publicData?.name || char.name,
            username: char.publicData?.username || char.username,
            avatar: char.publicData?.avatar || '',
            level: char.publicData?.level || 1,
            cls: char.publicData?.cls || '',
            race: char.publicData?.race || '',
            hpMax: char.publicData?.hpMax || 0,
            hpCur: char.publicData?.hpCur || 0,
            sysId: char.publicData?.sysId || char.sysId,
            canViewFull: false
          });
        }
      })
      .catch(reject);
    });
  }

  // ── Promover jogador a mestre ──
  function promoteToMaster(tableId, userId) {
    return StorageAdapter.get('table_' + tableId)
      .then(table => {
        const member = table.members.find(m => m.id === userId);
        if (member) {
          member.role = 'master';
          return StorageAdapter.save(table);
        }
        throw new Error('Usuário não está na mesa');
      });
  }

  // ── Remover jogador da mesa ──
  function removeFromTable(tableId, userId) {
    return StorageAdapter.get('table_' + tableId)
      .then(table => {
        // Não pode remover o mestre
        const master = table.members.find(m => m.role === 'master');
        if (master && master.id === userId) {
          throw new Error('Não é possível remover o mestre da mesa');
        }
        table.members = table.members.filter(m => m.id !== userId);
        return StorageAdapter.save(table);
      });
  }

  // ── API Pública ──
  return {
    createTable,
    joinTable,
    isMaster,
    getUserRole,
    shareCharacter,
    grantViewPermission,
    getTableCharacters,
    getTableCharactersPublic,
    getCharacterWithPermission,
    promoteToMaster,
    removeFromTable,
    CONFIG
  };

})();

window.TableSystem = TableSystem;