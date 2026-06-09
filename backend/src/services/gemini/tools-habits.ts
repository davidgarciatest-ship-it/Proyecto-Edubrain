import { SchemaType } from '@google/generative-ai';
import type { FunctionDeclaration } from '@google/generative-ai';

export const habitTools: FunctionDeclaration[] = [
  {
    name: 'register_habit',
    description: 'Registra una comida o sesión de estudio que el usuario reportó',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        habit_type: { type: SchemaType.STRING, enum: ['meal', 'study'], description: 'Tipo de hábito: meal o study' } as any,
        description: { type: SchemaType.STRING, description: 'Descripción de lo que comió o estudió' },
        subject: { type: SchemaType.STRING, description: 'Materia o tema (solo para study)' },
        duration_minutes: { type: SchemaType.INTEGER, description: 'Duración en minutos (solo para study)' },
        meal_type: { type: SchemaType.STRING, enum: ['desayuno', 'almuerzo', 'cena', 'merienda', 'snack'], description: 'Tipo de comida (solo para meal)' } as any,
        foods: { type: SchemaType.STRING, description: 'Alimentos consumidos (solo para meal)' },
      },
      required: ['habit_type', 'description'],
    },
  },
  {
    name: 'get_habit_analysis',
    description: 'Obtiene un resumen de los hábitos registrados para analizar el progreso',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        period: { type: SchemaType.STRING, enum: ['day', 'week', 'month'], description: 'Período a analizar' } as any,
      },
      required: ['period'],
    },
  },
];
