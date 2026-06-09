import { SchemaType } from '@google/generative-ai';
import type { FunctionDeclaration } from '@google/generative-ai';

export const profileTools: FunctionDeclaration[] = [
  {
    name: 'register_profile',
    description: 'Registra o actualiza el perfil académico del usuario',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        academic_level: { type: SchemaType.STRING, enum: ['primaria', 'secundaria', 'universidad'], description: 'Nivel educativo' } as any,
        school: { type: SchemaType.STRING, description: 'Nombre del colegio o universidad' },
        subjects: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: 'Materias que estudia' },
        goals: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: 'Objetivos académicos' },
      },
      required: ['academic_level'],
    },
  },
  {
    name: 'set_reminder',
    description: 'Crea un recordatorio para el usuario',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: 'Título del recordatorio' },
        reminder_type: { type: SchemaType.STRING, enum: ['study', 'meal', 'goal'], description: 'Tipo de recordatorio' } as any,
        scheduled_time: { type: SchemaType.STRING, description: 'Hora en formato HH:MM (24h)' },
        repeat_days: { type: SchemaType.ARRAY, items: { type: SchemaType.INTEGER }, description: 'Días de repetición (0=Dom, ..., 6=Sáb). Vacío = única vez.' },
      },
      required: ['title', 'reminder_type', 'scheduled_time'],
    },
  },
];
