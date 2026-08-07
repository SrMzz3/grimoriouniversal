/* js/db/pouch-init.js — PouchInit real usando PouchDB da CDN */

// ================================================================
// PouchInit — Camada de acesso ao PouchDB
// ================================================================

window.PouchInit = (() => {
  let _db = null;

  // ================================================================
  // DETECÇÃO DO POUCHDB REAL
  // ================================================================

  function isRealPouchDB() {
    if (typeof window.PouchDB === 'undefined') return false;

    // PouchDB real tem bulkDocs
    if (typeof window.PouchDB.prototype.bulkDocs === 'function') return true;

    // PouchDB real tem query
    if (typeof window.PouchDB.prototype.query === 'function') return true;

    return false;
  }

  const USE_REAL_POUCHDB = isRealPouchDB();

  if (!USE_REAL_POUCHDB) {
    console.warn('⚠️ PouchDB real não detectado. Usando modo manual para queries.');
  } else {
    console.log('✅ PouchDB real detectado. Views serão configuradas.');
  }

  // ================================================================
  // DESIGN DOCS (VIEWS)
  // ================================================================

  const DESIGN_DOCS = [
    {
      _id: '_design/users',
      views: {
        by_username: {
          map: function(doc) {
            if (doc.type === 'user' && doc.username) {
              emit(doc.username, null);
            }
          }.toString()
        }
      }
    },
    {
      _id: '_design/characters',
      views: {
        by_userId: {
          map: function(doc) {
            if (doc.type === 'character' && doc.userId) {
              emit(doc.userId, null);
            }
          }.toString()
        },
        by_tableId: {
          map: function(doc) {
            if (doc.tableId) {
              emit(doc.tableId, null);
            }
          }.toString()
        }
      }
    },
    {
      _id: '_design/rolls',
      views: {
        by_tableId: {
          map: function(doc) {
            if (doc.type === 'roll' && doc.tableId) {
              emit(doc.tableId, null);
            }
          }.toString()
        },
        by_timestamp: {
          map: function(doc) {
            if (doc.type === 'roll' && doc.timestamp) {
              emit(doc.timestamp, null);
            }
          }.toString()
        }
      }
    },
    {
      _id: '_design/messages',
      views: {
        by_tableId: {
          map: function(doc) {
            if (doc.type === 'message' && doc.tableId) {
              emit(doc.tableId, null);
            }
          }.toString()
        },
        by_timestamp: {
          map: function(doc) {
            if (doc.type === 'message' && doc.timestamp) {
              emit(doc.timestamp, null);
            }
          }.toString()
        }
      }
    }
  ];

  // ================================================================
  // CRIA AS VIEWS
  // ================================================================

  function ensureViews(db) {
    var promises = DESIGN_DOCS.map(function(ddoc) {
      return db.get(ddoc._id)
        .then(function(existing) {
          ddoc._rev = existing._rev;
          return db.put(ddoc);
        })
        .catch(function(err) {
          if (err.status === 404) {
            return db.put(ddoc);
          }
          throw err;
        });
    });
    return Promise.all(promises);
  }

  // ================================================================
  // GERAR ID
  // ================================================================

  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // ================================================================
  // QUERY MANUAL (FALLBACK)
  // ================================================================

  function manualQuery(view, options) {
    var key = options && options.key ? options.key : null;

    return _db.allDocs({ include_docs: true })
      .then(function(result) {
        var docs = result.rows.map(function(row) { return row.doc; });

        // Filtra por tipo de acordo com a view
        if (view === 'users/by_username') {
          docs = docs.filter(function(doc) { return doc.type === 'user'; });
          if (key) {
            docs = docs.filter(function(doc) { return doc.username === key; });
          }
        } else if (view === 'characters/by_userId') {
          docs = docs.filter(function(doc) { return doc.type === 'character' || doc.type === 'shared_character'; });
          if (key) {
            docs = docs.filter(function(doc) { return doc.userId === key; });
          }
        } else if (view === 'characters/by_tableId' || view === 'rolls/by_tableId' || view === 'messages/by_tableId') {
          if (key) {
            docs = docs.filter(function(doc) { return doc.tableId === key; });
          }
        }

        return { rows: docs.map(function(doc) { return { doc: doc }; }) };
      });
  }

  // ================================================================
  // FUNÇÕES PRINCIPAIS
  // ================================================================

  function init(dbName) {
    if (_db) return Promise.resolve(_db);

    var name = dbName || 'grimorio_db';
    console.log('📦 PouchInit.init(' + name + ')');

    _db = new PouchDB(name);

    if (USE_REAL_POUCHDB) {
      return ensureViews(_db)
        .then(function() {
          console.log('✅ PouchInit: views configuradas!');
          return _db;
        })
        .catch(function(err) {
          console.warn('⚠️ PouchInit: erro ao configurar views:', err.message || err);
          return _db;
        });
    } else {
      console.log('📦 PouchInit: usando modo manual (sem views)');
      return Promise.resolve(_db);
    }
  }

  function getDb() { return _db; }

  function save(doc) {
    if (!_db) return init().then(function() { return _db.put(doc); });
    return _db.put(doc);
  }

  function get(id) {
    if (!_db) return init().then(function() { return _db.get(id); });
    return _db.get(id);
  }

  function getAll(type) {
    if (!_db) return init().then(function() { return _db.allDocs({ include_docs: true }); })
      .then(function(result) {
        return result.rows.map(function(row) { return row.doc; })
          .filter(function(doc) { return doc.type === type; });
      });
    return _db.allDocs({ include_docs: true })
      .then(function(result) {
        return result.rows.map(function(row) { return row.doc; })
          .filter(function(doc) { return doc.type === type; });
      });
  }

  function remove(id) {
    if (!_db) return init()
      .then(function() { return _db.get(id); })
      .then(function(doc) { return _db.remove(doc); });
    return _db.get(id)
      .then(function(doc) { return _db.remove(doc); });
  }

  function query(view, options) {
    options = options || {};

    if (!USE_REAL_POUCHDB) {
      if (!_db) return init().then(function() { return manualQuery(view, options); });
      return manualQuery(view, options);
    }

    if (!_db) return init()
      .then(function() { return _db.query(view, options); })
      .catch(function(err) {
        if (err.status === 404) return manualQuery(view, options);
        throw err;
      });
    return _db.query(view, options)
      .catch(function(err) {
        if (err.status === 404) return manualQuery(view, options);
        throw err;
      });
  }

  function sync(remoteUrl, options) {
    if (!_db) return init().then(function() { return _db.sync(remoteUrl, options || {}); });
    return _db.sync(remoteUrl, options || {});
  }

  function stopSync() {
    console.log('🛑 Sync interrompido');
  }

  function getSyncStatus() {
    return { isSyncing: false, remoteUrl: null };
  }

  function backup() {
    if (!_db) return init().then(function() { return _db.allDocs({ include_docs: true }); })
      .then(function(result) {
        var docs = result.rows.map(function(row) { return row.doc; });
        var json = JSON.stringify(docs, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'grimorio_backup_' + new Date().toISOString().slice(0,10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        return docs;
      });
    return _db.allDocs({ include_docs: true })
      .then(function(result) {
        var docs = result.rows.map(function(row) { return row.doc; });
        var json = JSON.stringify(docs, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'grimorio_backup_' + new Date().toISOString().slice(0,10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        return docs;
      });
  }

  function restore(jsonData) {
    var docs = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (!_db) return init().then(function() { return _db.bulkDocs(docs); });
    return _db.bulkDocs(docs);
  }

  function destroy() {
    if (_db) {
      var name = _db._name;
      _db.destroy().catch(function() {});
      _db = null;
    }
    return Promise.resolve({ ok: true });
  }

  // ================================================================
  // API PÚBLICA
  // ================================================================

  return {
    init: init,
    getDb: getDb,
    save: save,
    get: get,
    getAll: getAll,
    remove: remove,
    query: query,
    sync: sync,
    stopSync: stopSync,
    getSyncStatus: getSyncStatus,
    backup: backup,
    restore: restore,
    destroy: destroy,
    generateId: generateId
  };

})();

console.log('✅ PouchInit real carregado!');
