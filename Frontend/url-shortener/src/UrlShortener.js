import {useEffect, useState} from 'react';
import axios from 'axios';

function UrlShortener () {

    // State for long_url which user types in while submitting
    const [longUrl, setLongUrl] = useState('');
    
    // State for short_url that we show to the user when he has shortened a url
    const [shortUrl, setShortUrl] = useState('');

    // useEffect will be called at start rendering. We call backend here if our path contains some suffix
    useEffect(() => {
        let path = window.location.pathname;
        if (path !== '/') {
            axios.post('http://ip/retrieveLongURL', { // Here ip needs to be changed to the ip of your instance
                short_url: `http://bit.ly${path}`
            }).then (res => {
                console.log(res);
                window.location = res.data.url; // We redirect to that long_url we get form backend
            }).catch(err => {
                window.location.pathname = '/';
            })
        }
        
    }, [])

    // This is for handling when user types in the text box for the url he/she wants to shorten
    const onChange = (e) => {
        setLongUrl(e.target.value);
    }

    //  On click of shorten button we call shorten API with long url that user had put in the text box and is in state
    const shorten = () => {
        axios.post('ip/shorten', { // Again replace ip of your instance of AWS
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
