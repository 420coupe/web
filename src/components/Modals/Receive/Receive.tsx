import { CopyIcon, ViewIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Circle,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue
} from '@chakra-ui/react'
import { ChainIdentifier } from '@shapeshiftoss/chain-adapters'
import { AssetMarketData } from '@shapeshiftoss/market-service'
import { Card } from 'components/Card'
import { QRCode } from 'components/QRCode/QRCode'
import { RawText, Text } from 'components/Text'
import { useChainAdapters } from 'context/ChainAdaptersProvider/ChainAdaptersProvider'
import { useModal } from 'context/ModalProvider/ModalProvider'
import { useWallet } from 'context/WalletProvider/WalletProvider'
import { useEffect, useState } from 'react'
import { useTranslate } from 'react-polyglot'

type ReceivePropsType = {
  asset: AssetMarketData
}

export const ReceiveModalProps: ReceivePropsType = {
  asset: {
    name: '',
    symbol: '',
    network: '',
    price: '',
    marketCap: '',
    volume: '',
    icon: '',
    changePercent24Hr: 0
  }
}

const Receive = ({ asset }: ReceivePropsType) => {
  const { name, symbol } = asset
  const { state } = useWallet()
  const [receiveAddress, setReceiveAddress] = useState<string>('')
  const chainAdapterManager = useChainAdapters()

  useEffect(() => {
    ;(async () => {
      const { wallet } = state
      if (!wallet) return
      const chainAdapter = chainAdapterManager.byChain(ChainIdentifier.Ethereum)
      // TODO(0xdef1cafe): remove this when chain adapters has a default path
      const path = `m/44'/60'/0'/0/0`
      setReceiveAddress(await chainAdapter.getAddress({ wallet, path }))
    })()
  }, [chainAdapterManager, state, setReceiveAddress])

  const translate = useTranslate()
  const { receive } = useModal()
  const { close, isOpen } = receive

  const hoverColor = useColorModeValue('gray.900', 'white')
  const bg = useColorModeValue('gray.100', 'gray.700')

  return (
    <Modal isOpen={isOpen} onClose={() => close()} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>
          {translate('modals.receive.receiveAsset', { asset: name })}
        </ModalHeader>
        <ModalCloseButton />
        {state.wallet ? (
          <>
            <ModalBody alignItems='center' justifyContent='center'>
              <Card variant='inverted' width='auto' borderRadius='xl'>
                <Card.Body>
                  <QRCode text={receiveAddress} />
                </Card.Body>
                <Card.Footer textAlign='center' pt={0}>
                  <RawText>{receiveAddress}</RawText>
                </Card.Footer>
              </Card>
            </ModalBody>
            <ModalFooter flexDir='column'>
              <Box>
                <Text
                  translation={[
                    'modals.receive.onlySend',
                    { asset: name, symbol: symbol.toUpperCase() }
                  ]}
                  color='gray.500'
                  textAlign='center'
                />
              </Box>
              <HStack my={6} spacing={8}>
                <Button
                  color='gray.500'
                  flexDir='column'
                  role='group'
                  variant='link'
                  _hover={{ textDecoration: 'none', color: hoverColor }}
                >
                  <Circle
                    bg={bg}
                    mb={2}
                    size='40px'
                    _groupHover={{ bg: 'blue.500', color: 'white' }}
                    onClick={() => true}
                  >
                    <CopyIcon />
                  </Circle>
                  <Text translation='modals.receive.copy' />
                </Button>
                <Button
                  color='gray.500'
                  flexDir='column'
                  role='group'
                  variant='link'
                  _hover={{ textDecoration: 'none', color: hoverColor }}
                >
                  <Circle
                    bg={bg}
                    mb={2}
                    size='40px'
                    _groupHover={{ bg: 'blue.500', color: 'white' }}
                  >
                    <CopyIcon />
                  </Circle>
                  <Text translation='modals.receive.setAmount' />
                </Button>
                <Button
                  color='gray.500'
                  flexDir='column'
                  role='group'
                  variant='link'
                  _hover={{ textDecoration: 'none', color: hoverColor }}
                >
                  <Circle
                    bg={bg}
                    mb={2}
                    size='40px'
                    _groupHover={{ bg: 'blue.500', color: 'white' }}
                  >
                    <ViewIcon />
                  </Circle>
                  <Text translation='modals.receive.verify' />
                </Button>
              </HStack>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalBody alignItems='center' justifyContent='center'>
              <Text
                translation={['modals.receive.connectAWallet', { name }]}
                color='gray.500'
                textAlign='center'
              />
            </ModalBody>
            <ModalFooter />
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export const ReceiveModal = Receive
