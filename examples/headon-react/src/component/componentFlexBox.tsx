import styled from 'styled-components';
import { RenderView } from '@headon/react';
import {HeadOnElement} from '@headon/core';


interface IcomponentFlexBoxProps {
    direction: string,
    items: HeadOnElement[],
    cssClass: string
}

const FlexBox = styled.div`
display: flex;
`;


export function componentFlexBox(props: IcomponentFlexBoxProps) {
    const {direction, items, cssClass} = props;
    return (
        <FlexBox style={{flexDirection: direction as 'row'|'column'}} className={cssClass}>
            <RenderView view={{items}} />
        </FlexBox>
    )
}