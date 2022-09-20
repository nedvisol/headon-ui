# Component Communications

React components used for representing Head-On Elements are rendered on the fly by the Head-On framework. Therefore, there is no direct way for two components to communicate to each other directly by passing props to each other (parent-child relationship.)

The most simple way for two Element components to communicate is by sharing a state. This can be done using plain React Context API. However, the best way that we recommend is to use Redux.

You can either use Redux Hooks or its `connect()` API to get values from the state and dispatch actions. (We like `connect()` API as it increases testability of the components!)

Example

```js
// componentCounterControls.ts
import { connect } from 'react-redux';
import styled from 'styled-components';
import { decrement, increment } from '../counterSlice';
import { AppDispatch } from '../store';

const BorderedDiv = styled.div`
    border: 1px solid black;
    padding: 10px;
`;

interface componentCounterControlsProps {
    increment: ()=>void,
    decrement: ()=>void
}

const _componentCounterControls:React.FC<componentCounterControlsProps> = (props) => {
    const {increment, decrement} = props;
    return (<BorderedDiv>
        <button onClick={()=>{ increment(); }}>Increment Value</button> || 
        <button onClick={()=>{ decrement(); }}>Decrement Value</button>
    </BorderedDiv>)
}

const mapDispatchToProps = (dispatch:AppDispatch) => {
    return {      
      increment: () => dispatch(increment()),
      decrement: () => dispatch(decrement()),      
    }
}

export const componentCounterControls = connect(null, mapDispatchToProps)(_componentCounterControls);
```

```js
// componentCounterDisplay.ts
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';

const BorderedDiv = styled.div`
    border: 1px solid black;
    padding: 10px;
`;

interface componentCounterDisplayProps {
    value: number
}

const _componentCounterDisplay:React.FC<componentCounterDisplayProps> = (props) => {
    const {value} = props;
    return (<BorderedDiv>
        Counter Value: {value}
    </BorderedDiv>)
}

const mapStateToProps = (state:RootState) => ({ value: state.counter.value });

export const componentCounterDisplay = connect(mapStateToProps)(_componentCounterDisplay);
```

The components can be added to the Component Registry like any other components:

```js
import { componentCounterControls } from './component/componentCounterControls';
import { componentCounterDisplay } from './component/componentCounterDisplay';

export const componentRegistry:ComponentRegistry = {
    componentCounterControls: {
      componentType: componentCounterControls
    },
    componentCounterDisplay: {
      componentType: componentCounterDisplay
    }
  };
```

The full working code can be found in [the examples](../examples/headon-react/)