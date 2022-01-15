import axios from 'axios';


export const setAuthHeader = () => {
    const [token, setToken] = useState('');
    
    var Buffer = require('buffer/').Buffer

    useEffect(() => {
		axios('https://accounts.spotify.com/api/token', {
			'method': 'POST',
			'headers': {
				 'Content-Type':'application/x-www-form-urlencoded',
				 'Authorization': 'Basic ' + (new Buffer('f5910041cd764887a9ddb43e035a8b8a' + ':' + '5ee27ed26cac40d6a98aa43ce98478b5').toString('base64')),
			},
			data: 'grant_type=client_credentials'
		}).then(tokenresponse => {
			console.log(tokenresponse.data.access_token);
			setToken(tokenresponse.data.access_token);
        }).catch(error => console.log(error));

	}, []);

    return token;
};
