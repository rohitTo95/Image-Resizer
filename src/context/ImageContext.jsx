import { createContext, useContext, useReducer, useCallback } from 'react';

const ImageContext = createContext(null);

const initialState = {
  images: [],
  groups: {},
  processing: false,
  progress: { current: 0, total: 0 },
  processedImages: {},
  settings: {
    cropEnabled: false,
    webpEnabled: false,
    webpMode: 'high',
    webpQuality: 92,
  },
  customResize: {
    width: '',
    height: '',
  },
  selectedGroup: null,
  preview: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_IMAGES': {
      const merged = [...state.images];
      for (const img of action.payload) {
        if (!merged.find((m) => m.id === img.id)) merged.push(img);
      }
      const groups = buildGroups(merged);
      return { ...state, images: merged, groups };
    }
    case 'REMOVE_IMAGE': {
      const images = state.images.filter((img) => img.id !== action.payload);
      const groups = buildGroups(images);
      return { ...state, images, groups };
    }
    case 'CLEAR_ALL':
      state.images.forEach((img) => {
        if (img.thumbnail) URL.revokeObjectURL(img.thumbnail);
      });
      return { ...initialState };
    case 'SET_PROCESSING':
      return { ...state, processing: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_PROCESSED_IMAGES':
      return {
        ...state,
        processedImages: { ...state.processedImages, ...action.payload },
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_CUSTOM_RESIZE':
      return { ...state, customResize: { ...state.customResize, ...action.payload } };
    case 'SET_SELECTED_GROUP':
      return { ...state, selectedGroup: action.payload };
    case 'SET_PREVIEW':
      return { ...state, preview: action.payload };
    default:
      return state;
  }
}

function buildGroups(images) {
  return images.reduce((acc, img) => {
    const key = img.dimensionKey;
    if (!acc[key]) {
      acc[key] = {
        id: key,
        width: img.width,
        height: img.height,
        aspectRatio: img.aspectRatio,
        images: [],
      };
    }
    acc[key].images.push(img);
    return acc;
  }, {});
}

export function ImageProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addImages = useCallback((images) => {
    dispatch({ type: 'ADD_IMAGES', payload: images });
  }, []);

  const removeImage = useCallback((id) => {
    dispatch({ type: 'REMOVE_IMAGE', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const updateSettings = useCallback((settings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const setCustomResize = useCallback((dims) => {
    dispatch({ type: 'SET_CUSTOM_RESIZE', payload: dims });
  }, []);

  const setSelectedGroup = useCallback((groupId) => {
    dispatch({ type: 'SET_SELECTED_GROUP', payload: groupId });
  }, []);

  const setProcessing = useCallback((val) => {
    dispatch({ type: 'SET_PROCESSING', payload: val });
  }, []);

  const setProgress = useCallback((progress) => {
    dispatch({ type: 'SET_PROGRESS', payload: progress });
  }, []);

  const setProcessedImages = useCallback((map) => {
    dispatch({ type: 'SET_PROCESSED_IMAGES', payload: map });
  }, []);

  const setPreview = useCallback((preview) => {
    dispatch({ type: 'SET_PREVIEW', payload: preview });
  }, []);

  return (
    <ImageContext.Provider
      value={{
        ...state,
        addImages,
        removeImage,
        clearAll,
        updateSettings,
        setCustomResize,
        setSelectedGroup,
        setProcessing,
        setProgress,
        setProcessedImages,
        setPreview,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export function useImageContext() {
  const ctx = useContext(ImageContext);
  if (!ctx) throw new Error('useImageContext must be used within ImageProvider');
  return ctx;
}
