import { openDB } from 'idb';

interface HealthDB {
  profile: {
    key: string;
    value: {
      id: string;
      height: number;
      weight: number;
      age: number;
      goal: string;
      allergies: string[];
      createdAt: string;
    };
  };
  meals: {
    key: number;
    value: {
      id?: number;
      date: string;
      type: 'breakfast' | 'lunch' | 'dinner';
      name: string;
      calories: number;
      items: string[];
    };
    indexes: { date: string };
  };
  workouts: {
    key: number;
    value: {
      id?: number;
      date: string;
      exercise: string;
      sets: number;
      reps: number;
      weight?: number;
    };
    indexes: { date: string };
  };
  bodyData: {
    key: number;
    value: {
      id?: number;
      date: string;
      weight: number;
      bodyFat?: number;
      bmi: number;
    };
    indexes: { date: string };
  };
}

const dbPromise = openDB('HealthTrackerDB', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('profile')) {
      db.createObjectStore('profile', { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains('meals')) {
      const mealsStore = db.createObjectStore('meals', {
        keyPath: 'id',
        autoIncrement: true,
      });
      mealsStore.createIndex('date', 'date');
    }

    if (!db.objectStoreNames.contains('workouts')) {
      const workoutsStore = db.createObjectStore('workouts', {
        keyPath: 'id',
        autoIncrement: true,
      });
      workoutsStore.createIndex('date', 'date');
    }

    if (!db.objectStoreNames.contains('bodyData')) {
      const bodyDataStore = db.createObjectStore('bodyData', {
        keyPath: 'id',
        autoIncrement: true,
      });
      bodyDataStore.createIndex('date', 'date');
    }
  },
});

export async function getProfile() {
  const db = await dbPromise;
  return db.get('profile', 'main');
}

export async function saveProfile(profile: any) {
  const db = await dbPromise;
  await db.put('profile', { ...profile, id: 'main' });
}

export async function addBodyData(data: {
  date: string;
  weight: number;
  bodyFat?: number;
  bmi: number;
}) {
  const db = await dbPromise;
  await db.add('bodyData', data);
}

export async function getBodyData(limit = 30) {
  const db = await dbPromise;
  const tx = db.transaction('bodyData', 'readonly');
  const store = tx.objectStore('bodyData');
  const index = store.index('date');
  const allData = await index.getAll();

  // 返回最近的 N 条记录，按日期排序
  return allData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .reverse();
}

export { dbPromise };
export type { HealthDB };
