window.LoginUI = {

  render: function() {
    return `
      <div class="login-screen">
        <div class="card">
          <h1>Grimório Universal</h1>
          <input id="login-user" placeholder="Usuário">
          <input id="login-pass" type="password" placeholder="Senha">
          <button id="btn-login" class="btn-gold auth-btn">⚔️ Entrar</button>
          <button id="btn-register" class="btn-ghost auth-btn">✦ Criar Conta</button>
          <button id="btn-recover" class="btn-ghost auth-btn" style="color:var(--gold);">🔑 Esqueci minha senha</button>
        </div>
      </div>
    `;
  },

  init: function() {
    var btnLogin = document.getElementById("btn-login");
    var btnRegister = document.getElementById("btn-register");
    var btnRecover = document.getElementById("btn-recover");

    // ── Registrar ──
    btnRegister.addEventListener("click", function() {
      var user = document.getElementById("login-user").value.trim();
      var pass = document.getElementById("login-pass").value;

      if (!user || !pass) {
        alert("Preencha usuário e senha.");
        return;
      }

      if (typeof StorageAdapter === 'undefined') {
        alert("Erro: StorageAdapter não carregado!");
        return;
      }

      StorageAdapter.registerUser(user, pass)
        .then(function() {
          alert("✅ Conta criada! Faça login.");
          document.getElementById("login-user").value = "";
          document.getElementById("login-pass").value = "";
        })
        .catch(function(err) {
          alert("❌ " + err.message);
        });
    });

    // ── Login ──
    btnLogin.addEventListener("click", function() {
      var user = document.getElementById("login-user").value.trim();
      var pass = document.getElementById("login-pass").value;

      if (!user || !pass) {
        alert("Preencha usuário e senha.");
        return;
      }

      if (typeof StorageAdapter === 'undefined') {
        alert("Erro: StorageAdapter não carregado!");
        return;
      }

      StorageAdapter.loginUser(user, pass)
        .then(function() {
          location.reload();
        })
        .catch(function(err) {
          alert("❌ " + err.message);
        });
    });

    // ── Recuperar senha ──
    btnRecover.addEventListener("click", function() {
      var user = document.getElementById("login-user").value.trim();
      if (!user) {
        alert("Digite seu nome de usuário primeiro.");
        return;
      }

      if (typeof StorageAdapter === 'undefined') {
        alert("Erro: StorageAdapter não carregado!");
        return;
      }

      // Primeiro verifica se o usuário existe
      StorageAdapter.loginUser(user, '')  // Tentativa fake pra ver se existe
        .catch(function(err) {
          if (err.message === 'Usuário não encontrado') {
            alert("❌ Usuário não encontrado.");
            return Promise.reject('STOP');
          }
          // Se a senha deu errado, o usuário existe
          return StorageAdapter.getCurrentUser();
        })
        .then(function() {
          // Se chegou aqui, o usuário existe
          var keyword = prompt("Digite sua palavra-chave de recuperação:");
          if (keyword === null) return Promise.reject('CANCEL');

          var newPass = prompt("Digite sua nova senha:");
          if (!newPass || newPass.length < 3) {
            alert("Senha inválida (mínimo 3 caracteres).");
            return Promise.reject('STOP');
          }

          return StorageAdapter.recoverAccount(user, keyword, newPass);
        })
        .then(function() {
          alert("✅ Senha alterada com sucesso! Faça login.");
        })
        .catch(function(err) {
          if (err !== 'STOP' && err !== 'CANCEL') {
            alert("❌ " + (err.message || err));
          }
        });
    });
  }
};

window.logout = function() {
  localStorage.removeItem("grimorio_session");
  location.reload();
};