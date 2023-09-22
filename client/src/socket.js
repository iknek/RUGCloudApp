import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Adjust the address if your server is running on a different domain or port

export default socket;