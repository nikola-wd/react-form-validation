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

const validateEmail = (emailString) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(emailString);
};

const validateField = (state, fieldName, fieldValue) => {
  let valid = true;
  if (!state[fieldName].hasOwnProperty('validation')) return valid;

  Object.entries(state[fieldName].validation).forEach(([key, val]) => {
    if (key === 'min') {
      if (fieldValue.length < val) {
        valid &= false;
      }
    }
    if (key === 'email') {
      valid &= validateEmail(fieldValue);
    }
  });
  return !!valid;
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
    case 'isValid':
      updatedState[action.name] = {
        ...updatedState[action.name],
        valid: action.isValid,
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

  const handleValidateField = (e) => {
    dispatch({
      type: 'isValid',
      name: e.target.name,
      isValid: validateField(state, e.target.name, e.target.value),
    });
  };

  return (
    <div>
      <form onSubmit={tryFormSubmit} noValidate>
        <input
          type="text"
          value={state.name.value}
          onChange={handleUpdateField}
          onKeyUp={handleValidateField}
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
          onKeyUp={handleValidateField}
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
          onKeyUp={handleValidateField}
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
