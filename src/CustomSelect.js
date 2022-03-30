import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = (props) => {
  const {
    options,
    activeOption,
    onChange,
    validationCls,
    handleValidateAllFields,
    formState,
    name,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const ddRef = useRef(null);

  const customSelectValue = formState[name].value.label;

  const handleSelectNew = (optionObj) => {
    onChange(optionObj);
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
  }, []);

  const handleClickOutside = (e) => {
    if (ddRef.current && !ddRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    handleValidateAllFields();
  }, [customSelectValue]);

  return (
    <div>
      {('Validation Class: ', validationCls)}
      <div ref={ddRef} className={`dropdown ${isOpen ? 'show' : ''}`}>
        <button
          type="button"
          className={`dropdown-toggle ${validationCls}`}
          onClick={() => setIsOpen((prevOpen) => !prevOpen)}
        >
          <span>{activeOption.label}</span>
        </button>
        <div className={`dropdown__content ${isOpen ? 'block' : 'hidden'}`}>
          {options.map((option) => {
            const isActive = activeOption.value === option.value;

            return (
              <div key={option.value}>
                <button
                  type="button"
                  className={`option ${isActive ? 'active' : ''}`}
                  data-value={option.value}
                  onClick={() => handleSelectNew(option)}
                >
                  {option.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
