import { DatabaseService } from './database';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test save
    const testData = {
      name: 'TEST DEPARTMENT',
      eventName: 'DOTTECH',
      tagline: 'TEST • CONNECTION • WORKING',
      date: 'TEST DATE',
      time: 'TEST TIME',
      venue: 'TEST VENUE',
      message: 'This is a test message',
      highlights: ['Test 1', 'Test 2'],
      savedAt: new Date().toISOString()
    };
    
    const saveResult = await DatabaseService.saveDepartment('TEST', testData);
    console.log('💾 Save test result:', saveResult);
    
    if (saveResult) {
      // Test load
      const loadResult = await DatabaseService.loadDepartment('TEST');
      console.log('📥 Load test result:', loadResult);
      
      // Test load all
      const loadAllResult = await DatabaseService.loadAllDepartments();
      console.log('📋 Load all test result:', Object.keys(loadAllResult));
      
      // Clean up test data
      await DatabaseService.deleteDepartment('TEST');
      console.log('🗑️ Test cleanup completed');
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return false;
  }
};