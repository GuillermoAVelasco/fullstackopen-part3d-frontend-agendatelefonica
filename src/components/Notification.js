const Notification = ({ message,typeMessage }) => {
    if (message === null) {
      return null
    }
  
    const messageClass=`message ${typeMessage}`
    return (
      <div className={messageClass}>
        {message}
      </div>
    )
}

export default Notification