/** @jsxImportSource @emotion/react */

import { css, jsx } from '@emotion/react';
import { HeadOnElement } from '@headon/core';
import { RenderView } from '@headon/react';


interface IcomponentFlexBoxProps {
    direction: string,
    items: HeadOnElement[],
    cssClass: string
}


export function componentFlexBox(props: IcomponentFlexBoxProps) {
    const {direction, items, cssClass} = props;
    const style = css`
        display: flex;
        flex-direction: ${direction}
    `;
    return (
        <div css={style} className={cssClass}>
            <RenderView view={{items}} />
        </div>
    )
}