interface CalendarCellTitleProps {
    content: string,
}

const CalendarCellTitle = ({content}: CalendarCellTitleProps) => {
    return ( 
    <>
        <div className="bg-light text-center" style={{height : "1.5em"}}>
            {content}
        </div>
    </> 
    );
}
 
export default CalendarCellTitle;