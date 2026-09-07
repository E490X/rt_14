import { toast } from 'react-toastify'

const defaultToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored'
}
function ToasterMessage (type, message) {
  switch (type) {
    case 'success':
      toast.success(message, defaultToastOptions)
      break
    case 'error':
      toast.error(message, defaultToastOptions)
      break
    case 'warning':
      toast.warn(message, defaultToastOptions)
      break
    default:
      break
  }
}
export { ToasterMessage }
