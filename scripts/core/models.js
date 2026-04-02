export const STORAGE_KEYS = {
  PROFILE: 'fitlog:user:profile',
  BODY_RECORDS: 'fitlog:body:records',
  WORKOUT_LIBRARY: 'fitlog:workout:library',
  WORKOUT_TEMPLATES: 'fitlog:workout:templates',
  WORKOUT_SESSIONS: 'fitlog:workout:sessions',
  NUTRITION_FOODS: 'fitlog:nutrition:foods',
  NUTRITION_DAILY: 'fitlog:nutrition:daily'
};

export const DEFAULT_PROFILE = {
  id: 'user-default',
  nickname: '健身达人',
  gender: 'male',
  birthYear: 1998,
  heightCm: 178,
  currentWeightKg: 77.5,
  goalType: 'cut',
  activityLevel: 'moderate',
  unitSystem: 'metric',
  reminderTime: '18:00',
  createdAt: '2026-03-27T00:00:00.000Z',
  updatedAt: '2026-03-27T00:00:00.000Z'
};

export const BODY_RECORD_TEMPLATE = {
  date: '2026-03-27',
  weightKg: 77.5,
  bodyFatPct: 14.2,
  restingHeartRate: 58,
  circumferencesCm: {
    chest: 108.5,
    waist: 82,
    hips: 96.5,
    arm: 38.2,
    thigh: 61
  },
  notes: ''
};

export const EXERCISE_TEMPLATE = {
  id: 'ex-squat',
  name: '深蹲',
  muscleGroup: 'legs',
  equipment: 'barbell',
  isCustom: false
};

export const WORKOUT_SET_TEMPLATE = {
  reps: 8,
  weightKg: 80,
  restSec: 90,
  rpe: 8,
  completed: true
};

export const WORKOUT_ITEM_TEMPLATE = {
  exerciseId: 'ex-squat',
  exerciseName: '深蹲',
  sets: [WORKOUT_SET_TEMPLATE]
};

export const WORKOUT_SESSION_TEMPLATE = {
  id: 'session-20260327-001',
  date: '2026-03-27',
  startAt: '2026-03-27T15:42:00+08:00',
  endAt: '2026-03-27T16:47:00+08:00',
  durationMin: 65,
  workoutType: '下肢力量训练',
  items: [WORKOUT_ITEM_TEMPLATE],
  totalVolumeKg: 12450,
  caloriesBurned: 420,
  note: '',
  createdAt: '2026-03-27T16:47:00.000Z',
  updatedAt: '2026-03-27T16:47:00.000Z'
};

export const FOOD_TEMPLATE = {
  id: 'food-chicken-breast',
  name: '鸡胸肉',
  servingLabel: '100g',
  calories: 165,
  protein: 31,
  carbs: 0,
  fat: 3.6
};

export const DAILY_NUTRITION_TEMPLATE = {
  date: '2026-03-27',
  targetCalories: 2200,
  intakeCalories: 1860,
  burnedCalories: 520,
  deficitOrSurplus: -340,
  entries: [
    {
      foodId: 'food-chicken-breast',
      foodName: '鸡胸肉',
      amount: 1.5,
      unit: '份',
      calories: 248,
      protein: 46.5,
      carbs: 0,
      fat: 5.4
    }
  ]
};
