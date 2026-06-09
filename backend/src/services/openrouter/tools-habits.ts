import OpenAI from 'openai';

export const habitTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'register_habit',
      description: 'Registra una comida o sesión de estudio que el usuario reportó',
      parameters: {
        type: 'object',
        properties: {
          habit_type: { type: 'string', enum: ['meal', 'study'], description: 'Tipo de hábito: meal o study' },
          description: { type: 'string', description: 'Descripción de lo que comió o estudió' },
          subject: { type: 'string', description: 'Materia o tema (solo para study)' },
          duration_minutes: { type: 'integer', description: 'Duración en minutos (solo para study)' },
          meal_type: { type: 'string', enum: ['desayuno', 'almuerzo', 'cena', 'merienda', 'snack'], description: 'Tipo de comida (solo para meal)' },
          foods: { type: 'string', description: 'Alimentos consumidos (solo para meal)' },
        },
        required: ['habit_type', 'description'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_habit_analysis',
      description: 'Obtiene un resumen de los hábitos registrados para analizar el progreso',
      parameters: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['day', 'week', 'month'], description: 'Período a analizar' },
        },
        required: ['period'],
      },
    },
  },
];
