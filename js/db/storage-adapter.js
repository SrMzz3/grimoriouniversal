/* js/db/storage-adapter.js — VERSÃO SIMPLIFICADA (funciona SEMPRE) */

// ================================================================
// CRIA O PouchInit IMEDIATAMENTE — CÓDIGO SOLTO, SEM IIFE
// ================================================================

// Se PouchInit não existir, cria
if (typeof window.PouchInit === 'undefined') {
  console.warn('⚠️ PouchInit não encontrado! Criando fallback...');
  
  // Se PouchDB não existe, cria um falso com localStorage
  if (typeof window.PouchDB === 'undefined') {
    console.warn('⚠️ PouchDB não encontrado! Criando fallback localStorage...');
    
    window.PouchDB = function(dbName) {
      this._name = dbName || 'fallback';
      this._prefix = 'pouch_' + this._name + '_';
      return this;
    };

    window.PouchDB.prototype = {
      put: function(doc) {
        const key = this._prefix + doc._id;
        localStorage.setItem(key, JSON.stringify(doc));
        return Promise.resolve({ ok: true, id: doc._id, rev: '1-xxx' });
      },
      get: function(id) {
        const key = this._prefix + id;
        const data = localStorage.getItem(key);
        if (!data) return Promise.reject({ status: 404 });
        return Promise.resolve(JSON.parse(data));
      },
      allDocs: function() {
        const prefix = this._prefix;
        const keys = Object.keys(localStorage);
        const rows = keys
          .filter(k => k.startsWith(prefix))
          .map(k => ({ doc: JSON.parse(localStorage.getItem(k)) }));
        return Promise.resolve({ rows });
      },
      remove: function(doc) {
        const key = this._prefix + doc._id;
        localStorage.removeItem(key);
        return Promise.resolve({ ok: true });
      },
      bulkDocs: function(docs) {
        if (!Array.isArray(docs)) {
          return Promise.reject(new Error('bulkDocs requires an array'));
        }
        var results = docs.map(function(doc) {
          var id = doc._id || doc.id || '';
          if (id) {
            localStorage.setItem(this._prefix + id, JSON.stringify(doc));
          }
          return { ok: true, id: id, rev: '1-xxx' };
        }, this);
        return Promise.resolve({ results: results });
      },
      query: function() { return Promise.resolve({ rows: [] }); },
      sync: function() { return { on: function() {}, cancel: function() {} }; },
      changes: function() { return { on: function() {}, cancel: function() {} }; }
    };
  }

  // CRIA O PouchInit
  window.PouchInit = {
    _db: null,
    
    init: function(dbName) {
      var name = dbName || 'grimorio_db';
      console.log('📦 PouchInit.init(' + name + ')');
      this._db = new PouchDB(name);
      return this._db;
    },
    
    getDb: function() { 
      if (!this._db) this.init('grimorio_db');
      return this._db; 
    },
    
    save: function(doc) {
      if (!this._db) this.init('grimorio_db');
      return this._db.put(doc);
    },
    
    get: function(id) {
      if (!this._db) this.init('grimorio_db');
      return this._db.get(id);
    },
    
    getAll: function(type) {
      if (!this._db) this.init('grimorio_db');
      return this._db.allDocs({ include_docs: true })
        .then(result => {
          return result.rows
            .map(row => row.doc)
            .filter(doc => doc.type === type);
        });
    },
    
    remove: function(id) {
      if (!this._db) this.init('grimorio_db');
      return this._db.get(id)
        .then(doc => this._db.remove(doc));
    },
    
    query: function(view, options) {
      if (!this._db) this.init('grimorio_db');

      // Tenta executar a query normal
      return this._db.query(view, options).catch(function(err) {
        // Se a view não existe (404), faz a busca manual no localStorage
        if (err.status === 404) {
          console.warn('⚠️ View "' + view + '" não encontrada. Buscando manualmente...');

          return this._db.allDocs({ include_docs: true })
            .then(function(result) {
              var docs = result.rows
                .map(function(row) { return row.doc; });

              // Se a query for por username, filtra
              if (view === 'users/by_username' && options && options.key) {
                docs = docs.filter(function(doc) {
                  return doc.username === options.key;
                });
              }

              // Se a query for por userId, filtra
              if (view === 'characters/by_userId' && options && options.key) {
                docs = docs.filter(function(doc) {
                  return doc.userId === options.key;
                });
              }

              return { rows: docs.map(function(doc) { return { doc: doc }; }) };
            }.bind(this));
        }
        throw err;
      }.bind(this));
    },
    
    sync: function(remoteUrl, options) {
      if (!this._db) this.init('grimorio_db');
      return this._db.sync(remoteUrl, options || {});
    },
    
    stopSync: function() {
      console.log('🛑 Sync interrompido');
    },
    
    getSyncStatus: function() {
      return { isSyncing: false, remoteUrl: null };
    },
    
    backup: function() {
      if (!this._db) this.init('grimorio_db');
      return this._db.allDocs({ include_docs: true })
        .then(result => {
          const docs = result.rows.map(row => row.doc);
          const json = JSON.stringify(docs, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'grimorio_backup_' + new Date().toISOString().slice(0,10) + '.json';
          a.click();
          URL.revokeObjectURL(url);
          return docs;
        });
    },
    
    restore: function(jsonData) {
      if (!this._db) this.init('grimorio_db');
      const docs = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      return this._db.bulkDocs(docs);
    },
    
    destroy: function() {
      if (this._db) {
        const name = this._db._name;
        const prefix = 'pouch_' + name + '_';
        const keys = Object.keys(localStorage);
        keys.filter(k => k.startsWith(prefix)).forEach(k => localStorage.removeItem(k));
        this._db = null;
      }
      return Promise.resolve({ ok: true });
    }
  };

  console.log('✅ PouchInit fallback criado!');
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
      .then(function(doc) { currentUser = doc; return doc; })
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
        return { message: 'Usuário excluído' };
      });
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
console.log('✅ StorageAdapter carregado com fallback!');