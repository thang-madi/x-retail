
/////////////////////////////////////////////
// Standard's

import { useLocation, Navigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
// import { DEBUG } from "../commons/constants";
import { RootState } from "../../data-storage";

/////////////////////////////////////////////
// Application's

// import { useSessionParams } from "../hooks/use-params";

/////////////////////////////////////////////
// Main component

// OK
const CheckAuth: React.FC<any> = (props) => {

    const { children } = props

    const { userToken, externalAccount, user } = useSelector((state: RootState) => state.session)
    // const userToken = useSelector((state: RootState) => state.session.userToken)
    // const externalAccount = useSelector((state: RootState) => state.session.externalAccount)
    // const user = useSelector((state: RootState) => state.session.user)
    // console.log("CheckAuth.userToken", userToken)

    // const { params } = useSessionParams()
    const { pathname = '/', search } = useLocation()
    const path = pathname + search

    // console.log('path', path)

    const skippingRoutes = [
        '/landing',
        '/login',
        '/logout',
        '/connect-user',
        '/about',
        '/carts',
        // '/products',
        '/test',
        '/test-mobile',
        '/settings',
        '/view',
        // '/order-view',
        '/uom-classifier',
        '/customer-profile',
    ]
    // console.log("location:")
    // console.log(location)

    if (!userToken && pathname === '/logout') {
        return <Navigate to='/' replace={true} />     // Không còn trường hợp này, vì trong menu không hiển thị Logout nếu như chưa có userToken
    } else if (!userToken && pathname !== '/' && skippingRoutes.findIndex(item => (pathname.startsWith(item))) === -1) {

        return <Navigate to='/login' state={{ path }} />

        // console.log('externalAccount', externalAccount)
        // console.log('user', user)

        // if (!externalAccount) {
        //     return <Navigate to='/login' state={{ path }} />
        //     } else if (!user) {
        //         return <Navigate to='/connect-user' state={{ path }} />
        // } else {
        //     return children
        // }

    } else {
        // console.log('externalAccount', externalAccount)
        return children
    }
}

/////////////////////////////////////////////
// Export's

export default CheckAuth