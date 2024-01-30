import tagPillStyle from '../../styles/TagPill.module.css';

export interface TagPillProps {
    content: string
}

const TagPill = ({content} : TagPillProps) => {
    return ( 
        <div className={tagPillStyle.content}>
            {content}
        </div>
     );
}
 
export default TagPill;