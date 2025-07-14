
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useFirestore = <T>(collectionName: string, userId?: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      console.log('No userId provided, setting loading to false');
      setLoading(false);
      return;
    }

    console.log(`Setting up Firestore listener for collection: ${collectionName}, userId: ${userId}`);
    
    const collectionRef = collection(db, collectionName);
    const q = query(
      collectionRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    );

    let isInitialLoad = true;
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        if (isInitialLoad) {
          console.log(`Initial load: ${snapshot.docs.length} documents from ${collectionName}`);
          isInitialLoad = false;
        }
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error listening to ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      console.log(`Cleaning up listener for ${collectionName}`);
      unsubscribe();
    };
  }, [collectionName, userId]);

  const addItem = async (item: Omit<T, 'id'>) => {
    try {
      console.log(`Adding item to ${collectionName}:`, item);
      
      const itemWithMetadata = {
        ...item,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Item with metadata:', itemWithMetadata);
      
      const docRef = await addDoc(collection(db, collectionName), itemWithMetadata);
      console.log(`Successfully added document with ID: ${docRef.id}`);
      return docRef.id;
    } catch (err) {
      console.error(`Error adding item to ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      // Optimistic update - update local state immediately
      setData(prevData => 
        prevData.map(item => 
          (item as any).id === id 
            ? { ...item, ...updates, updatedAt: new Date() } 
            : item
        )
      );

      // Then update Firestore in background
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (err) {
      console.error(`Error updating item ${id} in ${collectionName}:`, err);
      
      // Revert optimistic update on error by refetching data
      const collectionRebootRef = collection(db, collectionName);
      const q = query(
        collectionRebootRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      setData(items);
      
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      console.log(`Deleting item ${id} from ${collectionName}`);
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      console.log(`Successfully deleted document ${id}`);
    } catch (err) {
      console.error(`Error deleting item ${id} from ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem
  };
};
