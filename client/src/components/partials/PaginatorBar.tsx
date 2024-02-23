import paginatorBarStyle from "../../styles/PaginatorBar.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faAnglesLeft, faArrowLeft, faArrowRight, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

interface PaginatorBarProps {
    currentPageId: number,
    totalPageCount: number,
    changePage: (page: number) => void,
}

const PaginatorBar = ({currentPageId, totalPageCount, changePage}: PaginatorBarProps) => {
    return ( 
        <div className={paginatorBarStyle.container}>
            <div 
                className={paginatorBarStyle.navButton + (currentPageId === 1 ? " opacity-0" : "")}
                onClick={currentPageId !== 1 ? () => changePage(1) : () => {}}
            >
                <FontAwesomeIcon icon={faAnglesLeft} size="1x" />
            </div>
            
            <div 
                className={paginatorBarStyle.navButton + (currentPageId === 1 ? " opacity-0" : "")}
                onClick={currentPageId !== 1 ? () => changePage(currentPageId-1) : () => {}}
            >
                <FontAwesomeIcon icon={faArrowLeft} size="1x" />
            </div>

            {currentPageId}/{totalPageCount}

            <div 
                className={paginatorBarStyle.navButton + (currentPageId === totalPageCount ? " opacity-0" : "")}
                onClick={currentPageId !== totalPageCount ? () => changePage(currentPageId+1) : () => {}}
            >
                <FontAwesomeIcon icon={faArrowRight} size="1x" />
            </div>
            <div 
                className={paginatorBarStyle.navButton + (currentPageId === totalPageCount ? " opacity-0" : "")}
                onClick={currentPageId !== totalPageCount ? () => changePage(totalPageCount) : () => {}}
            >
                <FontAwesomeIcon icon={faAnglesRight} size="1x" />
            </div>   
        </div>
        
     );
}
 
export default PaginatorBar;