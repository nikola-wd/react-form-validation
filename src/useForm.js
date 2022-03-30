import React, { useState, useReducer } from 'react';

const selectOptions = [
  {
    id: 0,
    value: 'Select one option',
    label: 'Select one option',
  },
  {
    id: 1,
    value: 'Have an engineering team, want to augment 🤘',
    label: 'Have an engineering team, want to augment 🤘',
  },
  {
    id: 2,
    value: 'Looking for a standalone product team 🧑‍🚀',
    label: 'Looking for a standalone product team 🧑‍🚀',
  },
  {
    id: 3,
    value: 'Still defining the team, looking for magic ⚡️',
    label: 'Still defining the team, looking for magic ⚡️',
  },
];

const initialFieldsStates = {
  name: {
    value: 'asdasdasd',
    placeholder: 'Name',
    validation: {
      min: 2,
    },
    type: 'text',
    dirty: false,
    valid: true,
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
    valid: true,
  },
  interest: {
    type: 'custom-select',
    options: selectOptions,
    value: selectOptions[0],
    validation: {
      customSelect: {
        not: 0,
      },
    },
  },
  message: {
    value: '',
    placeholder: 'Message',
    validation: {
      min: 50,
    },
    type: 'text',
    dirty: false,
    valid: true,
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

const useForm = () => {
  const [state, dispatch] = useReducer(validationReducer, initialFieldsStates);
  const [formDirty, setFormDirty] = useState(false);
  const [allFieldsValid, setAllFieldsValid] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setFormDirty(true);
    dispatch({ type: 'setAllDirty' });

    // If not all invalid, continue
    if (!formDirty) {
      handleValidateAllFields();
    }
    if (!allFieldsValid) {
      setLoading(false);
      return;
    }

    // TODO: If request successful, then setLoading to false
    setLoading(false);
    alert('Continue now');
  };

  const handleUpdateField = (e, fieldName = false, fieldValue = false) => {
    let name, value;

    if (e !== null) {
      name = e.target.name;
      value = e.target.value;
    } else if (fieldName && fieldValue) {
      name = fieldName;
      value = fieldValue;
    }

    if (!formDirty && !state[name].dirty) {
      dispatch({ type: 'setDirty', name: name });
    }

    dispatch({ type: 'update', name: name, value: value });
  };

  const handleValidateAllFields = () => {
    let allFieldsValidStates = true;

    Object.keys(state).forEach((fieldName) => {
      let fieldValidState = validateField(
        state,
        fieldName,
        state[fieldName].value
      );

      allFieldsValidStates &= fieldValidState;

      dispatch({
        type: 'isValid',
        name: fieldName,
        isValid: fieldValidState,
      });
    });

    setAllFieldsValid(!!allFieldsValidStates);
    return !!allFieldsValidStates;
  };

  return {
    state,
    dispatch,
    formDirty,
    allFieldsValid,
    loading,
    handleUpdateField,
    handleValidateAllFields,
    tryFormSubmit,
    getFieldStateCls,
  };
};

export { useForm };
