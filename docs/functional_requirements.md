# Requisitos Funcionales y Casos de Uso

## Módulos del Sistema

1.  **Gestión de Pacientes**
2.  **Gestión de Médicos/Personal**
3.  **Gestión de Citas**
4.  **Historial/Consultas**
5.  **Seguridad y Usuarios**
6.  **Reportes**

## Requisitos Funcionales (RF)

### Módulo: Pacientes
*   **RF01**: Registrar nuevo paciente (Datos personales, historia clínica base).
*   **RF02**: Actualizar datos de paciente.
*   **RF03**: Buscar paciente por DNI o Nombre.
*   **RF04**: Listar historial de citas de un paciente.

### Módulo: Médicos
*   **RF05**: Registrar médico (Especialidad, horario, CMP).
*   **RF06**: Gestionar disponibilidad/horarios de médicos.
*   **RF07**: Asignar consultorio a médico.

### Módulo: Citas
*   **RF08**: Programar una cita (Verificar disponibilidad).
*   **RF09**: Cancelar cita.
*   **RF10**: Reprogramar cita.
*   **RF11**: Registrar llegada del paciente (Check-in).
*   **RF12**: Visualizar calendario de citas diarias.

### Módulo: Consultas
*   **RF13**: Registrar diagnóstico de la cita.
*   **RF14**: Generar receta médica.
*   **RF15**: Registrar signos vitales (Triaje).

### Módulo: Seguridad
*   **RF16**: Login de usuarios (Roles: Admin, Médico, Enfermera, Recepción).
*   **RF17**: Auditoría de acciones (Logs de creación/edición).
*   **RF18**: Gestión de usuarios del sistema.

### Módulo: Reportes
*   **RF19**: Reporte de citas por día/mes.
*   **RF20**: Reporte de diagnósticos más frecuentes.
*   **RF21**: Reporte de productividad médica.

### Otros
*   **RF22**: Gestión de Especialidades Médicas.
*   **RF23**: Notificaciones de cita (Simulado/Email).
*   **RF24**: Configuración general del sistema.

## Casos de Uso Principales (Application Core)

1.  `ScheduleAppointment`: Valida disponibilidad, regla de negocio de no solapamiento, crea reserva.
2.  `RegisterPatient`: Valida unicidad de DNI, crea registro.
3.  `PerformTriage`: Registra signos vitales previo a consulta.
4.  `CompleteConsultation`: Médico registra diagnóstico y receta. Cierra la cita.
5.  `CancelAppointment`: Libera el horario. Requiere motivo.

## Modelado de Entidades (Domain)

*   **Patient**: `id`, `firstName`, `lastName`, `dni`, `birthDate`, `phone`, `historyNumber`.
*   **Doctor**: `id`, `firstName`, `lastName`, `cmp`, `specialtyId`.
*   **Appointment**: `id`, `patientId`, `doctorId`, `dateTime`, `status` (PENDING, CONFIRMED, COMPLETED, CANCELLED), `type`.
*   **MedicalRecord**: `id`, `appointmentId`, `diagnosis`, `prescription`.
*   **User**: `id`, `username`, `role`, `passwordHash`.
