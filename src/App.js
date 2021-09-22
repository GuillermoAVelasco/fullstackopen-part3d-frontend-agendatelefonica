import React, { useState , useEffect } from 'react'
import Persons from './components/Persons'
import FormPerson from './components/FormPerson'
import FilterPersons from './components/FilterPersons'
import personServices from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterName, setFilterName ] = useState('')
  const [message, setMessage] = useState(null)
  const [typeMessage, setTypeMessage] = useState('exito')

  useEffect(() => {
    personServices.getAll().then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  console.log('render', persons.length, 'persons')
  
  const setNewNameTel=(e)=>{
    setNewName(e.target.value)
  }

  const setNewNumberTel=(e)=>{
    setNewNumber(e.target.value)
  }

  const setFindFilterName=(e)=>{
    setFilterName(e.target.value)
  }

  const addPerson=(e)=>{
    e.preventDefault()
    
    const newPerson={
      name:newName,
      number:newNumber
    }
    //console.log('newPerson',newPerson)
    //console.log('persons',persons)
    const findP=persons.find(element=> element.name.trim().toUpperCase()===newPerson.name.trim().toUpperCase())
    //console.log('filtrado',findP)
    if(findP){
        if(window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new number`)){
          //console.log('id',findP.id)
          personServices.update(findP.id,newPerson)
          .then(personObject=>{
            //console.log('nuevo',newPerson)
            setPersons(persons.map(p=> findP.id===p.id? personObject : p))
            setMessage(`Person '${newPerson.name}' was updated.`)

            
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')  
          })
          .catch(e=>{
            setTypeMessage('error')
            console.log(`the Person '${newPerson.name}'  was already deleted from server.`)
            setMessage(`the Person '${newPerson.name}'  was already deleted from server.`) 
            setTimeout(() => {
              setMessage(null)
            }, 5000) 
          })  
        }
        else {
          setNewName('')
          setNewNumber('')
          return
        }     
    }
    else {
      personServices.create(newPerson)
      .then(personObject=>{
        setMessage(`Person '${newPerson.name}' was created.`)
        setTypeMessage('exito')

        setTimeout(() => {
          setMessage(null)
        }, 5000)

        setPersons(persons.concat(personObject))
        setNewName('')
        setNewNumber('')  
      })
      .catch(e=>{
        console.log('error',e.response.data.error)
        setMessage(e.response.data.error)
        setTypeMessage('error')
      })
    }    
  } //2.6 paso 1

  const handleNewName=(e)=>{
    setNewNameTel(e)
  }
  const handleNewNumber=(e)=>{
    setNewNumberTel(e)
  }

  const handlerDelete=(e)=>{
    e.preventDefault()
    if(window.confirm(`Delete ${e.target.name}`)){
      personServices.remove(e.target.id)
      .then((response)=>{
          console.log('entre',persons)
          const rest=persons.filter(per=> per.id !== e.target.id )
          setPersons(rest)
          setTypeMessage('exito')
          setMessage(`the Person '${e.target.name}' was deleted.`)

          setTimeout(() => {
            setMessage(null)
          }, 5000)
        
      })
      .catch(e=>{
        setTypeMessage('error')
        //setMessage(`the Person '${e.target.name}' was already deleted from server.`)
        setMessage(`the Person  was already deleted from server.`)      
      })
    }
  }

  const personsFind=filterName===''
    ? persons
    : persons.filter(person => person.name.toUpperCase().indexOf(filterName.toUpperCase()) !== -1)
    
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} typeMessage={typeMessage}/>
      <FilterPersons persons={personsFind} filterName={filterName} setFindFilterName={setFindFilterName} />
      
      <h2>Add a New</h2>
      <FormPerson persons={personsFind }  addPerson={addPerson} newName={newName} newNumber={newNumber} handleNewName={handleNewName} handleNewNumber={handleNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={personsFind} handlerDelete={handlerDelete} />
    </div>
  )
}

export default App
