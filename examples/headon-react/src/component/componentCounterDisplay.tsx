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