import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PodcastItem } from '../types';
import {
  PODCAST_CARDS,
  FEATURED_PODCAST,
  MORE_PODCAST_CARDS,
  createPodcast,
} from '../data/podcasts';

const PODCASTS_COLLECTION = 'podcasts';

/**
 * Clean object of undefined fields before writing to Firestore
 * Firestore throws error when encountering `undefined` field values.
 */
function cleanForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = cleanForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result as T;
}

/**
 * Seed initial podcasts from local static list if Firestore collection is empty
 */
export async function initializeFirestorePodcastsIfEmpty(): Promise<void> {
  try {
    const colRef = collection(db, PODCASTS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      console.log('Seeding initial podcast data to Firestore...');
      const batch = writeBatch(db);
      const allInitial: PodcastItem[] = [
        FEATURED_PODCAST,
        ...PODCAST_CARDS,
        ...MORE_PODCAST_CARDS,
      ];

      allInitial.forEach((item, index) => {
        const normalized = createPodcast(item);
        const itemDocRef = doc(db, PODCASTS_COLLECTION, normalized.id);
        batch.set(
          itemDocRef,
          cleanForFirestore({
            ...normalized,
            order: index,
            createdAt: new Date().toISOString(),
          })
        );
      });

      await batch.commit();
      console.log('Firestore podcasts seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding Firestore podcasts:', error);
  }
}

/**
 * Subscribe to Real-time Firestore podcasts updates
 */
export function subscribeToPodcasts(
  callback: (podcasts: PodcastItem[]) => void,
  onError?: (error: Error) => void
) {
  const colRef = collection(db, PODCASTS_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // If empty in Firestore, return local fallback and trigger initial seed
        callback([FEATURED_PODCAST, ...PODCAST_CARDS, ...MORE_PODCAST_CARDS]);
        initializeFirestorePodcastsIfEmpty();
        return;
      }

      const list: PodcastItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as PodcastItem;
        list.push(createPodcast({ ...data, id: docSnap.id }));
      });
      callback(list);
    },
    (err) => {
      console.error('Firestore podcast subscription error:', err);
      if (onError) onError(err);
      // Fallback to local default podcasts
      callback([FEATURED_PODCAST, ...PODCAST_CARDS, ...MORE_PODCAST_CARDS]);
    }
  );
}

/**
 * Add or update a podcast episode in Firestore
 */
export async function savePodcastToFirestore(item: PodcastItem): Promise<PodcastItem> {
  const normalized = createPodcast(item);
  const docRef = doc(db, PODCASTS_COLLECTION, normalized.id);
  await setDoc(
    docRef,
    cleanForFirestore({
      ...normalized,
      updatedAt: new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString(),
    }),
    { merge: true }
  );
  return normalized;
}

/**
 * Set a specific podcast as the featured 'Podcast of the Week' in Firestore
 */
export async function setFeaturedPodcastInFirestore(featuredId: string): Promise<void> {
  const colRef = collection(db, PODCASTS_COLLECTION);
  const snap = await getDocs(colRef);

  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    if (d.id === featuredId) {
      batch.update(d.ref, { isFeatured: true, updatedAt: new Date().toISOString() });
    } else {
      const data = d.data();
      if (data.isFeatured) {
        batch.update(d.ref, { isFeatured: false, updatedAt: new Date().toISOString() });
      }
    }
  });

  await batch.commit();
}

/**
 * Delete a podcast episode from Firestore
 */
export async function deletePodcastFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PODCASTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Reset Firestore collection back to default dataset
 */
export async function resetPodcastsToDefaultInFirestore(): Promise<void> {
  const colRef = collection(db, PODCASTS_COLLECTION);
  const snap = await getDocs(colRef);

  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.delete(d.ref);
  });

  const allInitial: PodcastItem[] = [
    FEATURED_PODCAST,
    ...PODCAST_CARDS,
    ...MORE_PODCAST_CARDS,
  ];

  allInitial.forEach((item, index) => {
    const normalized = createPodcast(item);
    const itemDocRef = doc(db, PODCASTS_COLLECTION, normalized.id);
    batch.set(
      itemDocRef,
      cleanForFirestore({
        ...normalized,
        order: index,
        createdAt: new Date().toISOString(),
      })
    );
  });

  await batch.commit();
}
