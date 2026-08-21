import { useTransportList } from "../fetching/useTransport";
import TransportRow from "../components/TransportRow";
import type { Transport } from "../types/transportTypes"

// type SimplifiedTransport = {
//   name: string
// }


export default function Transport(){ 
  const { transportList, loading, error } = useTransportList();

  return ( 
    <div> 
      {transportList.map(t => (
        <TransportRow key={t.id} transport={t} />
      ))}
    </div>
  )
}
