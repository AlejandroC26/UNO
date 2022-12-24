import '../assets/css/card.css';
import UnoIMG from '../assets/img-game/uno.png';

export default function Card({visible, color, angulo, number, style, clickEvent}){
    style = {...style, '--angulo': angulo}
    return (
        <>
        <div className='card' style={style}> {
            visible ? (
                <>
                    <div 
                        onClick={clickEvent}
                        className="card-background" 
                        style={{
                            "--color": color
                        }}
                    >
                        <div className="card-top">
                            <span>{number}</span>
                        </div>
                        <div className="card-middle">
                            <div className="big-number">{number}</div>
                            <div className="card-oval"></div>
                        </div>
                        <div className="card-bottom">
                            <span>{number}</span>
                        </div>
                    </div>
                </>
            ) : (<>
                <div className='card-background hidden-card' style={{"--color":"#000"}}>
                    <img src={UnoIMG} alt=""/>
                </div>
            </>)
        } </div>
        </>
    )
}