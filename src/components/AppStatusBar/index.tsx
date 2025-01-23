
import { isFullscreenAndroid, isFullscreenIOS } from '../../commons/telegram'
import './index.css'

function AppStatusBar() {

    return (
        <div className={(isFullscreenAndroid() || isFullscreenIOS()) && 'status-bar-mobile' || 'status-bar'} >

        </div >
    )
}

export default AppStatusBar