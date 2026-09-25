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
    btnRegister.addEventListener("click", async function() {
      var user = document.getElementById("login-user").value.trim();
      var pass = document.getElementById("login-pass").value;

      if (!user || !pass) {
        await Modal.alert("Preencha usuário e senha.", { title: "Atenção", icon: "⚠️" });
        return;
      }

      if (typeof StorageAdapter === 'undefined') {
        await Modal.alert("Erro: StorageAdapter não carregado!", { title: "❌ Erro", icon: "❌" });
        return;
      }

      try {
        await StorageAdapter.registerUser(user, pass);
        await Modal.alert("Faça login para continuar.", { title: "✅ Conta criada!", icon: "✅" });
        document.getElementById("login-user").value = "";
        document.getElementById("login-pass").value = "";
      } catch (err) {
        await Modal.alert(err.message || "Erro ao criar conta.", { title: "❌ Erro", icon: "❌" });
      }
    });

    // ── Login ──
    btnLogin.addEventListener("click", async function() {
      var user = document.getElementById("login-user").value.trim();
      var pass = document.getElementById("login-pass").value;

      if (!user || !pass) {
        await Modal.alert("Preencha usuário e senha.", { title: "Atenção", icon: "⚠️" });
        return;
      }

      if (typeof StorageAdapter === 'undefined') {
        await Modal.alert("Erro: StorageAdapter não carregado!", { title: "❌ Erro", icon: "❌" });
        return;
      }

      try {
        const logged = await StorageAdapter.loginUser(user, pass);

        // Espelha no localStorage antes de recarregar, pro tracking achar o usuário
        try {
          if (window.Achievements) Achievements.track('login');
        } catch (e) {}

        // Conquista exclusiva do adm (verificada pela flag isAdmin, não pelo nome de usuário)
        if (logged && logged.isAdmin) {
          try { Achievements.unlock('im_purpleflower'); } catch (e) {}
        }

        setTimeout(function() { location.reload(); }, 400);
      } catch (err) {
        try { if (window.Achievements) Achievements.track('wrong_password'); } catch (e) {}
        await Modal.alert(err.message || "Erro ao fazer login.", { title: "❌ Erro", icon: "❌" });
      }
    });

    // ── Recuperar senha ──
    btnRecover.addEventListener("click", async function() {
      var user = document.getElementById("login-user").value.trim();
      if (!user) {
        await Modal.alert("Digite seu nome de usuário primeiro.", { title: "Atenção", icon: "⚠️" });
        return;
      }

      if (typeof StorageAdapter === 'undefined') {
        await Modal.alert("Erro: StorageAdapter não carregado!", { title: "❌ Erro", icon: "❌" });
        return;
      }

      var keyword = await Modal.prompt("Digite sua palavra-chave de recuperação:", {
        title: "🔑 Palavra-chave",
        icon: "🔑",
        placeholder: "Digite sua palavra-chave..."
      });

      if (keyword === null) return;

      var newPass = await Modal.prompt("Digite sua nova senha:", {
        title: "🔐 Nova senha",
        icon: "🔐",
        placeholder: "Digite sua nova senha (mínimo 3 caracteres)..."
      });

      if (newPass === null || newPass.length < 3) {
        await Modal.alert("Senha inválida (mínimo 3 caracteres).", { title: "❌ Erro", icon: "❌" });
        return;
      }

      try {
        await StorageAdapter.recoverAccount(user, keyword, newPass);
        // Recuperação limpa as tentativas de senha errada
        try {
          const store = JSON.parse(localStorage.getItem('grimorio_ach_stats') || '{}');
          Object.keys(store).forEach(function(k) {
            if (store[k] && store[k].persist) store[k].persist.wrongPass = 0;
          });
          localStorage.setItem('grimorio_ach_stats', JSON.stringify(store));
        } catch (e) {}
        await Modal.alert("Senha alterada com sucesso! Faça login.", { title: "✅ Sucesso", icon: "✅" });
      } catch (err) {
        await Modal.alert(err.message || "Erro ao recuperar conta.", { title: "❌ Erro", icon: "❌" });
      }
    });
  }
};

window.logout = function() {
  localStorage.removeItem("grimorio_session");
  location.reload();
};
