import { io } from 'socket.io-client';

const socket = io('http://10.104.98.217.default.svc.cluster.local:81'); // Adjust the address if your server is running on a different domain or port

export default socket;