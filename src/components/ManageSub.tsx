import { api } from "components/utils/api";
import react, {useEffect, useState} from 'react';


const ManageSub: react.FC = () => {
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if(redirect){
            window.location.href = 'https://billing.stripe.com/p/login/test_dR66rid5kaHg8Zq4gg'
        }
    }, [redirect])

    return (
        <button onClick={() => setRedirect(true)}>
            Manage Sub
        </button>
    )
}

export default ManageSub;