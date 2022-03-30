import React, { useState, useReducer } from 'react';
import './style.css';

const initialFieldsStates = {
  name: {
    value: 'asdasdasd',
    placeholder: 'Name',
    validation: {
      min: 2,
    },
    type: 'text',
    dirty: false,
    valid: false,
  },
  email: {
    value: '',
    placeholder: 'Email',
    type: 'email',
    validation: {
      min: 4,
      email: true,
    },
    dirty: false,
    valid: false,
  },
  message: {
    value: '',
    placeholder: 'Message',
    validation: {
      min: 50,
    },
    type: 'text',
    dirty: false,
    valid: false,
  },
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validateField = (fieldName) => {
  let valid = true;
  if (!state[fieldName].hasOwnProperty('validation')) return valid;

  Object.entries(state[fieldName].validation).forEach(([key, valObj]) => {
    if (key === 'min') {
      if (valObj.value.length < key) {
        valid &= false;
      }
    }
    if (key === 'email') {
      valid &= String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }
  });
  return valid;
};

const validationReducer = (state, action) => {
  const updatedState = { ...state };

  switch (action.type) {
    case 'setDirthy':
      updatedState[action.name] = {
        ...updatedState[action.name],
        dirty: true,
      };
      return { ...updatedState };
    case 'setAllDirty':
      Object.keys(updatedState).forEach((fieldName) => {
        updatedState[fieldName] = {
          ...updatedState[fieldName],
          dirty: true,
        };
      });
      return { ...updatedState };
    case 'update':
      // TODO: Check validity here, and if it's dirty and not valid, update valid to false
      updatedState[action.name] = {
        ...updatedState[action.name],
        value: action.value,
      };
      return { ...updatedState };
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(validationReducer, initialFieldsStates);
  const [formDirty, setFormDirty] = useState(false);

  const getFieldStateCls = (fieldName) => {
    if (!formDirty && !state[fieldName].dirty) {
      return '';
    }

    if (formDirty && state[fieldName].dirty) {
      if (!state[fieldName].valid) {
        return 'error';
      } else if (state[fieldName].valid) {
        return 'valid';
      }
    }
  };
  // validateField
  const tryFormSubmit = (e) => {
    e.preventDefault();
    setFormDirty(true);
    dispatch({ type: 'setAllDirty' });

    // If not all invalid, continue
    alert('Continue now');
  };

  const handleUpdateField = (e) => {
    if (!formDirty && !state[e.target.name].dirty) {
      dispatch({ type: 'setDirty', name: e.target.name });
    }

    dispatch({ type: 'update', name: e.target.name, value: e.target.value });
  };

  const handleValidateField = (e) => {};

  return (
    <div>
      <form onSubmit={tryFormSubmit} noValidate>
        <input
          type="text"
          value={state.name.value}
          onChange={handleUpdateField}
          placeholder="Name"
          name="name"
          className={`${getFieldStateCls('name')}`}
        />
        <pre>
          <code>{JSON.stringify(state.name, null, 2)}</code>
        </pre>

        <input
          type="email"
          value={state.email.value}
          onChange={handleUpdateField}
          placeholder="Email"
          name="email"
          className={`${getFieldStateCls('email')}`}
        />
        <pre>
          <code>{JSON.stringify(state.email, null, 2)}</code>
        </pre>

        <textarea
          value={state.message.value}
          onChange={handleUpdateField}
          placeholder="Message"
          name="message"
          className={`${getFieldStateCls('message')}`}
        />
        <pre>
          <code>{JSON.stringify(state.message, null, 2)}</code>
        </pre>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
