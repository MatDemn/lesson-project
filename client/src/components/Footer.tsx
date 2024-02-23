import { Table } from "react-bootstrap";
import FooterStyles from "../styles/Footer.module.css";

const Footer = () => {
    return ( 
        <div className={FooterStyles.container}>
            <div className="text-center">
                Mateusz Demon
                <span className="text-primary">©2024</span>
            </div>
            
        </div> 
    );
}
 
export default Footer;