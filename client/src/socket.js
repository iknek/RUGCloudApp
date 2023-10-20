import { io } from 'socket.io-client';

const socket = io('http://195.169.23.74:81/'); // Adjust the address if your server is running on a different domain or port

export default socket;