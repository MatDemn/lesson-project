import paginatorBarStyle from "../../styles/PaginatorBar.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faAnglesLeft, faArrowLeft, faArrowRight, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

interface PaginatorBarProps {
    currentPageId: number,
    totalPageCount: number,
}

const PaginatorBar = ({currentPageId, totalPageCount}: PaginatorBarProps) => {
    return ( 
        <div className={paginatorBarStyle.container}>
            <div className={paginatorBarStyle.navButton}>
                <FontAwesomeIcon icon={faAnglesLeft} size="1x" />
            </div>
            <div className={paginatorBarStyle.navButton}>
                <FontAwesomeIcon icon={faArrowLeft} size="1x" />
            </div>

            {currentPageId}/{totalPageCount}

            <div className={paginatorBarStyle.navButton}>
                <FontAwesomeIcon icon={faArrowRight} size="1x" />
            </div>
            <div className={paginatorBarStyle.navButton}>
                <FontAwesomeIcon icon={faAnglesRight} size="1x" />
            </div>   
        </div>
        
     );
}
 
export default PaginatorBar;