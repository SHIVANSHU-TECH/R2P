// src/services/firestore.jsx
import { db } from '../lib/firebase/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Save portfolio data to Firestore
 * @param {string} userId - User ID
 * @param {Object} portfolioData - Portfolio data object
 * @returns {Promise<string>} Document ID
 */
export async function savePortfolio(userId, portfolioData) {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    
    const dataToSave = {
      ...portfolioData,
      userId,
      updatedAt: serverTimestamp(),
      createdAt: portfolioData.createdAt || serverTimestamp()
    };

    await setDoc(portfolioRef, dataToSave);
    return userId;
  } catch (error) {
    console.error('Error saving portfolio:', error);
    throw new Error('Failed to save portfolio');
  }
}

/**
 * Save portfolio data by slug
 * @param {string} slug - Portfolio slug
 * @param {Object} portfolioData - Portfolio data object
 * @returns {Promise<string>} Document ID
 */
export async function savePortfolioBySlug(slug, portfolioData) {
  try {
    console.log('Attempting to save portfolio with slug:', slug);
    console.log('Portfolio data:', portfolioData);
    
    // Check if db is properly initialized
    if (!db) {
      throw new Error('Firebase database not initialized');
    }
    
    const portfolioRef = doc(db, 'portfolios', slug);
    
    const dataToSave = {
      ...portfolioData,
      slug,
      updatedAt: serverTimestamp(),
      createdAt: portfolioData.createdAt || serverTimestamp()
    };

    console.log('Data to save:', dataToSave);
    console.log('Database reference:', portfolioRef);

    // Add authentication check
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    console.log('User authenticated:', user.uid);

    await setDoc(portfolioRef, dataToSave);
    console.log('Portfolio saved successfully to Firestore');
    return slug;
  } catch (error) {
    console.error('Error saving portfolio by slug:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Provide more specific error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check your Firebase security rules.');
    } else if (error.code === 'unauthenticated') {
      throw new Error('You must be logged in to save a portfolio.');
    } else if (error.message.includes('Missing or insufficient permissions')) {
      throw new Error('Firebase permissions error. Please check your security rules.');
    } else {
      throw new Error(`Failed to save portfolio: ${error.message}`);
    }
  }
}

/**
 * Get portfolio data by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Portfolio data
 */
export async function getPortfolio(userId) {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    const portfolioSnap = await getDoc(portfolioRef);
    
    if (portfolioSnap.exists()) {
      return {
        id: portfolioSnap.id,
        ...portfolioSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting portfolio:', error);
    throw new Error('Failed to get portfolio');
  }
}

/**
 * Get portfolio by slug
 * @param {string} slug - Portfolio slug
 * @returns {Promise<Object|null>} Portfolio data
 */
export async function getPortfolioBySlug(slug) {
  try {
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting portfolio by slug:', error);
    throw new Error('Failed to get portfolio');
  }
}

/**
 * Update portfolio data
 * @param {string} userId - User ID
 * @param {Object} updates - Data to update
 * @returns {Promise<void>}
 */
export async function updatePortfolio(userId, updates) {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    
    const dataToUpdate = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    await updateDoc(portfolioRef, dataToUpdate);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    throw new Error('Failed to update portfolio');
  }
}

/**
 * Delete portfolio
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function deletePortfolio(userId) {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    await deleteDoc(portfolioRef);
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    throw new Error('Failed to delete portfolio');
  }
}

/**
 * Get all portfolios for a user (if they have multiple)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of portfolios
 */
export async function getUserPortfolios(userId) {
  try {
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(
      portfoliosRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user portfolios:', error);
    throw new Error('Failed to get user portfolios');
  }
}

/**
 * Save resume parsing result
 * @param {string} userId - User ID
 * @param {Object} resumeData - Parsed resume data
 * @returns {Promise<string>} Document ID
 */
export async function saveResumeData(userId, resumeData) {
  try {
    const resumeRef = doc(db, 'resumes', userId);
    
    const dataToSave = {
      userId,
      parsedData: resumeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(resumeRef, dataToSave);
    return userId;
  } catch (error) {
    console.error('Error saving resume data:', error);
    throw new Error('Failed to save resume data');
  }
}

/**
 * Get resume data for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Resume data
 */
export async function getResumeData(userId) {
  try {
    const resumeRef = doc(db, 'resumes', userId);
    const resumeSnap = await getDoc(resumeRef);
    
    if (resumeSnap.exists()) {
      return {
        id: resumeSnap.id,
        ...resumeSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting resume data:', error);
    throw new Error('Failed to get resume data');
  }
}

/**
 * Save user preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - User preferences
 * @returns {Promise<void>}
 */
export async function saveUserPreferences(userId, preferences) {
  try {
    const prefsRef = doc(db, 'userPreferences', userId);
    
    const dataToSave = {
      userId,
      ...preferences,
      updatedAt: serverTimestamp()
    };

    await setDoc(prefsRef, dataToSave);
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw new Error('Failed to save user preferences');
  }
}

/**
 * Get user preferences
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User preferences
 */
export async function getUserPreferences(userId) {
  try {
    const prefsRef = doc(db, 'userPreferences', userId);
    const prefsSnap = await getDoc(prefsRef);
    
    if (prefsSnap.exists()) {
      return {
        id: prefsSnap.id,
        ...prefsSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw new Error('Failed to get user preferences');
  }
}

/**
 * Check if portfolio slug is available
 * @param {string} slug - Slug to check
 * @returns {Promise<boolean>} Is slug available
 */
export async function isSlugAvailable(slug) {
  try {
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    throw new Error('Failed to check slug availability');
  }
}

/**
 * Generate unique slug
 * @param {string} baseSlug - Base slug
 * @returns {Promise<string>} Unique slug
 */
export async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await isSlugAvailable(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}