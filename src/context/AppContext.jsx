import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { fetchRepoFile, saveRepoFile } from '../services/githubService';

const AppContext = createContext(null);

const STORAGE_KEY = 'phd_tracker_data';
const GITHUB_CONFIG_KEY = 'phd_tracker_github';

function getInitialData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { universities: [] };
}

function getGithubConfig() {
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'ADD_UNIVERSITY':
      return { ...state, data: { ...state.data, universities: [...state.data.universities, action.payload] } };
    case 'REMOVE_UNIVERSITY':
      return { ...state, data: { ...state.data, universities: state.data.universities.filter(u => u.id !== action.payload) } };
    case 'UPDATE_UNIVERSITY': {
      const unis = state.data.universities.map(u => u.id === action.payload.id ? action.payload : u);
      return { ...state, data: { ...state.data, universities: unis } };
    }
    case 'SET_GITHUB_CONFIG':
      return { ...state, githubConfig: action.payload };
    case 'SET_SHA':
      return { ...state, fileSha: action.payload };
    case 'SET_SYNCING':
      return { ...state, syncing: action.payload };
    case 'SET_SYNC_ERROR':
      return { ...state, syncError: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    data: getInitialData(),
    githubConfig: getGithubConfig(),
    fileSha: null,
    syncing: false,
    syncError: null,
  });

  const saveQueueRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  }, [state.data]);

  // Load from GitHub on mount if configured
  useEffect(() => {
    if (state.githubConfig) loadFromGitHub();
  }, []);

  // Debounced GitHub save on data changes
  useEffect(() => {
    if (!state.githubConfig) return;
    clearTimeout(saveQueueRef.current);
    saveQueueRef.current = setTimeout(() => saveToGitHub(), 1500);
    return () => clearTimeout(saveQueueRef.current);
  }, [state.data]);

  async function loadFromGitHub() {
    const cfg = state.githubConfig;
    if (!cfg) return;
    dispatch({ type: 'SET_SYNCING', payload: true });
    dispatch({ type: 'SET_SYNC_ERROR', payload: null });
    try {
      const { content, sha } = await fetchRepoFile(cfg.token, cfg.owner, cfg.repo);
      if (content) {
        dispatch({ type: 'SET_DATA', payload: content });
        dispatch({ type: 'SET_SHA', payload: sha });
      }
    } catch (e) {
      dispatch({ type: 'SET_SYNC_ERROR', payload: e.message });
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }

  async function saveToGitHub() {
    const cfg = state.githubConfig;
    if (!cfg) return;
    try {
      const newSha = await saveRepoFile(cfg.token, cfg.owner, cfg.repo, state.data, state.fileSha);
      dispatch({ type: 'SET_SHA', payload: newSha });
    } catch (e) {
      dispatch({ type: 'SET_SYNC_ERROR', payload: e.message });
    }
  }

  function setGithubConfig(config) {
    dispatch({ type: 'SET_GITHUB_CONFIG', payload: config });
    if (config) {
      localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(GITHUB_CONFIG_KEY);
    }
  }

  function addUniversity(uni) {
    dispatch({ type: 'ADD_UNIVERSITY', payload: uni });
  }

  function removeUniversity(id) {
    dispatch({ type: 'REMOVE_UNIVERSITY', payload: id });
  }

  function updateUniversity(uni) {
    dispatch({ type: 'UPDATE_UNIVERSITY', payload: uni });
  }

  return (
    <AppContext.Provider value={{
      data: state.data,
      githubConfig: state.githubConfig,
      syncing: state.syncing,
      syncError: state.syncError,
      addUniversity,
      removeUniversity,
      updateUniversity,
      setGithubConfig,
      loadFromGitHub,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
