import React, { useState, useReducer } from 'react';
import { useForm } from './useForm';

import CustomSelect from './CustomSelect';

import './style.css';

export default function App() {
  const {
    state,
    formDirty,
    allFieldsValid,
    loading,
    handleUpdateField,
    handleValidateAllFields,
    tryFormSubmit,
    getFieldStateCls,
  } = useForm();

  const [activeSelectOption, setActiveSelectOption] = useState(
    selectOptions[0]
  );

  return (
    <div>
      {formDirty ? 'Form Dirty' : 'Form Not Dirty'}
      <br />
      {allFieldsValid ? 'All Fields Valid' : 'Not All Fields Valid'}
      <br />
      {activeSelectOption.label}
      <form onSubmit={tryFormSubmit} noValidate>
        <input
          type="text"
          value={state.name.value}
          onChange={handleUpdateField}
          onKeyUp={handleValidateAllFields}
          placeholder={state.name.placeholder}
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
          onKeyUp={handleValidateAllFields}
          placeholder={state.email.placeholder}
          name="email"
          className={`${getFieldStateCls('email')}`}
        />
        <pre>
          <code>{JSON.stringify(state.email, null, 2)}</code>
        </pre>

        <CustomSelect
          activeOption={state.interest.value}
          onSelectNew={(selectedOption) =>
            setActiveSelectOption(selectedOption)
          }
          options={state.interest.options}
        />

        <textarea
          value={state.message.value}
          onChange={handleUpdateField}
          onKeyUp={handleValidateAllFields}
          placeholder={state.message.placeholder}
          name="message"
          className={`${getFieldStateCls('message')}`}
        />
        <pre>
          <code>{JSON.stringify(state.message, null, 2)}</code>
        </pre>

        <button type="submit">{!loading ? 'SUBMIT' : '...'}</button>

        {formDirty && !allFieldsValid && (
          <h4
            style={{
              color: '#fff',
              backgroundColor: 'crimson',
              padding: '6px',
            }}
          >
            Please populate all the fields correctly and try again
          </h4>
        )}
      </form>
    </div>
  );
}
