# Frontend & Docker Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement React frontend and Docker Compose setup for UDAS Member Management

**Architecture:** React + Vite SPA with TanStack Query, Docker Compose with 3 services (postgres, backend, frontend)

**Tech Stack:** React 18, Vite, TanStack Query, Axios, React Router v6, Docker Compose

---

## Phase 1: Docker Setup

### Task 1: Create Docker Compose Configuration

**Files:**
- Create: `docker-compose.yml`
- Create: `.env`

- [ ] **Step 1: Create .env file**

```bash
# Database
POSTGRES_DB=udas_member_management
POSTGRES_USER=udas
POSTGRES_PASSWORD=dev_password

# Backend
SPRING_PROFILES_ACTIVE=dev
DB_HOST=postgres
DB_PORT=5432
DB_NAME=udas_member_management
DB_USERNAME=udas
DB_PASSWORD=dev_password

# Frontend
VITE_API_URL=http://localhost:8080/api/v1
```

- [ ] **Step 2: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: udas-postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: udas-backend
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}
      DB_HOST: postgres
      DB_PORT: ${DB_PORT}
      DB_NAME: ${DB_NAME}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: udas-frontend
    environment:
      VITE_API_URL: http://localhost:8080/api/v1
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres-data:
```

- [ ] **Step 3: Create backend Dockerfile**

Create `backend/Dockerfile`:

```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY src src
RUN apk add --no-cache maven
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yml .env backend/Dockerfile
git commit -m "feat: add Docker Compose setup for full-stack development"
```

---

## Phase 2: Frontend Scaffold

### Task 2: Initialize React + Vite Project

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/index.html`
- Create: `frontend/Dockerfile`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/vite-env.d.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.node.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "udas-member-management-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 3: Create index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UDAS Member Management</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 5: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Create Dockerfile**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

- [ ] **Step 7: Create src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 8: Create src/App.tsx**

```typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import MemberList from './pages/Members/MemberList'
import MemberForm from './pages/Members/MemberForm'
import UserList from './pages/Users/UserList'
import UserForm from './pages/Users/UserForm'

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />
  
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<PrivateRoute><MemberList /></PrivateRoute>} />
        <Route path="/members/new" element={<PrivateRoute><MemberForm /></PrivateRoute>} />
        <Route path="/members/:id/edit" element={<PrivateRoute><MemberForm /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute adminOnly><UserList /></PrivateRoute>} />
        <Route path="/users/new" element={<PrivateRoute adminOnly><UserForm /></PrivateRoute>} />
        <Route path="/users/:id/edit" element={<PrivateRoute adminOnly><UserForm /></UserForm>} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 9: Create basic CSS**

Create `src/index.css`:

```css
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --danger: #dc2626;
  --danger-hover: #b91c1c;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--gray-50);
  color: var(--gray-900);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-danger {
  background-color: var(--danger);
  color: white;
}

.btn-danger:hover {
  background-color: var(--danger-hover);
}

.btn-secondary {
  background-color: var(--gray-200);
  color: var(--gray-700);
}

.btn-secondary:hover {
  background-color: var(--gray-300);
}

input, select {
  padding: 0.5rem;
  border: 1px solid var(--gray-300);
  border-radius: 0.375rem;
  font-size: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
}

th, td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
}

th {
  background: var(--gray-100);
  font-weight: 600;
}

.card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

- [ ] **Step 10: Commit**

```bash
git add frontend/
git commit -m "feat: scaffold React + Vite frontend project"
```

---

## Phase 3: API Integration

### Task 3: Create API Types and Services

**Files:**
- Create: `frontend/src/api/types.ts`
- Create: `frontend/src/api/members.ts`
- Create: `frontend/src/api/users.ts`

- [ ] **Step 1: Create API types**

Create `src/api/types.ts`:

```typescript
export interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string[];
  phone?: string[];
  dateOfBirth?: string;
  dateOfDeath?: string;
  ssn?: string;
  address?: Address;
}

export interface MemberCreateRequest {
  firstName: string;
  lastName: string;
  email: string[];
  phone?: string[];
  dateOfBirth?: string;
  dateOfDeath?: string;
  ssn?: string;
  address?: Address;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type UserRole = 'READ_ONLY' | 'READ_WRITE' | 'ADMIN';

export interface ApplicationUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface ApplicationUserRequest {
  email: string;
  role: UserRole;
  active?: boolean;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
```

- [ ] **Step 2: Create members API**

Create `src/api/members.ts`:

