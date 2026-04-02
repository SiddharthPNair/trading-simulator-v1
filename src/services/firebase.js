import { initializeApp } from 'firebase/app'
import {
  getFirestore, doc, setDoc, getDoc,
  collection, getDocs, query, orderBy, limit
} from 'firebase/firestore'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {

  apiKey: "AIzaSyD7BPPcxYZItM7cCTTR7Qz4g4vJV6AR0i4",

  authDomain: "trading-simulator-v1.firebaseapp.com",

  projectId: "trading-simulator-v1",

  storageBucket: "trading-simulator-v1.firebasestorage.app",

  messagingSenderId: "361912027230",

  appId: "1:361912027230:web:565d6b242fe314b6594ccf",

  measurementId: "G-K89CWRKW6V"

};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export function loginWithGoogle() {
  return signInWithPopup(auth, provider)
}

export function logout() {
  return signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

export async function loadPortfolio(uid) {
  try {
    const snap = await getDoc(doc(db, 'portfolios', uid))
    if (snap.exists()) return snap.data()
    return null
  } catch (e) {
    console.warn('loadPortfolio failed:', e.message)
    return null
  }
}

export async function savePortfolio(uid, data) {
  try {
    await setDoc(doc(db, 'portfolios', uid), data, { merge: true })
  } catch (e) {
    console.warn('savePortfolio failed:', e.message)
  }
}

export async function saveScore(uid, username, photoURL, pnl, trades) {
  try {
    await setDoc(doc(db, 'leaderboard', uid), {
      username,
      photoURL: photoURL || '',
      pnl: parseFloat(pnl.toFixed(2)),
      trades,
      timestamp: Date.now()
    })
  } catch (e) {
    console.warn('saveScore failed:', e.message)
  }
}

export async function getLeaderboard() {
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('pnl', 'desc'), limit(20))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.warn('Firebase not configured, using mock data')
    return getMockLeaderboard()
  }
}

function getMockLeaderboard() {
  return [
    { id: '1', username: 'QuantKing', pnl: 48320.50, trades: 142, photoURL: '' },
    { id: '2', username: 'AlphaWolf', pnl: 31200.00, trades: 98, photoURL: '' },
    { id: '3', username: 'ZeroSlippage', pnl: 22800.75, trades: 201, photoURL: '' },
    { id: '4', username: 'ThetaGang', pnl: 18450.30, trades: 67, photoURL: '' },
    { id: '5', username: 'SidN', pnl: 12300.00, trades: 55, photoURL: '' },
    { id: '6', username: 'MomentumMike', pnl: 9870.20, trades: 113, photoURL: '' },
    { id: '7', username: 'ScalpMaster', pnl: 4200.10, trades: 320, photoURL: '' },
    { id: '8', username: 'LongOnly', pnl: -1200.50, trades: 12, photoURL: '' },
  ]
}

