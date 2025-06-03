import Skeleton from 'react-loading-skeleton'
import React, { useContext, useEffect, useState, useRef } from 'react';
import classes from './EnvironmentCard.module.css';
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from "../../../../../../Context/Colors";

const EnvironmentCard = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [dominantColor, setDominantColor] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (props.logo_url) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let r = 0, g = 0, b = 0, count = 0;
                for (let i = 0; i < imageData.length; i += 20) {
                    r += imageData[i];
                    g += imageData[i + 1];
                    b += imageData[i + 2];
                    count++;
                }
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                const hexColor = `rgba(${r}, ${g}, ${b}, 0.85)`;
                setDominantColor(hexColor);
            };
            
            img.onerror = () => {
                console.error("Error loading image for color extraction");
                setDominantColor(null);
            };
            
            img.src = props.logo_url;
        }
    }, [props.logo_url]);

    return (
        <div 
            className={classes.mainContainer} 
            onClick={props.onClick} 
            style={{
                backgroundColor: colors.secondBackground[_mode], 
                border: '1px solid '+ colors.border[_mode],
                '--hover-border-color': dominantColor || '#0861AF'
            }}
        >
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            { props.logo_url 
                ? <div className={classes.illustration} style={{
                    backgroundColor: colors.dashboardEnvs[_mode], 
                    '--logo-image': `url('${props.logo_url}')`
                }}></div>
                : <div className={classes.illustration} style={{backgroundColor: colors.dashboardEnvs[_mode]}}></div>
            }
            <div className={classes.textEnv}>
                <div style={{color: colors.mainText[_mode]}}>
                    <h1 className={classes.environmentText}>
                        {props.loading ?
                            <Skeleton style={{opacity: colors.opacity[_mode]}}/> :
                            props.name
                        }
                    </h1>
                </div>
                <div style={{ marginTop: '10px', color: colors.secondText[_mode]}}>
                    {props.loading ?
                        <Skeleton count={5} height={10} style={{opacity: colors.opacity[_mode]}}/> :
                        <h5 className={classes.descriptionText}>
                            {props.description}
                        </h5>
                    }
                </div>
            </div>
        </div>
    )
}

export default EnvironmentCard