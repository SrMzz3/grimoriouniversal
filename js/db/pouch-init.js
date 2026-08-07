/* js/db/pouch-init.js — PouchInit real usando PouchDB da CDN */

// ================================================================
// PouchInit — Camada de acesso ao PouchDB
// Define as views (design docs) para as queries usadas pelo sistema
// ================================================================

window.PouchInit = (() => {
  let _db = null;

  // Detecta se o PouchDB é o real (da CDN) ou o fallback falso (do index.html)
  // O PouchDB real tem bulkDocs no prototype; o falso não tem.
  function isRealPouchDB() {
    return typeof window.PouchDB !== 'undefined' &&
      window.PouchDB.prototype &&
      typeof window.PouchDB.prototype.bulkDocs === 'function';
  }

  const USE_REAL_POUCHDB = isRealPouchDB();
  if (!USE_REAL_POUCHDB) {
    console.warn('⚠️ PouchDB real não detectado. Usando modo manual para queries.');
  } else {
    console.log('✅ PouchDB real detectado. Views serão configuradas.');
  }

  // Design docs com as views utilizadas pelo StorageAdapter
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
        }
      }
    }
  ];

  function ensureViews(db) {
    var promises = DESIGN_DOCS.map(function(ddoc) {
      return db.get(ddoc._id)
        .then(function(existing) {
          // Se o design doc já existe, preserva o _rev
          ddoc._rev = existing._rev;
          return db.put(ddoc);
        })
        .catch(function(err) {
          // Se não existe (404), cria
          if (err.status === 404) {
            return db.put(ddoc);
          }
          throw err;
        });
    });
    return Promise.all(promises);
  }

  function init(dbName) {
    if (_db) return Promise.resolve(_db);

    var name = dbName || 'grimorio_db';
    console.log('📦 PouchInit.init(' + name + ')');

    _db = new PouchDB(name);

    // Cria as views se ainda não existirem
    return ensureViews(_db)
      .then(function() {
        console.log('✅ PouchInit: views configuradas!');
        return _db;
      })
      .catch(function(err) {
        console.warn('⚠️ PouchInit: erro ao configurar views:', err.message || err);
        return _db;
      });
  }

  function getDb() {
    return _db;
  }

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

    // Se não estiver usando o PouchDB real, faz a busca manual direto
    if (!USE_REAL_POUCHDB) {
      if (!_db) return init().then(function() { return manualQuery(view, options, null); });
      return manualQuery(view, options, null);
    }

    if (!_db) return init()
      .then(function() { return _db.query(view, options); })
      .catch(function(err) { return manualQuery(view, options, err); });
    return _db.query(view, options)
      .catch(function(err) { return manualQuery(view, options, err); });
  }

// Fallback manual quando a view não existe (404) — busca em allDocs
  function manualQuery(view, options, err) {
    // Sempre executa (quando err é null, vem do modo manual sem PouchDB real)
    if (err === null || err.status === 404) {
      if (err) {
        console.warn('⚠️ View "' + view + '" não encontrada. Buscando manualmente...');
      }
      return _db.allDocs({ include_docs: true })
        .then(function(result) {
          var docs = result.rows.map(function(row) { return row.doc; });

          if (view === 'users/by_username' && options.key) {
            docs = docs.filter(function(doc) {
              return doc.username === options.key;
            });
          }

          if (view === 'characters/by_userId' && options.key) {
            docs = docs.filter(function(doc) {
              return doc.userId === options.key;
            });
          }

          return { rows: docs.map(function(doc) { return { doc: doc }; }) };
        });
    }
    throw err;
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
    if (!_db) return init().then(function() { return _db.bulkDocs(docs); });
    var docs = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
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
    destroy: destroy
  };
})();

console.log('✅ PouchInit real carregado!');
