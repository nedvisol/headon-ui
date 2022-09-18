interface IcomponentTitleParagraphProps {
    title: string,
    paragraph: string,
    cssClass: string
}
export function componentTitleParagraph(props: IcomponentTitleParagraphProps) {
    const {title, paragraph, cssClass} = props;
    return (
        <div className={cssClass}>
            <h1>{title}</h1>
            <p>{paragraph}</p>
        </div>
    )
}