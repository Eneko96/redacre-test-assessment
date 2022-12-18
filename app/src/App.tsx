import { useEffect, useRef, useState } from 'react'
import { Header } from './modules/Header'
import socketIO from 'socket.io-client'
import { DataTable } from './modules/DataTable'
import { Feedback } from './components/Feedback'
import { Filter } from './components/Filter'
import './App.css'
import { API_URL, LIVE_RATE } from './constants'

function App() {
  const [data, setData] = useState<any[]>([])
  const [latest, setLatest] = useState<any[]>([])
  const [options, setOptions] = useState<{ from: any[]; to: any[] }>({} as any)
  const [feedBack, setFeedBack] = useState<string>('')
  const [filter, setFilter] = useState<any>(null)
  const shouldFetch = useRef(true)

  // Fetch data from API
  useEffect(() => {
    if (shouldFetch.current) {
      const fetchData = async () => {
        const data = await fetch(API_URL + '/rates', {
          method: 'GET',
        })
        const json = await data.json()
        setData(json.data)
        setLatest(json.data.filter((item: any) => item.type === LIVE_RATE))
        setOptions(json.options)
      }
      fetchData()
      shouldFetch.current = false
    }
    return () => setData([])
  }, [])

  // Socket connection
  useEffect(() => {
    const socket = socketIO(API_URL)
    socket.on('connection', () => {
      console.log('Connected')
    })
    socket.on('change-rates', (dataBeat: any) => {
      const newElement = dataBeat.data.fullDocument
      setData((prevData) => {
        // push new elements
        const newData = [...prevData]
        newData.unshift(newElement)
        return newData
      })
      setLatest((prevData) => {
        // update elements
        const newData = [...prevData]
        const index = newData.findIndex(
          (item: any) => item._id === newElement._id,
        )
        newData[index] = newElement
        return newData
      })
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="App">
      <Header
        data={data}
        tools={options}
        latest={latest}
        onCreated={() => setFeedBack('Exchange submitted')}
      />
      <Filter onFilter={setFilter} />
      <DataTable data={data} filter={filter} />
      <Feedback text={feedBack} onClose={setFeedBack} />
    </div>
  )
}

export default App
