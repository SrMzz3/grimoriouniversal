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
- [x] **Validar sintaxe** dos arquivos `pouch-init.js` e `storage-adapter.js` (node --check, exit 0)

## Pendências / Observações

- [ ] **`table.js`/`table-ui.js`** referenciam métodos que não existem:
  - `TableSystem.getUserTables()`, `leaveTable()`, `getTableRolls()`, `getTableMessages()`, `sendMessage()`, `watchTable()`
  - `StorageAdapter.save(table)` / `StorageAdapter.get('table_...')` — agora existem (genéricos adicionados)
  - Estes são problemas pré-existentes, independentes da mudança de banco. Podem ser tratados em outra etapa.
- [ ] O fallback de emergência do `index.html` (PASSO 2) permanece como proteção caso a CDN falhe. O `pouch-init.js` detecta e usa modo manual se necessário.
