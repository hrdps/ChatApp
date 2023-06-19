import React from 'react';
import { HStack, Avatar } from '@chakra-ui/react';

const Message = ({ text, uri, user = 'other' }) => {
  return (
    <HStack
      className='mcont'
      paddingX={3}
      paddingY={1}
      bg={'gray.200'}
      alignSelf={user === 'me' ? 'flex-end' : 'flex-start'}>
      {user === 'me' ? (
        <>
          <span className='messages'>{text}</span>
          <Avatar className='av' src={uri} />
        </>
      ) : (
        <>
          <Avatar className='av' src={uri} />
          <span className='messages'>{text}</span>
        </>
      )}
    </HStack>
  );
};

export default Message;
