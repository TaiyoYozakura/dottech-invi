import { database, ref, set, get, remove } from './firebase';

export class DatabaseService {
  static async saveDepartment(deptId, data) {
    try {
      await set(ref(database, `departments/${deptId}`), data);
      console.log(`✅ Saved ${deptId} to Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Firebase save error:', error);
      return false;
    }
  }

  static async loadDepartment(deptId) {
    try {
      const snapshot = await get(ref(database, `departments/${deptId}`));
      if (snapshot.exists()) {
        console.log(`✅ Loaded ${deptId} from Firebase`);
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('❌ Firebase load error:', error);
      return null;
    }
  }

  static async loadAllDepartments() {
    try {
      const snapshot = await get(ref(database, 'departments'));
      if (snapshot.exists()) {
        console.log('✅ Loaded all departments from Firebase');
        return snapshot.val();
      }
      return {};
    } catch (error) {
      console.error('❌ Firebase load all error:', error);
      return {};
    }
  }

  static async deleteDepartment(deptId) {
    try {
      await remove(ref(database, `departments/${deptId}`));
      console.log(`✅ Deleted ${deptId} from Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Firebase delete error:', error);
      return false;
    }
  }

  static syncWithLocalStorage(departments) {
    try {
      localStorage.setItem('dottech-departments', JSON.stringify(departments));
      console.log('✅ Synced with localStorage');
    } catch (error) {
      console.error('❌ localStorage sync error:', error);
    }
  }

  static loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('dottech-departments');
      if (saved) {
        return JSON.parse(saved);
      }
      return {};
    } catch (error) {
      console.error('❌ localStorage load error:', error);
      return {};
    }
  }
}