```typescript
import axios from 'axios';
import { Member, MemberCreateRequest, PagedResponse } from './types';

const api = axios.create({
  baseURL: '/api/v1',
});

export interface MemberParams {
  page?: number;
  size?: number;
  sort?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
}

export const membersApi = {
  list: (params: MemberParams = {}) => 
    api.get<PagedResponse<Member>>('/members', { params }).then(res => res.data),
  
  get: (id: string) => 
    api.get<Member>(`/members/${id}`).then(res => res.data),
  
  create: (data: MemberCreateRequest) => 
    api.post<Member>('/members', data).then(res => res.data),
  
  update: (id: string, data: MemberCreateRequest) => 
    api.put<Member>(`/members/${id}`, data).then(res => res.data),
  
  delete: (id: string) => 
    api.delete(`/members/${id}`),
};
```

- [ ] **Step 3: Create users API**

Create `src/api/users.ts`:

```typescript
import axios from 'axios';
import { ApplicationUser, ApplicationUserRequest, PagedResponse } from './types';

const api = axios.create({
  baseURL: '/api/v1',
});

export const usersApi = {
  list: () => 
    api.get<PagedResponse<ApplicationUser>>('/users').then(res => res.data),
  
  get: (id: string) => 
    api.get<ApplicationUser>(`/users/${id}`).then(res => res.data),
  
  create: (data: ApplicationUserRequest) => 
    api.post<ApplicationUser>('/users', data).then(res => res.data),
  
  update: (id: string, data: ApplicationUserRequest) => 
    api.put<ApplicationUser>(`/users/${id}`, data).then(res => res.data),
  
  delete: (id: string) => 
    api.delete(`/users/${id}`),
  
  getCurrentUser: () => 
    api.get('/users/me').then(res => res.data),
};
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/api/
git commit -m "feat: add API types and services"
```

---

## Phase 4: Auth Context

### Task 4: Create Auth Context and Hook

**Files:**
- Create: `frontend/src/context/AuthContext.tsx`
- Create: `frontend/src/hooks/useAuth.ts`

- [ ] **Step 1: Create Auth Context**

Create `src/context/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrentUser } from '../api/types';
import { usersApi } from '../api/users';

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    usersApi.getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = () => {
    window.location.href = '/oauth2/authorization/google';
  };

  const logout = () => {
    window.location.href = '/logout';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 2: Create useAuth hook**

Create `src/hooks/useAuth.ts`:

```typescript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

- [ ] **Step 3: Update App.tsx to wrap with AuthProvider**

Modify `src/App.tsx`:

```typescript
// Add import
import { AuthProvider } from './context/AuthContext'

// Wrap routes
<AuthProvider>
  <Routes>
    ...
  </Routes>
</AuthProvider>
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/context/ frontend/src/hooks/
git commit -m "feat: add auth context and hooks"
```

---

## Phase 5: Components

### Task 5: Create Layout Component

**Files:**
- Create: `frontend/src/components/Layout/Layout.tsx`
- Create: `frontend/src/components/Layout/Layout.css`

- [ ] **Step 1: Create Layout component**

Create `src/components/Layout/Layout.tsx`:

```typescript
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/members', label: 'Members' },
    ...(user?.role === 'ADMIN' ? [{ path: '/users', label: 'Users' }] : []),
  ];

  return (
    <div className="layout">
      <header className="header">
        <h1 className="logo">UDAS Members</h1>
        <nav className="nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="user-menu">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{user?.role}</span>
          <button onClick={logout} className="btn btn-secondary">Logout</button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create Layout CSS**

Create `src/components/Layout/Layout.css`:

```css
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.nav {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: var(--gray-700);
  font-weight: 500;
}

.nav-link:hover {
  background: var(--gray-100);
}

.nav-link.active {
  background: var(--primary);
  color: white;
}

.nav-link.active:hover {
  background: var(--primary-hover);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-weight: 500;
}

.user-role {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background: var(--gray-100);
  border-radius: 1rem;
  color: var(--gray-500);
}

.main {
  flex: 1;
  padding: 1.5rem;
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Layout/
git commit -m "feat: add Layout component"
```

---

### Task 6: Create Reusable UI Components

**Files:**
- Create: `frontend/src/components/Button/Button.tsx`
- Create: `frontend/src/components/Button/Button.css`
- Create: `frontend/src/components/Table/Table.tsx`
- Create: `frontend/src/components/Modal/Modal.tsx`
- Create: `frontend/src/components/Modal/Modal.css`

- [ ] **Step 1: Create Button component**

Create `src/components/Button/Button.tsx`:

```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props} />
  );
}
```

- [ ] **Step 2: Create Table component**

Create `src/components/Table/Table.tsx`:

```typescript
import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
}

