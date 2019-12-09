import React, { useState } from 'react';
import { removeIn, setIn, updateIn } from 'immutable';

import Form from './Form/Form';
import './App.css';


function removeChild( source, parents, id ) {
    const path = parents.reduce( ( res, id ) => {
        res.push( id, 'children' );
        return res;
    }, [] );

    return removeIn( source, [ ...path, id ] );
}

function addChild( source, parents, item ) {
    const path = parents.reduce( ( res, id ) => {
        res.push( id, 'children' );
        return res;
    }, [] );

    return setIn( source, [ ...path, item.id ], item.value );
}

function updateChild( source, parents, id, data ) {
    const path = parents.reduce( ( res, id ) => {
        res.push( id, 'children' );
        return res;
    }, [] );

    return updateIn( source, [ ...path, id ], ( val ) => ( {
        ...val,
        ...data,
    } ) );
}

function App() {
    const [ tree, setTree ] = useState( {} );

    const addItem = ( parents = [] ) => {
        const id = Math.random().toString( 36 ).substr( 2, 9 );
        const item = {
            id,
            parents,
            name: '',
            type: '',
            value: null,
            children: {},
        };

        setTree( ( tree ) => {
            return addChild( tree, parents, {
                id,
                value: item,
            } );
        } );
    };


    const removeItem = ( parents, id ) =>  {
        setTree( (tree) => {
            return removeChild( tree, parents, id );
        } );
    };

    const updateItem = ( parents, id, values ) => {
        setTree( ( tree ) => {
            return updateChild( tree, parents, id, values );
        });
    };

    const handleAddItem = ( e ) => {
        e.preventDefault();
        addItem();
    };

    return (
        <div>
            {Object.entries( tree ).map( ( [ key, data ] ) => (
                <Form
                    key={key}
                    item={data}
                    addItem={addItem}
                    updateItem={updateItem}
                    removeItem={removeItem}
                />
            ) )}
            <button type="button" onClick={handleAddItem}>Add new</button>
        </div>
    );
}

export default App;
