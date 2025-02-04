import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ModalBody,
  ModalHeader
} from '@chakra-ui/react'
import { Text } from 'components/Text'

export interface ConnectModalProps {
  headerText: string
  bodyText: string
  buttonText: string
  pairDevice(): any
  loading: boolean
  error: string | null
  children?: any
}

export const ConnectModal = (props: ConnectModalProps) => {
  return (
    <>
      <ModalHeader>
        <Text translation={props.headerText} />
      </ModalHeader>
      <ModalBody>
        <Text mb={4} color='gray.500' translation={props.bodyText} />
        <Button isFullWidth colorScheme='blue' onClick={props.pairDevice} disabled={props.loading}>
          <Text translation={props.buttonText || 'walletProvider.keepKey.connect.button'} />
        </Button>
        {props.error && (
          <Alert status='info' mt={4}>
            <AlertIcon />
            <AlertDescription>
              <Text translation={props.error} />
            </AlertDescription>
          </Alert>
        )}
      </ModalBody>
    </>
  )
}
