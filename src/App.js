import { useEffect, useState } from "react";
import axios from "axios";
import sha1 from 'crypto-js/sha1';

function App() {

  const publicKey = '38cd79b5f2b2486d86f562e3c43034f8'
  const privateKey = '8e49ff607b1f46e1a5e8f6ad5d312a80'

  const [orders, setOrders] = useState([])
  const [requestToken, setRequestToken] = useState('')
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('')

 useEffect(() => {
    axios.get('https://api.pixlpark.com/oauth/requesttoken')
      .then(authToken => {
        setRequestToken(authToken.data.RequestToken)
        const hash = sha1(authToken.data.RequestToken + privateKey)
        axios.get(`https://api.pixlpark.com/oauth/accesstoken?oauth_token=${authToken.data.RequestToken}&grant_type=api&username=${publicKey}&password=${hash.toString()}`)
          .then(res => {
            setAccessToken(res.data.AccessToken)
            setRefreshToken(res.data.RefreshToken)
          })
          .catch(tokensErr => console.log(tokensErr))
      })
      .catch(err => console.log(err))
  }, [])

  const getOrders = () => {
    axios.get(`https://api.pixlpark.com/orders?oauth_token=${accessToken}`)
      .then(orders => {setOrders(orders.data.Result)})
      .catch(ordersErr => console.log(ordersErr))
  }

  return (
    <div className="App">
      <button onClick={getOrders}>Вывести список заказов</button>
      <ul>
        {orders && orders.map(order => (
          <li key={order.Id}>{order.Title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
