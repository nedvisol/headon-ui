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
