# Backlog Scrum & Kanban

## Tablero Kanban Propuesto

### Columnas
1.  **Backlog**: Historias de usuario pendientes.
2.  **To Do**: Seleccionadas para el Sprint actual.
3.  **In Progress**: En desarrollo.
4.  **Review/QA**: En revisión de código o pruebas.
5.  **Done**: Desplegado y verificado.

## Historias de Usuario (Backlog Inicial)

### Sprint 1: Fundamentos y Gestión de Pacientes
*   **HU01**: Como Recepcionista, quiero registrar un nuevo paciente ingresando su DNI y datos básicos para poder agendarle citas.
    *   *Criterios de Aceptación*: DNI único, validación de campos obligatorios.
*   **HU02**: Como Recepcionista, quiero buscar un paciente por DNI para ver sus datos.
*   **HU03**: Como Admin, quiero crear usuarios para el personal (Médicos, Enfermeras) con roles asignados.

### Sprint 2: Gestión de Citas
*   **HU04**: Como Recepcionista, quiero ver los horarios disponibles de un médico en una fecha específica.
*   **HU05**: Como Recepcionista, quiero agendar una cita seleccionando paciente, médico y hora disponible.
    *   *Criterios de Aceptación*: El sistema debe impedir citas duplicadas en el mismo horario.
*   **HU06**: Como Paciente (futuro), quiero recibir una constancia de mi cita.

### Sprint 3: Atención Médica
*   **HU07**: Como Enfermera, quiero registrar el triaje (peso, talla, presión) de un paciente con cita del día.
*   **HU08**: Como Médico, quiero ver mi lista de pacientes del día.
*   **HU09**: Como Médico, quiero registrar el diagnóstico y tratamiento en la historia clínica.

### Sprint 4: Reportes y Auditoría
*   **HU10**: Como Director, quiero ver un dashboard con la cantidad de pacientes atendidos hoy.
