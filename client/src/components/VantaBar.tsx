import { useEffect, useRef, useState } from "react"
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min'
import vantaStyles from '../styles/VantaStyles.module.css';

const VantaBar = () => {
    const [vantaEffect, setVantaEffect] = useState<any>(null)
    const myRef = useRef(null)
    useEffect(() => {
        if (!vantaEffect) {
        setVantaEffect(NET({
            el: myRef.current,
            THREE: THREE,
            minHeight: 1000.00,
            color: 0x5c3441,
            backgroundColor: 0x1f221f,
            showDots: false,
        }))
        }
        return () => {
        if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect])


    return ( 
        <div ref={myRef} className={vantaStyles.container}>
            Lesson Project!
        </div>
     );
}
 
export default VantaBar;


