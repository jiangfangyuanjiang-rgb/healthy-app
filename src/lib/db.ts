// src/lib/db.ts
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface HealthDB extends DBSchema {
  profile: {
    key: string;
    value: {
      id: string;
      height: number;
      weight: number;
      age: number;
      targetWeight: number;
      createdAt: string;
      updatedAt: string;
    };
  };
  foodPreferences: {
    key: string;
    value: {
      id: string;
      preferences: string[];
      avoidFoods: string;
      notes: string;
      updatedAt: string;
    };
  };
  meals: {
    key: string;
    value: {
      id: string;
      date: string;
      mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
      time: string;
      foods: {
        name: string;
        icon: string;
        description: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      }[];
      totalCalories: number;
      totalProtein: number;
      totalCarbs: number;
      totalFat: number;
      createdAt: string;
    };
    indexes: { date: string; mealType: string };
  };
  workouts: {
    key: string;
    value: {
      id: string;
      date: string;
      exercises: {
        name: string;
        sets: number;
        reps: number;
        weight?: number;
      }[];
      duration: number;
      createdAt: string;
    };
    indexes: { date: string };
  };
  bodyData: {
    key: string;
    value: {
      id: string;
      date: string;
      weight: number;
      bodyFat?: number;
      bmi: number;
      createdAt: string;
    };
    indexes: { date: string };
  };
}

let dbInstance: IDBPDatabase<HealthDB> | null = null;

export const getDB = async () => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<HealthDB>('health-app', 2, {
    upgrade(db) {
      // 个人档案
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile', { keyPath: 'id' });
      }

      // 饮食偏好
      if (!db.objectStoreNames.contains('foodPreferences')) {
        db.createObjectStore('foodPreferences', { keyPath: 'id' });
      }

      // 饮食记录
      if (!db.objectStoreNames.contains('meals')) {
        const mealStore = db.createObjectStore('meals', { keyPath: 'id' });
        mealStore.createIndex('date', 'date');
        mealStore.createIndex('mealType', 'mealType');
      }

      // 训练记录
      if (!db.objectStoreNames.contains('workouts')) {
        const workoutStore = db.createObjectStore('workouts', { keyPath: 'id' });
        workoutStore.createIndex('date', 'date');
      }

      // 身体数据
      if (!db.objectStoreNames.contains('bodyData')) {
        const bodyStore = db.createObjectStore('bodyData', { keyPath: 'id' });
        bodyStore.createIndex('date', 'date');
      }
    },
  });

  return dbInstance;
};

// ========== 个人档案 ==========
export const saveProfile = async (profile: Omit<HealthDB['profile']['value'], 'id' | 'createdAt' | 'updatedAt'>) => {
  const db = await getDB();
  const data: HealthDB['profile']['value'] = {
    id: 'user-profile',
    ...profile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.put('profile', data);
  return data;
};

export const getProfile = async () => {
  const db = await getDB();
  return await db.get('profile', 'user-profile');
};

// ========== 饮食偏好 ==========
export const saveFoodPreferences = async (prefs: Omit<HealthDB['foodPreferences']['value'], 'id' | 'updatedAt'>) => {
  const db = await getDB();
  const data: HealthDB['foodPreferences']['value'] = {
    id: 'food-preferences',
    ...prefs,
    updatedAt: new Date().toISOString(),
  };
  await db.put('foodPreferences', data);
  return data;
};

export const getFoodPreferences = async () => {
  const db = await getDB();
  return await db.get('foodPreferences', 'food-preferences');
};

// ========== 饮食记录 ==========
export const saveMeal = async (meal: Omit<HealthDB['meals']['value'], 'id' | 'createdAt'>) => {
  const db = await getDB();
  const id = `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const data: HealthDB['meals']['value'] = {
    id,
    ...meal,
    createdAt: new Date().toISOString(),
  };
  await db.put('meals', data);
  return data;
};

export const getMealsByDate = async (date: string) => {
  const db = await getDB();
  const allMeals = await db.getAllFromIndex('meals', 'date', date);
  return allMeals;
};

export const getMealsByDateRange = async (startDate: string, endDate: string) => {
  const db = await getDB();
  const allMeals = await db.getAll('meals');
  return allMeals.filter(meal => meal.date >= startDate && meal.date <= endDate);
};

// ========== 训练记录 ==========
export const saveWorkout = async (workout: Omit<HealthDB['workouts']['value'], 'id' | 'createdAt'>) => {
  const db = await getDB();
  const id = `workout-${Date.now()}`;
  const data: HealthDB['workouts']['value'] = {
    id,
    ...workout,
    createdAt: new Date().toISOString(),
  };
  await db.put('workouts', data);
  return data;
};

export const getWorkoutsByDate = async (date: string) => {
  const db = await getDB();
  return await db.getAllFromIndex('workouts', 'date', date);
};

// ========== 身体数据 ==========
export const saveBodyData = async (data: Omit<HealthDB['bodyData']['value'], 'id' | 'createdAt'>) => {
  const db = await getDB();
  const id = `body-${Date.now()}`;
  const bodyData: HealthDB['bodyData']['value'] = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
  };
  await db.put('bodyData', bodyData);
  return bodyData;
};

export const getBodyDataByDate = async (date: string) => {
  const db = await getDB();
  return await db.getAllFromIndex('bodyData', 'date', date);
};

export const getAllBodyData = async () => {
  const db = await getDB();
  const allData = await db.getAll('bodyData');
  return allData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};