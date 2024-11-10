import  useQuiosco  from '../hooks/useQuiosco'
import ResumenProducto from './ResumenProducto'
import {formatearDinero} from "../helpers"
import { useAuth } from '../hooks/useAuth'

export default function Resumen(){

  const {pedido, total, handleSubmitNuevaOrden } = useQuiosco()

  const { logout } = useAuth({})
 
  const comprobarPedido = () => pedido.length === 0;

  const handleSubmit = e => {
    e.preventDefault()
    handleSubmitNuevaOrden(logout)
  }


    return (
    
       <aside className="md:w-72 h-screen overflow-y-scroll p-5">
         <h1 className="text-4xl font-black">
          Mi pedido
         </h1>
         <p className="text-lg my-5">
           Aqui podras ver el total y resumen de tu pedido
         </p>
         <div className="py-10">
            {pedido.length === 0 ? (
               <p
               className="text-center text-2xl"
               >
                No hay elementos en tu pedido aun.
                 </p> 

            ):(
            
             pedido.map(producto =>(
              <ResumenProducto 
                key={producto.id} 
                producto={producto}
              
              />

        
             ))
            )}
         </div>
         <p className="text-xl mt-10">
          Total: {''}
          {formatearDinero(total)}
         </p>
         <form 
         className="w-full"
         onSubmit={handleSubmit}
         >
          <div
          className="mt-5"
          >
           <input type="submit"
                  className={`${comprobarPedido() ? 'bg-indigo-100' : 'bg-indigo-600 hover:bg-indigo-800' } px-5 py-2 ronded uppercase font-bold text-white text-center w-full cursor-pointer`}
                  value="Confirmar Pedido"
                  disabled={comprobarPedido()}
           />

          </div>


         </form>
        </aside>
    )
  } 