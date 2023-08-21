import { useEffect} from 'react';
import Async from '../utils/Async';

function Gate(props) {
    useEffect( _ => {
        console.log(props)
    })
};


export default Gate;
