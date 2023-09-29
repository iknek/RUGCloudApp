import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:16025'); // Adjust the address if your server is running on a different domain or port

export default socket;