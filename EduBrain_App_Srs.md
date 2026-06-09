EduBrain App - Srs

FASE 1 – INTRODUCCIÓN Y ALCANCE

Introducción: El proyecto EduBrain app es una aplicación basada en Inteligencia artificial diseñada para apoyar a estudiantes de colegio en su aprendizaje y organización diaria. Permite responder preguntas académicas de forma rápida y clara facilitando la comprensión de diferentes materias. Además, crea horarios de estudio personalizados según el tiempo y las necesidades del usuario. La app también genera rutinas diarias, ofrece recomendaciones basadas en la personalidad y estilo de aprendizaje e incluye planes alimenticios básicos para fomentar hábitos saludables. Su objetivo es mejorar el rendimiento académico y el bienestar estudiantil mediante el uso de tecnología innovadora, convirtiéndose en un asistente educativo, integral y accesible

Alcance: El alcance de la plataforma EduBrain se circunscribe a la optimización del rendimiento estudiantil mediante la gestión automatizada de hábitos de estudio, el monitoreo nutricional orientado a la mejora cognitiva y el seguimiento gamificado de metas académicas, integrando sistema de notificaciones proactivas para el usuario; no obstante, el sistema excluye explícitamente a la impartición de contenidos curriculares o tutorías, la comercialización de productos alimenticios, la emisión de diagnósticos clínicos o médicos profesionales, la gestión administrativa financiera de la institución educativa y cualquier funcionalidad de comunicación social o chat en tiempo real entre los estudiantes

FASE 2 – STACK TECNOLÓGICO

·         NUESTRO STACK TECNOLÓGICO

o   Interfaz (Front-end) --> React Native (Expo)

o   Cerebro (Backend/IA) --> Node.js + Express

o   Conector (Lógica) --> Open Route

o   Memoria (Local) --> SQLite

React Native + Expo: Sirve como el framework para desarrollar la interfaz móvil multiplataforma (Android e iOS). Ayuda a EduBrain a ofrecer una pantalla de chat intuitiva donde los estudiantes escriban sus dudas

Node.js + Express: Sirven como el entorno y framework para construir el servidor que gestiona la lógica del sistema. Ayuda a EduBrain a procesar las peticiones de los usuarios y conectar todas las herramientas de forma organizada

Open Router: Sirve como pasarela unificada para acceder a diferentes modelos de Inteligencia artificial. Ayuda a EduBrain a enviar los mensajes a la IA para obtener consejos personalizados sobre estudio

SQLite: Sirve como un sistema de gestión de base de datos relacional que almacene información en un archivo local. Ayuda a EduBrain a guardar el historial de conversaciones y el progreso académico para que la app no olvide nada

Perfiles de Usuario

Estudiante (Usuario Final)

Es el actor principal (alumno de colegio o universidad) que interactúa con el chatbot para mejorar sus hábitos y rendimiento. No requiere conocimientos técnicos para operar la interfaz de chat.

Permisos clave:

Interactuar con el chatbot mediante lenguaje natural.

Consultar su historial de consejos y progreso.

Configurar metas personales y recordatorios.

Gestionar sus datos de perfil y privacidad.

Administrador (Desarrollador)

Es el responsable técnico encargado de supervisar el correcto funcionamiento de la aplicación y la gestión de los datos. Posee conocimientos sobre la configuración del servidor y la base de datos.

Permisos clave:

Ajustar las instrucciones (prompts) del chatbot.

Monitorear estadísticas de uso general del sistema.

Realizar mantenimiento y limpieza de la base de datos SQLite.

Gestionar el acceso y seguridad de los usuarios.

Proveedor de IA (Actor Externo)

Es el servicio externo (OpenRouter) que actúa como motor de inteligencia artificial del sistema. Provee la capacidad de procesamiento de texto sin intervención humana directa.

Requisitos Funcionales (RF)

RF-01: Interacción Conversacional con IA

El sistema debe permitir al estudiante enviar mensajes de texto y recibir respuestas coherentes generadas por la IA a través de OpenRouter, enfocadas específicamente en consejos de nutrición y técnicas de estudio.

RF-02: Registro de Hábitos Diarios

El sistema debe permitir al estudiante registrar sus comidas y horas de estudio mediante el chat, procesando la información para almacenarla en la base de datos SQLite.

RF-03: Persistencia de Historial de Chat

El sistema debe recuperar y mostrar al estudiante los mensajes previos almacenados en SQLite cada vez que inicie sesión, garantizando la continuidad de la asesoría.

RF-04: Análisis de Rendimiento Cognitivo

El sistema debe permitir al estudiante solicitar un resumen de su progreso, donde la IA analice los datos.

RF-05: Gestion de perfil académico

El sistema debe permitir al usuario configurar su nivel educativo, colegio o universidad y sus objetivos principales.

RF-06: Gestión de Recordatorios y Notificaciones

El sistema debe permitir al estudiante configurar recordatorios personalizados para horarios de estudio, comidas y cumplimiento de metas académicas, enviando notificaciones automáticas para fomentar la constancia y la organización diaria