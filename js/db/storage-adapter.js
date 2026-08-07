/* js/db/storage-adapter.js — Usa o PouchInit real (js/db/pouch-init.js) */

// ================================================================
// VERIFICAÇÃO DO POUCHINIT
// ================================================================

// Garante que o PouchInit real foi carregado de js/db/pouch-init.js
if (typeof window.PouchInit === 'undefined') {
  console.error('❌ PouchInit não encontrado! Verifique se js/db/pouch-init.js foi carregado antes de storage-adapter.js');
}

// ================================================================
// STORAGE ADAPTER
// ================================================================

const StorageAdapter = (() => {
  let currentUser = null;
  let initialized = false;

  function init() {
    if (initialized) return Promise.resolve();
    
    // Garante que o PouchInit existe
    if (typeof PouchInit === 'undefined') {
      console.error('❌ PouchInit não definido!');
      return Promise.reject(new Error('PouchInit não inicializado'));
    }

    PouchInit.init('grimorio_db');
    initialized = true;
    
    return migrateFromLocalStorage().catch(function(err) {
      console.warn('⚠️ Migração:', err);
    });
  }

  function migrateFromLocalStorage() {
    return new Promise(function(resolve) {
      try {
        var usersJson = localStorage.getItem('grimorio_users');
        if (usersJson) {
          var users = JSON.parse(usersJson);
          users.forEach(function(user) {
            var doc = {
              _id: 'user_' + user.id,
              id: user.id,
              username: user.username,
              password: user.password,
              displayName: user.displayName || user.username,
              avatar: user.avatar || '',
              frame: user.frame || 'none',
              background: user.background || '',
              bgBrightness: user.bgBrightness || 25,
              bio: user.bio || '',
              recoveryKeyword: user.recoveryKeyword || '',
              characters: user.characters || [],
              systems: user.systems || [],
              type: 'user',
              createdAt: user.createdAt || new Date().toISOString()
            };
            PouchInit.save(doc);
          });
          console.log('✅ [Migration] Usuários migrados');
        }

        var sessionJson = localStorage.getItem('grimorio_session');
        if (sessionJson) {
          var session = JSON.parse(sessionJson);
          var doc = {
            _id: 'session_' + session.id,
            userId: session.id,
            username: session.username,
            type: 'session',
            createdAt: new Date().toISOString()
          };
          PouchInit.save(doc);
          console.log('✅ [Migration] Sessão migrada');
        }

        var charJson = localStorage.getItem('rpg_grimorio_v2');
        if (charJson) {
          var char = JSON.parse(charJson);
          var doc = {
            _id: 'char_' + (char.id || crypto.randomUUID()),
            id: char.id || crypto.randomUUID(),
            ...char,
            type: 'character',
            userId: currentUser ? currentUser.id : 'unknown'
          };
          PouchInit.save(doc);
          console.log('✅ [Migration] Personagem migrado');
        }

        resolve();
      } catch (e) {
        console.warn('⚠️ [Migration] Erro:', e);
        resolve();
      }
    });
  }

  // ================================================================
  // USUÁRIOS
  // ================================================================

  function getCurrentUser() { return currentUser; }

  // Espelha o usuário (do PouchDB) no localStorage 'grimorio_users', pois
  // o profile.js e o select.js leem de lá (via GrimorioStorage).
  function syncUserToLocalStorage(user) {
    if (!user) return;
    try {
      var users = JSON.parse(localStorage.getItem('grimorio_users') || '[]');
      var idx = users.findIndex(function(u) { return u.id === user.id; });
      var plain = Object.assign({}, user);
      delete plain._id;
      delete plain._rev;
      if (idx >= 0) {
        users[idx] = plain;
      } else {
        users.push(plain);
      }
      localStorage.setItem('grimorio_users', JSON.stringify(users));
    } catch (e) {
      console.warn('⚠️ [syncUserToLocalStorage] Erro:', e);
    }
  }

  function setCurrentUser(user) {
    currentUser = user;
    if (user) {
      var doc = {
        _id: 'session_' + user.id,
        userId: user.id,
        username: user.username,
        type: 'session',
        updatedAt: new Date().toISOString()
      };
      PouchInit.save(doc);
      syncUserToLocalStorage(user);
      localStorage.setItem('grimorio_session', JSON.stringify({ id: user.id, username: user.username }));
    } else {
      localStorage.removeItem('grimorio_session');
    }
  }

  function loadSession() {
    var sessionJson = localStorage.getItem('grimorio_session');
    if (!sessionJson) return null;
    try { return JSON.parse(sessionJson); }
    catch { return null; }
  }

  function loadUserFromSession() {
    var session = loadSession();
    if (!session) return Promise.resolve(null);
    return PouchInit.get('user_' + session.id)
      .then(function(doc) {
        currentUser = doc;
        syncUserToLocalStorage(doc);
        return doc;
      })
      .catch(function() { return null; });
  }

  function registerUser(username, password) {
    return PouchInit.query('users/by_username', { key: username })
      .then(function(result) {
        if (result.rows.length > 0) throw new Error('Usuário já existe');
        var user = {
          _id: 'user_' + crypto.randomUUID(),
          id: crypto.randomUUID(),
          username: username,
          password: password,
          displayName: username,
          avatar: '',
          frame: 'none',
          background: '',
          bgBrightness: 25,
          bio: '',
          recoveryKeyword: '',
          characters: [],
          systems: [],
          type: 'user',
          createdAt: new Date().toISOString()
        };
        return PouchInit.save(user);
      })
      .then(function(result) { return PouchInit.get(result._id); });
  }

  function loginUser(username, password) {
    return PouchInit.query('users/by_username', { key: username })
      .then(function(result) {
        if (result.rows.length === 0) throw new Error('Usuário não encontrado');
        var user = result.rows[0].doc;
        if (user.password !== password) throw new Error('Senha incorreta');
        currentUser = user;
        setCurrentUser(user);
        return user;
      });
  }

  function recoverAccount(username, keyword, newPassword) {
    return PouchInit.query('users/by_username', { key: username })
      .then(function(result) {
        if (result.rows.length === 0) throw new Error('Usuário não encontrado');
        var user = result.rows[0].doc;
        if (user.recoveryKeyword !== keyword) throw new Error('Palavra-chave incorreta');
        user.password = newPassword;
        return PouchInit.save(user);
      })
      .then(function() { return { message: 'Senha alterada com sucesso' }; });
  }

function updateUser(userData) {
    return PouchInit.get('user_' + userData.id)
      .then(function(doc) { 
        Object.assign(doc, userData); 
        return PouchInit.save(doc); 
      })
      .then(function(result) { 
        currentUser = result; 
        syncUserToLocalStorage(result);
        return result; 
      });
  }

  function deleteUser(userId) {
    return PouchInit.remove('user_' + userId)
      .then(function() {
        return PouchInit.query('characters/by_userId', { key: userId, include_docs: true });
      })
      .then(function(result) {
        var promises = result.rows.map(function(row) { return PouchInit.remove(row.doc._id); });
        return Promise.all(promises);
      })
      .then(function() {
        currentUser = null;
        localStorage.removeItem('grimorio_session');
        // Remove também do localStorage 'grimorio_users'
        try {
          var users = JSON.parse(localStorage.getItem('grimorio_users') || '[]');
          users = users.filter(function(u) { return u.id !== userId; });
          localStorage.setItem('grimorio_users', JSON.stringify(users));
        } catch (e) {}
        return { message: 'Usuário excluído' };
      });
  }

// ================================================================
  // DOCUMENTOS GENÉRICOS (para mesas e outros tipos)
  // ================================================================

  function save(doc) {
    if (!PouchInit) return Promise.reject('PouchInit não inicializado');
    return PouchInit.save(doc);
  }

  function get(id) {
    if (!PouchInit) return Promise.reject('PouchInit não inicializado');
    return PouchInit.get(id);
  }

  function remove(id) {
    if (!PouchInit) return Promise.reject('PouchInit não inicializado');
    return PouchInit.remove(id);
  }

  // ================================================================
  // PERSONAGENS
  // ================================================================

  function getCharacters() {
    if (!currentUser) return Promise.resolve([]);
    return PouchInit.query('characters/by_userId', { key: currentUser.id, include_docs: true })
      .then(function(result) { return result.rows.map(function(row) { return row.doc; }); })
      .catch(function() { return []; });
  }

  function getCharacter(charId) {
    return PouchInit.get('char_' + charId);
  }

  function saveCharacter(charData) {
    if (!currentUser) return Promise.reject('Nenhum usuário logado');
    
    var doc = {
      _id: charData._id || (charData.id ? 'char_' + charData.id : 'char_' + crypto.randomUUID()),
      id: charData.id || crypto.randomUUID(),
      userId: currentUser.id,
      type: 'character',
      sysId: charData.sysId || 'custom',
      name: charData.name || 'Sem nome',
      stats: charData.stats || {},
      hpCur: charData.hpCur ?? 0,
      hpMax: charData.hpMax ?? 0,
      abilities: charData.abilities || [],
      equip: charData.equip || [],
      notes: charData.notes || '',
      skillTrainingLevel: charData.skillTrainingLevel || {},
      skillExtraBonuses: charData.skillExtraBonuses || {},
      createdAt: charData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      level: charData.level || 1,
      cls: charData.cls || '',
      clsId: charData.clsId || '',
      race: charData.race || '',
      raceId: charData.raceId || '',
      subrace: charData.subrace || null,
      subraceId: charData.subraceId || null,
      subclass: charData.subclass || null,
      subclassId: charData.subclassId || null,
      slots: charData.slots || {},
      skillProfs: charData.skillProfs || {},
      skillExpertise: charData.skillExpertise || {},
      age: charData.age || '',
      origin: charData.origin || '',
      originId: charData.originId || '',
      peCur: charData.peCur ?? 0,
      peMax: charData.peMax ?? 0,
      sanCur: charData.sanCur ?? 0,
      sanMax: charData.sanMax ?? 0,
      nexLevel: charData.nexLevel ?? 0,
      nexPercent: charData.nexPercent ?? 0,
      trilhas: charData.trilhas || { Sobrevivência: 0, Habilidades: 0, Poderes: 0, Rituais: 0 },
      customSysName: charData.customSysName || 'Sistema Próprio',
      customStatKeys: charData.customStatKeys || [],
      customStatLabels: charData.customStatLabels || {},
      customSkills: charData.customSkills || [],
      customDiceSet: charData.customDiceSet || ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'],
      customTheme: charData.customTheme || 'arcano',
      customResources: charData.customResources || []
    };
    
    return PouchInit.save(doc)
      .then(function() {
        return PouchInit.get('user_' + currentUser.id);
      })
      .then(function(user) {
        if (!user.characters) user.characters = [];
        if (!user.characters.some(function(c) { return c.id === doc.id; })) {
          user.characters.push({ id: doc.id, name: doc.name, sysId: doc.sysId });
          return PouchInit.save(user);
        }
        return user;
      })
      .then(function() { return doc; });
  }

  function deleteCharacter(charId) {
    if (!currentUser) return Promise.reject('Nenhum usuário logado');
    return PouchInit.remove('char_' + charId)
      .then(function() {
        return PouchInit.get('user_' + currentUser.id);
      })
      .then(function(user) {
        if (user.characters) {
          user.characters = user.characters.filter(function(c) { return c.id !== charId; });
          return PouchInit.save(user);
        }
        return user;
      });
  }

  // ================================================================
  // SISTEMAS
  // ================================================================

  function getSystems() {
    if (!currentUser) return Promise.resolve([]);
    return PouchInit.get('user_' + currentUser.id)
      .then(function(user) { return user.systems || []; })
      .catch(function() { return []; });
  }

  function saveSystem(sysData) {
    if (!currentUser) return Promise.reject('Nenhum usuário logado');
    return PouchInit.get('user_' + currentUser.id)
      .then(function(user) {
        if (!user.systems) user.systems = [];
        if (!user.systems.some(function(s) { return s.id === sysData.id; })) {
          user.systems.push(sysData);
          return PouchInit.save(user);
        }
        return user;
      })
      .then(function() { return sysData; });
  }

  function deleteSystem(sysId) {
    if (!currentUser) return Promise.reject('Nenhum usuário logado');
    return PouchInit.get('user_' + currentUser.id)
      .then(function(user) {
        if (user.systems) {
          user.systems = user.systems.filter(function(s) { return s.id !== sysId; });
          return PouchInit.save(user);
        }
        return user;
      });
  }

  // ================================================================
  // SINCRONIZAÇÃO E BACKUP
  // ================================================================

  function syncWithServer(remoteUrl, options) {
    return PouchInit.sync(remoteUrl, options || {});
  }

  function stopSync() { PouchInit.stopSync(); }
  function getSyncStatus() { return PouchInit.getSyncStatus(); }
  function backup() { return PouchInit.backup(); }
  function restore(jsonData) { return PouchInit.restore(jsonData); }

  // ================================================================
  // API PÚBLICA
  // ================================================================

  return {
    init: init,
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    loadSession: loadSession,
    loadUserFromSession: loadUserFromSession,
    registerUser: registerUser,
    loginUser: loginUser,
    recoverAccount: recoverAccount,
    updateUser: updateUser,
deleteUser: deleteUser,
    save: save,
    get: get,
    remove: remove,
    getCharacters: getCharacters,
    getCharacter: getCharacter,
    saveCharacter: saveCharacter,
    deleteCharacter: deleteCharacter,
    getSystems: getSystems,
    saveSystem: saveSystem,
    deleteSystem: deleteSystem,
    syncWithServer: syncWithServer,
    stopSync: stopSync,
    getSyncStatus: getSyncStatus,
    backup: backup,
    restore: restore
  };
})();

// Exporta globalmente
window.StorageAdapter = StorageAdapter;
console.log('✅ StorageAdapter carregado!');
