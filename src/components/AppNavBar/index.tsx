
import { isFullscreenAndroid } from '../../commons/telegram'
import './index.css'

function AppNavBar() {

    return (
        <div className={isFullscreenAndroid() && 'nav-bar-android' || 'nav-bar'} >
            {/* <div className='nav-bar-android' > */}
        </div >
    )
}

export default AppNavBar