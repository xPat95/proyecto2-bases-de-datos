import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  notification: {
    type: '',
    message: ''
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SHOW_SUCCESS':
      return {
        ...state,
        notification: { type: 'success', message: action.payload }
      };
    case 'SHOW_ERROR':
      return {
        ...state,
        notification: { type: 'error', message: action.payload }
      };
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notification: { type: '', message: '' }
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    notification: state.notification,
    clearNotification: () => dispatch({ type: 'CLEAR_NOTIFICATION' }),
    showSuccess: (message) => dispatch({ type: 'SHOW_SUCCESS', payload: message }),
    showError: (message) => dispatch({ type: 'SHOW_ERROR', payload: message })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider');
  }
  return context;
}
