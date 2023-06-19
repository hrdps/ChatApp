import './App.scss';
import { app } from './Components/firebase';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react';
import Message from './Components/Message';
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logout = () => signOut(auth);

function App() {
  const q = query(collection(db, 'Messages'), orderBy('createdAt', 'asc'));
  const [state, setState] = useState(false);
  const [pavatar, setPavatar] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const scrolltoend = useRef(null);
  const submithandler = async (e) => {
    e.preventDefault();

    try {
      if (message) {
        setMessage('');
        await addDoc(collection(db, 'Messages'), {
          text: message,
          uid: state.uid,
          uri: state.photoURL,
          createdAt: serverTimestamp(),
        });

        scrolltoend.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const getMessages = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });
    const getuserdata = onAuthStateChanged(auth, (data) => {
      setState(data);
      setPavatar(data.photoURL);
    });
    return () => {
      getMessages();
      getuserdata();
    };
  }, []);
  return (
    <Box bg={'red.200'}>
      {state ? (
        <Container h={'100vh'} bg={'white'} className='cont'>
          <VStack h={'full'}>
            <Button w={'full'} colorScheme={'red'} onClick={logout}>
              Logout
            </Button>
            <VStack h={'full'} w={'full'} overflowY={'auto'}>
              <Message text='Sample Text' uri={pavatar} />
              <Message text='Sample Text' user='me' />
              <Message text='Sample Text' />
              <Message text='Sample Text' user='me' />
              <Message text='Sample Text' />
              <Message text='Sample Text' />
              <Message text='Sample Text' user='me' />
              <Message text='Sample Text' />
              <Message text='Sample Text' user='me' />
              <Message text='Sample Text' />
              <Message text='Sample Text' />
              <Message text='Sample Text' user='me' />
              <Message text='Sample Text' />
              <Message text='Sample Text' user='me' />
              <Message text='Sample Text' />
              {messages.map((item) => (
                <Message
                  text={item.text}
                  uri={item.uri}
                  user={item.uid === state.uid ? 'me' : 'other'}
                  key={item.id}
                />
              ))}
              <div ref={scrolltoend}></div>
            </VStack>
            <form onSubmit={submithandler} style={{ width: '100%' }}>
              <HStack w={'full'}>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ border: '1px solid rgb(173, 173, 173)' }}
                  placeholder='Enter a Message...'
                />
                <Button type='submit' bg={'green.200'}>
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack>
          <Button onClick={loginHandler}>Login</Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
