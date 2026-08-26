# MentorFlow

Sistema web de gestión de incidencias y soporte académico desarrollado con PHP y Laravel.

MentorFlow centraliza la gestión de tickets, seguimiento de incidencias, asignación de responsables, control de prioridades y cumplimiento de tiempos de atención (SLA), proporcionando una API REST segura y estructurada para su integración con aplicaciones web.

---

## 🎯 Objetivo

MentorFlow nace como una solución para mejorar la gestión de incidencias dentro de una institución educativa.

El sistema permite registrar, clasificar, asignar y realizar seguimiento de solicitudes e incidencias, proporcionando información sobre su estado, prioridad, responsable y cumplimiento del SLA.

El proyecto fue diseñado aplicando principios de separación de responsabilidades, seguridad, reutilización de código y arquitectura orientada a servicios.

---

## 🚀 Funcionalidades principales

### Gestión de tickets

- Creación y consulta de tickets.
- Identificación mediante número de ticket.
- Clasificación por categoría.
- Clasificación por prioridad.
- Gestión de estados.
- Asignación de responsables.
- Seguimiento de fechas de creación y vencimiento.
- Eliminación lógica mediante Soft Deletes.

### 🔐 Autenticación y autorización

- Autenticación de usuarios.
- Gestión de roles.
- Control de acceso mediante Policies.
- Protección de endpoints.
- Diferenciación de permisos según el tipo de usuario.

### ⏱️ Gestión de SLA

El sistema calcula automáticamente el tiempo máximo de atención según la prioridad del ticket.

| Prioridad | SLA |
|-----------|-----|
| Baja | 48 horas |
| Media | 24 horas |
| Alta | 8 horas |
| Urgente | 2 horas |

El sistema permite identificar el estado del SLA de cada incidencia.

### 🔎 Búsqueda y filtros

La API permite consultar tickets utilizando diferentes criterios:

- Búsqueda por texto.
- Estado.
- Prioridad.
- Categoría.
- Responsable.
- Ordenamiento.
- Paginación.

Ejemplo:

```http
GET /api/tickets?status=open&priority=3