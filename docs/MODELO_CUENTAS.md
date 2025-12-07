# Modelo de Cuentas y Gestión Familiar

Este documento define las reglas de negocio, la estructura de cuentas y las políticas de acceso para el Sistema de Gestión de Citas Médicas.

## 1. Principio Fundamental
El sistema distingue estrictamente entre **ACCESO (Usuario)** y **ATENCIÓN (Paciente)**. 

*   **Usuario (User)**: Persona responsable, mayor de edad, con credenciales de acceso (email/password).
*   **Paciente (Patient)**: Persona que recibe el servicio médico. Puede tener o no tener cuenta de usuario propia.

## 2. Reglas de Negocio para Cuentas Familiares

### Regla #1: Titularidad Obligatoria
*   Toda cuenta de usuario (`auth.users`) debe pertenecer a una persona **MAYOR DE EDAD**.
*   Los menores de edad **NO** pueden tener cuentas de usuario propias para iniciar sesión.

### Regla #2: Dependientes (Menores de Edad)
*   Un Usuario Titular puede registrar a múltiples pacientes dependientes (Hijos, Hijas, Tutelados).
*   **Restricción Estricta**: Solo se permite registrar/vincular como dependientes a **MENORES DE EDAD**.
*   Si un familiar es mayor de edad (ej. cónyuge, hermano adulto, padre anciano), este **DEBE** crear su propia cuenta de usuario personal. No puede ser gestionado como dependiente (salvo excepciones legales de curatela, procesadas manualmente por el administrador).

### Regla #3: Vinculación
*   Al registrar un dependiente, el sistema crea un registro en la tabla `patients` con:
    *   `user_id`: ID del Padre/Madre (Titular).
    *   `is_verified`: FALSE (inicialmente).
    *   `relationship_type`: 'SON', 'DAUGHTER', 'WARD' (Pupilo).

## 3. Flujo de Verificación (Seguridad)

Para evitar fraudes o errores en los expedientes médicos, se implementa el siguiente flujo:

1.  **Registro Digital**: El Padre registra al hijo/a desde la web. Puede reservar citas inmediatamente (estado *Preliminar*).
2.  **Validación Presencial**: 
    *   En la primera cita, el personal de Admisión solicita el DNI del menor y del padre.
    *   Verifica el parentesco.
    *   El Admin marca el check **"Validar Identidad"** (`is_verified = TRUE`) en el sistema.
3.  **Bloqueo**: Si se detecta un registro indebido (ej. registrar a un amigo adulto como hijo), la cuenta del dependiente se bloquea hasta regularizar la situación.

## 4. Estructura de Base de Datos (Referencia 03_family_accounts.sql)

La tabla `patients` soporta este modelo con los siguientes campos:

| Campo | Tipo | Descripción | Regla |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Identificador único del expediente | |
| `user_id` | UUID | ID del Usuario Titular (Padre/Madre) | NULL si no tiene cuenta digital. NOT NULL para dependientes. |
| `birth_date` | DATE | Fecha de Nacimiento | **CRÍTICO**: Se usa para calcular la edad y validar si es menor. |
| `relationship_type` | TEXT | Tipo de relación | 'SELF' (Titular), 'CHILD' (Hijo/a). |
| `is_verified` | BOOL | Estado de validación | TRUE solo por Admin. |

---
**Nota de Implementación**: El Frontend debe bloquear el formulario de "Agregar Familiar" si la fecha de nacimiento ingresada resulta en una edad >= 18 años, indicando: *"Las personas mayores de edad deben crear su propia cuenta personal"*.
