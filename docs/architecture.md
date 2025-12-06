# Arquitectura del Sistema

Este proyecto implementa **Clean Architecture** (Arquitectura Limpia) propuesta por Robert C. Martin. El objetivo es separar las preocupaciones, haciendo que el sistema sea independiente de frameworks, UI, base de datos y agentes externos.

## Capas del Sistema

### 1. Domain (Dominio)
*   **Responsabilidad**: Contiene la lógica de negocio empresarial y las entidades del sistema. Es el núcleo de la aplicación y no depende de ninguna otra capa.
*   **Componentes**:
    *   **Entities**: Objetos de negocio (e.g., `Patient`, `Doctor`, `Appointment`).
    *   **Repository Interfaces**: Contratos que definen cómo se accede a los datos, sin implementarlos (e.g., `PatientRepository`).
    *   **Value Objects** & **Domain Errors**.

### 2. Application (Aplicación)
*   **Responsabilidad**: Contiene los casos de uso del sistema. Orquesta el flujo de datos hacia y desde las entidades, y dirige a esas entidades para que usen sus reglas de negocio críticas.
*   **Componentes**:
    *   **Use Cases**: Clases que encapsulan una acción específica del negocio (e.g., `ScheduleAppointment`, `RegisterPatient`).
    *   **DTOs**: Objetos de transferencia de datos.

### 3. Infrastructure (Infraestructura)
*   **Responsabilidad**: Implementa los detalles técnicos. Aquí se encuentran las implementaciones de los repositorios, las conexiones a base de datos, y los frameworks web.
*   **Componentes**:
    *   **DB**: Conexión a Supabase y mapeo de datos.
    *   **Repositories**: Implementaciones concretas de las interfaces del dominio (e.g., `SupabasePatientRepository`).
    *   **Web Server**: Configuración de Express.js.

### 4. Presentation (Presentación)
*   **Responsabilidad**: Mostrar la información al usuario e interpretar sus comandos. En este proyecto, esta capa es una aplicación **Service-Side** (API Controllers) y **Client-Side** (React App).
*   **Componentes**:
    *   **Controllers**: Reciben requests HTTP y llaman a los Casos de Uso.
    *   **React Frontend**: Interfaz visual construida con React, TailwindCSS y TypeScript.

## Principios SOLID Aplicados

*   **S (Single Responsibility)**: Cada clase tiene una única razón para cambiar.
*   **O (Open/Closed)**: Las entidades y casos de uso están abiertos a extensión pero cerrados a modificación.
*   **L (Liskov Substitution)**: Las implementaciones de repositorios pueden ser intercambiadas sin romper la aplicación.
*   **I (Interface Segregation)**: Interfaces específicas para cada propósito.
*   **D (Dependency Inversion)**: Los módulos de alto nivel (Dominio, Aplicación) no dependen de los de bajo nivel (Infraestructura); ambos dependen de abstracciones (Interfaces).
