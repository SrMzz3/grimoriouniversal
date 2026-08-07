# TODO — Implementação do PouchInit real

## Objetivo
Criar o arquivo `js/db/pouch-init.js` real (substituir o fallback interno) e adequar o resto do sistema para funcionar com ele.

## Progresso

- [x] **Analisar arquitetura atual** (storage-adapter.js, login.js, index.html, table.js, table-ui.js)
- [x] **Criar `js/db/pouch-init.js`** com PouchInit real + views (users/by_username, characters/by_userId)
- [x] **Adicionar script `pouch-init.js` no `index.html`** (antes do storage-adapter.js)
- [x] **Atualizar `js/db/storage-adapter.js`**:
  - [x] Remover fallback embutido de PouchInit/PouchDB falso
  - [x] Adicionar verificação de que o PouchInit real existe
  - [x] Adicionar métodos genéricos `save`, `get`, `remove` (para o sistema de mesas)
  - [x] Corrigir mensagem de log final
- [x] **Adicionar detecção de PouchDB real/falso** no pouch-init.js (robustez offline)
- [x] **Adicionar métodos faltantes ao `TableSystem` (table.js)** para o table-ui.js funcionar:
  - [x] `getUserTables()` — lista mesas do usuário
  - [x] `leaveTable()` — sair da mesa
  - [x] `getTableRolls()` — buscar rolagens da mesa
  - [x] `getTableMessages()` — buscar mensagens da mesa
  - [x] `sendMessage()` — enviar mensagem
  - [x] `addTableRoll()` — registrar rolagem
  - [x] `watchTable()` — watch em tempo real (polling)
- [x] **Validar sintaxe** dos arquivos modificados (node --check, exit 0):
  - [x] `pouch-init.js`
  - [x] `storage-adapter.js`
  - [x] `table.js`
  - [x] `login.js`
  - [x] `app.js`
- [x] **Substituir `crypto.randomUUID()` por `PouchInit.generateId()`** no `storage-adapter.js` (migração, registerUser, saveCharacter) para compatibilidade com navegadores que não suportam a API nativa.
- [x] **Melhorar `recoverAccount`** no `storage-adapter.js`: agora lê a palavra-chave também do `localStorage` (caso tenha sido salva via `profile.js`/`GrimorioStorage`) e sincroniza a nova senha de volta ao `localStorage`.

## Correção do bug "Nenhum usuário logado" (perfil)

- [x] **Causa raiz**: `profile.js` e `select.js` leem o usuário via `GrimorioStorage.getCurrentUser()`, que consulta o `localStorage` (`grimorio_users`). Mas o `StorageAdapter.loginUser` só salvava o usuário no PouchDB, nunca no `localStorage`. Após `location.reload()`, o `localStorage` estava vazio → perfil mostrava "Nenhum usuário logado".
- [x] **Correção**: adicionada função `syncUserToLocalStorage(user)` que espelha o usuário do PouchDB no `localStorage['grimorio_users']`.
- [x] `syncUserToLocalStorage` chamado em:
  - `setCurrentUser` (login e logout)
  - `loadUserFromSession` (recarga de sessão)
  - `updateUser` (edição de perfil)
- [x] `deleteUser` agora também remove o usuário do `localStorage['grimorio_users']`.

## Pendências / Observações

- [ ] **`table.js`** — as funções de compartilhamento de personagem (`shareCharacter`, `grantViewPermission`, `getTableCharacters`, `getTableCharactersPublic`, `getCharacterWithPermission`) usam `new PouchDB(CONFIG.SERVER_URL + tableId)` com o servidor remoto `https://grimorio-couchdb.ibm.com/`. Este servidor pode não existir. Caso falhe, será necessário um backend CouchDB real ou adaptar para usar o banco local. **(Configuração original do sistema)**
- [ ] O fallback de emergência do `index.html` (PASSO 2) permanece como proteção caso a CDN falhe. O `pouch-init.js` detecta e usa modo manual se necessário.
- [ ] Nota: As edições de perfil feitas via `profile.js` usam `GrimorioStorage.updateCurrentUser` (que só escreve no `localStorage`). Elas não são espelhadas de volta no PouchDB automaticamente. Para persistência completa no PouchDB, seria necessário sincronizar essas edições de volta. Atualmente, o PouchDB é a fonte primária e o localStorage é um espelho para compatibilidade com as telas existentes.
</content>

