import OpenAI from 'openai';

export const profileTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'register_profile',
      description: 'Registra o actualiza el perfil académico del usuario',
      parameters: {
        type: 'object',
        properties: {
          academic_level: { type: 'string', enum: ['primaria', 'secundaria', 'universidad'], description: 'Nivel educativo' },
          school: { type: 'string', description: 'Nombre del colegio o universidad' },
          subjects: { type: 'array', items: { type: 'string' }, description: 'Materias que estudia' },
          goals: { type: 'array', items: { type: 'string' }, description: 'Objetivos académicos' },
        },
        required: ['academic_level'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'set_reminder',
      description: 'Crea un recordatorio para el usuario',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Título del recordatorio' },
          reminder_type: { type: 'string', enum: ['study', 'meal', 'goal'], description: 'Tipo de recordatorio' },
          scheduled_time: { type: 'string', description: 'Hora en formato HH:MM (24h)' },
          repeat_days: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 }, description: 'Días de repetición (0=Dom, ..., 6=Sáb). Vacío = única vez.' },
        },
        required: ['title', 'reminder_type', 'scheduled_time'],
      },
    },
  },
];
