import { ReceiveModal, ReceiveModalProps } from 'components/Modals/Receive/Receive'
import { SendModal } from 'components/Modals/Send/Send'
import merge from 'lodash/merge'
import noop from 'lodash/noop'
import React, { useContext, useMemo, useReducer } from 'react'

const modalMethods = {
  isOpen: false,
  open: noop,
  close: noop
}

// consts
const MODALS = {
  send: {
    name: 'send',
    component: SendModal,
    props: {},
    ...modalMethods
  },
  receive: {
    name: 'receive',
    component: ReceiveModal,
    props: ReceiveModalProps,
    ...modalMethods
  }
} as const

const OPEN_MODAL = 'OPEN_MODAL'
const CLOSE_MODAL = 'CLOSE_MODAL'

// typedefs
type Modals = keyof typeof MODALS

type ModalProviderProps = {
  children: React.ReactNode
}

type OpenModalType<K extends Modals> = {
  type: typeof OPEN_MODAL
  name: K
  props: ModalProps[K]
}

type CloseModalType = {
  type: typeof CLOSE_MODAL
  name: Modals
}

type ModalComponents = {
  [k in Modals]: typeof MODALS[k]['component']
}

type ModalProps = {
  [k in Modals]: typeof MODALS[k]['props']
}

type ModalState = {
  [k in Modals]: {
    name: k
    component: ModalComponents[k]
    props: ModalProps[k]
    open: (props: ModalProps[k]) => void
    close: () => void
    isOpen: boolean
  }
}

type ModalActions = OpenModalType<Modals> | CloseModalType

// reducer
const reducer = (state: ModalState, action: ModalActions) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        [action.name]: { ...state[action.name], isOpen: true, props: action.props }
      }
    case CLOSE_MODAL:
      return { ...state, [action.name]: { ...state[action.name], isOpen: false } }
    default:
      return state
  }
}

// state
const initialState = Object.freeze(MODALS)

// context
export const ModalContext = React.createContext(initialState)

// provider
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const openFactory = useMemo(<K extends Modals>() => {
    return (name: Modals) => (props: ModalProps[K]) => dispatch({ type: OPEN_MODAL, name, props })
  }, [])

  const closeFactory = useMemo(() => {
    return (name: Modals) => () => dispatch({ type: CLOSE_MODAL, name })
  }, [])

  const value = useMemo(() => {
    const modals = Object.values(MODALS).map(modal => modal.name)
    const fns = modals.reduce((acc, cur) => {
      const open = openFactory(cur)
      const close = closeFactory(cur)
      return { ...acc, [cur]: { open, close } }
    }, state)
    const result = merge(state, fns)
    return result
  }, [state, closeFactory, openFactory])

  return (
    <ModalContext.Provider value={value}>
      {children}
      {value.send.isOpen && <value.send.component {...value.send.props} />}
      {value.receive.isOpen && <value.receive.component {...value.receive.props} />}
    </ModalContext.Provider>
  )
}

// hook
export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal hook cannot be used outside of the modal provider')
  return context
}
