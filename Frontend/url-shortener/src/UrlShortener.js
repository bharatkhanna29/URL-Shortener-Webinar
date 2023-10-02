import {useEffect, useState} from 'react';
import axios from 'axios';

function UrlShortener () {

    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');

    useEffect(() => {
        let path = window.location.pathname;
        if (path !== '/') {
            axios.post('http://3.91.149.227:3005/retrieveLongURL', {
                short_url: `http://bit.ly${path}`
            }).then (res => {
                console.log(res);
                window.location = res.data.url;
            }).catch(err => {
                window.location.pathname = '/';
            })
        }
        
    })

    const onChange = (e) => {
        setLongUrl(e.target.value);
    }

    const shorten = () => {
        axios.post('http://3.91.149.227:3005/shorten', {
            long_url: longUrl
        }).then (res => {
            setShortUrl(res.data.short_url);
        })
    }

    return (
        <div>
            <label>Long URL</label>
            <input type="text" id="long-url" onChange={onChange}/>
            <button onClick={shorten}>Shorten</button>
            <div>{shortUrl ? shortUrl: ""}</div>
        </div>
    );
}

export default UrlShortener;
