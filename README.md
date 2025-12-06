# Sistema de Gestión de Citas Médicas para la Posta

Bienvenido al repositorio del **Sistema de Gestión de Citas Médicas**, una solución integral diseñada para modernizar la administración de citas, pacientes y personal médico en postas de salud.

Este proyecto ha sido construido utilizando **Clean Architecture** y principios **SOLID** para garantizar escalabilidad, mantenibilidad y robustez.

## 🚀 Tecnologías

*   **Lenguaje Principal**: TypeScript
*   **Backend**: Node.js 20 + Express
*   **Frontend**: React + TailwindCSS
*   **Base de Datos**: Supabase (PostgreSQL)
*   **Arquitectura**: Clean Architecture
*   **Testing**: Jest

## 📂 Estructura del Proyecto

El proyecto sigue una estricta separación de responsabilidades:

```
/sistema-citas-posta
 ├── /src
 │   ├── /application   # Casos de uso (Lógica de aplicación)
 │   ├── /domain        # Entidades y Reglas de Negocio (Núcleo)
 │   ├── /infrastructure
 │   │     ├── /db      # Adaptadores de Base de Datos (Supabase)
 │   │     ├── /routes  # Definición de rutas API
 │   │     └── /controllers # Controladores HTTP
 │   └── /presentation  # Frontend (React App)
 ├── /tests             # Tests automatizados
 └── /docs              # Documentación del proyecto
```

## 🛠️ Instalación y Configuración

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/usuario/sistema-citas-posta.git
    cd sistema-citas-posta
    ```

2.  **Instalar dependencias**
    Este proyecto utiliza un único `package.json` para gestionar dependencias de frontend y backend.
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Crea un archivo `.env` en la raíz basado en `.env.example`:
    ```env
    PORT=3000
    SUPABASE_URL=tu_supabase_url
    SUPABASE_KEY=tu_supabase_anon_key
    ```

4.  **Iniciar Desarrollo**
    *   **Backend + Frontend (Concurrent)**:
        ```bash
        npm run dev
        ```
    *   **Sólo Backend**: `npm run dev:server`
    *   **Sólo Frontend**: `npm run dev:client`

## 📖 Documentación

*   [Arquitectura](./docs/architecture.md)
*   [Requisitos Funcionales](./docs/functional_requirements.md)
*   [Backlog & Roadmap](./docs/backlog.md)

## ⚡ Supabase Setup

1.  **Create Project**: Go to [app.supabase.io](https://app.supabase.io) and create a new project.
2.  **Environment Variables**:
    *   Copy credentials from Project Settings > API.
    *   Paste them into `.env` (copy from `.env.example`).
    *   **Security Note**: Never commit your `service_role` key. Use it only in secure backend contexts.
3.  **Database Migration**:
    *   Go to the SQL Editor in Supabase.
    *   Run the contents of `infra/sql/migrations/01_schema_init.sql`.
    *   Run the contents of `infra/sql/migrations/02_security_rls.sql`.
4.  **Seeding Data**:
    *   Run the contents of `infra/sql/seeders/01_base_seeds.sql` to populate initial data.
    *   This will create a default admin user, doctors, and specialties.

## 🤝 Contribución

1.  Hacer fork del repositorio.
2.  Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3.  Commit de tus cambios (`git commit -m 'Add: nueva funcionalidad'`).
4.  Push a la rama (`git push origin feature/nueva-funcionalidad`).
5.  Abrir un Pull Request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
