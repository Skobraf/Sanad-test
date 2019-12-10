import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import  './form.css';

function canHaveChildren(type) {
    return type === 'array' || type === 'structure';
};

function Form({ item, ...props }) {
    
    const [ visible, setVisible ] = useState(false);
    const typeRef = useRef();
    const textRef = useRef();
    const valueRef = useRef();

    useEffect(() => {
        textRef.current.focus();
    }, []);

    const losingFocus = ( e ) => {
        if( e.target.value === '' ) {
            e.target.style.border = ' 2px solid red';
        } else {
            e.target.style = 'none';
        }
    };
    const toggleVisibility = (value) => {
        setVisible(value === 'array' || value === 'structure'); 
    };

    const addItem = e => {
        e.preventDefault();
        const { id, parents } = item;

        props.addItem( [ ...parents, id ] );
    };

    const removeItem = e => {
        e.preventDefault();
        const { id, parents } = item;

        props.removeItem( parents, id );
    };

    const updateItem = () => {
        const { id, parents, type } = item;
        const value = typeRef.current.value === 'array' || typeRef.current.value === 'structure' ? '' :  valueRef.current && valueRef.current.value || null;
        const values = {
            type: typeRef.current.value,
            text: textRef.current.value,
            value, 
        };

        const removeChilds = canHaveChildren(type) && !canHaveChildren(typeRef.current.value);
        props.updateItem( parents, id, values, removeChilds );
    };

    const handleSelectChange = (e) => {
        const { value } = e.target;

        toggleVisibility(value);
        updateItem();
    }; 

    const { children } = item;
    return (
        <ul>
            <li>
                <form>
                    <input
                        type="text"
                        name="name"
                        value={item.text}
                        placeholder="Name"
                        ref={textRef}
                        onChange={updateItem}
                        onBlur={losingFocus}
                    />
                    <select
                        name="valeur"
                        value={item.type}
                        ref={typeRef}
                        onChange={handleSelectChange}
                    >
                        <option value="text">text</option>
                        <option value="boolean">Boolean</option>
                        <option value="number">Number</option>
                        <option value="structure">Structure</option>
                        <option value="array">Array</option>
                        <option value="date">Date</option>
                    </select>
                    {
                        visible &&
                        <button onClick={addItem}>Add</button>
                        ||
                        <input
                            type="text"
                            value={item.value}
                            placeholder="Value"
                            ref={valueRef}
                            onChange={updateItem}
                        />
                    }
                    <button onClick={removeItem}>remove</button>
                </form>
            </li>
            <ul>
                {Object.entries( children ).map( ( [ key, data ] ) => (
                    <Form
                        key={key}
                        item={data}
                        addItem={props.addItem}
                        updateItem={props.updateItem}
                        removeItem={props.removeItem}
                    />
                ) )}
            </ul>
        </ul>
    );
}
Form.propTypes = {
    item: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
};
export default Form;
