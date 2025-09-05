# 🎵 Top 5 Tião Carreiro & Pardinho

Aplicação web para sugerir, listar e aprovar músicas do Tião Carreiro & Pardinho, construída com **Laravel 11** no backend e **ReactJS** no frontend, com API REST, Docker e testes automatizados com **Pest**.

---

## 🛠️ Tecnologias

* **Backend:** Laravel 11, Sanctum, PHP 8.3+
* **Frontend:** ReactJS, React Query, Ant Design
* **Banco de dados:** MySQL (via Docker)
* **Contêineres:** Docker & Docker Compose
* **Testes:** Pest
* **Outros:** Axios, React Router, React Toastify

---

## 📦 Estrutura do projeto

```
backend/  → Laravel 11 API
frontend/ → React SPA
docker-compose.yml
```

---

## 🚀 Rodando o projeto localmente

### Pré-requisitos

* Docker e Docker Compose instalados
* Node.js e npm/yarn
* PHP >= 8.1 (localmente ou via container)

---

### 1️⃣ Como rodar

1. Acesse a pasta do backend:

```bash
cd backend
```

2. Copie o `.env.example` e configure:

```bash
cp .env.example .env
```

3. Suba os contêineres:

```bash
docker-compose up -d
```

4. Instale dependências do Laravel (dentro do container `app`):

```bash
docker exec -it laravel-app bash
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
exit
```

5. A API estará disponível em `http://localhost:80/api`.


6. A SPA estará disponível em `http://localhost:3000`.

---

## 🔑 Funcionalidades

* Registrar e logar usuários
* Sugerir músicas do YouTube (qualquer usuário, `approved=false`)
* Listar **Top 5 músicas** e **outras músicas com paginação**
* Aprovar/reprovar músicas (apenas usuários autenticados)
* Editar, excluir músicas (usuários autenticados)
* Formulários com validação e feedback

---

## 🧪 Testes automatizados

O backend utiliza **Pest** para testes. Para rodar os testes:

1. Entre no container backend:

```bash
docker exec -it laravel-app
```

2. Rode os testes:

```bash
./vendor/bin/pest
```

* Testes de exemplo incluem:

  * Registro e login de usuários
  * Criação de músicas (autenticado e não autenticado)
  * Aprovação/reprovação
  * Listagem de músicas
  * Paginação

---

## ⚡ Observações

* Para enviar músicas sem estar logado, elas sempre serão criadas com `approved=false`.
* Todas as requisições que alteram dados (`update`, `delete`, `approve`) exigem autenticação via **Sanctum**.
* Frontend utiliza React Query para cache e refetch automático.

---

## 💡 Sugestões

* Configurar variáveis do `.env` para MySQL, porta, ou JWT caso seja necessário.
* Criar usuário admin no seed inicial para testar funcionalidades de aprovação.
* Ajustar layout com Ant Design conforme preferir.
