# 🎬 Anime Tracker - API HTTP & UI (Full-Stack)

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

Este proyecto es una demostración arquitectónica de una API HTTP robusta construida con **NestJS** y consumida por un cliente **React** moderno. El propósito principal es ilustrar la semántica HTTP, validación estricta de datos, persistencia en memoria y el manejo adecuado de estados de error mediante una interfaz visual inmersiva.

---

## ✨ Características Principales

### ⚙️ Backend (NestJS)
- **Arquitectura Modular**: Implementación de Módulo, Controlador y Servicio aislados para la entidad `Anime`.
- **Validación Estricta**: Uso de `ValidationPipe` global con restricciones avanzadas (`whitelist`, `forbidNonWhitelisted`, `transform`) asegurando que ningún dato malicioso ingrese al sistema.
- **Semántica HTTP**: Uso riguroso de códigos de estado estándar para comunicación REST.
- **CORS Configurado**: Orígenes restringidos explícitamente para garantizar una comunicación segura con el cliente.
- **Documentación Viva**: Swagger (OpenAPI) auto-generado para la visualización y testeo de la API.

### 🎨 Frontend (React + Vite)
- **UI/UX Moderna**: Interfaz gráfica estilo "Plataforma de Streaming" utilizando el nuevo **Tailwind CSS v4**.
- **Integración Reactiva**: La interfaz muta su estado en tiempo real basándose en las respuestas confirmadas del servidor HTTP.
- **Manejo Visual de Errores**: Intercepción global de excepciones (Ej. `400 Bad Request`, `409 Conflict`) renderizados como alertas amigables al usuario.
- **Persistencia Visual Local**: Rendimiento acelerado utilizando recursos gráficos servidos en local para evitar bloqueos por políticas de CDN (Hotlinking).

---

## 🚦 Códigos de Estado HTTP (Semántica Implementada)

El backend cumple estrictamente con las normativas RESTful. En ningún momento se fabrica de forma deliberada o manual un error `500 Internal Server Error`, aprovechando íntegramente los filtros de excepciones (Exception Filters) nativos de NestJS.

| Código | Razón de Uso en la API |
| :--- | :--- |
| **`200 OK`** | Devuelto en peticiones `GET` (colección/detalle) y `PATCH` cuando el recurso fue encontrado y procesado/actualizado con éxito. |
| **`201 Created`** | Devuelto en el `POST` al confirmar que el recurso ha sido creado exitosamente en la memoria del servidor. |
| **`204 No Content`** | Devuelto en `DELETE` indicando que la eliminación fue exitosa y no hay cuerpo de respuesta adicional para retornar. |
| **`400 Bad Request`** | Disparado automáticamente por `class-validator` si faltan propiedades, si el tipo de dato es incorrecto (ej. texto en vez de número), o si se envían parámetros no reconocidos (evitando inyección de datos). |
| **`404 Not Found`** | Lanzado mediante `NotFoundException` si el cliente intenta solicitar (`GET`), actualizar (`PATCH`) o eliminar (`DELETE`) un Anime cuyo `id` no existe. |
| **`409 Conflict`** | Lanzado mediante `ConflictException` en métodos `POST` o `PATCH` si se intenta guardar una serie con un título que ya está registrado, previniendo duplicidad de estado. |

---

## 🛣️ Endpoints de la API

Base URL: `http://localhost:3000`

| Método | Endpoint | Descripción | Requisito JSON (Body) |
|---|---|---|---|
| `GET` | `/animes` | Retorna toda la colección persistida en memoria | N/A |
| `GET` | `/animes/:id` | Retorna el detalle exacto de un recurso por ID | N/A |
| `POST` | `/animes` | Crea y almacena un nuevo recurso | `{ title, studio, episodes, status, imageUrl? }` |
| `PATCH` | `/animes/:id`| Actualiza parcialmente un recurso existente | Propiedades parciales del POST |
| `DELETE`| `/animes/:id`| Elimina un recurso del sistema | N/A |

---

## 🚀 Despliegue Local

### Requisitos Previos
- Node.js (v18 o superior recomendado)
- Terminal y Navegador Web

### 1. Iniciar el Backend (API)
Abre una terminal en la raíz del proyecto y dirígete al backend:
```bash
cd backend
npm install
npm run start:dev
```
> 💡 La API HTTP correrá en **`http://localhost:3000`**. 
> Puedes revisar y ejecutar la documentación de Swagger en: **`http://localhost:3000/api`**

### 2. Iniciar el Frontend (Cliente Web)
Abre una segunda terminal en la raíz del proyecto y dirígete al frontend:
```bash
cd frontend
npm install
npm run dev
```
> 💡 La interfaz interactiva de React estará disponible en **`http://localhost:5173`**.
