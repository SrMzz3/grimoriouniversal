/* js/db/pouch-init.js — Inicialização do PouchDB com índices */

const PouchInit = (() => {
  let db = null;
  let remoteDb = null;
  let syncHandler = null;
  let isSyncing = false;

  function init(dbName = 'grimorio_db') {
    if (typeof PouchDB === 'undefined') {
      console.error('❌ [PouchDB] PouchDB não carregado! Adicione o script no index.html');
      return null;
    }
    
    db = new PouchDB(dbName);
    console.log('✅ [PouchDB] Banco inicializado:', dbName);
    
    // Criar índices
    createIndexes();
    
    return db;
  }

  function createIndexes() {
    if (!db) return;

    // Índice de personagens
    db.put({
      _id: '_design/characters',
      views: {
        by_sysId: {
          map: function(doc) {
            if (doc.type === 'character') {
              emit(doc.sysId);
            }
          }.toString()
        },
        by_userId: {
          map: function(doc) {
            if (doc.type === 'character' && doc.userId) {
              emit(doc.userId);
            }
          }.toString()
        },
        by_name: {
          map: function(doc) {
            if (doc.type === 'character' && doc.name) {
              emit(doc.name.toLowerCase());
            }
          }.toString()
        },
        by_updatedAt: {
          map: function(doc) {
            if (doc.type === 'character' && doc.updatedAt) {
              emit(doc.updatedAt);
            }
          }.toString()
        }
      }
    }).catch(err => {
      if (err.status !== 409) {
        console.warn('⚠️ [PouchDB] Erro ao criar índices de personagens:', err);
      }
    });

    // Índice de usuários
    db.put({
      _id: '_design/users',
      views: {
        by_username: {
          map: function(doc) {
            if (doc.type === 'user' && doc.username) {
              emit(doc.username);
            }
          }.toString()
        },
        by_session: {
          map: function(doc) {
            if (doc.type === 'session' && doc.userId) {
              emit(doc.userId);
            }
          }.toString()
        }
      }
    }).catch(err => {
      if (err.status !== 409) {
        console.warn('⚠️ [PouchDB] Erro ao criar índices de usuários:', err);
      }
    });
  }

  // ── Operações CRUD ──
  function save(doc) {
    if (!db) return Promise.reject('Banco não inicializado');
    
    doc._id = doc._id || doc.id || 'doc_' + crypto.randomUUID();
    doc.updatedAt = new Date().toISOString();
    
    return db.get(doc._id)
      .then(existing => {
        doc._rev = existing._rev;
        return db.put(doc);
      })
      .catch(err => {
        if (err.status === 404) {
          return db.put(doc);
        }
        throw err;
      })
      .then(result => {
        return { ...doc, _id: result.id, _rev: result.rev };
      });
  }

  function get(id) {
    if (!db) return Promise.reject('Banco não inicializado');
    return db.get(id);
  }

  function getAll(type) {
    if (!db) return Promise.reject('Banco não inicializado');
    
    return db.allDocs({ include_docs: true })
      .then(result => {
        return result.rows
          .map(row => row.doc)
          .filter(doc => doc.type === type);
      });
  }

  function remove(id) {
    if (!db) return Promise.reject('Banco não inicializado');
    
    return db.get(id)
      .then(doc => db.remove(doc));
  }

  function query(view, options = {}) {
    if (!db) return Promise.reject('Banco não inicializado');
    return db.query(view, options);
  }

  // ── Sincronização com servidor ──
  function sync(remoteUrl, options = {}) {
    if (!db) return Promise.reject('Banco não inicializado');
    
    remoteDb = new PouchDB(remoteUrl);
    
    const opts = {
      live: options.live !== undefined ? options.live : true,
      retry: options.retry !== undefined ? options.retry : true,
      continuous: options.continuous !== undefined ? options.continuous : true,
      ...options
    };
    
    syncHandler = db.sync(remoteDb, opts);
    isSyncing = true;
    
    syncHandler.on('change', (info) => {
      console.log('🔄 [Sync] Mudança detectada:', info);
    });
    
    syncHandler.on('paused', () => {
      console.log('⏸️ [Sync] Pausado');
    });
    
    syncHandler.on('active', () => {
      console.log('▶️ [Sync] Ativo');
    });
    
    syncHandler.on('error', (err) => {
      console.error('❌ [Sync] Erro:', err);
    });
    
    return syncHandler;
  }

  function stopSync() {
    if (syncHandler) {
      syncHandler.cancel();
      isSyncing = false;
      console.log('🛑 [Sync] Interrompido');
    }
  }

  function getSyncStatus() {
    return {
      isSyncing,
      remoteUrl: remoteDb ? remoteDb.name : null
    };
  }

  // ── Backup e Restauração ──
  function backup() {
    if (!db) return Promise.reject('Banco não inicializado');
    
    return db.allDocs({ include_docs: true })
      .then(result => {
        const docs = result.rows.map(row => row.doc);
        const json = JSON.stringify(docs, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `grimorio_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        return docs;
      });
  }

  function restore(jsonData) {
    if (!db) return Promise.reject('Banco não inicializado');
    
    const docs = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    return db.bulkDocs(docs);
  }

  // ── Utilitários ──
  function destroy() {
    if (!db) return Promise.reject('Banco não inicializado');
    return db.destroy();
  }

  function getDb() { return db; }

  return {
    init,
    getDb,
    save,
    get,
    getAll,
    remove,
    query,
    sync,
    stopSync,
    getSyncStatus,
    backup,
    restore,
    destroy
  };
})();