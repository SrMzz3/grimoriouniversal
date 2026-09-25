/* js/account.js — Funções de conta e de administrador */

const Account = (() => {

  const API = '/api/admin';

  // ============================================================
  // HELPERS
  // ============================================================
  function current() {
    if (window.GrimorioStorage && GrimorioStorage.getCurrentUser) {
      return GrimorioStorage.getCurrentUser();
    }
    return null;
  }

  function isAdmin(user) {
    user = user || current();
    if (!user) return false;
    return user.isAdmin === true;
  }

  function headers() {
    const user = current();
    return {
      'Content-Type': 'application/json',
      'X-User-Id': user ? user.id : ''
    };
  }

  function request(path, method, body) {
    return fetch(API + path, {
      method: method || 'GET',
      headers: headers(),
      body: body ? JSON.stringify(body) : undefined
    }).then(function(res) {
      return res.json().catch(function() { return {}; }).then(function(data) {
        if (!res.ok) throw new Error(data.error || 'Erro na requisição');
        return data;
      });
    });
  }

  // ============================================================
  // USUÁRIOS
  // ============================================================
  function listUsers(search) {
    const q = search ? '?q=' + encodeURIComponent(search) : '';
    return request('/users' + q, 'GET');
  }

  function getUser(userId) {
    return request('/users/' + userId, 'GET');
  }

  // ============================================================
  // CONQUISTAS
  // ============================================================
  function grantAchievement(userId, achievementId) {
    return request('/users/' + userId + '/achievements', 'POST', { achievementId: achievementId })
      .then(function(updated) {
        refreshIfSelf(updated);
        return updated;
      });
  }

  function revokeAchievement(userId, achievementId) {
    return request('/users/' + userId + '/achievements/' + achievementId, 'DELETE')
      .then(function(updated) {
        refreshIfSelf(updated);
        return updated;
      });
  }

  function listCustomAchievements() {
    return fetch(API + '/achievements')
      .then(function(r) { return r.ok ? r.json() : []; })
      .catch(function() { return []; });
  }

  function createCustomAchievement(data) {
    return request('/achievements', 'POST', {
      title: data.title,
      desc: data.desc,
      icon: data.icon,
      rarity: data.rarity
    }).then(function(created) {
      return Achievements.loadCustom().then(function() { return created; });
    });
  }

  function deleteCustomAchievement(achievementId) {
    return request('/achievements/' + achievementId, 'DELETE')
      .then(function(res) {
        return Achievements.loadCustom().then(function() { return res; });
      });
  }

  // Se o adm mexeu nas próprias conquistas, atualiza o localStorage local
  function refreshIfSelf(updated) {
    const user = current();
    if (!user || !updated || updated.id !== user.id) return;
    user.achievements = updated.achievements || [];
    user.displayedAchievement = updated.displayedAchievement || '';
    if (window.GrimorioStorage && GrimorioStorage.updateCurrentUser) {
      GrimorioStorage.updateCurrentUser(user);
    }
  }

  // ============================================================
  // SESSÃO
  // ============================================================
  function logout() {
    localStorage.removeItem('grimorio_session');
    location.reload();
  }

  return {
    current: current,
    isAdmin: isAdmin,
    listUsers: listUsers,
    getUser: getUser,
    grantAchievement: grantAchievement,
    revokeAchievement: revokeAchievement,
    listCustomAchievements: listCustomAchievements,
    createCustomAchievement: createCustomAchievement,
    deleteCustomAchievement: deleteCustomAchievement,
    logout: logout,
  };

})();

window.Account = Account;
console.log('✅ Account carregado!');