export default function Table<T>({ data, columns, keyField }: TableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={String(item[keyField])}>
            {columns.map(col => (
              <td key={col.key}>
                {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 3: Create Modal component**

Create `src/components/Modal/Modal.tsx`:

```typescript
import { ReactNode, useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
```

Create `src/components/Modal/Modal.css`:

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h2 {
  font-size: 1.25rem;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray-500);
}

.modal-close:hover {
  color: var(--gray-700);
}

.modal-body {
  padding: 1.5rem;
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/
git commit -feat: add reusable UI components"
```

---

## Phase 6: Pages

### Task 7: Create Login and Dashboard Pages

**Files:**
- Create: `frontend/src/pages/Login/Login.tsx`
- Create: `frontend/src/pages/Dashboard/Dashboard.tsx`

- [ ] **Step 1: Create Login page**

Create `src/pages/Login/Login.tsx`:

```typescript
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh' 
    }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h1 style={{ marginBottom: '1rem' }}>UDAS Member Management</h1>
        <p style={{ marginBottom: '1.5rem', color: 'var(--gray-500)' }}>
          Sign in to manage organization members
        </p>
        <button onClick={login} className="btn btn-primary" style={{ width: '100%' }}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Dashboard page**

Create `src/pages/Dashboard/Dashboard.tsx`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { membersApi } from '../../api/members';

export default function Dashboard() {
  const { data: membersData, isLoading } = useQuery({
    queryKey: ['members', { size: 1 }],
    queryFn: () => membersApi.list({ size: 1 }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '1.5rem' }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {membersData?.totalElements ?? 0}
          </div>
          <div style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Total Members</div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Login/ frontend/src/pages/Dashboard/
git commit -m "feat: add Login and Dashboard pages"
```

---

### Task 8: Create Members Pages

**Files:**
- Create: `frontend/src/pages/Members/MemberList.tsx`
- Create: `frontend/src/pages/Members/MemberForm.tsx`

- [ ] **Step 1: Create MemberList page**

Create `src/pages/Members/MemberList.tsx`:

```typescript
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { membersApi } from '../../api/members';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { Member } from '../../api/types';

export default function MemberList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['members', { page, search }],
    queryFn: () => membersApi.list({ 
      page, 
      size: 20,
      lastName: search || undefined 
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: membersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const columns = [
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { 
      key: 'email', 
      header: 'Email',
      render: (member: Member) => member.email[0] || '-'
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (member: Member) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/members/${member.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button 
            variant="danger" 
            onClick={() => {
              if (confirm('Delete this member?')) {
                deleteMutation.mutate(member.id);
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Members</h2>
        <Link to="/members/new">
          <Button>Add Member</Button>
        </Link>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by last name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Table data={data?.content ?? []} columns={columns} keyField="id" />
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <Button 
              variant="secondary" 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span style={{ padding: '0.5rem' }}>
              Page {page + 1} of {data?.totalPages ?? 1}
            </span>
            <Button 
              variant="secondary" 
              onClick={() => setPage(p => p + 1)}
              disabled={(data?.totalPages ?? 1) <= page + 1}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create MemberForm page**

Create `src/pages/Members/MemberForm.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersApi } from '../../api/members';
import { MemberCreateRequest } from '../../api/types';
import Button from '../../components/Button/Button';

export default function MemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<MemberCreateRequest>({
    firstName: '',
    lastName: '',
    email: [],
    phone: [],
  });

  const { data: member, isLoading: isLoadingMember } = useQuery({
    queryKey: ['member', id],
    queryFn: () => membersApi.get(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (member) {
      setForm({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone || [],
        dateOfBirth: member.dateOfBirth,
        dateOfDeath: member.dateOfDeath,
        ssn: member.ssn,
        address: member.address,
      });
    }
  }, [member]);

  const mutation = useMutation({
    mutationFn: isEdit 
      ? (data: MemberCreateRequest) => membersApi.update(id!, data)
      : membersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      navigate('/members');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleChange = (field: keyof MemberCreateRequest, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (isEdit && isLoadingMember) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '1.5rem' }}>{isEdit ? 'Edit' : 'New'} Member</h2>
      
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>First Name *</label>
            <input
              style={{ width: '100%' }}
              value={form.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Last Name *</label>
            <input
              style={{ width: '100%' }}
              value={form.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
            <input
              style={{ width: '100%' }}
              value={form.email[0] || ''}
              onChange={e => handleChange('email', [e.target.value])}
              type="email"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Phone</label>
            <input
              style={{ width: '100%' }}
              value={form.phone?.[0] || ''}
              onChange={e => handleChange('phone', [e.target.value])}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Date of Birth</label>
            <input
              style={{ width: '100%' }}
              value={form.dateOfBirth || ''}
              onChange={e => handleChange('dateOfBirth', e.target.value)}
              type="date"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/members')}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Members/
git commit -m "feat: add Members list and form pages"
```

---

### Task 9: Create Users Pages (Admin Only)

**Files:**
- Create: `frontend/src/pages/Users/UserList.tsx`
- Create: `frontend/src/pages/Users/UserForm.tsx`

- [ ] **Step 1: Create UserList page**

Create `src/pages/Users/UserList.tsx`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { usersApi } from '../../api/users';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { ApplicationUser } from '../../api/types';

export default function UserList() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { 
      key: 'active', 
      header: 'Active',
      render: (user: ApplicationUser) => user.active ? 'Yes' : 'No'
    },
    { 
      key: 'createdAt', 
      header: 'Created',
      render: (user: ApplicationUser) => new Date(user.createdAt).toLocaleDateString()
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (user: ApplicationUser) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/users/${user.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button 
            variant="danger" 
            onClick={() => {
              if (confirm('Delete this user?')) {
                deleteMutation.mutate(user.id);
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Users</h2>
        <Link to="/users/new">
          <Button>Add User</Button>
        </Link>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table data={data?.content ?? []} columns={columns} keyField="id" />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create UserForm page**

Create `src/pages/Users/UserForm.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { ApplicationUserRequest, UserRole } from '../../api/types';
import Button from '../../components/Button/Button';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ApplicationUserRequest>({
    email: '',
    role: 'READ_ONLY' as UserRole,
    active: true,
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.get(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        role: user.role,
        active: user.active,
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: isEdit 
      ? (data: ApplicationUserRequest) => usersApi.update(id!, data)
      : usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isEdit && isLoadingUser) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '1.5rem' }}>{isEdit ? 'Edit' : 'New'} User</h2>
      
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email *</label>
            <input
              style={{ width: '100%' }}
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              type="email"
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Role *</label>
            <select
              style={{ width: '100%' }}
              value={form.role}
              onChange={e => setForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
            >
              <option value="READ_ONLY">READ_ONLY</option>
              <option value="READ_WRITE">READ_WRITE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))}
              />
              Active
            </label>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/users')}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Users/
git commit -m "feat: add Users management pages (admin only)"
```

---

## Phase 7: Update Backend for /users/me Endpoint

### Task 10: Add Current User Endpoint

**Files:**
- Modify: `backend/src/main/java/ba/rs/udas/udas_member_management/controller/MemberController.java` (find similar pattern)

- [ ] **Step 1: Find existing controller pattern**

Run: `ls backend/src/main/java/ba/rs/udas/udas_member_management/controller/`

- [ ] **Step 2: Create ApplicationUserController**

Create `backend/src/main/java/ba/rs/udas/udas_member_management/controller/ApplicationUserController.java`:

```java
package ba.rs.udas.udas_member_management.controller;

import ba.rs.udas.udas_member_management.model.ApplicationUser;
import ba.rs.udas.udas_member_management.model.PagedApplicationUser;
import ba.rs.udas.udas_member_management.service.ApplicationUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class ApplicationUserController {

    private final ApplicationUserService userService;

    public ApplicationUserController(ApplicationUserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApplicationUser> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String email = principal.getAttribute("email");
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<PagedApplicationUser> listUsers(Pageable pageable) {
        Page<ApplicationUser> page = userService.findAll(pageable);
        return ResponseEntity.ok(PagedApplicationUser.builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationUser> getUser(@PathVariable UUID id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApplicationUser> createUser(@RequestBody ApplicationUserRequest request) {
        ApplicationUser user = userService.create(request);
        return ResponseEntity.status(201).body(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationUser> updateUser(@PathVariable UUID id, @RequestBody ApplicationUserRequest request) {
        return userService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

- [ ] **Step 3: Add @EnableMethodSecurity to security config**

Find: `backend/src/main/java/ba/rs/udas/udas_member_management/configuration/SecurityConfig.java`

Add `@EnableMethodSecurity` annotation to the class.

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/ba/rs/udas/udas_member_management/controller/
git commit -m "feat: add /users/me endpoint for frontend auth"
```

---

## Summary

All tasks complete. The implementation includes:
- Docker Compose with PostgreSQL, Backend, Frontend services
- React + Vite frontend with routing
- TanStack Query for API state management
- Login with OAuth2 (via backend)
- Role-based access (ADMIN sees Users menu)
- Members CRUD with pagination and search
- Users management (ADMIN only)
