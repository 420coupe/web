import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Button, ModalBody, ModalHeader, Stack } from '@chakra-ui/react'
import { Text } from 'components/Text'
import React from 'react'

import { NativeSetupProps } from './setup'

export const NativeStart = ({ history, location }: NativeSetupProps) => (
  <>
    <ModalHeader>
      <Text translation={'wProvider.shapeShift.nStart.header'} />
    </ModalHeader>
    <ModalBody>
      <Text mb={4} color='gray.500' translation={'wProvider.shapeShift.nStart.body'} />
      <Stack my={6} spacing={4}>
        <Button
          variant='ghost-filled'
          colorScheme='blue'
          w='full'
          h='auto'
          px={6}
          py={4}
          justifyContent='space-between'
          rightIcon={<ArrowForwardIcon />}
          onClick={() =>
            history.push('/native/import', { encryptedWallet: location.state.encryptedWallet })
          }
        >
          <Text translation={'wProvider.shapeShift.nStart.button'} />
        </Button>
        <Button
          variant='ghost-filled'
          colorScheme='blue'
          w='full'
          h='auto'
          px={6}
          py={4}
          justifyContent='space-between'
          rightIcon={<ArrowForwardIcon />}
          onClick={() =>
            history.push('/native/seed', { encryptedWallet: location.state.encryptedWallet })
          }
        >
          <Text translation={'wProvider.shapeShift.nStart.button2'} />
        </Button>
      </Stack>
    </ModalBody>
  </>
)
