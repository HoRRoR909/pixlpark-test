import { useEffect, useState } from "react";
import axios from "axios";
import sha1 from 'crypto-js/sha1';

function App() {

  const publicKey = '38cd79b5f2b2486d86f562e3c43034f8'
  const privateKey = '8e49ff607b1f46e1a5e8f6ad5d312a80'

  const [orders, setOrders] = useState([])

  useEffect(() => {
    axios.get('http://api.pixlpark.com/oauth/requesttoken')
      .then(authToken => {
        const hash = sha1(authToken.data.RequestToken + privateKey)
        axios.get(`http://api.pixlpark.com/oauth/accesstoken?oauth_token=${authToken.data.RequestToken}&grant_type=api&username=${publicKey}&password=${hash.toString()}`)
          .then(AccessToken => {
            axios.get(`http://api.pixlpark.com/orders?oauth_token=${AccessToken.data.AccessToken}`)
            .then(orders => {
              console.log(orders.data.Result);
              setOrders(orders.data.Result)
            })
            .catch(ordersErr => console.log(ordersErr))
          })
          .catch(accessErr => console.log(accessErr))
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="App">
      <ul>
        {orders && orders.map(order => (
          <li key={order.Id}>{order.Title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
